import joblib
import os
import sys

# Load model
try:
    model = joblib.load('backend/review_model.pkl')
    vectorizer = joblib.load('backend/vectorizer.pkl')
    print("Model and Vectorizer loaded successfully.")
except Exception as e:
    print(f"Error loading model: {e}")
    sys.exit(1)

# Test cases
samples = [
    "Love this! Well made, sturdy, and very comfortable. I love it!Very pretty", # Should be Fake (CG) -> 1
    "This is a great product. I've been using it for years.", # Ambiguous
    "The item arrived broken and the seller was rude. Do not buy.", # Real (OR) -> 0
]

print("\nRunning predictions:")
for text in samples:
    vec = vectorizer.transform([text])
    pred = model.predict(vec)[0]
    prob = model.predict_proba(vec)[0]
    label = "Fake (CG)" if pred == 1 else "Real (OR)"
    print(f"Text: {text[:50]}...")
    print(f"Prediction: {label} (Confidence: {max(prob)*100:.2f}%)")
