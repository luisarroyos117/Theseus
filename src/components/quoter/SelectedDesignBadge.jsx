import React from 'react';
import { useLanguage } from '@/lib/i18n';
import { X } from 'lucide-react';

const STYLE_LABELS = {
  modern: { en: 'Modern', es: 'Moderno' },
  industrial: { en: 'Industrial', es: 'Industrial' },
  classic: { en: 'Classic', es: 'Clásico' },
  biophilic: { en: 'Biophilic', es: 'Biofílico' },
  minimalist: { en: 'Minimalist', es: 'Minimalista' },
};

function getTierLabel(pricePerSqm, lang) {
  if (!pricePerSqm) return null;
  if (pricePerSqm < 300) return lang === 'es' ? 'Esencial' : 'Essential';
  if (pricePerSqm < 500) return 'Plus';
  return 'Premium';
}

export default function SelectedDesignBadge({ design, onClear }) {
  const { lang } = useLanguage();
  if (!design) return null;

  const name = lang === 'es' ? design.name_es : design.name_en;
  const styleLabel = STYLE_LABELS[design.style_key]?.[lang] || design.style_key;
  const tierLabel = getTierLabel(design.price_per_sqm, lang);

  return (
    <div className="flex items-center justify-between bg-primary/8 border border-primary/25 rounded-lg px-4 py-2.5 mb-6">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-muted-foreground font-body">
          {lang === 'es' ? 'Diseño seleccionado:' : 'Selected design:'}
        </span>
        <span className="text-sm font-body font-semibold text-foreground">
          {name}
        </span>
        <span className="text-muted-foreground text-xs">·</span>
        <span className="text-xs text-primary font-body capitalize">{styleLabel}</span>
        {tierLabel && (
          <>
            <span className="text-muted-foreground text-xs">·</span>
            <span className="text-xs text-primary font-body">{tierLabel}</span>
          </>
        )}
        {design.price_per_sqm && (
          <>
            <span className="text-muted-foreground text-xs">·</span>
            <span className="text-xs text-muted-foreground font-body">${design.price_per_sqm?.toLocaleString()} USD/m²</span>
          </>
        )}
      </div>
      <button
        onClick={onClear}
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors font-body ml-3 flex-shrink-0"
      >
        <X className="w-3.5 h-3.5" />
        {lang === 'es' ? 'Cambiar diseño' : 'Change design'}
      </button>
    </div>
  );
}