'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, User, Bot, Loader2, Sparkles, Minimize2, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import './ChatWidget.css';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const { user, setIsAuthModalOpen } = useAuth();
  
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { role: 'assistant', content: "Hi! I'm your BeautySkin AI assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const sessionId = localStorage.getItem('beautyskin_session') || undefined;
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...messages, { role: 'user', content: userMsg }],
          sessionId
        })
      });
      const data = await res.json();
      
      if (data.reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I am having trouble connecting right now.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <button 
            className="chat-toggle-btn"
            onClick={() => {
              if (!user) {
                setIsAuthModalOpen(true);
              } else {
                setIsOpen(true);
              }
            }}
          >
            <MessageCircle size={24} />
          </button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="chat-panel"
          >
            <div className="chat-header">
              <div className="chat-header-info">
                <div className="avatar bot-avatar"><Bot size={20} /></div>
                <div>
                  <h4>BeautySkin Assistant</h4>
                  <span className="status">Online</span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="close-btn">
                <X size={20} />
              </button>
            </div>

            <div className="chat-messages">
              {messages.map((m, i) => (
                <div key={i} className={`chat-bubble-wrapper ${m.role}`}>
                  {m.role === 'assistant' && <div className="avatar-small bot-avatar"><Bot size={14} /></div>}
                  <div className={`chat-bubble ${m.role}`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="chat-bubble-wrapper assistant">
                  <div className="avatar-small bot-avatar"><Bot size={14} /></div>
                  <div className="chat-bubble assistant typing">
                    <Loader2 className="spinner" size={16} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form className="chat-input-area" onSubmit={sendMessage}>
              <input 
                type="text" 
                placeholder="Ask about skincare..." 
                value={input}
                onChange={e => setInput(e.target.value)}
              />
              <button type="submit" disabled={!input.trim() || isLoading}>
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
