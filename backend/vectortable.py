import joblib
import numpy as np

# Correct file name
file_path = "vectorizer.pkl"

# Load vectorizer correctly
vectorizer = joblib.load(file_path)

print("✅ Vectorizer loaded successfully")

# Vocabulary size
print("\nVocabulary size:", len(vectorizer.vocabulary_))

# Feature names
features = vectorizer.get_feature_names_out()
print("\nFirst 20 features:")
print(features[:20])

# Test sample text
sample_text = ["this product is good and worth buying"]
X = vectorizer.transform(sample_text)

print("\nVector shape:", X.shape)

print("\nNon-zero TF-IDF values:")
rows, cols = X.nonzero()
for c in cols:
    print(f"{features[c]} -> {X[0, c]:.4f}")
