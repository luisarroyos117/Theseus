import React from 'react';
import { useLanguage } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Building2, Search, Minus, Plus, Users, MapPin } from 'lucide-react';

const corridors = [
  'Polanco', 'Reforma', 'Santa Fe', 'Insurgentes Sur', 'Lomas de Chapultepec',
  'Del Valle', 'Roma / Condesa', 'Bosque de las Lomas', 'Interlomas', 'Periférico Sur'
];

const amenities = [
  { key: 'reception', sqm: 25 },
  { key: 'kitchen', sqm: 20 },
  { key: 'dining', sqm: 40 },
  { key: 'meeting', sqm: 30, countable: true },
  { key: 'bathrooms', sqm: 15, countable: true },
  { key: 'server', sqm: 12 },
  { key: 'lounge', sqm: 35 },
];

function Counter({ value, onChange, label, sublabel }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <span className="font-body font-medium text-foreground">{label}</span>
        {sublabel && <span className="text-sm text-muted-foreground ml-2 font-body">({sublabel})</span>}
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={() => onChange(Math.max(0, value - 1))}
          disabled={value <= 0}
        >
          <Minus className="w-3 h-3" />
        </Button>
        <span className="w-8 text-center font-body font-semibold text-foreground">{value}</span>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={() => onChange(value + 1)}
        >
          <Plus className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}

export default function TeamAmenities({ config, onChange }) {
  const { t, lang } = useLanguage();
  const { spaceMode, sqm, corridor, directors, managers, operatives, selectedAmenities, amenityCounts } = config;

  const update = (key, val) => onChange({ ...config, [key]: val });

  const toggleAmenity = (key) => {
    const current = selectedAmenities || [];
    if (current.includes(key)) {
      update('selectedAmenities', current.filter(a => a !== key));
    } else {
      update('selectedAmenities', [...current, key]);
    }
  };

  const updateAmenityCount = (key, val) => {
    update('amenityCounts', { ...(amenityCounts || {}), [key]: val });
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-heading font-semibold text-foreground">{t('step.3')}</h2>
        <div className="w-16 h-0.5 bg-primary mx-auto mt-4" />
      </div>

      {/* Space mode toggle */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
        <button
          onClick={() => update('spaceMode', 'have_space')}
          className={`p-5 rounded-lg border text-center transition-all ${
            spaceMode === 'have_space' ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/30'
          }`}
        >
          <Building2 className={`w-6 h-6 mx-auto mb-2 ${spaceMode === 'have_space' ? 'text-primary' : 'text-muted-foreground'}`} />
          <span className="font-body font-medium text-sm">{t('space.have')}</span>
        </button>
        <button
          onClick={() => update('spaceMode', 'looking_for_space')}
          className={`p-5 rounded-lg border text-center transition-all ${
            spaceMode === 'looking_for_space' ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/30'
          }`}
        >
          <Search className={`w-6 h-6 mx-auto mb-2 ${spaceMode === 'looking_for_space' ? 'text-primary' : 'text-muted-foreground'}`} />
          <span className="font-body font-medium text-sm">{t('space.looking')}</span>
        </button>
      </div>

      {/* Conditional input */}
      <motion.div layout className="max-w-lg mx-auto">
        {spaceMode === 'have_space' ? (
          <div>
            <Label className="font-body text-sm text-muted-foreground">{t('space.sqm')}</Label>
            <Input
              type="number"
              value={sqm || ''}
              onChange={e => update('sqm', parseFloat(e.target.value) || 0)}
              className="mt-1 bg-card border-border font-body text-lg"
              placeholder="250"
            />
          </div>
        ) : (
          <div>
            <Label className="font-body text-sm text-muted-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4" /> {t('space.corridor')}
            </Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {corridors.map(c => (
                <button
                  key={c}
                  onClick={() => update('corridor', c)}
                  className={`px-3 py-2 rounded-md text-sm font-body transition-all ${
                    corridor === c ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Team counters */}
      <div className="max-w-lg mx-auto">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          {lang === 'es' ? 'Tu Equipo' : 'Your Team'}
        </h3>
        <div className="bg-card rounded-lg border border-border p-4 divide-y divide-border">
          <Counter
            label={t('space.directors')}
            sublabel={`20 ${t('space.sqm_each')}`}
            value={directors || 0}
            onChange={v => update('directors', v)}
          />
          <Counter
            label={t('space.managers')}
            sublabel={`12 ${t('space.sqm_each')}`}
            value={managers || 0}
            onChange={v => update('managers', v)}
          />
          <Counter
            label={t('space.operatives')}
            sublabel={`7 ${t('space.sqm_each')}`}
            value={operatives || 0}
            onChange={v => update('operatives', v)}
          />
        </div>
      </div>

      {/* Amenities */}
      <div className="max-w-lg mx-auto">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
          {lang === 'es' ? 'Amenidades' : 'Amenities'}
        </h3>
        <div className="bg-card rounded-lg border border-border p-4 space-y-3">
          {amenities.map(amenity => {
            const isOn = (selectedAmenities || []).includes(amenity.key);
            const count = amenityCounts?.[amenity.key] || 1;
            return (
              <div key={amenity.key} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3 flex-1">
                  <Switch checked={isOn} onCheckedChange={() => toggleAmenity(amenity.key)} />
                  <div>
                    <span className="font-body font-medium text-foreground text-sm">{t(`amenity.${amenity.key}`)}</span>
                    <span className="text-xs text-muted-foreground ml-2 font-body">
                      {amenity.sqm}m² {amenity.countable ? (lang === 'es' ? 'c/u' : 'each') : ''}
                    </span>
                  </div>
                </div>
                {amenity.countable && isOn && (
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="h-7 w-7 rounded-full" onClick={() => updateAmenityCount(amenity.key, Math.max(1, count - 1))}>
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-6 text-center text-sm font-body font-semibold">{count}</span>
                    <Button variant="outline" size="icon" className="h-7 w-7 rounded-full" onClick={() => updateAmenityCount(amenity.key, count + 1)}>
                      <Plus className="w-3 h-3" />
                    </Button>
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