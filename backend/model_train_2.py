import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
import joblib

# LOAD DATASET

print("Loading dataset from fake reviews dataset.csv...")
df = pd.read_csv('fake reviews dataset.csv')

# Preprocessing for new dataset
# Label mapping: CG (Computer Generated) -> 1 (Fake), OR (Original) -> 0 (Real)
print("Mapping labels...")
df['label'] = df['label'].map({'CG': 1, 'OR': 0})

# Ensure text column is string and remove NaNs
print("Preprocessing text...")
df['text_'] = df['text_'].astype(str).fillna('')

X = df['text_'].values
y = df['label'].values

print(f"Total reviews: {len(df)}")
print(f"Real reviews (OR): {(y == 0).sum()}")
print(f"Fake reviews (CG): {(y == 1).sum()}")

# SPLIT DATA

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print(f"\nTraining samples: {len(X_train)}")
print(f"Testing samples: {len(X_test)}")

# VECTORIZE TEXT

print("\nVectorizing text with TF-IDF...")
vectorizer = TfidfVectorizer(max_features=1000, stop_words='english')
X_train_vec = vectorizer.fit_transform(X_train)
X_test_vec = vectorizer.transform(X_test)

print(f"Vectorizer features: {X_train_vec.shape[1]}")


# TRAIN MODEL

print("\nTraining Naive Bayes model...")
model = MultinomialNB()
model.fit(X_train_vec, y_train)

# EVALUATE MODEL

print("\nEvaluating model...")
y_pred = model.predict(X_test_vec)

accuracy = accuracy_score(y_test, y_pred)
precision = precision_score(y_test, y_pred)
recall = recall_score(y_test, y_pred)
f1 = f1_score(y_test, y_pred)

print(f"Accuracy:  {accuracy:.4f}")
print(f"Precision: {precision:.4f}")
print(f"Recall:    {recall:.4f}")
print(f"F1 Score:  {f1:.4f}")

cm = confusion_matrix(y_test, y_pred)
print(f"\nConfusion Matrix:")
print(f"  True Negatives:  {cm[0][0]}")
print(f"  False Positives: {cm[0][1]}")
print(f"  False Negatives: {cm[1][0]}")
print(f"  True Positives:  {cm[1][1]}")

# SAVE MODEL

print("\nSaving model and vectorizer...")
joblib.dump(model, 'review_model.pkl')
joblib.dump(vectorizer, 'vectorizer.pkl')
print("✓ Model saved as 'review_model.pkl'")
print("✓ Vectorizer saved as 'vectorizer.pkl'")

print("\nTraining complete! You can now run app.py")
