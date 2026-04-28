import React, { useState } from 'react';
import { base44Public } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/lib/i18n';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { getDesignStyles, designMatchesStyleFilter, getStyleLabel } from '@/lib/styleHelpers';

const BUDGET_FILTERS = [
  { key: 'all', en: 'All', es: 'Todos' },
  { key: 'essential', en: 'Esencial', es: 'Esencial' },
  { key: 'plus', en: 'Plus', es: 'Plus' },
  { key: 'premium', en: 'Premium', es: 'Premium' },
];

function inBudget(pricePerSqm, key) {
  if (key === 'all') return true;
  if (key === 'essential') return pricePerSqm >= 200 && pricePerSqm < 300;
  if (key === 'plus') return pricePerSqm >= 300 && pricePerSqm < 500;
  if (key === 'premium') return pricePerSqm >= 500;
  return true;
}

function getTierLabel(pricePerSqm) {
  if (!pricePerSqm) return null;
  if (pricePerSqm < 300) return 'Esencial';
  if (pricePerSqm < 500) return 'Plus';
  return 'Premium';
}

function isPremium(pricePerSqm) { return pricePerSqm >= 500; }

function DesignModal({ design, lang, onClose, onModalQuoteClick }) {
  const [photoIdx, setPhotoIdx] = useState(0);
  const photos = (design.photos || []).filter(Boolean);
  const name = lang === 'es' ? (design.name_es || design.name_en) : (design.name_en || design.name_es);
  const desc = lang === 'es' ? design.description_es : design.description_en;
  const elements = lang === 'es' ? design.included_elements_es : design.included_elements_en;
  const styles = getDesignStyles(design);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'rgba(0,0,0,0.15)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }}
        style={{ background: '#f8f7f4', border: '0.5px solid rgba(0,0,0,0.12)', maxWidth: 640, width: '100%', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Photo carousel */}
        <div style={{ position: 'relative', width: '100%', height: 280, background: '#e8e6e0', overflow: 'hidden' }}>
           {photos[photoIdx] ? (
             <img src={photos[photoIdx]} alt={name} loading="lazy" crossOrigin="anonymous" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
               onError={(e) => { e.target.style.display='none'; e.target.parentElement.style.background='#e8e6e0'; }} />
           ) : (
             <div style={{ width: '100%', height: 280, background: '#e8e6e0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <span style={{ fontSize: 11, color: 'rgba(10,10,10,0.15)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>THESEUS</span>
             </div>
           )}
          {photos.length > 1 && (
            <>
              <button onClick={() => setPhotoIdx(i => (i - 1 + photos.length) % photos.length)}
                style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', background: 'rgba(248,247,244,0.7)', border: 'none', color: '#0a0a0a', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <ChevronLeft size={18} />
              </button>
              <button onClick={() => setPhotoIdx(i => (i + 1) % photos.length)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'rgba(248,247,244,0.7)', border: 'none', color: '#0a0a0a', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <ChevronRight size={18} />
              </button>
              </>
              )}
              <button onClick={onClose}
                style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(248,247,244,0.7)', border: 'none', color: '#0a0a0a', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <X size={18} />
              </button>
        </div>

        <div style={{ padding: '28px 32px 32px' }}>
          <div style={{ fontSize: 10, color: '#6b6b6b', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8 }}>
            {styles.map((s, i) => (
              <span key={s}>
                {i > 0 && ' · '}{getStyleLabel(s, lang)}
              </span>
            ))} {styles.length > 0 && ' · '} {getTierLabel(design.price_per_sqm)}
          </div>
          <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', color: '#0a0a0a', marginBottom: 16 }}>{name}</h2>
          {desc && <p style={{ fontSize: 14, color: 'rgba(10,10,10,0.55)', lineHeight: 1.7, marginBottom: 20 }}>{desc}</p>}
          {elements && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 10, color: '#6b6b6b', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 10 }}>
                {lang === 'es' ? 'Incluye' : 'Includes'}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px' }}>
                {elements.split('\n').filter(Boolean).map((el, i) => (
                  <div key={i} style={{ fontSize: 12, color: 'rgba(10,10,10,0.6)', display: 'flex', gap: 8 }}>
                    <span style={{ color: '#6b6b6b' }}>✓</span>{el.trim()}
                  </div>
                ))}
              </div>
            </div>
          )}
          <button onClick={() => onModalQuoteClick(design)}
            style={{ width: '100%', background: '#6b6b6b', color: '#ffffff', border: 'none', padding: '14px 24px', fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: "'Helvetica Neue', Arial, sans-serif", transition: 'opacity 0.2s' }}
            onMouseEnter={e => e.target.style.opacity = '0.85'}
            onMouseLeave={e => e.target.style.opacity = '1'}
          >
            {lang === 'es' ? 'COTIZAR ESTE DISEÑO →' : 'QUOTE THIS DESIGN →'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function GallerySection({ designs, onSelect, changeDesignMode, lang: langProp, selectedDesignId, view = 'home', setModalDesign: externalSetModalDesign, modalDesign: externalModalDesign, onModalQuoteClick }) {
  const { lang } = useLanguage();
  const currentLang = langProp || lang;
  const [styleFilter, setStyleFilter] = useState('all');
  const [budgetFilter, setBudgetFilter] = useState('all');
  const [internalModalDesign, setInternalModalDesign] = useState(null);
  const modalDesign = view === 'home' ? internalModalDesign : externalModalDesign;
  const setModalDesign = view === 'home' ? setInternalModalDesign : externalSetModalDesign;

  // Helper: get design name with fallback
  const getDesignName = (design) => currentLang === 'es' 
    ? (design.name_es || design.name_en || '—') 
    : (design.name_en || design.name_es || '—');

  const { data: officeStyles = [] } = useQuery({
    queryKey: ['officeStyles'],
    queryFn: () => base44Public.entities.OfficeStyle.list('style_key'),
  });

  const activeStyles = officeStyles.filter(s => s.active);

  const filtered = designs
    .filter(d => d.active !== false)
    .filter(d => designMatchesStyleFilter(d, styleFilter))
    .filter(d => inBudget(d.price_per_sqm || 0, budgetFilter))
    .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

  const styleBtn = (active, onClick, label) => (
    <button onClick={onClick} style={{
      fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '7px 16px', cursor: 'pointer',
      background: active ? 'rgba(0,0,0,0.08)' : 'transparent',
      border: active ? '0.5px solid #0a0a0a' : '0.5px solid rgba(0,0,0,0.15)',
      color: active ? '#0a0a0a' : 'rgba(10,10,10,0.4)',
      fontFamily: "'Helvetica Neue', Arial, sans-serif", fontWeight: active ? 600 : 400,
      transition: 'all 0.2s',
    }}>{label}</button>
  );

  const tierBtn = (active, onClick, label) => (
    <button onClick={onClick} style={{
      fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '7px 16px', cursor: 'pointer',
      background: active ? '#6b6b6b' : 'transparent',
      border: active ? '0.5px solid #6b6b6b' : '0.5px solid rgba(100,100,100,0.25)',
      color: active ? '#0a0a0a' : 'rgba(100,100,100,0.45)',
      fontFamily: "'Helvetica Neue', Arial, sans-serif", fontWeight: active ? 600 : 400,
      transition: 'all 0.2s',
    }}>{label}</button>
  );

  return (
    <section id="lookbook" style={{ padding: '96px 0 0' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
        {changeDesignMode && (
          <div style={{ background: 'rgba(100,100,100,0.08)', border: '0.5px solid rgba(100,100,100,0.25)', padding: '16px 20px', marginBottom: 32, fontSize: 13, color: 'rgba(10,10,10,0.6)', lineHeight: 1.6, borderRadius: 2 }}>
            {currentLang === 'es'
              ? '✓ Selecciona un nuevo diseño — tu configuración se mantendrá'
              : '✓ Select a new design — your configuration will be saved'}
          </div>
        )}
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 10, letterSpacing: '0.25em', color: '#6b6b6b', textTransform: 'uppercase', marginBottom: 10 }}>
            {currentLang === 'es' ? 'Lookbook' : 'Lookbook'}
          </div>
          <h2 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em', color: '#0a0a0a', marginBottom: 24 }}>
            {currentLang === 'es' ? 'Proyectos de referencia' : 'Reference projects'}
          </h2>

          {/* Filters */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Row 1 — Style */}
            <div>
              <div style={{ fontSize: 9, letterSpacing: '0.2em', color: 'rgba(10,10,10,0.5)', textTransform: 'uppercase', marginBottom: 8 }}>
                Estilo / Style
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {styleBtn(styleFilter === 'all', () => setStyleFilter('all'), lang === 'es' ? 'Todos' : 'All')}
                {activeStyles.map(s => styleBtn(styleFilter === s.style_key, () => setStyleFilter(s.style_key), lang === 'es' ? s.name_es : s.name_en))}
              </div>
            </div>
            {/* Row 2 — Tier */}
            <div>
              <div style={{ fontSize: 9, letterSpacing: '0.2em', color: 'rgba(10,10,10,0.4)', textTransform: 'uppercase', marginBottom: 8 }}>
                Nivel / Tier
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {tierBtn(budgetFilter === 'all', () => setBudgetFilter('all'), lang === 'es' ? 'Todos' : 'All')}
                {BUDGET_FILTERS.slice(1).map(b => tierBtn(budgetFilter === b.key, () => setBudgetFilter(b.key === budgetFilter ? 'all' : b.key), b.es))}
              </div>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'rgba(0,0,0,0.08)' }}>
          {filtered.map((design, i) => {
            const name = lang === 'es' ? (design.name_es || design.name_en) : (design.name_en || design.name_es);
            const photo = (design.photos || []).filter(Boolean)[0];
            const tier = getTierLabel(design.price_per_sqm);
            const isFirst = i === 0;

            const isSelected = selectedDesignId === design.id;
            return (
              <motion.div key={design.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                onClick={() => setModalDesign(design)}
                style={{
                  background: view === 'configurator' && isSelected ? 'rgba(107,107,107,0.04)' : '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  border: view === 'configurator' && isSelected ? '1.5px solid #6b6b6b' : '0.5px solid rgba(0,0,0,0.1)',
                  boxShadow: view === 'configurator' && isSelected ? '0 4px 16px rgba(107,107,107,0.2)' : 'none',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ width: '100%', height: 220, background: '#e8e6e0', overflow: 'hidden', position: 'relative' }}>
                   {photo ? (
                      <img src={photo} alt={name} loading="lazy" crossOrigin="anonymous" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
                        onError={(e) => { e.target.style.display='none'; e.target.parentElement.style.background='#e8e6e0'; }} />
                    ) : (
                      <div style={{ width: '100%', height: 220, background: '#e8e6e0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: 10, color: 'rgba(10,10,10,0.1)', letterSpacing: '0.25em' }}>THESEUS</span>
                      </div>
                    )}
                 </div>
                <div style={{ padding: '18px 22px', borderTop: '0.5px solid rgba(0,0,0,0.07)', display: 'flex', flexDirection: 'column', gap: 12 }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 0 }}>
                     <div style={{ flex: 1 }}>
                       <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em', color: '#0a0a0a', lineHeight: 1.15 }}>{name}</div>
                       <div style={{ fontSize: 10, textTransform: 'uppercase', color: 'rgba(10,10,10,0.35)', marginTop: 4, letterSpacing: '0.08em' }}>
                         {getDesignStyles(design).map((s, i) => (
                           <span key={s}>
                             {i > 0 && ' · '}{getStyleLabel(s, lang)}
                           </span>
                         ))}
                       </div>
                     </div>
                     {tier && (
                       <span style={{
                         fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '4px 8px',
                         background: isPremium(design.price_per_sqm) ? 'rgba(100,100,100,0.15)' : 'rgba(0,0,0,0.05)',
                         color: isPremium(design.price_per_sqm) ? '#6b6b6b' : 'rgba(10,10,10,0.4)',
                         border: isPremium(design.price_per_sqm) ? '0.5px solid rgba(100,100,100,0.3)' : '0.5px solid rgba(0,0,0,0.08)',
                         marginLeft: 12, flexShrink: 0,
                       }}>{tier}</span>
                     )}
                   </div>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     {design.price_per_sqm > 0 && (
                       <div style={{ fontSize: 12, fontWeight: 600, color: '#6b6b6b' }}>
                         ${design.price_per_sqm?.toLocaleString()} USD/m²
                       </div>
                     )}
                     {view === 'configurator' && (
                       <button
                         onClick={(e) => {
                           e.stopPropagation();
                           setModalDesign(design);
                         }}
                         style={{
                           background: 'none',
                           border: 'none',
                           fontSize: 11,
                           color: 'rgba(0,0,0,0.4)',
                           cursor: 'pointer',
                           textDecoration: 'underline',
                           padding: 0,
                           fontFamily: "'Helvetica Neue', Arial, sans-serif",
                         }}
                       >
                         {lang === 'es' ? 'Ver detalle →' : 'See detail →'}
                       </button>
                     )}
                   </div>
                 </div>
              </motion.div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '64px 0', fontSize: 13, color: 'rgba(10,10,10,0.55)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {currentLang === 'es' ? 'Sin proyectos con estos filtros' : 'No projects match'}
          </div>
        )}

        {filtered.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: 16, fontSize: 12, color: 'rgba(0,0,0,0.4)' }}>
            {currentLang === 'es' ? 'Selecciona un proyecto para ver tu cotización estimada' : 'Select a project to see your estimated quote'}
          </div>
        )}


      </div>

      <AnimatePresence>
        {modalDesign && (
          <DesignModal
            design={modalDesign}
            lang={lang}
            onClose={() => setModalDesign(null)}
            onModalQuoteClick={onModalQuoteClick}
          />
        )}
      </AnimatePresence>
    </section>
  );
}