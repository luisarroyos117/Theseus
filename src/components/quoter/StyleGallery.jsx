import React from 'react';
import { useLanguage } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const styles = [
  { key: 'modern', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=500&fit=crop' },
  { key: 'industrial', img: 'https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800&h=500&fit=crop' },
  { key: 'classic', img: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&h=500&fit=crop' },
  { key: 'biophilic', img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=500&fit=crop' },
  { key: 'minimalist', img: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&h=500&fit=crop' },
];

export default function StyleGallery({ selected, onSelect, styleImages }) {
  const { t } = useLanguage();

  const getImage = (key) => {
    const custom = styleImages?.find(si => si.style_key === key);
    if (custom?.image_url) return custom.image_url;
    return styles.find(s => s.key === key)?.img;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-heading font-semibold text-foreground">{t('step.1')}</h2>
        <div className="w-16 h-0.5 bg-primary mx-auto mt-4" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {styles.map((style, i) => (
          <motion.button
            key={style.key}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => onSelect(style.key)}
            className={`group relative rounded-lg overflow-hidden text-left transition-all duration-300 ${
              selected === style.key 
                ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' 
                : 'ring-1 ring-border hover:ring-primary/50'
            }`}
          >
            <div className="aspect-[16/10] relative overflow-hidden">
              <img
                src={getImage(style.key)}
                alt={t(`style.${style.key}`)}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              {selected === style.key && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-3 right-3 w-8 h-8 bg-primary rounded-full flex items-center justify-center"
                >
                  <Check className="w-5 h-5 text-primary-foreground" />
                </motion.div>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="text-xl font-heading font-semibold text-white mb-1">
                  {t(`style.${style.key}`)}
                </h3>
                <p className="text-sm text-white/70 font-body">
                  {t(`style.${style.key}.desc`)}
                </p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}