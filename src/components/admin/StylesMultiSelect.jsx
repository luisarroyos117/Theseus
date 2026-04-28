import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { getStyleLabel } from '@/lib/styleHelpers';

export default function StylesMultiSelect({ value = [], onChange, lang = 'en' }) {
  const { data: officeStyles = [] } = useQuery({
    queryKey: ['officeStyles'],
    queryFn: () => base44.entities.OfficeStyle.list('style_key'),
  });

  const activeStyles = officeStyles.filter(s => s.active);

  const handleToggle = (styleKey) => {
    const newValue = value.includes(styleKey)
      ? value.filter(s => s !== styleKey)
      : [...value, styleKey];
    onChange(newValue);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 20px' }}>
      {activeStyles.map(style => (
        <label key={style.style_key} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={value.includes(style.style_key)}
            onChange={() => handleToggle(style.style_key)}
            style={{ width: 18, height: 18, cursor: 'pointer' }}
          />
          <span style={{ fontSize: 14, color: '#333' }}>
            {lang === 'es' ? style.name_es : style.name_en}
          </span>
        </label>
      ))}
    </div>
  );
}