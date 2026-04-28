import React, { useState } from 'react';
import { useLanguage } from '@/lib/i18n';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Layers, Grid3x3, Columns3, Armchair, Blinds, Monitor, Wrench } from 'lucide-react';

const categories = [
  { key: 'walls', icon: Layers },
  { key: 'floors', icon: Grid3x3 },
  { key: 'ceilings', icon: Columns3 },
  { key: 'furniture', icon: Armchair },
  { key: 'blinds', icon: Blinds },
  { key: 'technology', icon: Monitor },
  { key: 'installations', icon: Wrench },
];

export default function CustomizeSpace({ products, selectedProducts, onToggleProduct }) {
  const { t, lang } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('walls');

  const filteredProducts = (products || []).filter(p => p.category === activeCategory && p.active !== false);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-heading font-semibold text-foreground">{t('step.2')}</h2>
        <div className="w-16 h-0.5 bg-primary mx-auto mt-4" />
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categories.map(cat => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-body font-medium transition-all ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{t(`cat.${cat.key}`)}</span>
            </button>
          );
        })}
      </div>

      {/* Products grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filteredProducts.map(product => {
            const isSelected = selectedProducts.includes(product.id);
            return (
              <button
                key={product.id}
                onClick={() => onToggleProduct(product.id)}
                className={`group relative p-5 rounded-lg text-left transition-all border ${
                  isSelected
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-card hover:border-primary/30'
                }`}
              >
                {product.image_url && (
                  <div className="aspect-video rounded-md overflow-hidden mb-3 bg-muted">
                    <img src={product.image_url} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-body font-semibold text-foreground">
                      {lang === 'es' ? product.name_es : product.name_en}
                    </h4>
                    <p className="text-sm text-muted-foreground font-body mt-1">
                      {lang === 'es' ? product.description_es : product.description_en}
                    </p>
                    {product.price_usd > 0 && (
                      <p className="text-sm text-primary font-semibold mt-2 font-body">
                        ${product.price_usd?.toLocaleString()} USD
                      </p>
                    )}
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-3 mt-1 transition-all ${
                    isSelected ? 'bg-primary border-primary' : 'border-muted-foreground/30'
                  }`}>
                    {isSelected && <Check className="w-4 h-4 text-primary-foreground" />}
                  </div>
                </div>
              </button>
            );
          })}
          {filteredProducts.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground font-body">
              {lang === 'es' ? 'No hay productos en esta categoría' : 'No products in this category'}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}