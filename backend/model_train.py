import pandas as pd
import numpy as np
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix, classification_report
import joblib

# ============================================
# LOAD DATASET
# ============================================

DATASET_PATH = 'fake reviews dataset.csv'

print(f"Loading dataset from {DATASET_PATH}...")
df = pd.read_csv(DATASET_PATH)
df = df.dropna(subset=['text_', 'label'])

# Map labels: CG (Computer Generated) = 1 (fake), OR (Original) = 0 (real)
df['label_int'] = df['label'].map({'CG': 1, 'OR': 0})
df = df.dropna(subset=['label_int'])
df['label_int'] = df['label_int'].astype(int)

X = df['text_'].values
y = df['label_int'].values

print(f"Total reviews: {len(df):,}")
print(f"Real reviews (OR): {(y == 0).sum():,}")
print(f"Fake reviews (CG): {(y == 1).sum():,}")

# ============================================
# TEXT PREPROCESSING
# ============================================

def preprocess(text):
    """Clean text before vectorization."""
    text = str(text).lower()
    text = re.sub(r'[^a-z0-9\s]', ' ', text)   # strip punctuation
    text = re.sub(r'\s+', ' ', text).strip()      # collapse whitespace
    return text

print("\nPreprocessing text...")
X = np.array([preprocess(t) for t in X])

# ============================================
# SPLIT DATA
# ============================================

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

print(f"\nTraining samples: {len(X_train):,}")
print(f"Testing samples: {len(X_test):,}")

# ============================================
# VECTORIZE TEXT
# ============================================

print("\nVectorizing text with TF-IDF...")
vectorizer = TfidfVectorizer(
    max_features=5000,
    stop_words='english',
    ngram_range=(1, 2),
)
X_train_vec = vectorizer.fit_transform(X_train)
X_test_vec = vectorizer.transform(X_test)

print(f"Vectorizer features: {X_train_vec.shape[1]:,}")

# ============================================
# TRAIN MODEL
# ============================================

print("\nTraining Naive Bayes model...")
model = MultinomialNB()
model.fit(X_train_vec, y_train)

# ============================================
# EVALUATE MODEL
# ============================================

print("\nEvaluating model...")
y_pred = model.predict(X_test_vec)

accuracy = accuracy_score(y_test, y_pred)
precision = precision_score(y_test, y_pred, zero_division=0)
recall = recall_score(y_test, y_pred, zero_division=0)
f1 = f1_score(y_test, y_pred, zero_division=0)

print(f"Accuracy:  {accuracy:.4f}")
print(f"Precision: {precision:.4f}")
print(f"Recall:    {recall:.4f}")
print(f"F1 Score:  {f1:.4f}")

cm = confusion_matrix(y_test, y_pred)
print(f"\nConfusion Matrix:")
print(f"  True Negatives:  {cm[0][0]:,}")
print(f"  False Positives: {cm[0][1]:,}")
print(f"  False Negatives: {cm[1][0]:,}")
print(f"  True Positives:  {cm[1][1]:,}")

print("\nClassification Report:")
print(classification_report(y_test, y_pred, target_names=['Real (OR)', 'Fake (CG)']))

# ============================================
# SAVE MODEL
# ============================================

print("Saving model and vectorizer...")
joblib.dump(model, 'review_model.pkl')
joblib.dump(vectorizer, 'vectorizer.pkl')
print("✓ Model saved as 'review_model.pkl'")
print("✓ Vectorizer saved as 'vectorizer.pkl'")

print(f"\nTraining complete! Trained on {len(df):,} reviews.")
print("You can now run app.py")
