import React, { useMemo } from 'react';
import { useLanguage } from '@/lib/i18n';
import { Minus, Plus } from 'lucide-react';

const CORRIDORS_HAVE = [
  'Polanco', 'Reforma', 'Lomas Palmas', 'Santa Fe', 'Insurgentes',
  'Periférico Sur', 'Bosques', 'Perinorte', 'Roma / Condesa', 'Interlomas',
];

const CORRIDORS_LOOKING = [
  'Polanco', 'Reforma', 'Lomas Palmas', 'Santa Fe', 'Insurgentes',
  'Periférico Sur', 'Bosques', 'Perinorte',
];

const AMENITY_DEFS = [
  { key: 'reception', sqm: 25, en: 'Reception', es: 'Recepción' },
  { key: 'kitchen', sqm: 20, en: 'Kitchen', es: 'Cocineta' },
  { key: 'dining', sqm: 40, en: 'Dining Room', es: 'Comedor' },
  { key: 'meeting', sqm: 30, en: 'Meeting Rooms', es: 'Salas de Juntas', countable: true },
  { key: 'bathrooms', sqm: 15, en: 'Bathrooms', es: 'Baños', countable: true },
  { key: 'server', sqm: 12, en: 'Server Room', es: 'Site / Servidor' },
  { key: 'lounge', sqm: 35, en: 'Lounge', es: 'Lounge' },
  { key: 'ac', sqm: 0, en: 'AC System', es: 'Aire Acondicionado' },
  { key: 'fire', sqm: 0, en: 'Fire Protection', es: 'Protección contra Incendios' },
  { key: 'it_screens', sqm: 0, en: 'IT / Screens', es: 'TI / Pantallas' },
];

const S = {
  label: { fontSize: 10, letterSpacing: '0.18em', color: 'rgba(10,10,10,0.4)', textTransform: 'uppercase', marginBottom: 12, display: 'block', fontFamily: "'Helvetica Neue', Arial, sans-serif" },
  input: { width: '100%', background: 'rgba(0,0,0,0.04)', border: '0.5px solid rgba(0,0,0,0.15)', padding: '12px 14px', color: '#0a0a0a', fontSize: 15, fontFamily: "'Helvetica Neue', Arial, sans-serif', outline: 'none", boxSizing: 'border-box' },
  sectionTitle: { fontSize: 12, fontWeight: 700, letterSpacing: '0.15em', color: 'rgba(10,10,10,0.5)', textTransform: 'uppercase', marginBottom: 16, display: 'block' },
  divider: { height: '0.5px', background: 'rgba(0,0,0,0.07)', margin: '28px 0' },
};

function Counter({ value, onChange, label, sublabel }) {
  const handleInputChange = (e) => {
    const val = e.target.value;
    onChange(val === '' ? 0 : Math.max(0, parseInt(val) || 0));
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '0.5px solid rgba(0,0,0,0.05)' }}>
      <div>
        <span style={{ fontSize: 14, color: '#0a0a0a', fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>{label}</span>
        {sublabel && <span style={{ fontSize: 11, color: 'rgba(10,10,10,0.35)', marginLeft: 8 }}>({sublabel})</span>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => onChange(Math.max(0, value - 1))}
          style={{ width: 32, height: 32, background: 'rgba(0,0,0,0.06)', border: '0.5px solid rgba(0,0,0,0.1)', color: '#0a0a0a', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Minus size={12} />
        </button>
        <input type="number" min="0" value={value} onChange={handleInputChange}
          style={{ width: 48, textAlign: 'center', fontSize: 18, fontWeight: 700, color: '#0a0a0a', background: 'transparent', border: 'none', borderBottom: '0.5px solid rgba(0,0,0,0.2)', appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'textfield', outline: 'none' }} />
        <button onClick={() => onChange(value + 1)}
          style={{ width: 32, height: 32, background: 'rgba(100,100,100,0.15)', border: '0.5px solid rgba(100,100,100,0.3)', color: '#6b6b6b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Plus size={12} />
        </button>
      </div>
    </div>
  );
}

function LiveCounter({ breakdown, lang }) {
  if (!breakdown) return (
    <div style={{ marginTop: 32, padding: '20px 24px', background: 'rgba(100,100,100,0.04)', border: '0.5px solid rgba(100,100,100,0.15)', textAlign: 'center' }}>
      <div style={{ fontSize: 11, color: 'rgba(10,10,10,0.55)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
        {lang === 'es' ? 'Selecciona un diseño para ver el precio' : 'Select a design to see pricing'}
      </div>
    </div>
  );

  const activeItems = breakdown.items.filter(item => item.amount > 0);

  return (
    <div style={{ marginTop: 32, padding: '24px', background: 'rgba(100,100,100,0.04)', border: '0.5px solid rgba(100,100,100,0.2)' }}>
      <div style={{ fontSize: 10, letterSpacing: '0.2em', color: '#6b6b6b', textTransform: 'uppercase', marginBottom: 12 }}>
        {lang === 'es' ? 'Total en tiempo real' : 'Live total'}
      </div>
      <div style={{ fontSize: 'clamp(28px, 6vw, 42px)', fontWeight: 800, letterSpacing: '-0.04em', color: '#6b6b6b', lineHeight: 1, marginBottom: 20 }}>
        ${breakdown.total.toLocaleString('en-US')} <span style={{ fontSize: '0.35em', color: 'rgba(100,100,100,0.6)', fontWeight: 400 }}>USD</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {activeItems.map((item) => {
          const label = lang === 'es' ? item.label_es : item.label_en;
          const isBase = item.key === 'base';
          return (
            <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '7px 0', borderBottom: '0.5px solid rgba(0,0,0,0.05)' }}>
              <span style={{ fontSize: 12, color: isBase ? 'rgba(10,10,10,0.6)' : 'rgba(10,10,10,0.45)', fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
                {isBase ? label : `+ ${label}`}
              </span>
              <span style={{ fontSize: 13, fontWeight: 700, color: isBase ? '#0a0a0a' : '#6b6b6b', flexShrink: 0, marginLeft: 12 }}>
                ${item.amount.toLocaleString('en-US')}
              </span>
            </div>
          );
        })}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: 10, marginTop: 4 }}>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6b6b6b' }}>= Total</span>
          <span style={{ fontSize: 16, fontWeight: 800, color: '#6b6b6b' }}>${breakdown.total.toLocaleString('en-US')} USD</span>
        </div>
      </div>
    </div>
  );
}

export default function ConfigureSpace({ config, onChange, breakdown, designPricing }) {
  const { lang } = useLanguage();
  const { spaceMode, sqm, corridor, directors, managers, operatives, selectedAmenities, amenityCounts } = config;

  const update = (key, val) => onChange({ ...config, [key]: val });

  const toggleAmenity = (key) => {
    const current = selectedAmenities || [];
    update('selectedAmenities', current.includes(key) ? current.filter(a => a !== key) : [...current, key]);
  };

  const updateAmenityCount = (key, val) => {
    update('amenityCounts', { ...(amenityCounts || {}), [key]: val });
  };

  const autoSqm = useMemo(() => {
    const teamSqm = (directors || 0) * 20 + (managers || 0) * 12 + (operatives || 0) * 7;
    const amenitySqm = (selectedAmenities || []).reduce((acc, key) => {
      const def = AMENITY_DEFS.find(a => a.key === key);
      if (!def || def.sqm === 0) return acc;
      const count = def.countable ? ((amenityCounts || {})[key] || 1) : 1;
      return acc + def.sqm * count;
    }, 0);
    return teamSqm + amenitySqm;
  }, [directors, managers, operatives, selectedAmenities, amenityCounts]);

  const corridors = spaceMode === 'looking_for_space' ? CORRIDORS_LOOKING : CORRIDORS_HAVE;

  return (
    <div>
      {/* Space mode */}
      <div style={{ marginBottom: 28 }}>
        <span style={S.sectionTitle}>{lang === 'es' ? 'Situación del espacio' : 'Space situation'}</span>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'rgba(0,0,0,0.08)' }}>
          {[
            { key: 'have_space', es: 'Ya tengo un espacio', en: 'I have a space' },
            { key: 'looking_for_space', es: 'Busco un espacio', en: "I'm looking for a space" },
          ].map(mode => {
            const active = spaceMode === mode.key;
            return (
              <button key={mode.key} onClick={() => update('spaceMode', mode.key)} style={{
                background: active ? 'rgba(100,100,100,0.08)' : '#f8f7f4', padding: '16px 20px', border: 'none', cursor: 'pointer',
                borderBottom: active ? '1.5px solid #6b6b6b' : '1.5px solid transparent',
                color: active ? '#6b6b6b' : 'rgba(10,10,10,0.4)', fontSize: 12, fontWeight: active ? 600 : 400,
                letterSpacing: '0.05em', fontFamily: "'Helvetica Neue', Arial, sans-serif", transition: 'all 0.2s',
              }}>
                {lang === 'es' ? mode.es : mode.en}
              </button>
            );
          })}
        </div>
      </div>

      {/* m² */}
      <div style={{ marginBottom: 28 }}>
        <label style={S.label}>
          {lang === 'es' ? '¿Cuántos m² tiene tu espacio?' : 'How many m² is your space?'}
        </label>
        <div style={{ position: 'relative' }}>
          <input type="number" value={sqm || ''} onChange={e => update('sqm', parseFloat(e.target.value) || 0)}
            placeholder="200"
            style={{ ...S.input, paddingRight: 44, colorScheme: 'light', appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'textfield' }} />
          <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: 'rgba(240,237,232,0.35)' }}>m²</span>
        </div>
      </div>

      {/* Corridor */}
      <div style={{ marginBottom: 28 }}>
        <label style={S.label}>
           {spaceMode === 'have_space' ? (lang === 'es' ? 'Zona / colonia' : 'Zone / neighborhood') : (lang === 'es' ? 'Zona preferida' : 'Preferred zone')}
           <span style={{ color: 'rgba(10,10,10,0.5)', marginLeft: 8 }}>{lang === 'es' ? '(opcional)' : '(optional)'}</span>
         </label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'rgba(0,0,0,0.06)' }}>
          {corridors.map(c => {
            const active = corridor === c;
            return (
              <button key={c} onClick={() => update('corridor', corridor === c ? '' : c)} style={{
                background: active ? 'rgba(100,100,100,0.08)' : '#f8f7f4', padding: '10px 14px', border: 'none', cursor: 'pointer',
                color: active ? '#6b6b6b' : 'rgba(10,10,10,0.45)', fontSize: 12, textAlign: 'left',
                fontFamily: "'Helvetica Neue', Arial, sans-serif", transition: 'all 0.2s',
                borderLeft: active ? '1.5px solid #6b6b6b' : '1.5px solid transparent',
              }}>{c}</button>
            );
          })}
        </div>
      </div>

      <div style={S.divider} />

      {/* Team */}
      <div style={{ marginBottom: 28 }}>
        <span style={S.sectionTitle}>{lang === 'es' ? 'Tu equipo' : 'Your team'}</span>
        <Counter label={lang === 'es' ? 'Directores' : 'Directors'} value={directors || 0} onChange={v => update('directors', v)} />
        <Counter label={lang === 'es' ? 'Gerentes' : 'Managers'} value={managers || 0} onChange={v => update('managers', v)} />
        <Counter label={lang === 'es' ? 'Operativos' : 'Operatives'} value={operatives || 0} onChange={v => update('operatives', v)} />
      </div>

      <div style={S.divider} />

      {/* Amenities — remove sqm sublabels since pricing is now from DesignPricing */}
      <div>
        <span style={S.sectionTitle}>{lang === 'es' ? 'Amenidades' : 'Amenities'}</span>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'rgba(0,0,0,0.06)' }}>
          {AMENITY_DEFS.map(amenity => {
            const isOn = (selectedAmenities || []).includes(amenity.key);
            const count = amenityCounts?.[amenity.key] || 1;
            const label = lang === 'es' ? amenity.es : amenity.en;
            return (
              <div key={amenity.key} style={{
                background: isOn ? 'rgba(100,100,100,0.05)' : '#f8f7f4', padding: '12px 16px',
                borderLeft: isOn ? '1.5px solid #6b6b6b' : '1.5px solid transparent',
                cursor: 'pointer', transition: 'all 0.2s',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} onClick={() => toggleAmenity(amenity.key)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 14, height: 14, border: `0.5px solid ${isOn ? '#6b6b6b' : 'rgba(0,0,0,0.2)'}`, background: isOn ? '#6b6b6b' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {isOn && <span style={{ fontSize: 9, color: '#0a0a0a', fontWeight: 700 }}>✓</span>}
                    </div>
                    <span style={{ fontSize: 12, color: isOn ? '#0a0a0a' : 'rgba(10,10,10,0.45)', fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>{label}</span>
                  </div>
                </div>
                {amenity.countable && isOn && (
                   <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                     <button onClick={() => updateAmenityCount(amenity.key, Math.max(1, count - 1))}
                       style={{ width: 24, height: 24, background: 'rgba(0,0,0,0.06)', border: '0.5px solid rgba(0,0,0,0.1)', color: '#0a0a0a', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       <Minus size={10} />
                     </button>
                     <input type="number" min="1" value={count} onChange={e => updateAmenityCount(amenity.key, Math.max(1, parseInt(e.target.value) || 1))}
                       style={{ width: 32, textAlign: 'center', fontSize: 13, fontWeight: 700, color: '#6b6b6b', background: 'transparent', border: 'none', borderBottom: '0.5px solid rgba(100,100,100,0.3)', appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'textfield', outline: 'none' }} />
                     <button onClick={() => updateAmenityCount(amenity.key, count + 1)}
                       style={{ width: 24, height: 24, background: 'rgba(100,100,100,0.15)', border: '0.5px solid rgba(100,100,100,0.3)', color: '#6b6b6b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       <Plus size={10} />
                     </button>
                   </div>
                 )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}