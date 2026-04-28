import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/lib/i18n';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, ArrowRight, ChevronLeft, ChevronRight, Ruler, DollarSign } from 'lucide-react';

// Budget filter now filters by price_per_sqm (quality tier ranges)
const BUDGET_FILTERS = [
  { key: 'all', en: 'All Levels', es: 'Todos los Niveles' },
  { key: 'essential', en: 'Esencial ($200–$300/m²)', es: 'Esencial ($200–$300/m²)' },
  { key: 'plus', en: 'Plus ($300–$500/m²)', es: 'Plus ($300–$500/m²)' },
  { key: 'premium', en: 'Premium ($500+/m²)', es: 'Premium ($500+/m²)' },
];

function inBudget(pricePerSqm, key) {
  if (key === 'all') return true;
  if (key === 'essential') return pricePerSqm >= 200 && pricePerSqm < 300;
  if (key === 'plus') return pricePerSqm >= 300 && pricePerSqm < 500;
  if (key === 'premium') return pricePerSqm >= 500;
  return true;
}

function getTierLabel(pricePerSqm, lang) {
  if (!pricePerSqm) return null;
  if (pricePerSqm < 300) return lang === 'es' ? 'Esencial' : 'Essential';
  if (pricePerSqm < 500) return 'Plus';
  return 'Premium';
}

const PLACEHOLDER_IMAGES = [
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
  'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80',
  'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80',
  'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=800&q=80',
  'https://images.unsplash.com/photo-1568992688065-536aad8a12f6?w=800&q=80',
  'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80',
];

function DesignModal({ design, lang, onClose, onSelect, styleLabel }) {
  const [photoIdx, setPhotoIdx] = useState(0);
  const photos = design.photos?.length ? design.photos : [PLACEHOLDER_IMAGES[0], PLACEHOLDER_IMAGES[1], PLACEHOLDER_IMAGES[2]];
  const name = lang === 'es' ? design.name_es : design.name_en;
  const desc = lang === 'es' ? design.description_es : design.description_en;
  const elements = lang === 'es' ? design.included_elements_es : design.included_elements_en;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-card border border-border rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Photo carousel */}
        <div className="relative h-64 sm:h-80 rounded-t-xl overflow-hidden">
          <img src={photos[photoIdx]} alt={name} className="w-full h-full object-cover" />
          {photos.length > 1 && (
            <>
              <button
                onClick={() => setPhotoIdx(i => (i - 1 + photos.length) % photos.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={() => setPhotoIdx(i => (i + 1) % photos.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {photos.map((_, i) => (
                  <button key={i} onClick={() => setPhotoIdx(i)}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${i === photoIdx ? 'bg-primary w-4' : 'bg-white/50'}`}
                  />
                ))}
              </div>
            </>
          )}
          <button onClick={onClose} className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-primary/15 text-primary border-primary/30 font-body text-xs">
                {styleLabel(design.style_key)}
              </Badge>
            </div>
            <h2 className="text-2xl font-heading font-bold text-foreground">{name}</h2>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground font-body">
              <span className="flex items-center gap-1"><Ruler className="w-3.5 h-3.5" /> {design.size_min_sqm}–{design.size_max_sqm} m²</span>
              <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" />
                {lang === 'es' ? 'Desde' : 'From'} ${design.price_from_usd?.toLocaleString()} USD
              </span>
            </div>
          </div>

          {desc && (
            <div>
              <h3 className="text-sm font-body font-semibold text-foreground uppercase tracking-wider mb-2">
                {lang === 'es' ? 'Descripción' : 'Description'}
              </h3>
              <p className="text-sm text-muted-foreground font-body leading-relaxed">{desc}</p>
            </div>
          )}

          {elements && (
            <div>
              <h3 className="text-sm font-body font-semibold text-foreground uppercase tracking-wider mb-2">
                {lang === 'es' ? 'Elementos Incluidos' : 'Included Elements'}
              </h3>
              <ul className="space-y-1">
                {elements.split('\n').filter(Boolean).map((el, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground font-body">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                    {el.trim()}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Button
            onClick={() => { onSelect(design); onClose(); }}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-body font-semibold py-5 gap-2"
          >
            {lang === 'es' ? 'Cotizar Este Diseño para Mi Espacio' : 'Quote This Design for My Space'}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function OfficeGallery({ designs, tiers, onSelect }) {
  const { lang } = useLanguage();
  const [styleFilter, setStyleFilter] = useState('all');
  const [budgetFilter, setBudgetFilter] = useState('all');
  const [modalDesign, setModalDesign] = useState(null);

  const { data: officeStyles = [] } = useQuery({
    queryKey: ['officeStyles'],
    queryFn: () => base44.entities.OfficeStyle.list('style_key'),
  });

  const activeStyles = officeStyles.filter(s => s.active);
  const styleLabel = (key) => {
    const s = officeStyles.find(s => s.style_key === key);
    return s ? (lang === 'es' ? s.name_es : s.name_en) : key;
  };

  const filtered = designs
    .filter(d => d.active !== false)
    .filter(d => styleFilter === 'all' || d.style_key === styleFilter)
    .filter(d => inBudget(d.price_per_sqm || 0, budgetFilter))
    .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
          {lang === 'es' ? 'Proyectos de Oficina' : 'Office Projects'}
        </h2>
        <p className="text-muted-foreground font-body mt-3 max-w-xl mx-auto">
          {lang === 'es'
            ? 'Selecciona un diseño para calcular tu inversión'
            : 'Select a design to calculate your investment'}
        </p>
        <div className="w-16 h-0.5 bg-primary mx-auto mt-4" />
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => setStyleFilter('all')}
            className={`px-4 py-1.5 rounded-full text-sm font-body transition-all border ${
              styleFilter === 'all'
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
            }`}
          >
            {lang === 'es' ? 'Todos los Estilos' : 'All Styles'}
          </button>
          {activeStyles.map(s => (
            <button
              key={s.style_key}
              onClick={() => setStyleFilter(s.style_key)}
              className={`px-4 py-1.5 rounded-full text-sm font-body transition-all border ${
                styleFilter === s.style_key
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
              }`}
            >
              {lang === 'es' ? s.name_es : s.name_en}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          {BUDGET_FILTERS.map(b => (
            <button
              key={b.key}
              onClick={() => setBudgetFilter(b.key)}
              className={`px-4 py-1.5 rounded-full text-sm font-body transition-all border ${
                budgetFilter === b.key
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
              }`}
            >
              {lang === 'es' ? b.es : b.en}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filtered.map((design, i) => {
            const name = lang === 'es' ? design.name_es : design.name_en;
            const img = design.photos?.[0] || PLACEHOLDER_IMAGES[i % PLACEHOLDER_IMAGES.length];
            return (
              <motion.div
                key={design.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 transition-all hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="relative h-52 overflow-hidden">
                  <img src={img} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <Badge className="absolute top-3 left-3 bg-black/50 text-white border-0 backdrop-blur-sm font-body text-xs">
                    {styleLabel(design.style_key)}
                  </Badge>
                </div>
                <div className="p-5 space-y-3">
                  <h3 className="font-heading font-semibold text-foreground text-lg">{name}</h3>
                  <div className="flex items-center justify-between text-sm text-muted-foreground font-body">
                    <span className="flex items-center gap-1"><Ruler className="w-3.5 h-3.5" /> {design.size_min_sqm}–{design.size_max_sqm} m²</span>
                    {design.price_per_sqm ? (
                      <span className="text-primary font-medium">
                        ${design.price_per_sqm?.toLocaleString()} USD/m²
                      </span>
                    ) : (
                      <span className="text-primary font-medium">
                        {lang === 'es' ? 'Desde' : 'From'} ${design.price_from_usd?.toLocaleString()}
                      </span>
                    )}
                  </div>
                  {design.price_per_sqm && (() => {
                    const tierLabel = getTierLabel(design.price_per_sqm, lang);
                    return tierLabel ? (
                      <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-body">
                        {tierLabel}
                      </span>
                    ) : null;
                  })()}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setModalDesign(design)}
                    className="w-full font-body border-border hover:border-primary hover:text-primary transition-colors"
                  >
                    {lang === 'es' ? 'Ver Detalles' : 'See Details'}
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground font-body">
          {lang === 'es' ? 'No hay proyectos con estos filtros' : 'No projects match these filters'}
        </div>
      )}

      <AnimatePresence>
        {modalDesign && (
          <DesignModal
            design={modalDesign}
            lang={lang}
            onClose={() => setModalDesign(null)}
            onSelect={onSelect}
            styleLabel={styleLabel}
          />
        )}
      </AnimatePresence>
    </div>
  );
}