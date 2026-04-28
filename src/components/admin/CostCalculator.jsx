import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Loader2, Save, CheckCircle2 } from 'lucide-react';

const TIERS = [
  { key: 'essential', label: 'Esencial' },
  { key: 'plus', label: 'Plus' },
  { key: 'premium', label: 'Premium' },
];

function fmt(n) {
  return n.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

function marginColor(pct) {
  if (pct >= 30) return '#4ade80';
  if (pct >= 20) return '#fbbf24';
  return '#f87171';
}

export default function CostCalculator() {
  const [sqm, setSqm] = useState(300);
  const [activeTier, setActiveTier] = useState('essential');
  const [rows, setRows] = useState([]);
  const [edits, setEdits] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setLoading(true);
    setEdits({});
    setSaved(false);
    base44.entities.CostElement.filter({ tier: activeTier }, 'display_order')
      .then(data => {
        setRows(data);
      })
      .finally(() => setLoading(false));
  }, [activeTier]);

  function getCost(row) {
    return parseFloat(edits[row.id]?.cost_per_sqm ?? row.cost_per_sqm) || 0;
  }
  function getSale(row) {
    return parseFloat(edits[row.id]?.sale_per_sqm ?? row.sale_per_sqm) || 0;
  }
  function getMargin(cost, sale) {
    if (!sale) return 0;
    return ((sale - cost) / sale) * 100;
  }

  function handleChange(id, field, value) {
    setEdits(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    const ids = Object.keys(edits);
    for (const id of ids) {
      const row = rows.find(r => r.id === id);
      if (!row) continue;
      await base44.entities.CostElement.update(id, {
        cost_per_sqm: parseFloat(edits[id].cost_per_sqm ?? row.cost_per_sqm) || 0,
        sale_per_sqm: parseFloat(edits[id].sale_per_sqm ?? row.sale_per_sqm) || 0,
      });
    }
    setSaving(false);
    setSaved(true);
    setEdits({});
    // refresh rows with saved values
    const updated = await base44.entities.CostElement.filter({ tier: activeTier }, 'display_order');
    setRows(updated);
  }

  const totalCost = rows.reduce((s, r) => s + getCost(r), 0);
  const totalSale = rows.reduce((s, r) => s + getSale(r), 0);
  const totalMargin = getMargin(totalCost, totalSale);
  const totalUtility = (totalSale - totalCost) * sqm;
  const hasDirty = Object.keys(edits).length > 0;

  return (
    <div style={{ fontFamily: 'var(--font-body)', color: 'hsl(var(--foreground))' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontFamily: 'var(--font-heading)', fontWeight: 600, margin: 0 }}>
          Calculadora de Costos
        </h2>
        <button
          onClick={handleSave}
          disabled={saving || !hasDirty}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '7px 16px', borderRadius: 8, border: 'none', cursor: hasDirty ? 'pointer' : 'not-allowed',
            background: hasDirty ? 'hsl(var(--primary))' : 'hsl(var(--muted))',
            color: hasDirty ? 'hsl(var(--primary-foreground))' : 'hsl(var(--muted-foreground))',
            fontSize: 13, fontWeight: 500, transition: 'all 0.15s',
          }}
        >
          {saving ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> :
           saved && !hasDirty ? <CheckCircle2 size={14} /> : <Save size={14} />}
          {saving ? 'Guardando...' : saved && !hasDirty ? 'Guardado' : `Guardar cambios${hasDirty ? ` (${Object.keys(edits).length})` : ''}`}
        </button>
      </div>

      {/* m² input */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <label style={{ fontSize: 13, color: 'hsl(var(--muted-foreground))' }}>m² de referencia</label>
        <input
          type="number"
          min={1}
          value={sqm}
          onChange={e => setSqm(parseInt(e.target.value) || 1)}
          style={{
            width: 90, padding: '4px 10px', borderRadius: 6, border: '1px solid hsl(var(--border))',
            background: 'hsl(var(--background))', color: 'hsl(var(--foreground))', fontSize: 14,
          }}
        />
        <span style={{ fontSize: 13, color: 'hsl(var(--muted-foreground))' }}>m²</span>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid hsl(var(--border))', marginBottom: 24 }}>
        {TIERS.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTier(t.key)}
            style={{
              padding: '9px 20px', fontSize: 13, fontWeight: 500, border: 'none', cursor: 'pointer',
              background: 'transparent', borderBottom: activeTier === t.key ? '2px solid hsl(var(--primary))' : '2px solid transparent',
              color: activeTier === t.key ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
              marginBottom: -1, transition: 'all 0.15s',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
          <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', color: 'hsl(var(--primary))' }} />
        </div>
      ) : rows.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 48, color: 'hsl(var(--muted-foreground))', fontSize: 13, border: '1px dashed hsl(var(--border))', borderRadius: 10 }}>
          No hay elementos para este tier.
        </div>
      ) : (
        <div style={{ overflowX: 'auto', borderRadius: 10, border: '1px solid hsl(var(--border))', marginBottom: 24 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'hsl(var(--muted))', borderBottom: '1px solid hsl(var(--border))' }}>
                {['Categoría', 'Elemento', 'Costo/m²', 'Venta/m²', 'Margen %', 'Utilidad total'].map(h => (
                  <th key={h} style={{
                    padding: '10px 14px', textAlign: h === 'Categoría' || h === 'Elemento' ? 'left' : 'right',
                    color: 'hsl(var(--muted-foreground))', fontWeight: 500, whiteSpace: 'nowrap',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => {
                const cost = getCost(row);
                const sale = getSale(row);
                const margin = getMargin(cost, sale);
                const utility = (sale - cost) * sqm;
                const isEdited = !!edits[row.id];
                return (
                  <tr key={row.id} style={{
                    borderTop: i > 0 ? '1px solid hsl(var(--border))' : 'none',
                    background: isEdited ? 'hsl(var(--primary) / 0.06)' : (i % 2 === 0 ? 'transparent' : 'hsl(var(--muted) / 0.3)'),
                    transition: 'background 0.1s',
                  }}>
                    <td style={{ padding: '8px 14px', color: 'hsl(var(--muted-foreground))' }}>{row.category}</td>
                    <td style={{ padding: '8px 14px' }}>{row.element}</td>

                    <td style={{ padding: '6px 14px', textAlign: 'right' }}>
                      <input
                        type="number"
                        value={edits[row.id]?.cost_per_sqm ?? row.cost_per_sqm}
                        onChange={e => handleChange(row.id, 'cost_per_sqm', e.target.value)}
                        step="0.01"
                        min={0}
                        style={{
                          width: 80, padding: '4px 8px', textAlign: 'right', borderRadius: 6,
                          border: '1px solid hsl(var(--border))', background: 'hsl(var(--background))',
                          color: 'hsl(var(--foreground))', fontSize: 13,
                        }}
                      />
                    </td>

                    <td style={{ padding: '6px 14px', textAlign: 'right' }}>
                      <input
                        type="number"
                        value={edits[row.id]?.sale_per_sqm ?? row.sale_per_sqm}
                        onChange={e => handleChange(row.id, 'sale_per_sqm', e.target.value)}
                        step="0.01"
                        min={0}
                        style={{
                          width: 80, padding: '4px 8px', textAlign: 'right', borderRadius: 6,
                          border: '1px solid hsl(var(--border))', background: 'hsl(var(--background))',
                          color: 'hsl(var(--foreground))', fontSize: 13,
                        }}
                      />
                    </td>

                    <td style={{ padding: '8px 14px', textAlign: 'right', fontWeight: 600, color: marginColor(margin) }}>
                      {margin.toFixed(0)}%
                    </td>

                    <td style={{ padding: '8px 14px', textAlign: 'right', fontWeight: 500 }}>
                      ${fmt(utility)} USD
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary cards */}
      {!loading && rows.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
          {[
            { label: 'Total costo/m²', value: `$${totalCost.toFixed(2)}`, color: null },
            { label: 'Total venta/m²', value: `$${totalSale.toFixed(2)}`, color: null },
            { label: 'Margen global', value: `${totalMargin.toFixed(1)}%`, color: marginColor(totalMargin) },
            { label: 'Utilidad del proyecto', value: `$${fmt(totalUtility)} USD`, color: null },
          ].map(card => (
            <div key={card.label} style={{
              background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))',
              borderRadius: 12, padding: '16px 20px',
            }}>
              <div style={{ fontSize: 11, color: 'hsl(var(--muted-foreground))', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {card.label}
              </div>
              <div style={{ fontSize: 22, fontFamily: 'var(--font-heading)', fontWeight: 700, color: card.color || 'hsl(var(--foreground))' }}>
                {card.value}
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}