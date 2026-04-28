import React from 'react';

const STATUS_CONFIG = {
  cotizacion: { label: 'Cotización',  bg: 'rgba(255,255,255,0.08)', color: 'rgba(240,237,232,0.5)',  border: 'rgba(255,255,255,0.12)' },
  en_diseno:  { label: 'En Diseño',   bg: 'rgba(194,155,90,0.12)',  color: '#c29b5a',                border: 'rgba(194,155,90,0.35)' },
  en_obra:    { label: 'En Obra',     bg: 'rgba(59,130,246,0.1)',   color: '#60a5fa',                border: 'rgba(59,130,246,0.3)' },
  entregado:  { label: 'Entregado',   bg: 'rgba(34,197,94,0.1)',    color: '#4ade80',                border: 'rgba(34,197,94,0.3)' },
};

export default function ProjectCard({ project, onView }) {
  const status = STATUS_CONFIG[project.status] || STATUS_CONFIG.cotizacion;
  const pct = Math.min(100, Math.max(0, project.progress_pct || 0));

  return (
    <div style={{ background: '#111', border: '0.5px solid rgba(255,255,255,0.08)', padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em', color: '#f0ede8', lineHeight: 1.2 }}>
            {project.design_name || 'Proyecto'}
          </div>
          {project.style && (
            <div style={{ fontSize: 10, color: 'rgba(240,237,232,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 4 }}>
              {project.style}
            </div>
          )}
        </div>
        <span style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '5px 10px', background: status.bg, color: status.color, border: `0.5px solid ${status.border}`, flexShrink: 0 }}>
          {status.label}
        </span>
      </div>

      {/* Metrics */}
      <div style={{ display: 'flex', gap: 24 }}>
        <div>
          <div style={{ fontSize: 10, color: 'rgba(240,237,232,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Inversión</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#c29b5a' }}>${(project.total_investment_usd || 0).toLocaleString('en-US')} USD</div>
        </div>
        {project.total_m2 > 0 && (
          <div>
            <div style={{ fontSize: 10, color: 'rgba(240,237,232,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Superficie</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#f0ede8' }}>{project.total_m2} m²</div>
          </div>
        )}
      </div>

      {/* Progress */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 10, color: 'rgba(240,237,232,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Avance</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#c29b5a' }}>{pct}%</span>
        </div>
        <div style={{ height: 3, background: 'rgba(255,255,255,0.07)', width: '100%' }}>
          <div style={{ height: 3, background: '#c29b5a', width: `${pct}%`, transition: 'width 0.6s ease' }} />
        </div>
      </div>

      {/* Notes */}
      {project.status_notes && (
        <div style={{ fontSize: 12, color: 'rgba(240,237,232,0.45)', lineHeight: 1.6, padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderLeft: '2px solid rgba(194,155,90,0.4)' }}>
          {project.status_notes}
        </div>
      )}

      <button onClick={() => onView(project)} style={{
        background: 'transparent', border: '0.5px solid rgba(255,255,255,0.15)', color: 'rgba(240,237,232,0.6)',
        padding: '10px 20px', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
        cursor: 'pointer', fontFamily: "'Helvetica Neue', Arial, sans-serif", transition: 'all 0.2s', alignSelf: 'flex-start',
      }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#c29b5a'; e.currentTarget.style.color = '#c29b5a'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = 'rgba(240,237,232,0.6)'; }}
      >
        VER DETALLE →
      </button>
    </div>
  );
}