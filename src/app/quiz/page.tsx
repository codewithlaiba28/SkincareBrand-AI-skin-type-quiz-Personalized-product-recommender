'use client';
import { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { products } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import './QuizPage.css';

const QUESTIONS = [
  {
    id: 'skinType',
    question: 'How would you describe your skin type?',
    options: ['Dry', 'Oily', 'Combination', 'Normal', 'Sensitive'],
  },
  {
    id: 'concern',
    question: 'What is your primary skincare concern?',
    options: ['Acne & Breakouts', 'Aging & Wrinkles', 'Dark Spots & Pigmentation', 'Redness & Rosacea', 'Dullness'],
  },
  {
    id: 'feeling',
    question: 'How does your skin feel after washing?',
    options: ['Tight and dry', 'Comfortable', 'Oily very quickly', 'Irritated or red'],
  },
  {
    id: 'age',
    question: 'What is your age range?',
    options: ['Teens', '20s', '30s', '40s', '50+'],
  },
  {
    id: 'routine',
    question: 'Do you prefer a minimal or extensive routine?',
    options: ['Minimal (2-3 steps, quick)', 'Extensive (4+ steps, spa-like)'],
  }
];

export default function QuizPage() {
  const { user, setIsAuthModalOpen } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { addToCart } = useCart();

  const handleSelect = (option: string) => {
    setAnswers({ ...answers, [QUESTIONS[currentStep].id]: option });
  };

  const handleNext = async () => {
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      await submitQuiz();
    }
  };

  const submitQuiz = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers),
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error("Quiz submission failed", error);
    } finally {
      setLoading(false);
    }
  };

  // Find the actual product objects matching Gemini's recommendations by name
  const recommendedProducts = result?.recommendedProducts
    ?.map((aiProd: any) => {
      const found = products.find(p => p.name.toLowerCase() === aiProd.name.toLowerCase());
      return found ? { ...found, reason: aiProd.reason } : null;
    })
    .filter(Boolean) || [];

  if (!user) {
    return (
      <main className="quiz-main-page">
        <div className="quiz-wrapper container" style={{ textAlign: 'center' }}>
          <div className="quiz-card animate-fade-in">
            <h2 className="quiz-question" style={{ marginBottom: '1rem' }}>Authentication Required</h2>
            <p style={{ color: 'var(--color-text-light)', marginBottom: '2rem', fontSize: '1.1rem' }}>You must be logged in to take the AI Skin Assessment.</p>
            <button onClick={() => setIsAuthModalOpen(true)} className="btn-primary">
              Login or Create Account
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (result) {
    return (
      <main className="quiz-result-page">
        <div className="container result-container">
          <div className="result-header text-center">
            <div className="sparkle-icon"><Sparkles size={32} /></div>
            <h1>Your Personalized Routine</h1>
            <p>Based on your answers, our AI specialist has created a routine just for your <strong>{result.skinType}</strong> skin.</p>
          </div>

          <div className="routine-layout">
            <div className="routine-column">
              <div className="routine-card">
                <h3><span className="sun-icon">☀️</span> Morning Routine</h3>
                <ul className="routine-list">
                  {result.recommendedRoutine.AM.map((step: string, i: number) => (
                    <li key={i}><CheckCircle2 size={16} className="text-accent" /> {step}</li>
                  ))}
                </ul>
              </div>
              <div className="routine-card">
                <h3><span className="moon-icon">🌙</span> Evening Routine</h3>
                <ul className="routine-list">
                  {result.recommendedRoutine.PM.map((step: string, i: number) => (
                    <li key={i}><CheckCircle2 size={16} className="text-accent" /> {step}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="products-column">
              <h3>Recommended For You</h3>
              <p className="column-subtitle">Expertly selected to target your unique concerns.</p>
              
              <div className="quiz-product-grid">
                {recommendedProducts.map((prod: any) => (
                  <div key={prod.id} className="quiz-product-card">
                    <img src={prod.image} alt={prod.name} />
                    <div className="quiz-product-info">
                      <h4>{prod.name}</h4>
                      <p className="quiz-reason">"{prod.reason}"</p>
                      <div className="quiz-product-meta">
                        <span className="price">{prod.price}</span>
                        <button onClick={() => addToCart(prod)} className="btn-secondary">Add to Cart</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="quiz-main-page">
      <div className="quiz-wrapper container">
        {loading ? (
          <div className="quiz-loading">
            <Loader2 className="spinner" size={48} />
            <h2>Analyzing your skin profile...</h2>
            <p>Our AI is consulting with top dermatological data to craft your perfect routine.</p>
          </div>
        ) : (
          <div className="quiz-card animate-fade-in">
            <div className="quiz-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${((currentStep + 1) / QUESTIONS.length) * 100}%` }}
                ></div>
              </div>
              <span className="progress-text">Step {currentStep + 1} of {QUESTIONS.length}</span>
            </div>

            <h2 className="quiz-question">{QUESTIONS[currentStep].question}</h2>

            <div className="quiz-options">
              {QUESTIONS[currentStep].options.map((option) => {
                const isSelected = answers[QUESTIONS[currentStep].id] === option;
                return (
                  <button
                    key={option}
                    onClick={() => handleSelect(option)}
                    className={`quiz-option-btn ${isSelected ? 'selected' : ''}`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            <div className="quiz-footer">
              <button 
                className="btn-primary quiz-next-btn"
                onClick={handleNext}
                disabled={!answers[QUESTIONS[currentStep].id]}
              >
                {currentStep === QUESTIONS.length - 1 ? 'Analyze My Skin' : 'Next Question'} 
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
