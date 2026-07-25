<![CDATA[<div align="center">

# 🛡️ FakeShield AI

### AI-Powered Ecommerce Fake Review Detection System

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Python](https://img.shields.io/badge/Python-3.8+-3776AB?logo=python&logoColor=white)](https://python.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Flask](https://img.shields.io/badge/Flask-API-000000?logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![Scikit-learn](https://img.shields.io/badge/Scikit--learn-ML-F7931E?logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-10B981)](LICENSE)

**Detect fraudulent product reviews in real-time using Machine Learning, heuristic analysis, and local LLM inference.**

[Features](#-features) · [Quick Start](#-quick-start) · [Architecture](#-architecture) · [API](#-api-endpoints) · [Customization](#-customization)

</div>

---

## 📸 Overview

FakeShield AI is a full-stack web application that analyzes ecommerce product reviews and flags potentially fake or spam reviews using a multi-engine detection pipeline. It combines browser-side heuristic rules, a Python ML backend powered by Naive Bayes + TF-IDF, and optional local LLM inference via LM Studio — all with real-time Firebase synchronization.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎯 **Multi-Engine Detection** | Choose between local heuristics, Python ML (Naive Bayes), or LM Studio local LLM |
| 🔥 **Real-Time Sync** | Firebase Firestore provides instant cross-device updates |
| 🤖 **Machine Learning** | Naive Bayes classifier with TF-IDF vectorization trained on labeled review data |
| 📊 **Confidence Scoring** | Every review gets a confidence percentage and flagged reasons |
| 🛡️ **Auto-Fallback** | Gracefully degrades to local heuristics if the backend is unreachable |
| 🌙 **Dark Mode UI** | Beautiful, modern interface built with Tailwind CSS and glassmorphism effects |
| 👤 **Anonymous Auth** | No sign-up required — Firebase anonymous authentication |
| ⚡ **Blazing Fast** | Vite-powered React frontend with hot module replacement |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Frontend (React + Vite)           │
│  ┌──────────┐  ┌──────────┐  ┌───────────────────┐  │
│  │  Store    │  │  Admin   │  │  About            │  │
│  │  View     │  │  Panel   │  │  Page             │  │
│  └────┬─────┘  └────┬─────┘  └───────────────────┘  │
│       │              │                                │
│       └──────┬───────┘                                │
│              ▼                                        │
│     ┌────────────────┐                                │
│     │  Detection     │                                │
│     │  Engine Switch │                                │
│     └───┬────┬───┬───┘                                │
└─────────┼────┼───┼────────────────────────────────────┘
          │    │   │
    ┌─────┘    │   └─────┐
    ▼          ▼         ▼
┌────────┐ ┌────────┐ ┌──────────┐
│Local   │ │Python  │ │LM Studio │
│Heurist.│ │ML API  │ │Local LLM │
│(browser│ │(Flask) │ │(optional)│
└────────┘ └────────┘ └──────────┘
                │
          ┌─────┘
          ▼
   ┌─────────────┐
   │  Firebase    │
   │  Firestore   │
   │  (Real-time) │
   └─────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 16+ (or Bun)
- **Python** 3.8+ *(optional, for ML backend)*
- **Firebase** project *(free tier works)*

### 1. Clone & Install

```bash
git clone https://github.com/anikchak2002/fakeshieldai.git
cd fakeshield-ai

# Frontend
cd frontend
npm install    # or: bun install
```

### 2. Configure Firebase

Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com), then:

1. Enable **Firestore Database**
2. Enable **Anonymous Authentication**
3. Update `frontend/src/firebase-config.js` with your credentials:

```javascript
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 3. Run the App

```bash
# Frontend (Terminal 1)
cd frontend
npm run dev
```

Open **http://localhost:5173** and you're live! 🎉

### 4. (Optional) Enable ML Backend

```bash
# Backend (Terminal 2)
cd backend
pip install -r requirements.txt
python model_train.py   # Train the model
python app.py           # Start Flask API at :5000
```

Then switch to **"Python ML Backend"** in the Admin Panel.

---

## 📁 Project Structure

```
fakeshield-ai/
├── frontend/                    # React App (Vite + Tailwind)
│   ├── src/
│   │   ├── App.jsx             # Main application component
│   │   ├── main.jsx            # Entry point
│   │   ├── index.css           # Global styles + Tailwind
│   │   └── firebase-config.js  # Firebase credentials
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── index.html
│
├── backend/                     # Python ML Server (Flask)
│   ├── app.py                  # Flask REST API
│   ├── model_train.py          # ML model training script
│   ├── vectortable.py          # TF-IDF vectorization utilities
│   ├── reviews.csv             # Labeled training dataset
│   └── requirements.txt        # Python dependencies
│
├── .gitignore
└── README.md
```

---

## 🔍 Detection Methods

### 1. Local Heuristics *(Default — No Server Needed)*

Fast, browser-side rule-based analysis:

- ❌ Review too short (< 10 characters)
- ❌ Contains spam keywords (`FREE`, `MONEY`, `CLICK`, `WINNER`, etc.)
- ❌ Excessive ALL CAPS usage
- ❌ Repeated characters (`AMAZINGGGG`)
- ❌ Suspicious rating-text mismatch

### 2. Python ML Model *(Requires Flask Backend)*

Trained Naive Bayes classifier with TF-IDF vectorization:

- 📊 Evaluates Accuracy, Precision, Recall, and F1 Score
- 🔄 Automatic fallback to heuristics on server error
- 📈 Configurable confidence thresholds

### 3. LM Studio Local LLM *(Optional)*

Route review analysis through a locally-hosted LLM via LM Studio's OpenAI-compatible API.

---

## 📡 API Endpoints

### `POST /predict`

Analyze a review for authenticity.

```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{"text": "This product is absolutely amazing!"}'
```

**Response:**
```json
{
  "isFlagged": false,
  "confidence": 15,
  "reasons": ["Verified by Machine Learning Model"],
  "method": "Naive Bayes Classifier"
}
```

### `GET /health`

```json
{ "status": "ok", "model_loaded": true }
```

---

## ⚙️ Customization

### Add Products
Edit `SEED_PRODUCTS` in `App.jsx`:
```javascript
{ id: 'p5', name: 'New Product', price: 1999, image: '🎮', description: '...' }
```

### Switch ML Algorithm
In `model_train.py`, swap Naive Bayes for another classifier:
```python
from sklearn.ensemble import RandomForestClassifier
model = RandomForestClassifier(n_estimators=100)
```

### Adjust Detection Sensitivity
Modify thresholds in `app.py`:
```python
is_fake = (probabilities[1] > 0.6)  # Default: 0.5
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide Icons |
| **Backend** | Python, Flask, Flask-CORS |
| **ML/NLP** | Scikit-learn, TF-IDF, Naive Bayes |
| **Database** | Firebase Firestore (real-time) |
| **Auth** | Firebase Anonymous Auth |
| **Optional** | LM Studio (local LLM inference) |

---

## 📊 Dataset Format

The training dataset (`reviews.csv`) uses two columns:

```csv
review_text,label
"This product is amazing and works great!",0
"FREE MONEY CLICK HERE NOW!!!",1
```

- `0` = Genuine review
- `1` = Fake/spam review

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|---------|
| Firebase not initialized | Update `firebase-config.js` with real credentials |
| Python server unreachable | Auto-falls back to heuristics. Check `python app.py` is running |
| Model file not found | Run `python model_train.py` first |
| CORS errors | Flask-CORS is pre-configured. Ensure Flask runs on port 5000 |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

**Built with ❤️ by [Anik Chakraborty](https://github.com/anikchak2002)**

⭐ Star this repo if you found it useful!

</div>
