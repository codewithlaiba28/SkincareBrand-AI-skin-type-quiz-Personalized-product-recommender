'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import './SkinQuiz.css';

const questions = [
  {
    id: 'skinType',
    question: "How would you describe your skin type?",
    options: ["Dry", "Oily", "Combination", "Normal", "Sensitive"]
  },
  {
    id: 'concerns',
    question: "What are your primary skin concerns? (Select all that apply)",
    options: ["Acne & Blemishes", "Anti-aging", "Dark Spots/Hyperpigmentation", "Redness", "Dullness", "Large Pores"],
    multi: true
  },
  {
    id: 'routine',
    question: "What does your current routine look like?",
    options: ["Minimal (Cleanse & Moisturize)", "Moderate (3-4 steps)", "Extensive (5+ steps)"]
  }
];

export default function SkinQuiz() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSelect = (questionId: string, option: string, isMulti?: boolean) => {
    if (isMulti) {
      setAnswers(prev => {
        const current = prev[questionId] || [];
        if (current.includes(option)) {
          return { ...prev, [questionId]: current.filter((item: string) => item !== option) };
        } else {
          return { ...prev, [questionId]: [...current, option] };
        }
      });
    } else {
      setAnswers(prev => ({ ...prev, [questionId]: option }));
    }
  };

  const nextStep = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(curr => curr + 1);
    } else {
      submitQuiz();
    }
  };

  const submitQuiz = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers)
      });
      const data = await res.json();
      setResult(data);
      if (data.sessionId) {
        localStorage.setItem('beautyskin_session', data.sessionId);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (result) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="quiz-result-container">
        <h3>Your Personalized Routine</h3>
        <p><strong>Skin Type:</strong> {result.skinType}</p>
        <p><strong>Focus:</strong> {result.concerns?.join(", ")}</p>
        
        <div className="routine-grid mt-4">
          <div className="routine-card">
            <h4>AM Routine</h4>
            <ul>
              {result.recommendedRoutine?.AM?.map((step: string, i: number) => (
                <li key={i}><CheckCircle2 size={16} /> {step}</li>
              ))}
            </ul>
          </div>
          <div className="routine-card">
            <h4>PM Routine</h4>
            <ul>
              {result.recommendedRoutine?.PM?.map((step: string, i: number) => (
                <li key={i}><CheckCircle2 size={16} /> {step}</li>
              ))}
            </ul>
          </div>
        </div>

        <h4 className="mt-4">Recommended Products</h4>
        <div className="recommended-products grid grid-cols-2 mt-4">
          {result.recommendedProducts?.map((prod: any, i: number) => (
            <div key={i} className="rec-product-card">
              <h5>{prod.name}</h5>
              <p>{prod.reason}</p>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  const q = questions[currentStep];

  return (
    <div className="quiz-container">
      <div className="quiz-progress-bar">
        <div 
          className="quiz-progress" 
          style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
        ></div>
      </div>
      
      <AnimatePresence mode="wait">
        {isSubmitting ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="quiz-loading"
          >
            <Loader2 className="spinner" size={48} />
            <p>Analyzing your skin profile with AI...</p>
          </motion.div>
        ) : (
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="quiz-question-card"
          >
            <span className="step-count">Step {currentStep + 1} of {questions.length}</span>
            <h3>{q.question}</h3>
            
            <div className="quiz-options">
              {q.options.map(opt => {
                const isSelected = q.multi 
                  ? (answers[q.id] || []).includes(opt)
                  : answers[q.id] === opt;
                  
                return (
                  <button
                    key={opt}
                    onClick={() => handleSelect(q.id, opt, q.multi)}
                    className={`quiz-option ${isSelected ? 'selected' : ''}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            <button 
              className="btn-primary mt-4" 
              onClick={nextStep}
              disabled={q.multi ? !(answers[q.id]?.length > 0) : !answers[q.id]}
            >
              {currentStep === questions.length - 1 ? 'Analyze My Skin' : 'Next Question'}
              <ArrowRight size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
