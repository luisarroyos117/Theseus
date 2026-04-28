import React from 'react';
import { useLanguage } from '@/lib/i18n';
import { motion } from 'framer-motion';

export default function QuoteResult({ breakdown, selectedDesign, onNext }) {
  const { lang, t } = useLanguage();
  if (!breakdown) return (
    <div style={{ textAlign: 'center', padding: '48px 0', color: 'rgba(10,10,10,0.35)', fontSize: 14 }}>
      {t('quote.no_pricing')}
    </div>
  );

  const downPayment = Math.round(breakdown.total * 0.30);
  const monthly = Math.round((breakdown.total * 0.70) / 12);

  const activeItems = breakdown.items.filter(item =>
    item.key === 'base' || item.amount > 0
  );

  return (
    <div>
      {/* Total hero */}
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 40, paddingBottom: 32, borderBottom: '0.5px solid rgba(0,0,0,0.08)' }}>
        <div style={{ fontSize: 10, letterSpacing: '0.25em', color: '#6b6b6b', textTransform: 'uppercase', marginBottom: 16 }}>
           {t('quote.investment_turnkey')}
         </div>
        <div style={{ fontSize: 'clamp(36px, 8vw, 64px)', fontWeight: 800, letterSpacing: '-0.04em', color: '#0a0a0a', lineHeight: 1, marginBottom: 8 }}>
          ${breakdown.total?.toLocaleString('en-US')} <span style={{ fontSize: '0.4em', color: 'rgba(10,10,10,0.4)', fontWeight: 400 }}>USD</span>
        </div>
        {selectedDesign && (
          <div style={{ fontSize: 13, color: 'rgba(10,10,10,0.4)' }}>
            {lang === 'es' ? (selectedDesign.name_es || selectedDesign.name_en) : (selectedDesign.name_en || selectedDesign.name_es)}
          </div>
        )}
      </motion.div>

      {/* Itemized breakdown */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ fontSize: 10, letterSpacing: '0.2em', color: 'rgba(10,10,10,0.35)', textTransform: 'uppercase', marginBottom: 20 }}>
          {t('quote.detailed_breakdown')}
        </div>
        <div>
          {activeItems.map((item, i) => (
            <motion.div key={item.key}
              initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 0', borderBottom: '0.5px solid rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: 13, color: item.key === 'base' ? '#0a0a0a' : 'rgba(10,10,10,0.65)' }}>
                {lang === 'es' ? item.label_es : item.label_en}
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: item.key === 'base' ? '#0a0a0a' : '#6b6b6b' }}>
                ${item.amount?.toLocaleString('en-US')}
              </div>
            </motion.div>
          ))}
          {/* Total row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderTop: '0.5px solid rgba(0,0,0,0.1)', marginTop: 4 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#0a0a0a', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {lang === 'es' ? 'TOTAL' : 'TOTAL'}
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#6b6b6b' }}>
              ${breakdown.total?.toLocaleString('en-US')} USD
            </div>
          </div>
        </div>
      </div>

      {/* Financing */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        style={{ background: 'rgba(100,100,100,0.05)', border: '0.5px solid rgba(100,100,100,0.25)', padding: '24px 28px', marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 10, color: '#6b6b6b', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>
              {t('finance.option')}
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#0a0a0a' }}>
              {t('finance.down_months')}
            </div>
            </div>
            <span style={{ fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '4px 10px', background: '#6b6b6b', color: '#0a0a0a', fontWeight: 700 }}>{lang === 'es' ? '0% INTERÉS' : '0% INTEREST'}</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'rgba(0,0,0,0.06)' }}>
          <div style={{ background: '#f8f7f4', padding: '16px 20px', textAlign: 'center' }}>
             <div style={{ fontSize: 10, color: 'rgba(10,10,10,0.35)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>{t('finance.down_label')}</div>
             <div style={{ fontSize: 24, fontWeight: 800, color: '#6b6b6b' }}>${downPayment.toLocaleString('en-US')}</div>
             <div style={{ fontSize: 11, color: 'rgba(10,10,10,0.55)', marginTop: 2 }}>USD</div>
           </div>
           <div style={{ background: '#f8f7f4', padding: '16px 20px', textAlign: 'center' }}>
             <div style={{ fontSize: 10, color: 'rgba(10,10,10,0.35)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>{t('finance.monthly_label')}</div>
             <div style={{ fontSize: 24, fontWeight: 800, color: '#6b6b6b' }}>${monthly.toLocaleString('en-US')}</div>
             <div style={{ fontSize: 11, color: 'rgba(10,10,10,0.55)', marginTop: 2 }}>USD × 12</div>
           </div>
        </div>
        <div style={{ fontSize: 11, color: 'rgba(10,10,10,0.5)', marginTop: 12, textAlign: 'center' }}>
          {t('finance.subject_credit')}
        </div>
      </motion.div>

      {/* CTA */}
      {onNext && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <button onClick={onNext} style={{
            width: '100%', background: '#6b6b6b', color: '#ffffff', border: 'none',
            padding: '18px 24px', fontSize: 13, fontWeight: 700, letterSpacing: '0.12em',
            textTransform: 'uppercase', cursor: 'pointer', fontFamily: "'Helvetica Neue', Arial, sans-serif",
            transition: 'opacity 0.2s',
          }}
            onMouseEnter={e => e.target.style.opacity = '0.85'}
            onMouseLeave={e => e.target.style.opacity = '1'}
          >
            {t('quote.formal_request')}
          </button>
          <div style={{ fontSize: 11, color: 'rgba(10,10,10,0.5)', textAlign: 'center', marginTop: 10 }}>
           {t('quote.no_commitment')}
          </div>
        </motion.div>
      )}
    </div>
  );
}