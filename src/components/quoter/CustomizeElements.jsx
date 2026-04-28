import React, { useState } from 'react';
import { useLanguage } from '@/lib/i18n';
import { motion, AnimatePresence } from 'framer-motion';
import { Switch } from '@/components/ui/switch';
import { Layers, PenTool, Sofa, Wind, Monitor, Zap } from 'lucide-react';

const CATEGORIES = [
  { key: 'walls', icon: Layers, en: 'Walls', es: 'Muros' },
  { key: 'floors', icon: Layers, en: 'Floors', es: 'Pisos' },
  { key: 'ceilings', icon: Layers, en: 'Ceilings', es: 'Plafones' },
  { key: 'furniture', icon: Sofa, en: 'Furniture', es: 'Mobiliario' },
  { key: 'blinds', icon: PenTool, en: 'Blinds & Curtains', es: 'Persianas y Cortinas' },
  { key: 'technology', icon: Monitor, en: 'Technology', es: 'Tecnología' },
  { key: 'installations', icon: Zap, en: 'Installations', es: 'Instalaciones' },
];

export default function CustomizeElements({ products, selectedProducts, onToggleProduct }) {
  const { lang } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('walls');

  const activeProducts = products.filter(p => p.category === activeCategory && p.active !== false);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-heading font-semibold text-foreground">
          {lang === 'es' ? 'Personaliza los Elementos' : 'Customize Elements'}
        </h2>
        <p className="text-muted-foreground font-body mt-2 text-sm">
          {lang === 'es' ? 'Activa o desactiva elementos del diseño' : 'Toggle design elements on or off'}
        </p>
        <div className="w-16 h-0.5 bg-primary mx-auto mt-4" />
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 justify-center">
        {CATEGORIES.map(cat => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-body transition-all border ${
                isActive ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {lang === 'es' ? cat.es : cat.en}
            </button>
          );
        })}
      </div>

      {/* Products */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="max-w-2xl mx-auto space-y-2"
        >
          {activeProducts.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground font-body text-sm">
              {lang === 'es' ? 'No hay productos en esta categoría' : 'No products in this category'}
            </div>
          ) : (
            activeProducts.map(product => {
              const isOn = selectedProducts.includes(product.id);
              const name = lang === 'es' ? product.name_es : product.name_en;
              const desc = lang === 'es' ? product.description_es : product.description_en;
              return (
                <div
                  key={product.id}
                  onClick={() => onToggleProduct(product.id)}
                  className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all ${
                    isOn ? 'border-primary/50 bg-primary/5' : 'border-border bg-card hover:border-border/80'
                  }`}
                >
                  {product.image_url && (
                    <img src={product.image_url} alt={name} className="w-14 h-14 rounded-md object-cover object-center flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-body font-medium text-foreground text-sm">{name}</p>
                    {desc && <p className="text-xs text-muted-foreground font-body mt-0.5 truncate">{desc}</p>}
                    {product.price_usd > 0 && (
                      <p className="text-xs text-primary font-body mt-1 font-medium">+${product.price_usd?.toLocaleString()} USD</p>
                    )}
                  </div>
                  <Switch checked={isOn} onCheckedChange={() => onToggleProduct(product.id)} onClick={e => e.stopPropagation()} />
                </div>
              );
            })
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}