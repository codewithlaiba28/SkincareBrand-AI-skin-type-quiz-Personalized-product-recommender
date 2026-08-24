'use client';
import { useCart } from '@/context/CartContext';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import './CartSidebar.css';

export default function CartSidebar() {
  const { isCartOpen, setIsCartOpen, items, removeFromCart, cartTotal, cartCount } = useCart();

  return (
    <>
      <div 
        className={`cart-overlay ${isCartOpen ? 'open' : ''}`} 
        onClick={() => setIsCartOpen(false)}
      />
      
      <div className={`cart-sidebar ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2>Your Cart ({cartCount})</h2>
          <button onClick={() => setIsCartOpen(false)} className="close-cart">
            <X size={24} />
          </button>
        </div>

        <div className="cart-items">
          {items.length === 0 ? (
            <div className="empty-cart">
              <ShoppingBag size={48} />
              <p>Your cart is empty.</p>
              <button onClick={() => setIsCartOpen(false)} className="btn-primary">
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div className="item-details">
                  <h4>{item.name}</h4>
                  <p>{item.price} x {item.quantity}</p>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="remove-item">
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total:</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <Link href="/cart" onClick={() => setIsCartOpen(false)} className="btn-primary w-full" style={{ display: 'block', textAlign: 'center', marginBottom: '1rem' }}>
              View Full Cart
            </Link>
            <button className="btn-secondary w-full" style={{ color: 'var(--color-text)', borderColor: 'var(--color-text)' }}>Checkout</button>
          </div>
        )}
      </div>
    </>
  );
}
