# 🔧 Troubleshooting Guide

## Frontend Issues

### Issue: "npm: command not found"
**Problem**: Node.js/npm not installed
**Solution**:
1. Download from https://nodejs.org (LTS version)
2. Run installer and restart terminal
3. Verify: `node --version` and `npm --version`

### Issue: "Port 3000 already in use"
**Problem**: Another app using port 3000
**Solution**:

Windows:
```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

Mac/Linux:
```bash
lsof -i :3000
kill -9 <PID>
```

Or use different port:
```bash
npm run dev -- --port 3001
```

### Issue: "Module not found: react"
**Problem**: Dependencies not installed
**Solution**:
```bash
cd frontend
rm -rf node_modules
npm install
npm run dev
```

### Issue: "Firebase is not initialized"
**Problem**: Firebase config is incomplete/wrong
**Solution**:
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Copy your full config from Project Settings
3. Paste in `frontend/src/firebase-config.js`
4. Check all 6 fields are present:
   - apiKey
   - authDomain
   - projectId
   - storageBucket
   - messagingSenderId
   - appId

### Issue: "App stuck on 'Loading System...'"
**Problem**: Firebase authentication timeout
**Solution**:
1. Check internet connection
2. Verify Firebase config is correct
3. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
4. Clear cache: Open DevTools (F12) → Settings → Network → "Disable cache (while DevTools is open)"
5. Close DevTools and refresh

### Issue: "Reviews not showing up"
**Problem**: Firestore not syncing
**Solution**:
1. Check Firebase credentials are correct
2. Open DevTools (F12) → Console
3. Look for Firebase errors
4. Check Firestore has data:
   - Firebase Console → Firestore Database
   - Look for `artifacts/default-app-id/public/data/reviews`
5. If empty, try writing a new review
6. Check Firestore rules allow read/write

### Issue: "Styling looks broken"
**Problem**: Tailwind CSS not loaded
**Solution**:
```bash
cd frontend
npm install tailwindcss postcss autoprefixer
npm run dev
```

### Issue: "Can't see admin panel changes"
**Problem**: Browser cache
**Solution**:
1. Hard refresh: `Ctrl+Shift+R`
2. Or clear everything: DevTools → Application → Clear Storage → Clear All
3. Then refresh

---

## Backend Issues

### Issue: "python: command not found"
**Problem**: Python not installed
**Solution**:
1. Download from https://python.org
2. During install, check "Add Python to PATH"
3. Restart terminal and verify: `python --version`

### Issue: "No module named 'flask'"
**Problem**: Flask not installed
**Solution**:
```bash
cd backend
pip install -r requirements.txt
```

### Issue: "Port 5000 already in use"
**Problem**: Flask or another app using port 5000
**Solution**:

Windows:
```bash
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

Mac/Linux:
```bash
lsof -i :5000
kill -9 <PID>
```

Or modify in `app.py`:
```python
app.run(debug=True, port=5001)  # Use different port
```

### Issue: "ModuleNotFoundError: No module named 'sklearn'"
**Problem**: Scikit-learn not installed
**Solution**:
```bash
cd backend
pip install scikit-learn pandas numpy joblib flask flask-cors
```

### Issue: "No such file or directory: 'reviews.csv'"
**Problem**: Running from wrong directory
**Solution**:
```bash
# Make sure you're in backend folder
cd backend

# Then run
python model_train.py
```

### Issue: "Model file not found when starting app.py"
**Problem**: Model wasn't trained
**Solution**:
```bash
# First train the model
python model_train.py

# Then run server
python app.py
```

### Issue: "CORS error when calling from React"
**Problem**: Flask-CORS not enabled
**Solution**:
1. Make sure `flask-cors` is installed:
   ```bash
   pip install flask-cors
   ```

2. Check `app.py` has:
   ```python
   from flask_cors import CORS
   CORS(app)
   ```

3. Restart Flask server

### Issue: "Server runs but React can't reach it"
**Problem**: Wrong API endpoint or server not running
**Solution**:
1. Check Flask is actually running (you see "Running on http://localhost:5000")
2. In Admin Panel, verify endpoint is: `http://localhost:5000/predict`
3. Test endpoint in browser:
   ```
   http://localhost:5000/health
   ```
   Should show: `{"status":"ok"}`
4. Make sure both frontend AND backend are running

---

## Firebase Issues

### Issue: "Permission denied" error
**Problem**: Firestore rules too restrictive
**Solution**:
1. Firebase Console → Firestore Database → Rules
2. Replace with test rules:
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
3. Click "Publish"

⚠️ These test rules allow anyone to read/write. Only use for development!

### Issue: "Authentication failed"
**Problem**: Anonymous auth not enabled
**Solution**:
1. Firebase Console → Authentication
2. Make sure "Anonymous" is enabled (toggle ON)
3. Try hard refresh in browser

### Issue: "Collections not created"
**Problem**: No reviews written yet or schema issue
**Solution**:
1. Write a review in the app (Store → Pick product → Write review)
2. Check Firebase Console → Firestore Database
3. You should see new documents appear in real-time
4. If still empty, check browser console (F12) for errors

### Issue: "Data disappeared"
**Problem**: Firestore rule change or accidental deletion
**Solution**:
1. Check Firestore Rules allow read/write
2. Make sure you didn't delete the collection
3. If using test mode, you have limited retention
4. Write new reviews to add data back

---

## API Issues

### Issue: "ML server returns error"
**Problem**: Model not trained or invalid input
**Solution**:
1. Train model: `cd backend && python model_train.py`
2. Restart Flask: `python app.py`
3. Check request format:
   ```json
   {"text": "Your review text here"}
   ```

### Issue: "Undefined/null predictions"
**Problem**: Model didn't load properly
**Solution**:
1. Check console output from `python app.py`
2. Should see: "Loading pre-trained model..." or "Using heuristic fallback"
3. If fallback is used, train model again
4. Check `review_model.pkl` and `vectorizer.pkl` exist in backend folder

---

## Performance Issues

### Issue: "App is slow/laggy"
**Problem**: Too many reviews or poor network
**Solution**:
1. Open DevTools → Performance tab
2. Record a few seconds
3. Look for slow operations
4. Try in incognito mode (fewer extensions)
5. Check internet speed (speedtest.net)

### Issue: "Memory usage high"
**Problem**: Leak or too much data in memory
**Solution**:
1. Close other tabs/apps
2. Hard refresh: `Ctrl+Shift+R`
3. Restart browser
4. Check if you have 1000+ reviews (delete some)

---

## Data Issues

### Issue: "Reviews keep disappearing"
**Problem**: Firestore test mode expiration or rules
**Solution**:
1. Check Firestore Rules allow read/write
2. Use production rules (not test)
3. Upgrade Firebase plan if needed
4. Check data is actually being saved

### Issue: "Can't delete reviews"
**Problem**: Permission denied or ID not found
**Solution**:
1. Check Firestore Rules allow delete
2. Hard refresh and try again
3. Check review exists in Firebase console
4. Use browser DevTools to see error details

### Issue: "Writing reviews very slow"
**Problem**: Network lag or Firebase quota
**Solution**:
1. Check internet connection
2. Check Firebase project has quota remaining
3. Try from different network (WiFi vs mobile)
4. Check console for errors

---

## Development Issues

### Issue: "Can't see my code changes"
**Problem**: File not saved or cache
**Solution**:
1. Make sure file is saved (looks clean in editor, no dot)
2. Wait for Vite to recompile (check terminal)
3. Hard refresh browser: `Ctrl+Shift+R`
4. Check browser console has no errors

### Issue: "Git merge conflicts"
**Problem**: Multiple changes to same file
**Solution**:
1. Open file and look for `<<<<<<` markers
2. Choose which version to keep
3. Remove conflict markers
4. Save and commit

### Issue: "Can't push to GitHub"
**Problem**: Authentication or permissions
**Solution**:
```bash
git config user.email "your@email.com"
git config user.name "Your Name"
git push -u origin main
```

---

## General Tips

### The "Try This First" List
When stuck, try in this order:

1. **Hard refresh browser**: `Ctrl+Shift+R`
2. **Clear cache**: DevTools → Application → Clear Storage
3. **Close and reopen terminal**: Kill and restart your commands
4. **Restart VS Code**: Close and reopen
5. **Check console**: DevTools (F12) → Console for red errors
6. **Read error message**: 90% of the time it tells you the problem!
7. **Google the error**: Copy-paste the error message
8. **Ask ChatGPT**: Paste error and your code, ask what's wrong

### Asking for Help
When posting on Stack Overflow or asking for help:
1. Include the **exact error message**
2. Include your **code snippet** (not screenshot)
3. Include what **version** of Node/Python you're using
4. Include what you **already tried**
5. Include **what you expected** vs **what happened**

### Common Fixes
Most issues are fixed by:
- Reinstalling: `rm -rf node_modules && npm install`
- Restarting: Terminal, browser, or VS Code
- Clearing cache: DevTools → Clear Storage
- Updating: `npm update` or `pip install --upgrade package`

---

## Still Stuck?

1. **Check the docs**: README.md, QUICKSTART.md, FIREBASE_SETUP.md
2. **Check the comments**: Code has explanatory comments
3. **Google it**: Error message + "javascript" or "python"
4. **Stack Overflow**: Tag with `firebase`, `react`, `flask`
5. **GitHub Issues**: Check if others had same problem

Remember: **Every developer gets stuck!** It's normal. Keep debugging! 🚀

Good luck! 💪
