import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function QuoteCard({ lead, onRequote }) {
  const dateStr = lead.created_date
    ? format(new Date(lead.created_date), "d MMM yyyy", { locale: es })
    : '—';

  const designName = lead.quote_breakdown?.selectedDesignName || '—';
  const total = lead.estimated_investment_usd || 0;
  const sqm = lead.total_sqm || 0;

  return (
    <div style={{ background: '#111', border: '0.5px solid rgba(255,255,255,0.08)', padding: '22px 26px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.02em', color: '#f0ede8' }}>{designName}</div>
          <div style={{ fontSize: 10, color: 'rgba(240,237,232,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 4 }}>
            {dateStr}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#c29b5a' }}>${total.toLocaleString('en-US')} USD</div>
          {sqm > 0 && <div style={{ fontSize: 11, color: 'rgba(240,237,232,0.3)', marginTop: 2 }}>{sqm} m²</div>}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        {lead.style_chosen && (
          <div>
            <span style={{ fontSize: 10, color: 'rgba(240,237,232,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginRight: 8 }}>Estilo</span>
            <span style={{ fontSize: 12, color: '#f0ede8', textTransform: 'capitalize' }}>{lead.style_chosen}</span>
          </div>
        )}
        {lead.team_directors + lead.team_managers + lead.team_operatives > 0 && (
          <div>
            <span style={{ fontSize: 10, color: 'rgba(240,237,232,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginRight: 8 }}>Equipo</span>
            <span style={{ fontSize: 12, color: '#f0ede8' }}>
              {[lead.team_directors && `${lead.team_directors}D`, lead.team_managers && `${lead.team_managers}G`, lead.team_operatives && `${lead.team_operatives}O`].filter(Boolean).join(' · ')}
            </span>
          </div>
        )}
      </div>

      <button onClick={() => onRequote(lead)} style={{
        background: '#c29b5a', color: '#0a0a0a', border: 'none',
        padding: '10px 20px', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
        cursor: 'pointer', fontFamily: "'Helvetica Neue', Arial, sans-serif", transition: 'opacity 0.2s', alignSelf: 'flex-start',
      }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
      >
        COTIZAR DE NUEVO →
      </button>
    </div>
  );
}