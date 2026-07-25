# Backend Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Prepare Your Dataset
Place a `reviews.csv` file in this directory with columns:
- `review_text`: The review content
- `label`: 0 for real, 1 for fake

Example:
```csv
review_text,label
"Great product!",0
"FREE MONEY NOW!!!",1
```

### 3. Train the Model
```bash
python model_train.py
```

This will:
- Load `reviews.csv`
- Train a Naive Bayes classifier
- Save `review_model.pkl` and `vectorizer.pkl`
- Display accuracy metrics

### 4. Start the Server
```bash
python app.py
```

Server runs on `http://localhost:5000`

## API Endpoints

### POST /predict
Analyze a review

```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{"text":"This product is great"}'
```

Response:
```json
{
  "isFlagged": false,
  "confidence": 20,
  "reasons": ["Verified by Machine Learning Model"],
  "method": "Naive Bayes Classifier"
}
```

### GET /health
Check server status

```bash
curl http://localhost:5000/health
```

## Fallback Logic

If model training fails or server has issues:
- System falls back to heuristic analysis
- No external dependencies needed
- Rules: check for spam keywords, caps, short length

## Monitoring

Check the Flask server console for:
- Request logs
- Prediction details
- Error messages

## Customization

### Use Different ML Algorithm
In `model_train.py`, replace:
```python
from sklearn.naive_bayes import MultinomialNB
model = MultinomialNB()
```

With other classifiers:
```python
from sklearn.ensemble import RandomForestClassifier
model = RandomForestClassifier(n_estimators=100)
```

### Adjust Vectorizer
```python
vectorizer = TfidfVectorizer(
    max_features=2000,      # More features
    ngram_range=(1, 2),     # Use bigrams
    min_df=2,               # Minimum document frequency
    stop_words='english'
)
```

### Change Confidence Threshold
In `app.py`, modify the prediction threshold:
```python
is_fake = (probabilities[1] > 0.6)  # Default is 0.5
```

## Performance Metrics

After training, you'll see:
- **Accuracy**: Overall correctness
- **Precision**: How many flagged reviews are actually fake
- **Recall**: How many fake reviews get caught
- **F1 Score**: Harmonic mean (balanced metric)

Aim for:
- Precision > 0.85 (minimize false alarms)
- Recall > 0.80 (catch most fakes)

## Requirements

- Python 3.8+
- 50+ labeled reviews in CSV
- ~100MB disk space for models

Enjoy! 🚀
