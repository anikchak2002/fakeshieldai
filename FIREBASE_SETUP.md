# Firebase Setup Instructions

## 📖 Step-by-Step Firebase Configuration

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Add project"**
3. Enter project name (e.g., "fake-review-detector")
4. Accept the terms and click **"Create project"**
5. Wait for setup to complete

### 2. Enable Firestore Database

1. In Firebase Console, click **"Firestore Database"** (left sidebar)
2. Click **"Create database"**
3. Select **"Start in test mode"** (for development)
4. Choose region (closest to you)
5. Click **"Enable"**

✅ Firestore is now ready

### 3. Enable Anonymous Authentication

1. Go to **"Authentication"** (left sidebar)
2. Click **"Get started"**
3. Find **"Anonymous"** provider
4. Click it and toggle **"Enable"**
5. Click **"Save"**

✅ Authentication is ready

### 4. Get Firebase Config

1. Go to **"Project Settings"** (gear icon, top right)
2. Scroll to **"Your apps"** section
3. Click on the **"Web"** app (if none exists, click **"</>** Add app")
4. Copy the Firebase config object

It will look like:
```javascript
{
  apiKey: "AIzaSyDx...",
  authDomain: "myproject.firebaseapp.com",
  projectId: "myproject",
  storageBucket: "myproject.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc..."
}
```

### 5. Update Your App

Paste the config in `frontend/src/firebase-config.js`:

```javascript
export const firebaseConfig = {
  apiKey: "PASTE_YOUR_API_KEY",
  authDomain: "PASTE_YOUR_AUTHDOMAIN",
  projectId: "PASTE_YOUR_PROJECTID",
  storageBucket: "PASTE_YOUR_STORAGEBUCKET",
  messagingSenderId: "PASTE_YOUR_MESSAGESENDERID",
  appId: "PASTE_YOUR_APPID"
};
```

### 6. Set Firestore Security Rules (Important!)

For development/testing:

1. Go to **Firestore Database**
2. Click **"Rules"** tab
3. Replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write for testing
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

4. Click **"Publish"**

⚠️ **For production**: Use proper authentication rules!

### 7. Firestore Collection Structure

The app will auto-create this structure on first run:

```
artifacts/
└── default-app-id/
    └── public/
        └── data/
            ├── products/
            │   ├── p1 → {name, price, image, description}
            │   ├── p2 → ...
            │   └── ...
            └── reviews/
                ├── doc1 → {productId, text, rating, isFlagged, ...}
                ├── doc2 → ...
                └── ...
```

*No manual setup needed* - the app creates collections automatically!

---

## 🧪 Test Your Setup

1. Start the frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

2. Open browser to `http://localhost:3000`

3. You should see the app loading (spinning spinner → "Loading System...")

4. Once loaded, you can:
   - View the product store
   - Write a review
   - See it appear in Admin Panel

If Firebase works, reviews will persist even after refresh!

---

## ❌ Troubleshooting

### "Firebase is not initialized"
**Problem**: Firebase config is missing or invalid
**Solution**: 
- Check you copied the config correctly
- Make sure all 6 fields are present
- No extra quotes or missing commas

### "Permission denied" error in console
**Problem**: Firestore rules are too restrictive
**Solution**:
- Go to Firestore → Rules
- Use the test mode rules above (allow all for now)
- Click "Publish"

### "Anonymous authentication failed"
**Problem**: Anonymous auth not enabled
**Solution**:
- Go to Authentication
- Enable "Anonymous" provider
- Make sure toggle is ON

### Reviews don't appear
**Problem**: Firestore not syncing properly
**Solution**:
- Check browser console for errors (F12)
- Verify Firebase config is correct
- Check Firestore Rules allow read/write
- Try hard refresh (Ctrl+Shift+R)

### App stuck on "Loading System..."
**Problem**: Authentication timeout
**Solution**:
- Check internet connection
- Verify Firebase project is active
- Check browser console for errors
- Try clearing browser storage (DevTools → Application → Clear Storage)

---

## 🔐 Security Notes

### Development (Test Mode)
The rules above allow **anyone** to read/write. Use only for:
- Local development
- Testing
- Non-sensitive data

### Production (Recommended Rules)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /artifacts/{appId}/public/data/{document=**} {
      // Only allow anonymous users
      allow read: if request.auth.uid != null;
      allow write: if request.auth.uid != null;
    }
  }
}
```

---

## 📊 Firebase Pricing

**Good news:** The free tier is generous!

- **Firestore**: 1GB storage, 50K reads/day free
- **Authentication**: Unlimited free
- **Hosting**: Free tier available

Your fake review app will stay free unless it goes viral! 🚀

---

## 🆘 Need Help?

- Firebase Docs: https://firebase.google.com/docs
- Console Issues: https://firebase.google.com/support
- Stack Overflow: Tag questions with `firebase`

You're all set! 🎉
