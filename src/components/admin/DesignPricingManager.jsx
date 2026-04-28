import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const FIELD_GROUPS = [
  {
    label: 'Base',
    fields: [
      { key: 'base_price_usd', label: 'Precio base ($/m²)', cols: 1 },
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

function PricingCard({ design, pricing }) {
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
    payload.design_id = design.id;
    payload.design_name = design.name_es || design.name_en;
    payload.active = true;

    if (pricing?.id) {
      await base44.entities.DesignPricing.update(pricing.id, payload);
    } else {
      await base44.entities.DesignPricing.create(payload);
    }
    queryClient.invalidateQueries({ queryKey: ['designPricings'] });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const designName = design.name_es || design.name_en;
  const styleKey = design.style_key || '';

  return (
    <div style={{ background: '#ffffff', border: '0.5px solid rgba(0,0,0,0.1)', padding: '20px 24px', marginBottom: '16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', paddingBottom: '16px', borderBottom: '0.5px solid rgba(0,0,0,0.08)' }}>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0a0a0a', margin: 0, marginBottom: '4px', fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>{designName}</h3>
          {styleKey && <span style={{ fontSize: '10px', color: 'rgba(0,0,0,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>{styleKey}</span>}
        </div>
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
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
            whiteSpace: 'nowrap',
            marginLeft: '16px',
            flexShrink: 0
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

export default function DesignPricingManager() {
  const { data: designs = [], isLoading: loadingD } = useQuery({
    queryKey: ['officeDesigns'],
    queryFn: () => base44.entities.OfficeDesign.list('display_order'),
  });
  const { data: pricings = [], isLoading: loadingP } = useQuery({
    queryKey: ['designPricings'],
    queryFn: () => base44.entities.DesignPricing.list(),
  });

  if (loadingD || loadingP) return (
    <div className="flex items-center justify-center py-20 text-muted-foreground font-body text-sm">
      Cargando...
    </div>
  );

  const activeDesigns = designs.filter(d => d.active !== false);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0a0a0a', marginBottom: '8px', fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>Precios por Proyecto</h2>
        <p style={{ fontSize: '14px', color: 'rgba(0,0,0,0.55)', lineHeight: '1.6', maxWidth: '600px', fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
          El precio base se multiplica por los m² del proyecto. Los demás rubros se suman al total según lo que elija el cliente.
        </p>
      </div>

      {/* Cards stacked */}
      <div style={{ maxWidth: '600px' }}>
        {activeDesigns.map(design => {
          const pricing = pricings.find(p => p.design_id === design.id);
          return (
            <PricingCard key={design.id} design={design} pricing={pricing} />
          );
        })}
      </div>

      {activeDesigns.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'rgba(0,0,0,0.4)', fontSize: '14px', fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
          No hay diseños activos. Agrega proyectos en la sección "Proyectos" primero.
        </div>
      )}
    </div>
  );
}