import React from 'react';
import { useLanguage } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44Public } from '@/api/base44Client';

export default function TierSelector({ onSelectTier }) {
  const { lang } = useLanguage();

  const { data: tiers = [], isLoading } = useQuery({
    queryKey: ['generalPricings'],
    queryFn: () => base44Public.entities.GeneralPricing.list('tier_key'),
  });

  const tierOrder = ['essential', 'plus', 'premium'];
  const sortedTiers = tierOrder.map(key => tiers.find(t => t.tier_key === key)).filter(Boolean);

  if (isLoading) {
    return (
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '48px 32px', textAlign: 'center' }}>
        <div style={{ fontSize: 12, color: 'rgba(10,10,10,0.4)' }}>
          {lang === 'es' ? 'Cargando opciones...' : 'Loading options...'}
        </div>
      </div>
    );
  }

  const getTierLabel = (tier) => {
    const labels = { essential: { es: 'Esencial', en: 'Essential' }, plus: { es: 'Plus', en: 'Plus' }, premium: { es: 'Premium', en: 'Premium' } };
    return labels[tier.tier_key]?.[lang === 'es' ? 'es' : 'en'] || tier.tier_key;
  };

  const getTierDesc = (tier) => {
    const descs = {
      essential: { es: 'Solución económica con elementos esenciales.', en: 'Economic solution with essential elements.' },
      plus: { es: 'Solución intermedia con mejor calidad.', en: 'Mid-range solution with better quality.' },
      premium: { es: 'Solución premium con máxima calidad.', en: 'Premium solution with maximum quality.' },
    };
    return descs[tier.tier_key]?.[lang === 'es' ? 'es' : 'en'] || '';
  };

  const getPriceRange = (tier) => {
    const minPrice = Math.round(tier.base_price_per_sqm * 0.8);
    const maxPrice = Math.round(tier.base_price_per_sqm * 1.2);
    return `${lang === 'es' ? 'Desde' : 'From'} $${minPrice} ${lang === 'es' ? 'hasta' : 'to'} $${maxPrice} USD/m²`;
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 32px' }}>
      <div style={{ marginBottom: 48, textAlign: 'center' }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em', color: '#0a0a0a', marginBottom: 8 }}>
          {lang === 'es' ? 'Elige tu nivel de calidad' : 'Choose your quality level'}
        </h2>
        <p style={{ fontSize: 14, color: 'rgba(10,10,10,0.45)', lineHeight: 1.6 }}>
          {lang === 'es' ? 'Selecciona el nivel que mejor se ajusta a tu presupuesto y necesidades.' : 'Select the level that best fits your budget and needs.'}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, alignItems: 'stretch' }}>
         {sortedTiers.map((tier, i) => (
           <motion.div
             key={tier.tier_key}
             initial={{ opacity: 0, y: 16 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: i * 0.1 }}
             onClick={() => {
               const customDesign = {
                 id: `custom_${tier.tier_key}`,
                 name_es: 'Diseño a Medida',
                 name_en: 'Custom Design',
                 style_key: 'custom',
                 styles: ['custom'],
                 tier: tier.tier_key,
                 photos: [],
                 isCustom: true,
               };
               onSelectTier(customDesign);
             }}
             style={{
               background: '#ffffff',
               border: '0.5px solid rgba(0,0,0,0.1)',
               padding: '32px 24px',
               cursor: 'pointer',
               transition: 'all 0.3s',
               display: 'flex',
               flexDirection: 'column',
               height: '100%',
               minHeight: '420px',
             }}
             onMouseEnter={e => {
               e.currentTarget.style.borderColor = 'rgba(0,0,0,0.3)';
               e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)';
             }}
             onMouseLeave={e => {
               e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)';
               e.currentTarget.style.boxShadow = 'none';
             }}
           >
             {/* Tier name */}
             <div style={{ marginBottom: 16 }}>
               <h3 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em', color: '#0a0a0a', marginBottom: 4 }}>
                 {getTierLabel(tier)}
               </h3>
               <div style={{ fontSize: 12, color: 'rgba(107,107,107,0.8)' }}>
                 {getPriceRange(tier)}
               </div>
             </div>

             {/* Description */}
             <div style={{ fontSize: 13, color: 'rgba(10,10,10,0.55)', lineHeight: 1.6, flex: 1 }}>
               {getTierDesc(tier)}
             </div>

             {/* Button */}
             <div style={{ marginTop: 'auto', paddingTop: 16 }}>
              <button
                onClick={() => {
                  const customDesign = {
                    id: `custom_${tier.tier_key}`,
                    name_es: 'Diseño a Medida',
                    name_en: 'Custom Design',
                    style_key: 'custom',
                    styles: ['custom'],
                    tier: tier.tier_key,
                    photos: [],
                    isCustom: true,
                  };
                  onSelectTier(customDesign);
                }}
                style={{
                  width: '100%',
                  background: '#6b6b6b',
                  color: '#0a0a0a',
                  border: 'none',
                  padding: '12px 20px',
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  fontFamily: "'Helvetica Neue', Arial, sans-serif",
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={e => e.target.style.opacity = '0.85'}
                onMouseLeave={e => e.target.style.opacity = '1'}
              >
                {lang === 'es' ? 'Elegir este nivel →' : 'Choose this level →'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}