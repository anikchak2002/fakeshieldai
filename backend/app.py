from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
import re
from urllib import error, request as urlrequest

import joblib

app = Flask(__name__)
CORS(
    app,
    resources={
        r"/predict": {
            "origins": ["http://localhost:3000", "http://127.0.0.1:3000"],
            "methods": ["POST", "OPTIONS"],
            "allow_headers": ["Content-Type"],
        },
        r"/health": {
            "origins": ["http://localhost:3000", "http://127.0.0.1:3000"],
            "methods": ["GET", "OPTIONS"],
        },
    },
)

# ============================================
# LOAD OR TRAIN THE MODEL
# ============================================

MODEL_PATH = 'review_model.pkl'
VECTORIZER_PATH = 'vectorizer.pkl'
LM_STUDIO_API_BASE = os.environ.get('LM_STUDIO_API_BASE', 'http://127.0.0.1:1234/v1')
LM_STUDIO_DEFAULT_MODEL = os.environ.get('LM_STUDIO_MODEL', 'local-model')

# Try to load pre-trained model
if os.path.exists(MODEL_PATH) and os.path.exists(VECTORIZER_PATH):
    print("Loading pre-trained model...")
    model = joblib.load(MODEL_PATH)
    vectorizer = joblib.load(VECTORIZER_PATH)
else:
    print("No pre-trained model found. Using heuristic fallback.")
    model = None
    vectorizer = None

# ============================================
# HEURISTIC FALLBACK (if no model exists)
# ============================================

def analyze_review_heuristic(text):
    """Simple rule-based fake review detection"""
    score = 0
    reasons = []
    lower_text = text.lower()

    # Basic rules
    if len(text) < 10:
        score += 20
        reasons.append("Too short")

    spam_keywords = ['free', 'money', 'guarantee', 'click', 'winner', 'prize', '100%', 'crypto', 'buy now']
    matches = [w for w in spam_keywords if w in lower_text]
    if matches:
        score += len(matches) * 20
        reasons.append(f"Spam keywords: {', '.join(matches)}")

    if text == text.upper() and len(text) > 10:
        score += 30
        reasons.append("All CAPS")

    # Repeated characters check
    if re.search(r'(.)\1{3,}', text):
        score += 15
        reasons.append("Repeated characters")

    is_flagged = score >= 40
    confidence = min(score, 100)

    return {
        'isFlagged': is_flagged,
        'confidence': confidence,
        'reasons': reasons if is_flagged else ["Verified by heuristic analysis"],
        'method': 'Heuristic Fallback (Local Rules)'
    }

# ============================================
# ML PREDICTION (if model exists)
# ============================================

def _preprocess(text):
    """Match the preprocessing used during training."""
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text


def predict_with_ml(text):
    """Use trained ML model to predict if review is fake"""
    try:
        if model is None or vectorizer is None:
            return None

        # Preprocess and vectorize the text
        cleaned = _preprocess(text)
        X = vectorizer.transform([cleaned])

        # Get prediction
        prediction = model.predict(X)[0]
        probabilities = model.predict_proba(X)[0]

        # Convert numpy types to standard python types for JSON serialization
        # Only flag as fake if confidence is > 75% to avoid false positives on short/generic comments
        fake_probability = float(probabilities[1])
        is_fake = bool(prediction == 1 and fake_probability > 0.75)
        
        # Determine confidence score (use the max probability)
        confidence = float(max(probabilities)) * 100

        return {
            'isFlagged': is_fake,
            'confidence': round(confidence, 2),
            'reasons': ['Flagged by ML Model'] if is_fake else ['Verified by ML Model'],
            'method': 'Naive Bayes Classifier'
        }
    except Exception as e:
        print(f"ML prediction error: {e}")
        return None


def _extract_json_object(raw_text):
    """Extract the first JSON object from an LLM response."""
    start = raw_text.find('{')
    end = raw_text.rfind('}')
    if start == -1 or end == -1 or end <= start:
        raise ValueError("No JSON object found in LM Studio response")
    return json.loads(raw_text[start:end + 1])


def predict_with_lm_studio(text, model_name=None, api_base=None):
    """Use an LM Studio local model through its OpenAI-compatible API."""
    model_name = model_name or LM_STUDIO_DEFAULT_MODEL
    api_base = (api_base or LM_STUDIO_API_BASE).rstrip('/')

    payload = {
        'model': model_name,
        'temperature': 0.2,
        'messages': [
            {
                'role': 'system',
                'content': (
                    "You detect fake ecommerce reviews. "
                    "Return JSON only with keys: isFlagged (boolean), confidence (0-100 number), "
                    "reasons (array of short strings)."
                ),
            },
            {
                'role': 'user',
                'content': f"Analyze this review for authenticity:\n\n{text}",
            },
        ],
    }

    req = urlrequest.Request(
        f"{api_base}/chat/completions",
        data=json.dumps(payload).encode('utf-8'),
        headers={'Content-Type': 'application/json'},
        method='POST',
    )

    try:
        with urlrequest.urlopen(req, timeout=30) as response:
            body = json.loads(response.read().decode('utf-8'))
    except error.URLError as e:
        print(f"LM Studio request error: {e}")
        return None
    except Exception as e:
        print(f"LM Studio unexpected error: {e}")
        return None

    try:
        content = body['choices'][0]['message']['content']
        parsed = _extract_json_object(content)
        is_flagged = bool(parsed.get('isFlagged', False))
        confidence = float(parsed.get('confidence', 0))
        reasons = parsed.get('reasons') or []
        if not isinstance(reasons, list):
            reasons = [str(reasons)]

        return {
            'isFlagged': is_flagged,
            'confidence': round(max(0, min(confidence, 100)), 2),
            'reasons': reasons if reasons else ['Analyzed by LM Studio'],
            'method': f'LM Studio ({model_name})',
        }
    except Exception as e:
        print(f"LM Studio parse error: {e}")
        return None

# ============================================
# API ENDPOINT
# ============================================

@app.route('/predict', methods=['POST', 'OPTIONS'])
def predict():
    """Main endpoint for fake review detection"""
    try:
        if request.method == 'OPTIONS':
            return jsonify({'status': 'ok'}), 200

        data = request.get_json() or {}
        text = data.get('text', '').strip()
        provider = (data.get('provider') or 'python-ml').strip().lower()
        lm_studio_model = data.get('lmStudioModel')
        lm_studio_api_base = data.get('lmStudioApiBase')

        if not text:
            return jsonify({'error': 'No text provided'}), 400

        if provider == 'heuristic':
            result = analyze_review_heuristic(text)
        elif provider == 'lmstudio':
            result = predict_with_lm_studio(text, lm_studio_model, lm_studio_api_base)
            if result is None:
                result = analyze_review_heuristic(text)
                result['method'] = 'Fallback Local (LM Studio Unavailable)'
                result['reasons'].append('LM Studio unavailable')
        else:
            result = predict_with_ml(text)
            if result is None:
                result = analyze_review_heuristic(text)
                result['method'] = 'Fallback Local (Python ML Unavailable)'
                result['reasons'].append('Python ML backend unavailable')

        return jsonify(result), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': str(e)}), 500

# ============================================
# HEALTH CHECK
# ============================================

@app.route('/health', methods=['GET'])
def health():
    """Check if server is alive"""
    return jsonify({
        'status': 'ok',
        'model_loaded': model is not None,
        'lm_studio_api_base': LM_STUDIO_API_BASE,
        'lm_studio_default_model': LM_STUDIO_DEFAULT_MODEL,
    }), 200

# ============================================
# RUN SERVER
# ============================================

if __name__ == '__main__':
    print("Starting FakeShield AI Backend Server...")
    print("Available at: http://127.0.0.1:5050")
    print("Endpoints:")
    print("  POST /predict - Analyze review text")
    print("  GET /health - Check server status")
    app.run(debug=True, host='127.0.0.1', port=5050)
