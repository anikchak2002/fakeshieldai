import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
  signInWithCustomToken
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import {
  ShieldAlert,
  CheckCircle2,
  Trash2,
  LayoutDashboard,
  ShoppingBag,
  Star,
  AlertTriangle,
  RefreshCw,
  Server,
  Cpu,
  WifiOff,
  Activity,
  Users,
  Info,
  Zap,
  Sun,
  Moon,
  ArrowRight,
  Loader2,
  X,
  Check
} from 'lucide-react';
import { firebaseConfig, appId, initialAuthToken } from './firebase-config';

// --- Firebase Setup ---
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- Heuristic Analysis (unchanged) ---
const analyzeReviewHeuristic = (text, rating) => {
  let score = 0;
  let reasons = [];
  const lowerText = text.toLowerCase();

  if (text.length < 10) { score += 20; reasons.push("Too short"); }
  const spamKeywords = ['free', 'money', 'guarantee', 'click', 'winner', 'prize', '100%', 'crypto', 'buy now', 'link in bio'];
  const matches = spamKeywords.filter(word => lowerText.includes(word));
  if (matches.length > 0) {
    score += matches.length * 20;
    reasons.push(`Spam keywords: ${matches.join(', ')}`);
  }
  if (text === text.toUpperCase() && text.length > 10) { score += 30; reasons.push("All CAPS"); }
  if (/(.)\\1{3,}/.test(text)) { score += 15; reasons.push("Repeated characters"); }

  return {
    isFlagged: score >= 40,
    confidence: Math.min(score, 100),
    reasons: reasons,
    method: 'Local Logic'
  };
};

// --- Seed Products ---
const SEED_PRODUCTS = [
  { id: 'p1', name: 'NeuralNet GPU 4090', price: 135000, image: '🎮', description: 'Next-gen AI training architecture.' },
  { id: 'p2', name: 'Quantum Noise Earbuds', price: 16500, image: '🎧', description: 'Active reality filtering.' },
  { id: 'p3', name: 'CyberDeck Mechanical', price: 12000, image: '⌨️', description: 'Haptic feedback macros.' },
  { id: 'p4', name: 'Smart Home Hub', price: 7500, image: '🏠', description: 'Voice control your life.' }
];

// ============================================================
// UI Components
// ============================================================

function ThemeToggle({ darkMode, setDarkMode }) {
  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
      title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {darkMode ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

function Navbar({ viewMode, setViewMode, darkMode, setDarkMode }) {
  const tabs = [
    { id: 'customer', icon: ShoppingBag, label: 'Store' },
    { id: 'admin', icon: LayoutDashboard, label: 'Admin' },
    { id: 'about', icon: Info, label: 'About' }
  ];

  return (
    <nav
      className="sticky top-0 z-50 border-b"
      style={{
        backgroundColor: 'var(--bg-primary)',
        borderColor: 'var(--border-color)',
      }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex flex-col justify-center">
          <span
            className="text-[17px] tracking-tight leading-none"
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 800,
              background: 'linear-gradient(135deg, var(--accent) 0%, #a855f7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: 'transparent'
            }}
          >
            FakeShield AI
          </span>
          <span className="text-[9px] uppercase font-bold tracking-[0.2em] mt-1" style={{ color: 'var(--text-tertiary)' }}>Review Intelligence</span>
        </div>

        <div className="flex items-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setViewMode(tab.id)}
              className="px-3 py-1.5 text-sm rounded-md transition-colors flex items-center gap-1.5"
              style={{
                backgroundColor: viewMode === tab.id ? 'var(--bg-tertiary)' : 'transparent',
                color: viewMode === tab.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: viewMode === tab.id ? 500 : 400,
              }}
            >
              <tab.icon size={15} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}

          <div className="w-px h-5 mx-1" style={{ backgroundColor: 'var(--border-color)' }} />
          <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
        </div>
      </div>
    </nav>
  );
}

function ProductCard({ product, onSelect }) {
  return (
    <div
      onClick={() => onSelect(product)}
      className="rounded-xl p-5 cursor-pointer transition-all duration-200 border hover:shadow-md"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-color)',
        boxShadow: 'var(--shadow)',
      }}
    >
      <div
        className="h-32 flex items-center justify-center rounded-lg mb-4"
        style={{ backgroundColor: 'var(--bg-tertiary)' }}
      >
        <span className="text-5xl">{product.image}</span>
      </div>

      <h3 className="font-semibold text-base mb-1">{product.name}</h3>
      <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
        {product.description}
      </p>

      <div className="flex items-center justify-between">
        <span className="font-semibold" style={{ color: 'var(--accent)' }}>
          ₹{product.price.toLocaleString('en-IN')}
        </span>
        <span
          className="text-xs flex items-center gap-1 font-medium"
          style={{ color: 'var(--text-secondary)' }}
        >
          Write Review <ArrowRight size={12} />
        </span>
      </div>
    </div>
  );
}

function ReviewForm({ product, onSubmit, onCancel, isProcessing }) {
  const [text, setText] = useState('');
  const [rating, setRating] = useState(5);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim().length === 0) return alert('Please write a review');
    onSubmit({ productId: product.id, productName: product.name, rating, text, author: 'Anonymous User' });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
    >
      <div
        className="w-full max-w-md rounded-xl p-6 border relative"
        style={{
          backgroundColor: 'var(--bg-primary)',
          borderColor: 'var(--border-color)',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <button
          onClick={onCancel}
          className="absolute top-3 right-3 p-1 rounded-md hover:bg-[var(--bg-tertiary)] transition-colors"
          style={{ color: 'var(--text-tertiary)' }}
        >
          <X size={18} />
        </button>

        <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
        <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>
          Share your experience
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Star rating */}
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="p-0.5"
              >
                <Star
                  size={22}
                  className={rating >= star ? 'fill-amber-400 text-amber-400' : ''}
                  style={rating >= star ? {} : { color: 'var(--border-color)' }}
                />
              </button>
            ))}
          </div>

          {/* Text input */}
          <textarea
            required
            className="w-full rounded-lg p-3 text-sm min-h-[100px] border outline-none resize-none transition-colors"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
            }}
            placeholder="What did you think? (Try 'FREE MONEY' to test detection)..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-2.5 rounded-lg text-sm font-medium text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ backgroundColor: 'var(--accent)' }}
          >
            {isProcessing ? <Loader2 size={16} className="animate-spin" /> : null}
            {isProcessing ? 'Analyzing...' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  );
}

function SettingsPanel({
  provider, setProvider,
  apiEndpoint, setApiEndpoint,
  lmStudioApiBase, setLmStudioApiBase,
  lmStudioModel, setLmStudioModel
}) {
  const engines = [
    { id: 'heuristic', title: 'Local Heuristics', desc: 'Browser-side rules, no backend needed', icon: Server },
    { id: 'python-ml', title: 'Python ML Backend', desc: 'Flask + scikit-learn inference', icon: Cpu },
    { id: 'lmstudio', title: 'LM Studio LLM', desc: 'Route through a local LM Studio model', icon: Zap },
  ];

  return (
    <div
      className="rounded-xl border p-5 mb-6"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-color)',
      }}
    >
      <h3 className="font-semibold mb-1">Detection Engine</h3>
      <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>
        Choose how reviews are analyzed
      </p>

      <div className="space-y-2 mb-5">
        {engines.map((engine) => (
          <button
            key={engine.id}
            onClick={() => setProvider(engine.id)}
            className="w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors flex items-center gap-3"
            style={{
              borderColor: provider === engine.id ? 'var(--accent)' : 'var(--border-color)',
              backgroundColor: provider === engine.id ? 'var(--accent-light)' : 'var(--bg-primary)',
            }}
          >
            <engine.icon size={16} style={{ color: provider === engine.id ? 'var(--accent)' : 'var(--text-tertiary)' }} />
            <div>
              <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{engine.title}</p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{engine.desc}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Endpoint inputs */}
      {provider !== 'heuristic' && (
        <div className="space-y-3 pt-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
              Backend API Endpoint
            </label>
            <input
              type="text"
              value={apiEndpoint}
              onChange={(e) => setApiEndpoint(e.target.value)}
              className="w-full rounded-lg px-3 py-2 text-sm border outline-none font-mono"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          {provider === 'lmstudio' && (
            <>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                  LM Studio API Base
                </label>
                <input
                  type="text"
                  value={lmStudioApiBase}
                  onChange={(e) => setLmStudioApiBase(e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-sm border outline-none font-mono"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                  Model Name
                </label>
                <input
                  type="text"
                  value={lmStudioModel}
                  onChange={(e) => setLmStudioModel(e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-sm border outline-none font-mono"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
            </>
          )}

          <p className="text-xs flex items-center gap-1" style={{ color: 'var(--text-tertiary)' }}>
            <WifiOff size={11} /> Falls back to local heuristics if backend is unreachable
          </p>
        </div>
      )}
    </div>
  );
}

function ReviewCard({ review, onDelete, onApprove }) {
  const isFlagged = review.isFlagged;
  const isManuallyApproved = review.manuallyApproved;

  return (
    <div
      className="rounded-lg border p-4 transition-colors"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-color)',
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-medium text-sm">{review.productName}</span>
            <span
              className="text-xs px-1.5 py-0.5 rounded"
              style={{
                backgroundColor: 'var(--bg-tertiary)',
                color: 'var(--text-secondary)',
              }}
            >
              ★ {review.rating}
            </span>
          </div>

          <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
            "{review.text}"
          </p>

          <div className="flex gap-3 text-xs" style={{ color: 'var(--text-tertiary)' }}>
            <span>{review.author}</span>
            <span>·</span>
            <span>{review.method}</span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          {/* Status badge */}
          <span
            className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md"
            style={{
              backgroundColor: isFlagged ? 'var(--danger-light)' : 'var(--success-light)',
              color: isFlagged ? 'var(--danger)' : 'var(--success)',
            }}
          >
            {isFlagged ? <AlertTriangle size={12} /> : <CheckCircle2 size={12} />}
            {isFlagged ? 'Flagged' : (isManuallyApproved ? 'Approved' : 'Passed')}
          </span>

          {isFlagged && (
            <span className="text-xs font-mono" style={{ color: 'var(--text-tertiary)' }}>
              {review.confidence}%
            </span>
          )}

          <div className="flex gap-1 mt-1">
            {isFlagged && onApprove && (
              <button
                onClick={() => onApprove(review.id)}
                className="p-1.5 rounded-md transition-colors hover:bg-[var(--success-light)] text-[var(--success)]"
                title="Approve review manually"
              >
                <Check size={14} />
              </button>
            )}
            <button
              onClick={() => onDelete(review.id)}
              className="p-1.5 rounded-md transition-colors hover:bg-[var(--danger-light)]"
              style={{ color: 'var(--text-tertiary)' }}
              title="Delete review"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Flagged reasons */}
      {isFlagged && review.reasons?.length > 0 && (
        <div className="mt-3 pt-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex flex-wrap gap-1.5">
            {review.reasons.map((reason, i) => (
              <span
                key={i}
                className="text-xs px-2 py-0.5 rounded"
                style={{
                  backgroundColor: 'var(--danger-light)',
                  color: 'var(--danger)',
                }}
              >
                {reason}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto py-12 space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">FakeShield AI</h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Ecommerce fake review detection system built by Anik Chakraborty.
        </p>
      </div>

      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--text-tertiary)' }}>
          About
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          FakeShield AI is a full-stack application designed to detect fake product reviews
          in ecommerce platforms using machine learning and heuristic analysis. It features
          a React frontend, Python ML backend with Naive Bayes classification, and Firebase
          real-time database for instant review sync across clients.
        </p>
      </div>

      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--text-tertiary)' }}>
          Technologies
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {[
            'React + Vite',
            'Firebase Firestore',
            'Python Flask',
            'Scikit-learn',
            'Tailwind CSS',
            'Naive Bayes ML'
          ].map((tech) => (
            <div
              key={tech}
              className="text-sm px-3 py-2 rounded-lg border"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-secondary)',
              }}
            >
              {tech}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--text-tertiary)' }}>
          Developer
        </h2>
        <div
          className="rounded-xl border p-4"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }}
        >
          <p className="text-sm font-medium">Anik Chakraborty</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>Full-Stack Developer</p>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--text-tertiary)' }}>
          Features
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { title: 'Multi-Engine Detection', desc: 'Local heuristics, Python ML, and LM Studio LLM' },
            { title: 'Real-Time Sync', desc: 'Firebase Firestore instant updates' },
            { title: 'Machine Learning', desc: 'Naive Bayes classifier with TF-IDF' },
            { title: 'Analytics', desc: 'Confidence scores and flagged reasons' },
          ].map((feature) => (
            <div key={feature.title}>
              <p className="text-sm font-medium mb-0.5">{feature.title}</p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs pt-4" style={{ color: 'var(--text-tertiary)' }}>
        © 2026 FakeShield AI. All rights reserved.
      </p>
    </div>
  );
}

// ============================================================
// Main App
// ============================================================

function ProductDetailModal({ product, reviews, onClose, onWriteReview }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className="w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}
      >
        <div className="p-4 border-b flex justify-between items-center sticky top-0" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-primary)' }}>
          <h2 className="font-semibold text-lg">{product.name}</h2>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto p-6 flex-1">
          <div className="flex gap-6 mb-8">
            <div className="w-1/3 aspect-square rounded-lg overflow-hidden shrink-0 border" style={{ borderColor: 'var(--border-color)' }}>
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{product.description}</p>
              <div className="flex items-center gap-2 mb-6">
                <span className="font-bold text-xl">${product.price.toFixed(2)}</span>
                <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>· {product.category}</span>
              </div>
              <button
                onClick={onWriteReview}
                className="w-full sm:w-auto px-4 py-2 rounded-lg font-medium text-white shadow-md hover:shadow-lg transition-all text-sm flex justify-center items-center gap-2"
                style={{ background: 'linear-gradient(135deg, var(--accent) 0%, #a855f7 100%)' }}
              >
                Write a Review
              </button>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-4 flex items-center gap-2 border-b pb-2" style={{ borderColor: 'var(--border-color)' }}>
              Customer Reviews
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                {reviews.length}
              </span>
            </h3>

            {reviews.length === 0 ? (
              <div className="text-center py-8 rounded-lg border border-dashed" style={{ borderColor: 'var(--border-color)' }}>
                <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>No reviews yet. Be the first to share your thoughts!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map(review => (
                  <div key={review.id} className="p-4 rounded-lg border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{review.author}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                          ★ {review.rating}
                        </span>
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[var(--success-light)] text-[var(--success)]">
                        {review.manuallyApproved ? 'Approved (Manual)' : 'Verified'}
                      </span>
                    </div>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>"{review.text}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [viewMode, setViewMode] = useState('customer');
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [provider, setProvider] = useState('heuristic');
  const [apiEndpoint, setApiEndpoint] = useState('http://127.0.0.1:5050/predict');
  const [lmStudioApiBase, setLmStudioApiBase] = useState('http://127.0.0.1:1234/v1');
  const [lmStudioModel, setLmStudioModel] = useState('local-model');
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('fakeshield-theme');
    return saved ? saved === 'dark' : true;
  });

  // Theme effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('fakeshield-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Auth
  useEffect(() => {
    const initAuth = async () => {
      if (initialAuthToken) await signInWithCustomToken(auth, initialAuthToken);
      else await signInAnonymously(auth);
    };
    initAuth();
    onAuthStateChanged(auth, setUser);
  }, []);

  // Data listeners
  useEffect(() => {
    if (!user) return;
    const unsubProd = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'products'), (s) => {
      const p = s.docs.map(d => ({ id: d.id, ...d.data() }));
      p.length === 0 ? seedData() : setProducts(p);
    });
    const unsubRev = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'reviews'), (s) => {
      setReviews(s.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0)));
    });
    return () => { unsubProd(); unsubRev(); };
  }, [user]);

  const seedData = async () => {
    const batch = writeBatch(db);
    SEED_PRODUCTS.forEach(p => batch.set(doc(db, 'artifacts', appId, 'public', 'data', 'products', p.id), p));
    await batch.commit();
  };

  const handleReviewSubmit = async (reviewData) => {
    setProcessing(true);
    let analysis = {};
    if (provider !== 'heuristic') {
      try {
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: reviewData.text,
            provider,
            lmStudioApiBase,
            lmStudioModel
          })
        });
        if (!response.ok) throw new Error('Unreachable');
        const data = await response.json();
        analysis = {
          isFlagged: data.isFlagged,
          confidence: data.confidence,
          reasons: Array.isArray(data.reasons) ? data.reasons : [],
          method: data.method || (provider === 'lmstudio' ? 'LM Studio Local LLM' : 'Python Model (Naive Bayes)')
        };
      } catch (err) {
        analysis = { ...analyzeReviewHeuristic(reviewData.text, reviewData.rating), method: 'Fallback Local' };
        analysis.reasons.push("Server Error");
      }
    } else {
      await new Promise(r => setTimeout(r, 800));
      analysis = analyzeReviewHeuristic(reviewData.text, reviewData.rating);
    }

    await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'reviews'), { ...reviewData, ...analysis, createdAt: serverTimestamp() });
    setProcessing(false);
    setSelectedProduct(null);
  };

  const handleDeleteReview = (reviewId) => {
    deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'reviews', reviewId));
  };

  const handleApproveReview = async (reviewId) => {
    await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'reviews', reviewId), {
      isFlagged: false,
      manuallyApproved: true
    });
  };

  // Loading state
  if (!user) return (
    <div className="flex h-screen items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
        <Loader2 size={16} className="animate-spin" />
        Initializing...
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Navbar viewMode={viewMode} setViewMode={setViewMode} darkMode={darkMode} setDarkMode={setDarkMode} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {viewMode === 'customer' && (
          <div>
            <div className="mb-8">
              <h1 className="text-xl font-semibold mb-1">Products</h1>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Browse items and leave authenticated reviews.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {products.map(p => (
                <ProductCard key={p.id} product={p} onSelect={setViewingProduct} />
              ))}
            </div>
          </div>
        )}

        {viewMode === 'admin' && (
          <div>
            <SettingsPanel
              provider={provider}
              setProvider={setProvider}
              apiEndpoint={apiEndpoint}
              setApiEndpoint={setApiEndpoint}
              lmStudioApiBase={lmStudioApiBase}
              setLmStudioApiBase={setLmStudioApiBase}
              lmStudioModel={lmStudioModel}
              setLmStudioModel={setLmStudioModel}
            />

            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold flex items-center gap-2">
                <Activity size={16} style={{ color: 'var(--accent)' }} />
                Reviews
              </h2>
              <span
                className="text-xs font-mono"
                style={{ color: 'var(--text-tertiary)' }}
              >
                {reviews.length} total
              </span>
            </div>

            <div className="space-y-3">
              {reviews.length === 0 && (
                <div
                  className="text-center py-12 rounded-xl border border-dashed"
                  style={{
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-tertiary)',
                  }}
                >
                  <p className="text-sm">No reviews yet.</p>
                </div>
              )}

              {reviews.map(r => (
                <ReviewCard key={r.id} review={r} onDelete={handleDeleteReview} onApprove={handleApproveReview} />
              ))}
            </div>
          </div>
        )}

        {viewMode === 'about' && <AboutPage />}
      </main>

      {selectedProduct && (
        <ReviewForm
          product={selectedProduct}
          onSubmit={handleReviewSubmit}
          onCancel={() => setSelectedProduct(null)}
          isProcessing={processing}
        />
      )}

      {viewingProduct && (
        <ProductDetailModal
          product={viewingProduct}
          reviews={reviews.filter(r => r.productName === viewingProduct.name && !r.isFlagged)}
          onClose={() => setViewingProduct(null)}
          onWriteReview={() => {
            setSelectedProduct(viewingProduct);
            setViewingProduct(null);
          }}
        />
      )}
    </div>
  );
}
