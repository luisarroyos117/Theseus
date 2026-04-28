import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { LogOut } from 'lucide-react';
import ProjectCard from './ProjectCard';
import QuoteCard from './QuoteCard';

const TABS = [
  { id: 'projects', label: 'Mis Proyectos' },
  { id: 'quotes',   label: 'Mis Cotizaciones' },
  { id: 'new',      label: 'Nueva Cotización' },
];

export default function ClientDashboard({ user, onLogout, onStartQuote, onRequote }) {
  const [tab, setTab] = useState('projects');

  const { data: projects = [] } = useQuery({
    queryKey: ['clientProjects', user?.id],
    queryFn: () => base44.entities.ClientProject.filter({ user_id: user.id }),
    enabled: !!user?.id,
  });

  const { data: leads = [] } = useQuery({
    queryKey: ['clientLeads', user?.email],
    queryFn: () => base44.entities.Lead.filter({ email: user.email }),
    enabled: !!user?.email,
  });

  // Only role="user" clients can access client portal
  if (!user || user.role !== 'user') {
    window.location.href = '/';
    return null;
  }

  const initials = (user.full_name || user.email || 'U').split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#f0ede8', fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
      {/* Top bar */}
      <div style={{ borderBottom: '0.5px solid rgba(255,255,255,0.08)', padding: '0 40px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(10,10,10,0.98)', position: 'sticky', top: 0, zIndex: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: '0.18em', color: '#6b6b6b', textTransform: 'uppercase' }}>THESEUS</span>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.15)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>/ Portal</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#f0ede8' }}>{user.full_name || user.email}</div>
            {user.company && <div style={{ fontSize: 10, color: 'rgba(240,237,232,0.35)', marginTop: 2 }}>{user.company}</div>}
          </div>
          <div style={{ width: 36, height: 36, background: 'rgba(100,100,100,0.15)', border: '0.5px solid rgba(100,100,100,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#6b6b6b' }}>
            {initials}
          </div>
          <button onClick={onLogout} style={{ background: 'none', border: 'none', color: 'rgba(240,237,232,0.3)', cursor: 'pointer', padding: 6 }}
            title="Cerrar sesión">
            <LogOut size={16} />
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 32px 80px' }}>
        {/* Greeting */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 10, letterSpacing: '0.25em', color: '#6b6b6b', textTransform: 'uppercase', marginBottom: 8 }}>Portal de cliente</div>
          <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em', color: '#f0ede8', margin: 0 }}>
            Hola, {user.full_name?.split(' ')[0] || 'bienvenido'}.
          </h1>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 40, width: 'fit-content' }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => { setTab(t.id); if (t.id === 'new') onStartQuote(); }} style={{
              background: tab === t.id ? 'rgba(100,100,100,0.08)' : '#0a0a0a',
              borderBottom: tab === t.id ? '1.5px solid #6b6b6b' : '1.5px solid transparent',
              border: 'none', padding: '12px 24px', color: tab === t.id ? '#6b6b6b' : 'rgba(240,237,232,0.4)',
              fontSize: 11, fontWeight: tab === t.id ? 700 : 400, letterSpacing: '0.1em', textTransform: 'uppercase',
              cursor: 'pointer', fontFamily: "'Helvetica Neue', Arial, sans-serif", transition: 'all 0.2s', whiteSpace: 'nowrap',
            }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab: Projects */}
        {tab === 'projects' && (
          <div>
            {projects.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 0' }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>🏢</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#f0ede8', marginBottom: 8 }}>Aún no tienes proyectos.</div>
                <div style={{ fontSize: 13, color: 'rgba(240,237,232,0.4)', marginBottom: 28 }}>¡Cotiza tu primera oficina y empieza a hacer realidad tu espacio!</div>
                <button onClick={onStartQuote} style={{
                  background: '#6b6b6b', color: '#0a0a0a', border: 'none', padding: '13px 28px',
                  fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                  cursor: 'pointer', fontFamily: "'Helvetica Neue', Arial, sans-serif",
                }}>
                  COTIZAR AHORA →
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 1, background: 'rgba(255,255,255,0.06)' }}>
                {projects.map(p => (
                  <ProjectCard key={p.id} project={p} onView={() => {}} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab: Quotes */}
        {tab === 'quotes' && (
          <div>
            {leads.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 0' }}>
                <div style={{ fontSize: 13, color: 'rgba(240,237,232,0.4)', marginBottom: 24 }}>No hay cotizaciones guardadas todavía.</div>
                <button onClick={onStartQuote} style={{
                  background: '#6b6b6b', color: '#0a0a0a', border: 'none', padding: '13px 28px',
                  fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                  cursor: 'pointer', fontFamily: "'Helvetica Neue', Arial, sans-serif",
                }}>
                  CREAR COTIZACIÓN →
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 1, background: 'rgba(255,255,255,0.06)' }}>
                {leads.map(l => (
                  <QuoteCard key={l.id} lead={l} onRequote={onRequote} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}