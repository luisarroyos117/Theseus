import React from 'react';
import { useLanguage } from '@/lib/i18n';
import { motion } from 'framer-motion';

export default function DesignEntryChoice({ onChooseProject, onChooseCustom }) {
  const { lang } = useLanguage();

  const options = lang === 'es' ? [
    {
      key: 'project',
      title: 'Elegir un proyecto',
      desc: 'Explora nuestro lookbook y elige el diseño que más te inspira. Incluye fotos, materiales y especificaciones.',
      btn: 'Ver proyectos →',
      onClick: onChooseProject,
    },
    {
      key: 'custom',
      title: 'Diseño a medida',
      desc: '¿No encontraste lo que buscas? Cotiza con tu propio concepto eligiendo el nivel de calidad.',
      btn: 'Cotizar a medida →',
      onClick: onChooseCustom,
    },
  ] : [
    {
      key: 'project',
      title: 'Choose a project',
      desc: 'Browse our lookbook and choose the design that inspires you most. Includes photos, materials and specifications.',
      btn: 'See projects →',
      onClick: onChooseProject,
    },
    {
      key: 'custom',
      title: 'Custom design',
      desc: "Didn't find what you're looking for? Quote with your own concept by choosing the quality level.",
      btn: 'Quote custom →',
      onClick: onChooseCustom,
    },
  ];

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '48px 32px' }}>
      <div style={{ marginBottom: 48, textAlign: 'center' }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em', color: '#0a0a0a', marginBottom: 8 }}>
          {lang === 'es' ? '¿Cómo quieres empezar?' : 'How would you like to start?'}
        </h2>
        <p style={{ fontSize: 14, color: 'rgba(10,10,10,0.45)', lineHeight: 1.6 }}>
          {lang === 'es' ? 'Elige tu camino hacia la oficina perfecta.' : 'Choose your path to the perfect office.'}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
        {options.map((opt, i) => (
          <motion.div
            key={opt.key}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={opt.onClick}
            style={{
              background: '#ffffff',
              border: '0.5px solid rgba(0,0,0,0.1)',
              padding: '32px 28px',
              cursor: 'pointer',
              transition: 'all 0.3s',
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
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
            {/* Title */}
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0a0a0a', marginBottom: 8, letterSpacing: '-0.02em' }}>
                {opt.title}
              </h3>
              <p style={{ fontSize: 12, color: 'rgba(10,10,10,0.45)', lineHeight: 1.6 }}>
                {opt.desc}
              </p>
            </div>

            {/* Button */}
            <div style={{ paddingTop: 12 }}>
              <button
                onClick={opt.onClick}
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
                {opt.btn}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}