# 🔑 Firebase Credentials Setup

## Quick Setup Steps

1. Go to: https://console.firebase.google.com
2. Click your project
3. Click ⚙️ **Settings** (top right)
4. Scroll down to **"Your apps"** section
5. Find your **Web** app and click it
6. Copy the config object below

---

## 📋 Your Firebase Config

Copy these **6 values** from Firebase Console into the boxes below:

```
🔑 API KEY:
[                                          ]

📨 AUTH DOMAIN:
[                                          ]

📁 PROJECT ID:
[                                          ]

🪣 STORAGE BUCKET:
[                                          ]

📲 MESSAGING SENDER ID:
[                                          ]

📱 APP ID:
[                                          ]
```

---

## ✅ What It Looks Like

Your Firebase config will look like this:

```javascript
{
  apiKey: "AIzaSyDx1234567890abcdefghijklmnopqrstu",
  authDomain: "myproject-12345.firebaseapp.com",
  projectId: "myproject-12345",
  storageBucket: "myproject-12345.appspot.com",
  messagingSenderId: "1234567890123",
  appId: "1:1234567890123:web:abcdef1234567890ab"
}
```

---

## 🔧 Where to Paste It

**File:** `frontend/src/firebase-config.js`

**Replace this:**
```javascript
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

**With your actual values** (from Firebase Console)

---

## 🎯 Step by Step

### Step 1: Open Firebase Console
- Go to https://console.firebase.google.com
- Log in with your Google account

### Step 2: Select Your Project
- Click on the project you want to use
- (Or create a new one if you don't have one)

### Step 3: Find Settings
- Click ⚙️ icon (top right, near your avatar)
- Click **"Project Settings"**

### Step 4: Copy Config
- Scroll down to **"Your apps"** section
- Look for **"Web"** app (might say `</>`)
- Click on it
- Copy the entire config object

### Step 5: Paste in VS Code
- Open: `frontend/src/firebase-config.js`
- Replace `YOUR_API_KEY`, `YOUR_PROJECT_ID`, etc. with real values
- Save file

### Step 6: Verify
- Open browser DevTools (F12)
- Go to Console
- You should NOT see any Firebase errors
- Refresh page if needed

---

## ⚠️ Common Mistakes

❌ **DON'T:**
- Leave `YOUR_API_KEY` in the file
- Copy incomplete config (missing fields)
- Put config in wrong file

✅ **DO:**
- Copy all 6 values from Firebase
- Replace ALL placeholder text
- Save the file after editing
- Refresh browser with Ctrl+Shift+R

---

## 🚀 Next: Enable Features in Firebase

### 1. Enable Anonymous Auth
- In Firebase Console, go to **Authentication**
- Click **Get started**
- Find **Anonymous** and enable it
- Save

### 2. Enable Firestore
- In Firebase Console, go to **Firestore Database**
- Click **Create Database**
- Start in **Test Mode**
- Pick region closest to you
- Click **Enable**

### 3. Set Firestore Rules
- Click **Rules** tab in Firestore
- Replace with:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```
- Click **Publish**

---

## ✅ Testing

Once done:
1. Run: `npm run dev`
2. App should open in browser
3. You should see product store (NOT loading spinner)
4. Try writing a review
5. It should appear in Admin Panel

---

## 🆘 Still Stuck?

- Check console (F12) for red errors
- Make sure ALL 6 Firebase config values are filled
- Make sure Anonymous auth is ENABLED
- Try hard refresh: Ctrl+Shift+R
- Check FIREBASE_SETUP.md for detailed guide

---

**Ready?** Fill in your values and come back! 🎉
