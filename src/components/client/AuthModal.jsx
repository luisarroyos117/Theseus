import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { X, Loader2 } from 'lucide-react';

const S = {
  overlay: { position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(6px)' },
  modal: { background: '#111', border: '0.5px solid rgba(255,255,255,0.12)', width: '100%', maxWidth: 420, position: 'relative', padding: '40px 36px 36px' },
  label: { fontSize: 10, letterSpacing: '0.18em', color: 'rgba(240,237,232,0.4)', textTransform: 'uppercase', marginBottom: 8, display: 'block', fontFamily: "'Helvetica Neue', Arial, sans-serif" },
  input: { width: '100%', background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.15)', padding: '11px 14px', color: '#f0ede8', fontSize: 14, fontFamily: "'Helvetica Neue', Arial, sans-serif", outline: 'none', boxSizing: 'border-box' },
  btn: { width: '100%', background: '#6b6b6b', color: '#ffffff', border: 'none', padding: '14px 24px', fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: "'Helvetica Neue', Arial, sans-serif", transition: 'opacity 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 },
};

export default function AuthModal({ onClose, onSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({ full_name: '', company: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'register') {
        await base44.auth.register({
          full_name: form.full_name,
          email: form.email,
          password: form.password,
          role: 'user',
        });
        // after register, update company via updateMe
        try { await base44.auth.updateMe({ company: form.company }); } catch {}
      } else {
        await base44.auth.login({ email: form.email, password: form.password });
      }
      const user = await base44.auth.me();
      onSuccess(user);
    } catch (err) {
      setError(err?.message || (mode === 'login' ? 'Credenciales incorrectas.' : 'Error al crear la cuenta.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={S.modal} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: 'rgba(240,237,232,0.4)', cursor: 'pointer' }}>
          <X size={18} />
        </button>

        {/* Toggle */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 32 }}>
          {[['login', 'Iniciar sesión'], ['register', 'Crear cuenta']].map(([key, label]) => (
            <button key={key} onClick={() => { setMode(key); setError(''); }} style={{
              background: mode === key ? 'rgba(100,100,100,0.08)' : '#0a0a0a',
              borderBottom: mode === key ? '1.5px solid #6b6b6b' : '1.5px solid transparent',
              border: 'none', padding: '13px 0', color: mode === key ? '#6b6b6b' : 'rgba(240,237,232,0.4)',
              fontSize: 11, fontWeight: mode === key ? 700 : 400, letterSpacing: '0.08em',
              cursor: 'pointer', fontFamily: "'Helvetica Neue', Arial, sans-serif", textTransform: 'uppercase',
            }}>{label}</button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {mode === 'register' && (
            <>
              <div>
                <label style={S.label}>Nombre completo <span style={{ color: '#6b6b6b' }}>*</span></label>
                <input style={{ ...S.input, colorScheme: 'light' }} required value={form.full_name} onChange={e => set('full_name', e.target.value)} placeholder="Juan Pérez" />
              </div>
              <div>
                <label style={S.label}>Empresa</label>
                <input style={{ ...S.input, colorScheme: 'light' }} value={form.company} onChange={e => set('company', e.target.value)} placeholder="Mi Empresa S.A." />
              </div>
            </>
          )}
          <div>
            <label style={S.label}>Correo electrónico <span style={{ color: '#6b6b6b' }}>*</span></label>
            <input style={{ ...S.input, colorScheme: 'light' }} type="email" required value={form.email} onChange={e => set('email', e.target.value)} placeholder="juan@empresa.com" />
          </div>
          <div>
            <label style={S.label}>Contraseña <span style={{ color: '#6b6b6b' }}>*</span></label>
            <input style={{ ...S.input, colorScheme: 'light' }} type="password" required minLength={6} value={form.password} onChange={e => set('password', e.target.value)} placeholder="••••••••" />
          </div>

          {error && (
            <div style={{ fontSize: 12, color: '#ef4444', padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '0.5px solid rgba(239,68,68,0.25)' }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={{ ...S.btn, opacity: loading ? 0.6 : 1, marginTop: 4 }}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : (mode === 'login' ? 'ENTRAR →' : 'CREAR CUENTA →')}
          </button>
        </form>
      </div>
    </div>
  );
}