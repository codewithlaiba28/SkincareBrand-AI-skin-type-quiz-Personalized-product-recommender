'use client';
import Link from 'next/link';
import { ShoppingBag, LogOut } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { cartCount } = useCart();
  const { user, setIsAuthModalOpen, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="container">
        <Link href="/" className="nav-logo">BeautySkin.</Link>
        <ul className="nav-links">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/#about">About Us</Link></li>
          <li><Link href="/#services">Services</Link></li>
          <li><Link href="/#contact">Contact Us</Link></li>
        </ul>
        <div className="nav-right">
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--color-text-light)' }}>
                Hi, {user.name.split(' ')[0]}
              </span>
              <button 
                onClick={logout} 
                title="Log out"
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}
              >
                <LogOut size={18} className="nav-icon" />
              </button>
            </div>
          ) : (
            <span 
              onClick={() => setIsAuthModalOpen(true)} 
              style={{ cursor: 'pointer' }}
            >
              Login
            </span>
          )}
          <Link 
            href="/cart"
            className="cart-trigger" 
            style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--color-text)' }}
          >
            <ShoppingBag className="nav-icon" />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
        </div>
      </div>
    </nav>
  );
}
