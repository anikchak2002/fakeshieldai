# Commands Reference

Quick reference for all important commands.

## Frontend Commands

### Installation & Setup
```bash
cd frontend
npm install
```

### Development
```bash
npm run dev
```
- Starts dev server at http://localhost:3000
- Hot reload on file changes
- Open automatically in browser

### Production Build
```bash
npm run build
```
- Creates optimized build in `dist/`
- Ready for deployment
- Minified and optimized

### Preview Build
```bash
npm run preview
```
- Test production build locally
- Useful before deployment

## Backend Commands

### Installation
```bash
cd backend
pip install -r requirements.txt
```

Installs:
- Flask
- Flask-CORS
- Scikit-learn
- Pandas
- NumPy
- Joblib

### Training ML Model
```bash
python model_train.py
```

Outputs:
- `review_model.pkl` - Trained model
- `vectorizer.pkl` - Text vectorizer
- Accuracy metrics in console

### Running Server
```bash
python app.py
```

Starts Flask at http://localhost:5000

Endpoints:
- `POST /predict` - Analyze review
- `GET /health` - Check status

### Test API (curl)
```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{"text":"This product is amazing"}'
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

## Development Commands

### Check Setup
```bash
bash check-setup.sh
```

Validates:
- Node.js installed
- npm installed
- Python installed
- All files present

### Git Commands
```bash
# Initialize repo
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Create new branch
git checkout -b feature-name

# Push to remote
git push -u origin main
```

### Python Virtual Environment
```bash
# Create
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Mac/Linux)
source venv/bin/activate

# Deactivate
deactivate
```

## Project Management

### Update Dependencies

**Frontend:**
```bash
cd frontend
npm update
```

**Backend:**
```bash
cd backend
pip install --upgrade -r requirements.txt
```

### Clean Build
```bash
# Frontend
cd frontend
rm -rf node_modules dist
npm install

# Backend
cd backend
rm -rf __pycache__ *.pkl
pip install -r requirements.txt
python model_train.py
```

### View Port Usage
```bash
# Check what's using port 3000 (Windows)
netstat -ano | findstr :3000

# Kill process (Windows)
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :3000
kill -9 <PID>
```

## Useful Shortcuts

### VS Code
- `Ctrl+J` - Toggle terminal
- `Ctrl+Shift+P` - Command palette
- `F12` - DevTools
- `Ctrl+Shift+L` - Format document

### Git
- `git log --oneline` - See commit history
- `git status` - Check changes
- `git diff` - See what changed
- `git restore .` - Undo changes

### Python
- `python -c "import package"` - Check if package installed
- `python --version` - Check Python version
- `python -m pip list` - List installed packages

## Debugging

### Frontend (Browser DevTools)
```javascript
// Console
console.log(obj)
console.table(array)
console.error(error)

// Network tab
// See all API calls and responses

// Application tab
// View Firebase auth state
// Check Firestore data
// View localStorage
```

### Flask
```python
# Add to app.py
@app.route('/debug')
def debug():
    return jsonify({
        'model_loaded': model is not None,
        'vectorizer_loaded': vectorizer is not None
    })
```

### React
```javascript
// Add to App.jsx
useEffect(() => {
    console.log('User:', user);
    console.log('Products:', products);
    console.log('Reviews:', reviews);
}, [user, products, reviews]);
```

## Deployment Shortcuts

### Frontend (Vercel)
```bash
npm i -g vercel
vercel login
vercel
```

### Frontend (Netlify)
```bash
npm i -g netlify-cli
netlify login
netlify deploy --prod --dir=dist
```

### Backend (Heroku)
```bash
heroku login
heroku create app-name
git push heroku main
```

## Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_CONFIG={"apiKey":"..."}
```

Access in code:
```javascript
const apiUrl = import.meta.env.VITE_API_URL
```

### Backend (.env)
```env
FLASK_ENV=development
FLASK_DEBUG=1
```

## Quick Recipes

### Add Package to Frontend
```bash
cd frontend
npm install package-name
```

### Add Package to Backend
```bash
cd backend
pip install package-name
pip freeze > requirements.txt
```

### Reset Everything
```bash
# Frontend
cd frontend
rm -rf node_modules dist .vite
npm install
npm run dev

# Backend
cd backend
rm -rf __pycache__ venv *.pkl *.joblib
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python model_train.py
python app.py
```

### View Live Logs
```bash
# Frontend (VS Code terminal)
npm run dev

# Backend (separate terminal)
python app.py
# Watch for "Contacting ML Server" messages
```

---

## Tips & Tricks

1. **Keep two terminals open**
   - One for frontend (`npm run dev`)
   - One for backend (`python app.py`)

2. **Use console.log liberally**
   - Log API requests/responses
   - Log Firebase events
   - Log ML predictions

3. **Check browser DevTools**
   - Network tab shows API calls
   - Application tab shows Firebase data
   - Console shows errors

4. **Reload isn't enough**
   - Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - Clear cache: DevTools → Settings → Network → Disable cache (while open)

5. **Test both paths**
   - Try writing "real" reviews first
   - Then try "fake" keywords to test detection
   - Check Admin panel shows both types

Happy developing! 🚀
