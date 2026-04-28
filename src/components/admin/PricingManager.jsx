import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLanguage } from '@/lib/i18n';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Save, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function PricingManager() {
  const { t, lang } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editData, setEditData] = useState({});

  const { data: pricing, isLoading } = useQuery({
    queryKey: ['stylePricing'],
    queryFn: () => base44.entities.StylePricing.list(),
    initialData: [],
  });

  useEffect(() => {
    if (pricing.length > 0) {
      const map = {};
      pricing.forEach(p => { map[p.style_key] = { ...p }; });
      setEditData(map);
    }
  }, [pricing]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      for (const key of Object.keys(editData)) {
        const item = editData[key];
        if (item.id) {
          await base44.entities.StylePricing.update(item.id, {
            base_price_per_sqm: parseFloat(item.base_price_per_sqm) || 0,
            pct_design: parseFloat(item.pct_design) || 0,
            pct_construction: parseFloat(item.pct_construction) || 0,
            pct_furniture: parseFloat(item.pct_furniture) || 0,
            pct_finishes: parseFloat(item.pct_finishes) || 0,
            pct_electrical: parseFloat(item.pct_electrical) || 0,
          });
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stylePricing'] });
      toast({ title: lang === 'es' ? 'Precios guardados' : 'Prices saved' });
    },
  });

  const updateField = (styleKey, field, value) => {
    setEditData(prev => ({
      ...prev,
      [styleKey]: { ...prev[styleKey], [field]: value },
    }));
  };

  const styleLabels = { modern: 'Modern', industrial: 'Industrial', classic: 'Classic', biophilic: 'Biophilic', minimalist: 'Minimalist' };
  const fields = [
    { key: 'base_price_per_sqm', label: 'USD/m²' },
    { key: 'pct_design', label: lang === 'es' ? '% Diseño' : '% Design' },
    { key: 'pct_construction', label: lang === 'es' ? '% Obra' : '% Construction' },
    { key: 'pct_furniture', label: lang === 'es' ? '% Mobiliario' : '% Furniture' },
    { key: 'pct_finishes', label: lang === 'es' ? '% Acabados' : '% Finishes' },
    { key: 'pct_electrical', label: lang === 'es' ? '% Eléctrico' : '% Electrical' },
  ];

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <table className="w-full text-sm font-body">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-3 text-muted-foreground font-medium">{lang === 'es' ? 'Estilo' : 'Style'}</th>
              {fields.map(f => (
                <th key={f.key} className="text-left py-3 px-3 text-muted-foreground font-medium">{f.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.keys(styleLabels).map(styleKey => {
              const row = editData[styleKey];
              if (!row) return null;
              return (
                <tr key={styleKey} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="py-3 px-3 font-medium text-foreground capitalize">{t(`style.${styleKey}`)}</td>
                  {fields.map(f => (
                    <td key={f.key} className="py-3 px-3">
                      <Input
                       type="number"
                       value={row[f.key] ?? ''}
                       onChange={e => updateField(styleKey, f.key, e.target.value)}
                       className="h-8 w-24 bg-card border-border text-sm"
                       autoComplete="off"
                      />
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Button
        onClick={() => saveMutation.mutate()}
        disabled={saveMutation.isPending}
        className="bg-primary text-primary-foreground hover:bg-primary/90 font-body"
      >
        {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
        {t('admin.save')}
      </Button>
    </div>
  );
}