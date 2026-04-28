import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';

const TIERS = [
  { key: 'essential', label_es: 'Esencial', label_en: 'Essential' },
  { key: 'plus', label_es: 'Plus', label_en: 'Plus' },
  { key: 'premium', label_es: 'Premium', label_en: 'Premium' },
];

const PCTS = [
  { key: 'pct_design', label_es: 'Diseño %', label_en: 'Design %' },
  { key: 'pct_construction', label_es: 'Construcción %', label_en: 'Construction %' },
  { key: 'pct_furniture', label_es: 'Mobiliario %', label_en: 'Furniture %' },
  { key: 'pct_finishes', label_es: 'Acabados %', label_en: 'Finishes %' },
  { key: 'pct_electrical', label_es: 'Instalaciones %', label_en: 'Electrical %' },
];

export default function QualityTierManager() {
  const queryClient = useQueryClient();
  const [editingTier, setEditingTier] = useState(null);
  const [formData, setFormData] = useState({});

  const { data: tiers = [] } = useQuery({
    queryKey: ['qualityTiers'],
    queryFn: () => base44.entities.QualityTier.list('tier_key'),
  });

  const updateMutation = useMutation({
    mutationFn: (data) => base44.entities.QualityTier.update(data.id, data.updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qualityTiers'] });
      setEditingTier(null);
      setFormData({});
    },
  });

  const startEdit = (tier) => {
    setEditingTier(tier.id);
    setFormData({
      price_min_usd: tier.price_min_usd || 0,
      price_max_usd: tier.price_max_usd || 0,
      pct_design: tier.pct_design || 0,
      pct_construction: tier.pct_construction || 0,
      pct_furniture: tier.pct_furniture || 0,
      pct_finishes: tier.pct_finishes || 0,
      pct_electrical: tier.pct_electrical || 0,
    });
  };

  const handleSave = () => {
    if (!editingTier) return;
    updateMutation.mutate({
      id: editingTier,
      updates: formData,
    });
  };

  const cancelEdit = () => {
    setEditingTier(null);
    setFormData({});
  };

  const currentTierData = editingTier ? tiers.find(t => t.id === editingTier) : null;
  const tierLabel = currentTierData ? TIERS.find(t => t.key === currentTierData.tier_key) : null;
  const midpoint = editingTier && formData.price_min_usd && formData.price_max_usd
    ? Math.round((formData.price_min_usd + formData.price_max_usd) / 2)
    : 0;

  const totalPct = PCTS.reduce((sum, p) => sum + (formData[p.key] || 0), 0);
  const pctIsValid = totalPct === 100;

  return (
    <div>
      {/* Helper note */}
      <div style={{ background: 'rgba(107,107,107,0.08)', border: '0.5px solid rgba(107,107,107,0.25)', padding: '16px 20px', marginBottom: 32, fontSize: 13, color: 'rgba(10,10,10,0.6)', lineHeight: 1.6, borderRadius: 4 }}>
        Estos son los precios que se muestran cuando un cliente elige "Diseño a medida" sin seleccionar un proyecto del lookbook. El precio de cotización se multiplica por los m² del cliente.
      </div>

      {/* Cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 32 }}>
        {TIERS.map(tierDef => {
          const tier = tiers.find(t => t.tier_key === tierDef.key);
          if (!tier) return null;

          const isEditing = editingTier === tier.id;
          const tierMidpoint = tier.price_min_usd && tier.price_max_usd
            ? Math.round((tier.price_min_usd + tier.price_max_usd) / 2)
            : 0;

          return (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                border: '0.5px solid rgba(0,0,0,0.12)',
                borderRadius: 8,
                padding: '24px',
                background: '#ffffff',
              }}
            >
              {/* Header */}
              <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: '0.5px solid rgba(0,0,0,0.08)' }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0a0a0a', marginBottom: 4 }}>
                  {tierDef.label_es}
                </h3>
                <p style={{ fontSize: 12, color: 'rgba(10,10,10,0.45)', lineHeight: 1.5 }}>
                  Estos precios se usan cuando el cliente cotiza sin elegir un proyecto específico (Diseño a medida)
                </p>
              </div>

              {!isEditing ? (
                <>
                  {/* View mode */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '0.5px solid rgba(0,0,0,0.05)' }}>
                      <span style={{ fontSize: 12, color: 'rgba(10,10,10,0.5)' }}>Mín (USD/m²)</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#0a0a0a' }}>${tier.price_min_usd?.toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '0.5px solid rgba(0,0,0,0.05)' }}>
                      <span style={{ fontSize: 12, color: 'rgba(10,10,10,0.5)' }}>Máx (USD/m²)</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#0a0a0a' }}>${tier.price_max_usd?.toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '0.5px solid rgba(0,0,0,0.05)', background: 'rgba(107,107,107,0.04)', padding: '8px', marginLeft: '-8px', marginRight: '-8px', paddingLeft: '8px' }}>
                      <span style={{ fontSize: 12, color: '#6b6b6b', fontWeight: 600 }}>Cotización (USD/m²)</span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: '#6b6b6b' }}>${tierMidpoint.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Percentages */}
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(10,10,10,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
                      Desglose
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {PCTS.map(p => (
                        <div key={p.key} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'rgba(10,10,10,0.55)' }}>
                          <span>{p.label_es}</span>
                          <span>{tier[p.key] || 0}%</span>
                        </div>
                      ))}
                      <div style={{ marginTop: 6, paddingTop: 6, borderTop: '0.5px solid rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, color: tier.pct_design + tier.pct_construction + tier.pct_furniture + tier.pct_finishes + tier.pct_electrical === 100 ? '#4ade80' : '#ef4444' }}>
                        <span>Total</span>
                        <span>{(tier.pct_design || 0) + (tier.pct_construction || 0) + (tier.pct_furniture || 0) + (tier.pct_finishes || 0) + (tier.pct_electrical || 0)}%</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => startEdit(tier)}
                    style={{
                      width: '100%',
                      background: '#6b6b6b',
                      color: '#ffffff',
                      border: 'none',
                      padding: '10px 16px',
                      fontSize: 12,
                      fontWeight: 600,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      borderRadius: 4,
                    }}
                  >
                    Editar
                  </button>
                </>
              ) : (
                <>
                  {/* Edit mode */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
                    {/* Price inputs */}
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: 'rgba(10,10,10,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>
                        Precio mínimo (USD/m²)
                      </label>
                      <input
                        type="number"
                        value={formData.price_min_usd}
                        onChange={(e) => setFormData({ ...formData, price_min_usd: parseFloat(e.target.value) || 0 })}
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          fontSize: 13,
                          border: '0.5px solid rgba(0,0,0,0.15)',
                          borderRadius: 4,
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: 'rgba(10,10,10,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>
                        Precio máximo (USD/m²)
                      </label>
                      <input
                        type="number"
                        value={formData.price_max_usd}
                        onChange={(e) => setFormData({ ...formData, price_max_usd: parseFloat(e.target.value) || 0 })}
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          fontSize: 13,
                          border: '0.5px solid rgba(0,0,0,0.15)',
                          borderRadius: 4,
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>

                    <div style={{ background: 'rgba(107,107,107,0.04)', padding: 10, borderRadius: 4 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: '#6b6b6b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                        Precio de cotización (USD/m²)
                      </div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: '#6b6b6b' }}>
                        ${midpoint.toLocaleString()}
                      </div>
                      <div style={{ fontSize: 10, color: 'rgba(107,107,107,0.6)', marginTop: 4 }}>
                        (mín + máx) / 2
                      </div>
                    </div>

                    {/* Percentage inputs */}
                    <div style={{ marginTop: 8 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(10,10,10,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
                        Desglose (debe sumar 100%)
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {PCTS.map(p => (
                          <div key={p.key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <label style={{ fontSize: 12, color: 'rgba(10,10,10,0.55)', flex: 1 }}>
                              {p.label_es}
                            </label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={formData[p.key] || 0}
                                onChange={(e) => setFormData({ ...formData, [p.key]: parseFloat(e.target.value) || 0 })}
                                style={{
                                  width: 60,
                                  padding: '6px 8px',
                                  fontSize: 12,
                                  border: '0.5px solid rgba(0,0,0,0.15)',
                                  borderRadius: 4,
                                  textAlign: 'right',
                                }}
                              />
                              <span style={{ fontSize: 12, color: 'rgba(10,10,10,0.4)', width: 16 }}>%</span>
                            </div>
                          </div>
                        ))}
                        <div style={{ marginTop: 8, paddingTop: 8, borderTop: '0.5px solid rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, color: pctIsValid ? '#4ade80' : '#ef4444' }}>
                          <span>Total</span>
                          <span>{totalPct}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={handleSave}
                      disabled={updateMutation.isPending || !pctIsValid}
                      style={{
                        flex: 1,
                        background: pctIsValid ? '#6b6b6b' : 'rgba(0,0,0,0.08)',
                        color: pctIsValid ? '#ffffff' : 'rgba(0,0,0,0.3)',
                        border: 'none',
                        padding: '10px 16px',
                        fontSize: 12,
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        cursor: pctIsValid && !updateMutation.isPending ? 'pointer' : 'not-allowed',
                        borderRadius: 4,
                      }}
                    >
                      {updateMutation.isPending ? 'Guardando...' : 'Guardar'}
                    </button>
                    <button
                      onClick={cancelEdit}
                      disabled={updateMutation.isPending}
                      style={{
                        flex: 1,
                        background: 'transparent',
                        color: 'rgba(10,10,10,0.5)',
                        border: '0.5px solid rgba(0,0,0,0.2)',
                        padding: '10px 16px',
                        fontSize: 12,
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        borderRadius: 4,
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}