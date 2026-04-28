import React from 'react';
import { useLanguage } from '@/lib/i18n';
import { Link } from 'react-router-dom';

export default function Header({ onLogoClick, onStartQuote, user, onMyAccount, onLogout }) {
  const { lang, toggleLang } = useLanguage();

  const initials = user
    ? (user.full_name || user.email || 'U').split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
    : null;

  const handleLogoClick = (e) => {
    if (onLogoClick) { e.preventDefault(); onLogoClick(); }
  };

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: 'rgba(248,247,244,0.95)', backdropFilter: 'blur(12px)',
      borderBottom: '0.5px solid rgba(0,0,0,0.08)',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" onClick={handleLogoClick} style={{ textDecoration: 'none' }}>
          <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: '0.18em', color: '#0a0a0a', textTransform: 'uppercase', fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
            THESEUS
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <nav style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
            {[
              { label: lang === 'es' ? 'PROYECTOS' : 'PROJECTS', href: '#lookbook' },
              { label: lang === 'es' ? 'PROCESO' : 'PROCESS', href: '#process' },
              { label: lang === 'es' ? 'FINANCIAMIENTO' : 'FINANCING', href: '#financing' },
            ].map(item => (
              <a key={item.label} href={item.href} style={{ fontSize: 11, letterSpacing: '0.12em', color: 'rgba(10,10,10,0.45)', textDecoration: 'none', textTransform: 'uppercase', fontFamily: "'Helvetica Neue', Arial, sans-serif", transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#0a0a0a'}
                onMouseLeave={e => e.target.style.color = 'rgba(10,10,10,0.45)'}
              >{item.label}</a>
            ))}
          </nav>

          <button onClick={toggleLang} style={{
            fontSize: 11, letterSpacing: '0.12em', color: '#6b6b6b', textTransform: 'uppercase',
            border: '0.5px solid rgba(100,100,100,0.35)', padding: '5px 14px', background: 'transparent',
            cursor: 'pointer', fontFamily: "'Helvetica Neue', Arial, sans-serif", fontWeight: 600,
          }}>
            {lang === 'es' ? 'EN' : 'ES'}
          </button>

          {/* My Account / Avatar */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button onClick={onMyAccount} style={{
                width: 34, height: 34, background: 'rgba(100,100,100,0.15)', border: '0.5px solid rgba(100,100,100,0.4)',
                color: '#6b6b6b', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }} title="Mi cuenta">
                {initials}
              </button>
            </div>
          ) : (
            <button onClick={onMyAccount} style={{
              fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', color: 'rgba(10,10,10,0.6)',
              background: 'transparent', padding: '8px 18px', border: '0.5px solid rgba(0,0,0,0.15)', cursor: 'pointer',
              textTransform: 'uppercase', fontFamily: "'Helvetica Neue', Arial, sans-serif", transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(10,10,10,0.4)'; e.currentTarget.style.color = '#0a0a0a'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.15)'; e.currentTarget.style.color = 'rgba(10,10,10,0.6)'; }}
            >
              {lang === 'es' ? 'MI CUENTA' : 'MY ACCOUNT'}
            </button>
          )}

          {onStartQuote && (
            <button onClick={onStartQuote} style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: '#0a0a0a',
              background: '#6b6b6b', padding: '10px 22px', border: 'none', cursor: 'pointer',
              textTransform: 'uppercase', fontFamily: "'Helvetica Neue', Arial, sans-serif",
              transition: 'opacity 0.2s',
            }}
              onMouseEnter={e => e.target.style.opacity = '0.85'}
              onMouseLeave={e => e.target.style.opacity = '1'}
            >
              {lang === 'es' ? 'COTIZAR' : 'GET QUOTE'}
            </button>
          )}

          {user && user.role === 'admin' && (
            <Link to="/admin" style={{ fontSize: 10, color: 'rgba(10,10,10,0.5)', letterSpacing: '0.1em', textDecoration: 'none', textTransform: 'uppercase' }}>
              Admin
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}