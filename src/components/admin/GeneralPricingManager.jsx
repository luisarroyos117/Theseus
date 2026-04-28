import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';

const TIERS = [
  { key: 'essential', label_es: 'Esencial', label_en: 'Essential' },
  { key: 'plus', label_es: 'Plus', label_en: 'Plus' },
  { key: 'premium', label_es: 'Premium', label_en: 'Premium' },
];

const FIELD_GROUPS = [
  {
    label: 'Base',
    fields: [
      { key: 'base_price_per_sqm', label: 'Precio base ($/m²)', cols: 1 },
    ],
  },
  {
    label: 'Por persona',
    cols: 3,
    fields: [
      { key: 'price_per_director', label: 'Por Director' },
      { key: 'price_per_manager', label: 'Por Gerente' },
      { key: 'price_per_operative', label: 'Por Operativo' },
    ],
  },
  {
    label: 'Espacios contables',
    cols: 2,
    fields: [
      { key: 'price_per_bathroom', label: 'Por Baño' },
      { key: 'price_per_meeting_room', label: 'Por Sala de Juntas' },
    ],
  },
  {
    label: 'Amenidades',
    cols: 3,
    fields: [
      { key: 'price_reception', label: 'Recepción' },
      { key: 'price_kitchen', label: 'Cocina / Pantry' },
      { key: 'price_dining', label: 'Comedor' },
      { key: 'price_lounge', label: 'Lounge' },
      { key: 'price_server_room', label: 'Server Room' },
      { key: '__empty__', label: '', empty: true },
    ],
  },
  {
    label: 'Instalaciones',
    cols: 3,
    fields: [
      { key: 'price_ac', label: 'Aire Acondicionado' },
      { key: 'price_it_screens', label: 'IT / Pantallas' },
      { key: 'price_fire_protection', label: 'Protección contra Incendio' },
    ],
  },
];

function PricingCard({ tier, pricing }) {
  const queryClient = useQueryClient();
  const [values, setValues] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const v = {};
    FIELD_GROUPS.forEach(g => g.fields.forEach(f => { v[f.key] = pricing?.[f.key] ?? 0; }));
    setValues(v);
  }, [pricing]);

  const set = (key, val) => setValues(v => ({ ...v, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    const payload = {};
    FIELD_GROUPS.forEach(g => g.fields.forEach(f => {
      if (!f.empty) payload[f.key] = parseFloat(values[f.key]) || 0;
    }));
    payload.tier_key = tier.key;

    if (pricing?.id) {
      await base44.entities.GeneralPricing.update(pricing.id, payload);
    } else {
      await base44.entities.GeneralPricing.create(payload);
    }
    queryClient.invalidateQueries({ queryKey: ['generalPricings'] });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ background: '#ffffff', border: '0.5px solid rgba(0,0,0,0.1)', padding: '20px 24px', marginBottom: '16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '16px', borderBottom: '0.5px solid rgba(0,0,0,0.08)' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0a0a0a' }}>{tier.label_es}</h3>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            background: saved ? 'rgba(34,197,94,0.1)' : '#6b6b6b',
            color: saved ? '#4ade80' : '#ffffff',
            border: saved ? '0.5px solid rgba(34,197,94,0.25)' : 'none',
            padding: '8px 16px',
            fontSize: '12px',
            fontWeight: 700,
            cursor: saving ? 'not-allowed' : 'pointer',
            opacity: saving ? 0.6 : 1,
            transition: 'all 0.2s',
            fontFamily: "'Helvetica Neue', Arial, sans-serif"
          }}
        >
          {saving ? 'Guardando...' : saved ? '✓ Guardado' : 'Guardar'}
        </button>
      </div>

      {/* Field groups */}
      {FIELD_GROUPS.map((group, gIdx) => (
        <div key={gIdx} style={{ marginTop: '16px' }}>
          <div style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)', marginBottom: '8px', fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
            {group.label}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${group.cols || 1}, 1fr)`, gap: '12px' }}>
            {group.fields.map(f => (
              f.empty ? (
                <div key={f.key} />
              ) : (
                <div key={f.key}>
                  <label style={{ display: 'block', fontSize: '11px', color: 'rgba(0,0,0,0.5)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '4px', fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
                    {f.label}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={values[f.key] ?? 0}
                      onChange={e => set(f.key, e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        border: '0.5px solid rgba(0,0,0,0.15)',
                        background: '#fff',
                        fontSize: '13px',
                        fontFamily: "'Helvetica Neue', Arial, sans-serif",
                        boxSizing: 'border-box',
                        appearance: 'none',
                        WebkitAppearance: 'none',
                        MozAppearance: 'textfield'
                      }}
                    />
                    <span style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', fontSize: '11px', color: 'rgba(0,0,0,0.4)', pointerEvents: 'none', fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>USD</span>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function GeneralPricingManager() {
  const { data: pricings = [], isLoading } = useQuery({
    queryKey: ['generalPricings'],
    queryFn: () => base44.entities.GeneralPricing.list('tier_key'),
  });

  if (isLoading) return (
    <div className="flex items-center justify-center py-20 text-muted-foreground font-body text-sm">
      Cargando...
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0a0a0a', marginBottom: '8px', fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>Precios Generales</h2>
        <p style={{ fontSize: '14px', color: 'rgba(0,0,0,0.55)', lineHeight: '1.6', maxWidth: '600px', fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
          Precios utilizados cuando el cliente cotiza con "Diseño a medida" sin seleccionar un proyecto del lookbook. 
          Mismo funcionamiento que los precios por proyecto: precio base × m² + extras por rubro.
        </p>
      </div>

      {/* Cards stacked */}
      <div style={{ maxWidth: '600px' }}>
        {TIERS.map(tier => {
          const pricing = pricings.find(p => p.tier_key === tier.key);
          return (
            <motion.div
              key={tier.key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <PricingCard tier={tier} pricing={pricing} />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}