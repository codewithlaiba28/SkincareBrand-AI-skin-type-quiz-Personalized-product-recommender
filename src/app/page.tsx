'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, ArrowRight, Star, Mail } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

import { products } from '@/data/products';

export default function Home() {
  const { setIsCartOpen, addToCart, cartCount } = useCart();
  const { user, setIsAuthModalOpen } = useAuth();

  return (
    <>
      <main>
        {/* HERO SECTION */}
        <section className="hero-section">
          <div className="container hero-container">
            <div className="hero-content animate-fade-in">
              <div className="hero-badge">
                <Sparkles size={16} />
                <span>Our Philosophy</span>
              </div>
              <h1>Reveal Your<br />Beauty <i>with</i><br />Skincare</h1>
              <p className="hero-subtitle">
                It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
              </p>
              <Link href="/quiz" className="btn-primary">
                Take the Quiz <ArrowRight size={18} />
              </Link>
            </div>
            <div className="hero-image-wrapper">
              <div className="hero-image-bg"></div>
              <img 
                src="/images/hero.jpg" 
                alt="Model with glowing skin" 
                className="hero-image"
              />
            </div>
          </div>
        </section>

        {/* PHILOSOPHY STRIP */}
        <AnimatedSection className="philosophy-section" id="about">
          <div className="container text-center">
            <h2 className="philosophy-title">Skincare is <i>Self-Care</i></h2>
            <p className="philosophy-text">
              At BeautySkin, we believe that true beauty begins with healthy skin. Our formulations blend nature's finest ingredients with clinical science to deliver transformative results. No harsh chemicals, no false promises—just radiant, nourished skin.
            </p>
          </div>
        </AnimatedSection>

        <div className="diamond-divider">
          <div className="diamond"></div>
        </div>

        {/* QUIZ SECTION */}
        <AnimatedSection id="services" className="quiz-section">
          <div className="container text-center">
            <h2>Find Your <i>Perfect</i> Routine</h2>
            <p className="section-subtitle">Take our advanced AI-powered skin assessment to get personalized recommendations tailored to your unique skin type and concerns.</p>
            {user ? (
              <Link href="/quiz" className="btn-primary" style={{ display: 'inline-block', marginTop: '2rem', padding: '1rem 3rem', fontSize: '1.2rem' }}>
                Start Assessment <Sparkles size={18} style={{ display: 'inline', marginLeft: '8px' }} />
              </Link>
            ) : (
              <button onClick={() => setIsAuthModalOpen(true)} className="btn-primary" style={{ display: 'inline-block', marginTop: '2rem', padding: '1rem 3rem', fontSize: '1.2rem' }}>
                Login to Start Assessment <Sparkles size={18} style={{ display: 'inline', marginLeft: '8px' }} />
              </button>
            )}
          </div>
        </AnimatedSection>

        <div className="diamond-divider">
          <div className="diamond"></div>
        </div>

        {/* CATEGORIES SECTION */}
        <AnimatedSection className="categories-section">
          <div className="container">
            <div className="section-header">
              <h2>Shop by <i>Category</i></h2>
            </div>
            <div className="grid category-grid">
              <div className="category-card">
                <img src="/images/category-face.jpg" alt="Face Care" />
                <div className="category-overlay">
                  <h3>Face Care</h3>
                  <button className="btn-secondary">Shop Now</button>
                </div>
              </div>
              <div className="category-card">
                <img src="/images/category-body.jpg" alt="Body Care" />
                <div className="category-overlay">
                  <h3>Body Care</h3>
                  <button className="btn-secondary">Shop Now</button>
                </div>
              </div>
              <div className="category-card">
                <img src="/images/category-lip.jpg" alt="Lip Care" />
                <div className="category-overlay">
                  <h3>Lip Care</h3>
                  <button className="btn-secondary">Shop Now</button>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* BESTSELLERS */}
        <AnimatedSection>
          <div className="container">
            <div className="section-header">
              <h2>Product <i>Bestseller</i></h2>
            </div>
            <div className="grid grid-cols-4 product-grid">
              {products.map((product) => (
                <div key={product.id} className="product-card">
                  <div className="product-image-container">
                    <img src={product.image} alt={product.name} />
                  </div>
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <div className="product-meta">
                      <span className="price">{product.price}</span>
                      <button className="add-to-cart" onClick={() => addToCart(product)}>Add to Cart</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* TESTIMONIALS */}
        <AnimatedSection className="testimonials-section">
          <div className="container">
            <h2 className="text-center">What Our <i>Customers</i> Say</h2>
            <div className="grid grid-cols-2 mt-4">
              <div className="testimonial-card">
                <div className="stars">
                  <Star fill="currentColor" size={16} />
                  <Star fill="currentColor" size={16} />
                  <Star fill="currentColor" size={16} />
                  <Star fill="currentColor" size={16} />
                  <Star fill="currentColor" size={16} />
                </div>
                <p>"This AI quiz completely changed my skin! The recommended products are perfect for my sensitive skin."</p>
                <div className="customer-info">
                  <img src="/images/testimonial-1.jpg" alt="Customer" />
                  <span>Sarah J.</span>
                </div>
              </div>
              <div className="testimonial-card">
                <div className="stars">
                  <Star fill="currentColor" size={16} />
                  <Star fill="currentColor" size={16} />
                  <Star fill="currentColor" size={16} />
                  <Star fill="currentColor" size={16} />
                  <Star fill="currentColor" size={16} />
                </div>
                <p>"I love how elegant the brand feels. The products are high quality and the packaging is gorgeous."</p>
                <div className="customer-info">
                  <img src="/images/testimonial-2.jpg" alt="Customer" />
                  <span>Emily R.</span>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* NEWSLETTER CTA */}
        <AnimatedSection className="newsletter-section">
          <div className="container newsletter-container">
            <div className="newsletter-content">
              <h2>Join the <i>BeautySkin</i> Club</h2>
              <p>Subscribe to receive 15% off your first order, plus exclusive skincare tips.</p>
              <form className="newsletter-form">
                <div className="input-group">
                  <Mail className="input-icon" size={20} />
                  <input type="email" placeholder="Your email address" required />
                </div>
                <button type="submit" className="btn-primary">Subscribe</button>
              </form>
            </div>
          </div>
        </AnimatedSection>
      </main>

      <footer className="footer">
        <div className="container text-center">
          <h2>BeautySkin.</h2>
          <p>&copy; 2026 BeautySkin. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
