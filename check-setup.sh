#!/bin/bash
# Setup Validation Script - Checks if everything is ready

echo "================================================"
echo "FakeShield AI - System Check"
echo "================================================"

# Check Node.js
echo ""
echo "📦 Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✓ Node.js installed: $NODE_VERSION"
else
    echo "✗ Node.js NOT found. Install from https://nodejs.org"
fi

# Check npm
echo ""
echo "📦 Checking npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo "✓ npm installed: $NPM_VERSION"
else
    echo "✗ npm NOT found. Install Node.js"
fi

# Check Python
echo ""
echo "🐍 Checking Python..."
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    echo "✓ Python installed: $PYTHON_VERSION"
else
    echo "✗ Python NOT found. Install from https://python.org"
fi

# Check frontend files
echo ""
echo "📁 Checking Frontend Files..."
if [ -f "frontend/package.json" ]; then
    echo "✓ frontend/package.json"
else
    echo "✗ frontend/package.json NOT found"
fi

if [ -f "frontend/src/App.jsx" ]; then
    echo "✓ frontend/src/App.jsx"
else
    echo "✗ frontend/src/App.jsx NOT found"
fi

if [ -f "frontend/src/firebase-config.js" ]; then
    echo "✓ frontend/src/firebase-config.js (needs Firebase credentials)"
else
    echo "✗ frontend/src/firebase-config.js NOT found"
fi

# Check backend files
echo ""
echo "🔧 Checking Backend Files..."
if [ -f "backend/app.py" ]; then
    echo "✓ backend/app.py"
else
    echo "✗ backend/app.py NOT found"
fi

if [ -f "backend/model_train.py" ]; then
    echo "✓ backend/model_train.py"
else
    echo "✗ backend/model_train.py NOT found"
fi

if [ -f "backend/reviews.csv" ]; then
    echo "✓ backend/reviews.csv"
else
    echo "✗ backend/reviews.csv NOT found"
fi

# Check documentation
echo ""
echo "📖 Checking Documentation..."
if [ -f "README.md" ]; then
    echo "✓ Main README.md"
else
    echo "✗ README.md NOT found"
fi

if [ -f "QUICKSTART.md" ]; then
    echo "✓ QUICKSTART.md"
else
    echo "✗ QUICKSTART.md NOT found"
fi

echo ""
echo "================================================"
echo "✅ System Check Complete!"
echo ""
echo "Next Steps:"
echo "1. Install frontend deps: cd frontend && npm install"
echo "2. Setup Firebase: Edit frontend/src/firebase-config.js"
echo "3. Start frontend: npm run dev"
echo "4. (Optional) Setup backend: cd backend && pip install -r requirements.txt"
echo ""
echo "Read QUICKSTART.md for more info!"
echo "================================================"
