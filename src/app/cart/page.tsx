'use client';
import { useCart } from '@/context/CartContext';
import { Trash2, ArrowLeft, ShieldCheck, Truck, Plus, Minus } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import './CartPage.css';
import AnimatedSection from '@/components/AnimatedSection';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();

  const recommendedProducts = [
    { id: 9, name: 'Hydrating Eye Cream', price: '$40.00', image: '/images/product-5.jpg' },
    { id: 10, name: 'Vitamin C Serum', price: '$55.00', image: '/images/product-2.jpg' },
  ];

  return (
    <main className="cart-page-main">
      <div className="cart-container container">
        <div className="cart-header-full">
          <Link href="/" className="back-link">
            <ArrowLeft size={16} /> Continue Shopping
          </Link>
          <h1>Your Shopping Cart</h1>
          <p className="cart-count-subtitle">
            {cartCount} {cartCount === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        {items.length === 0 ? (
          <div className="empty-cart-full">
            <h2>Your cart is beautifully empty.</h2>
            <p>Discover our range of premium skincare products and find your next favorite.</p>
            <Link href="/" className="btn-primary">Shop Bestsellers</Link>
          </div>
        ) : (
          <div className="cart-content-wrapper">
            <div className="cart-items-section">
              <div className="cart-items-list">
                {items.map((item) => (
                  <div key={item.id} className="cart-item-row">
                    <div className="item-image-col">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="item-details-col">
                      <h3>{item.name}</h3>
                      <p className="item-desc">Premium Formulation</p>
                      <button onClick={() => removeFromCart(item.id)} className="remove-btn">
                        <Trash2 size={16} /> Remove
                      </button>
                    </div>
                    <div className="item-quantity-col">
                      <div className="quantity-controls">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                          <Minus size={14} />
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="item-price-col">
                      <p className="price">${(parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Related/Recommended Products */}
              <div className="cart-upsell-section">
                <h3>You might also love</h3>
                <div className="upsell-grid">
                  {recommendedProducts.map((prod) => (
                    <div key={prod.id} className="upsell-card">
                      <img src={prod.image} alt={prod.name} />
                      <div className="upsell-info">
                        <h4>{prod.name}</h4>
                        <span className="price">{prod.price}</span>
                      </div>
                      <Link href="/" className="btn-secondary upsell-btn">View Product</Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="cart-summary-section">
              <div className="summary-card">
                <h3>Order Summary</h3>
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="summary-row">
                  <span>Tax</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                
                <button className="btn-primary checkout-btn">
                  Proceed to Checkout
                </button>
                
                <div className="trust-badges">
                  <div className="badge">
                    <ShieldCheck size={18} />
                    <span>Secure Checkout</span>
                  </div>
                  <div className="badge">
                    <Truck size={18} />
                    <span>Free Global Shipping</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
