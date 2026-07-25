# 🚀 Quick Start Guide

## ⏱️ 5-Minute Setup

### Step 1: Get Firebase (2 minutes)
1. Go to https://firebase.google.com
2. Click "Get Started" → Create Project (any name)
3. Enable **Firestore Database** (Start in test mode)
4. Enable **Anonymous Authentication**
5. Copy your Firebase config from Project Settings

### Step 2: Frontend Setup (2 minutes)
```bash
cd frontend
npm install
```

Edit `src/firebase-config.js` with your Firebase credentials:
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

Start server:
```bash
npm run dev
```

✅ Open http://localhost:3000 - You're ready to go!

### Step 3 (Optional): Backend ML Mode (1 minute)
```bash
cd backend
pip install -r requirements.txt
python model_train.py  # Train on sample data
python app.py          # Start server
```

Then in Admin Panel → Toggle "Enable Python ML" ✨

---

## 📋 What You Get

✅ **Full-Stack Review System**
- React UI with Tailwind CSS
- Firebase real-time database
- 2 Detection engines (Local + ML)
- Admin dashboard

✅ **Machine Learning Ready**
- Pre-trained Naive Bayes model
- TF-IDF vectorization
- 50+ labeled reviews included
- Accuracy metrics included

✅ **Production Ready**
- CORS enabled
- Error handling & fallbacks
- Real-time data sync
- Responsive design

---

## 🎯 Try It Out

### Customer View
1. Click "Store" tab
2. Pick a product
3. Write a review
4. See if it's flagged as fake

**Try these to test:**
- Real: "This product works great and arrived quickly"
- Fake: "FREE MONEY NOW!!! Click here for 100% guaranteed prize!!!"

### Admin View
1. Click "Admin Panel"
2. See all reviews
3. Toggle "Enable Python ML" to see both detection methods
4. Delete reviews with trash icon

---

## 📁 Project Structure

```
ecomreview/
├── frontend/          # React app
│   ├── src/
│   │   ├── App.jsx
│   │   ├── firebase-config.js  ← EDIT THIS!
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── backend/           # Python ML (optional)
│   ├── app.py
│   ├── model_train.py
│   ├── reviews.csv
│   └── requirements.txt
│
└── README.md
```

---

## 🔧 Common Issues

| Issue | Fix |
|-------|-----|
| "Firebase not initialized" | Edit `firebase-config.js` |
| "Port 3000 in use" | `npm run dev -- --port 3001` |
| "Can't connect to ML" | Make sure Flask runs on port 5000 |
| "CSV not found" | Run model_train.py from backend folder |

---

## 🎓 Learning Path

1. **Beginner**: Use with default local detection
2. **Intermediate**: Train and enable Python ML
3. **Advanced**: Modify dataset, add custom algorithms, deploy

---

## 📚 Next: Read Full Docs

- `README.md` - Complete guide
- `frontend/README.md` - React/Firebase details
- `backend/README.md` - ML model details

---

## 🎉 You're All Set!

Questions? Check the README files or modify the code to learn!

Happy fake review detecting! 🛡️
