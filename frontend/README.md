# Frontend Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Firebase
Edit `src/firebase-config.js`:
```javascript
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "yourapp.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "yourapp.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456"
};
```

### 3. Start Development Server
```bash
npm run dev
```

Opens automatically at `http://localhost:3000`

## Features

### Customer View
- Browse 4 sample products
- Write reviews with star ratings
- Real-time submission with AI analysis
- See if review was flagged as fake

### Admin Panel
- Toggle between Local Logic and Python ML
- Adjust Python API endpoint
- Monitor all incoming reviews in real-time
- See confidence scores and reason for flags
- Delete reviews
- View detection method used

## Project Structure

```
src/
├── App.jsx              # Main component with full logic
├── firebase-config.js   # Firebase credentials
├── main.jsx            # React entry point
└── index.css           # Tailwind styles
```

## Components Breakdown

### Navbar
Navigation between Customer and Admin modes

### ProductCard
Displays product info and opens review modal

### ReviewForm
Modal form for submitting reviews

### SettingsPanel
Admin controls for detection engine

### Main App Logic
- Firebase authentication (anonymous)
- Real-time data syncing with Firestore
- Dual detection (local + ML)
- Review CRUD operations

## Build & Deploy

### Production Build
```bash
npm run build
```

Outputs optimized files to `dist/`

### Preview Build
```bash
npm run preview
```

## Configuration

### Disable ML Mode by Default
Edit `App.jsx`:
```javascript
const [useML, setUseML] = useState(false);  // ← Already disabled
```

### Change Default API Endpoint
Edit `App.jsx`:
```javascript
const [apiEndpoint, setApiEndpoint] = useState('http://localhost:5000/predict');
```

### Modify Products
Edit `App.jsx`, find `SEED_PRODUCTS`:
```javascript
const SEED_PRODUCTS = [
  { id: 'p1', name: 'Product Name', price: 99.99, image: '🎮', description: '...' }
];
```

### Adjust Detection Rules
Edit `App.jsx`, find `analyzeReviewHeuristic`:
```javascript
const spamKeywords = ['free', 'money', 'click'];  // Add/remove keywords
if (text.length < 10) { score += 20; }            // Adjust sensitivity
```

## Styling

Uses **Tailwind CSS** for all styling. Classes are directly in JSX.

To customize:
1. Edit `tailwind.config.js` for theme
2. Modify classes in JSX components
3. Add custom CSS in `index.css`

## Troubleshooting

### "Firebase config is invalid"
→ Check `firebase-config.js` has all required fields from Firebase Console

### Reviews not syncing
→ Check Firebase Firestore permissions (should be readable/writable)

### Python server not connecting
→ Check Flask is running on port 5000 and CORS is enabled

### Styling issues
→ Run `npm install` to ensure Tailwind is installed

### Port 3000 already in use
→ Run on different port:
```bash
npm run dev -- --port 3001
```

## Dependencies

- `react` - UI library
- `react-dom` - React renderer
- `firebase` - Backend services
- `lucide-react` - Icons
- `tailwindcss` - CSS framework
- `vite` - Build tool

## Next Steps

1. ✅ Complete Firebase setup
2. ✅ Run `npm install && npm run dev`
3. ✅ Write test reviews
4. ✅ (Optional) Enable Python ML mode with backend

Enjoy! 🎉
