import React from 'react';
import { useLanguage } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { Check, Gem, Star, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const TIER_CONFIG = {
  essential: {
    icon: Star,
    color: 'text-sky-400',
    bg: 'bg-sky-400/10',
    border: 'border-sky-400/40',
    activeBorder: 'border-sky-400',
    activeRing: 'ring-sky-400/30',
    badgeClass: 'bg-sky-400/15 text-sky-400 border-sky-400/30',
  },
  plus: {
    icon: Gem,
    color: 'text-primary',
    bg: 'bg-primary/10',
    border: 'border-primary/40',
    activeBorder: 'border-primary',
    activeRing: 'ring-primary/30',
    badgeClass: 'bg-primary/15 text-primary border-primary/30',
  },
  premium: {
    icon: Sparkles,
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
    border: 'border-purple-400/40',
    activeBorder: 'border-purple-400',
    activeRing: 'ring-purple-400/30',
    badgeClass: 'bg-purple-400/15 text-purple-400 border-purple-400/30',
  },
};

// Fallback tiers if DB is empty
const FALLBACK_TIERS = [
  {
    tier_key: 'essential',
    name_es: 'Esencial',
    name_en: 'Essential',
    description_es: 'Materiales estándar. Funcional, eficiente y bien diseñado.',
    description_en: 'Standard quality materials. Functional, efficient, well-designed.',
    price_min_usd: 200,
    price_max_usd: 300,
  },
  {
    tier_key: 'plus',
    name_es: 'Plus',
    name_en: 'Plus',
    description_es: 'Materiales de nivel medio-alto. Mejores acabados en pisos, muros y mobiliario.',
    description_en: 'Mid-to-high level materials. Better finishes: floors, walls, furniture.',
    price_min_usd: 300,
    price_max_usd: 500,
  },
  {
    tier_key: 'premium',
    name_es: 'Premium',
    name_en: 'Premium',
    description_es: 'Materiales de lujo: mármol, madera importada, mobiliario de diseñador. Llave en mano de clase mundial.',
    description_en: 'Luxury materials: marble, imported wood, designer furniture. World-class turnkey.',
    price_min_usd: 500,
    price_max_usd: 1100,
  },
];

export default function QualityTierSelector({ tiers, selected, onSelect }) {
  const { lang } = useLanguage();

  const displayTiers = tiers?.length ? tiers : FALLBACK_TIERS;

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-heading font-semibold text-foreground">
          {lang === 'es' ? 'Nivel de Calidad' : 'Quality Level'}
        </h2>
        <p className="text-muted-foreground font-body mt-3 max-w-lg mx-auto text-sm">
          {lang === 'es'
            ? 'Todo incluye diseño, obra, mobiliario, instalaciones y acabados. La diferencia está en la calidad de los materiales.'
            : 'Everything includes design, construction, furniture, installations & finishes. The difference is the quality of materials.'}
        </p>
        <div className="w-16 h-0.5 bg-primary mx-auto mt-4" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {displayTiers.map((tier, i) => {
          const cfg = TIER_CONFIG[tier.tier_key] || TIER_CONFIG.plus;
          const Icon = cfg.icon;
          const isSelected = selected === tier.tier_key;
          const name = lang === 'es' ? tier.name_es : tier.name_en;
          const desc = lang === 'es' ? tier.description_es : tier.description_en;

          return (
            <motion.button
              key={tier.tier_key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => onSelect(tier.tier_key)}
              className={`relative text-left rounded-xl border-2 p-6 transition-all duration-200 w-full
                ${isSelected
                  ? `${cfg.activeBorder} ring-4 ${cfg.activeRing} bg-card`
                  : `${cfg.border} bg-card hover:bg-card/80`
                }`}
            >
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-4 right-4 w-7 h-7 bg-primary rounded-full flex items-center justify-center"
                >
                  <Check className="w-4 h-4 text-primary-foreground" />
                </motion.div>
              )}

              <div className={`w-12 h-12 rounded-xl ${cfg.bg} flex items-center justify-center mb-4`}>
                <Icon className={`w-6 h-6 ${cfg.color}`} />
              </div>

              <h3 className="text-xl font-heading font-bold text-foreground mb-1">{name}</h3>

              <Badge className={`${cfg.badgeClass} font-body text-xs mb-4`}>
                {lang === 'es' ? 'Desde' : 'From'} ${tier.price_min_usd} USD/m²
              </Badge>

              <p className="text-sm text-muted-foreground font-body leading-relaxed mb-4">
                {desc}
              </p>

              <div className="pt-4 border-t border-border space-y-1 text-xs font-body text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>{lang === 'es' ? 'Rango de inversión' : 'Investment range'}</span>
                  <span className={`font-semibold ${cfg.color}`}>
                    ${tier.price_min_usd}–${tier.price_max_usd} USD/m²
                  </span>
                </div>
                <p className="text-xs text-muted-foreground/70">
                  {lang === 'es' ? 'Incluye diseño, obra, mobiliario e instalaciones' : 'Includes design, construction, furniture & installations'}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}