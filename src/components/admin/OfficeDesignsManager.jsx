import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLanguage } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Pencil, Trash2, Plus, Eye, EyeOff } from 'lucide-react';
import { useAdminToast, AdminToast } from '@/components/admin/AdminToast';
import StylesMultiSelect from '@/components/admin/StylesMultiSelect';
import { getDesignStyles, getStyleLabel } from '@/lib/styleHelpers';



const EMPTY = {
  name_en: '', name_es: '', style_key: '', styles: [],
  quality_tiers: [],
  price_per_sqm: 0, price_from_usd: 0,
  photos: ['', '', '', '', '', ''],
  description_en: '', description_es: '',
  included_elements_en: '', included_elements_es: '',
  active: true, display_order: 0,
};

const TIER_OPTIONS = ['essential', 'plus', 'premium'];

export default function OfficeDesignsManager() {
  const { lang } = useLanguage();
  const { toast: adminToast, show: showToast, dismiss: dismissToast } = useAdminToast();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);

  const { data: designs = [], isLoading } = useQuery({
    queryKey: ['officeDesigns'],
    queryFn: () => base44.entities.OfficeDesign.list('display_order'),
  });

  const { data: officeStyles = [] } = useQuery({
    queryKey: ['officeStyles'],
    queryFn: () => base44.entities.OfficeStyle.list('style_key'),
  });

  const styleLabels = (design) => {
    const styles = getDesignStyles(design);
    return styles.map(sk => getStyleLabel(sk, 'es')).join(' · ');
  };

  const saveMutation = useMutation({
    mutationFn: (d) => {
      const payload = { ...d, photos: d.photos.filter(Boolean) };
      return d.id ? base44.entities.OfficeDesign.update(d.id, payload) : base44.entities.OfficeDesign.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['officeDesigns'] });
      showToast(lang === 'es' ? 'Guardado' : 'Saved');
      setOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.OfficeDesign.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['officeDesigns'] }),
  });

  const toggleActive = (design) => {
    base44.entities.OfficeDesign.update(design.id, { active: !design.active })
      .then(() => queryClient.invalidateQueries({ queryKey: ['officeDesigns'] }));
  };

  const openNew = () => { setEditing({ ...EMPTY }); setOpen(true); };
  const openEdit = (d) => { setEditing({ ...d, photos: [...(d.photos || []), '', '', '', '', '', ''].slice(0, 6) }); setOpen(true); };

  const setPhoto = (idx, val) => {
    const photos = [...(editing.photos || [])];
    photos[idx] = val;
    setEditing({ ...editing, photos });
  };

  return (
    <div className="space-y-4">
      <AdminToast toast={adminToast} onDismiss={dismissToast} />
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-heading font-semibold" style={{ color: '#f0ede8', fontWeight: 700 }}>
          {lang === 'es' ? 'Proyectos de Oficina' : 'Office Projects'}
        </h2>
        <Button onClick={openNew} size="sm" className="gap-2" style={{ background: '#f0ede8', color: '#0a0a0a', fontWeight: 700 }}>
          <Plus className="w-4 h-4" /> {lang === 'es' ? 'Nuevo Proyecto' : 'New Project'}
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-10 font-body text-sm" style={{ color: 'rgba(240,237,232,0.6)' }}>
          {lang === 'es' ? 'Cargando...' : 'Loading...'}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg" style={{ border: '0.5px solid rgba(255,255,255,0.1)' }}>
          <table className="w-full text-sm font-body">
            <thead>
              <tr style={{ borderBottom: '0.5px solid rgba(255,255,255,0.1)', background: '#1a1a1a' }}>
                <th className="text-left px-4 py-3 font-medium" style={{ color: '#f0ede8', fontWeight: 700 }}>Orden</th>
                  <th className="text-left px-4 py-3 font-medium" style={{ color: '#f0ede8', fontWeight: 700 }}>Nombre</th>
                  <th className="text-left px-4 py-3 font-medium" style={{ color: '#f0ede8', fontWeight: 700 }}>Estilo</th>
                  <th className="text-left px-4 py-3 font-medium" style={{ color: '#f0ede8', fontWeight: 700 }}>Desde (USD)</th>
                  <th className="text-left px-4 py-3 font-medium" style={{ color: '#f0ede8', fontWeight: 700 }}>Activo</th>
                  <th className="text-left px-4 py-3 font-medium" style={{ color: '#f0ede8', fontWeight: 700 }}>Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              {designs.map((d, idx) => (
                <tr key={d.id} style={{ background: idx % 2 === 0 ? '#0f0f0f' : '#111111', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'} onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? '#0f0f0f' : '#111111'}>
                  <td className="px-4 py-3" style={{ color: 'rgba(240,237,232,0.6)' }}>{d.display_order}</td>
                  <td className="px-4 py-3 font-medium" style={{ color: '#f0ede8', fontWeight: 600 }}>{lang === 'es' ? d.name_es : d.name_en}</td>
                  <td className="px-4 py-3">
                    <Badge className="border text-xs" style={{ background: 'rgba(255,255,255,0.1)', color: '#f0ede8', borderColor: 'rgba(255,255,255,0.2)' }}>{styleLabels(d)}</Badge>
                  </td>
                  <td className="px-4 py-3 font-medium" style={{ color: '#fbbf24' }}>${d.price_per_sqm?.toLocaleString()} USD/m²</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleActive(d)} style={{ color: 'rgba(240,237,232,0.6)' }} onMouseEnter={e => e.currentTarget.style.color = '#f0ede8'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(240,237,232,0.6)'}>
                      {d.active ? <Eye className="w-4 h-4" style={{ color: '#f0ede8' }} /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8" style={{ color: 'rgba(240,237,232,0.6)' }} onClick={() => openEdit(d)}>
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" style={{ color: '#ff6b6b' }} onClick={() => deleteMutation.mutate(d.id)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" style={{ background: '#1a1a1a', border: '0.5px solid rgba(255,255,255,0.1)' }}>
          <DialogHeader>
            <DialogTitle className="font-heading" style={{ color: '#f0ede8', fontWeight: 700 }}>
              {editing?.id ? (lang === 'es' ? 'Editar Proyecto' : 'Edit Project') : (lang === 'es' ? 'Nuevo Proyecto' : 'New Project')}
            </DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs" style={{ color: 'rgba(240,237,232,0.6)', fontWeight: 700 }}>Nombre ES</Label>
                  <Input value={editing.name_es} onChange={e => setEditing({ ...editing, name_es: e.target.value })} className="mt-1" style={{ background: '#222222', color: '#f0ede8', border: '0.5px solid rgba(255,255,255,0.2)', fontWeight: 600 }} autoComplete="off" />
                </div>
                <div>
                  <Label className="text-xs" style={{ color: 'rgba(240,237,232,0.6)', fontWeight: 700 }}>Name EN</Label>
                  <Input value={editing.name_en} onChange={e => setEditing({ ...editing, name_en: e.target.value })} className="mt-1" style={{ background: '#222222', color: '#f0ede8', border: '0.5px solid rgba(255,255,255,0.2)', fontWeight: 600 }} autoComplete="off" />
                </div>
              </div>

              <div>
                <Label className="text-xs mb-2 block" style={{ color: 'rgba(240,237,232,0.6)', fontWeight: 700 }}>Niveles de Calidad</Label>
                <div className="flex gap-3">
                  {TIER_OPTIONS.map(tk => {
                    const checked = (editing.quality_tiers || []).includes(tk);
                    return (
                      <label key={tk} className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            const current = editing.quality_tiers || [];
                            setEditing({
                              ...editing,
                              quality_tiers: checked ? current.filter(t => t !== tk) : [...current, tk],
                            });
                          }}
                          className="accent-primary"
                        />
                        <span className="text-sm font-body capitalize" style={{ color: '#f0ede8', fontWeight: 600 }}>{tk}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <Label className="text-xs mb-3 block" style={{ color: 'rgba(240,237,232,0.6)', fontWeight: 700 }}>Estilos (múltiples permitidos)</Label>
                <StylesMultiSelect value={editing.styles || []} onChange={v => setEditing({ ...editing, styles: v })} lang="es" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-xs" style={{ color: 'rgba(240,237,232,0.6)', fontWeight: 700 }}>Precio USD/m²</Label>
                  <Input type="number" value={editing.price_per_sqm} onChange={e => setEditing({ ...editing, price_per_sqm: +e.target.value })} className="mt-1" style={{ background: '#222222', color: '#f0ede8', border: '0.5px solid rgba(255,255,255,0.2)', fontWeight: 600 }} autoComplete="off" />
                </div>
                <div>
                  <Label className="text-xs" style={{ color: 'rgba(240,237,232,0.6)', fontWeight: 700 }}>Precio desde (USD total)</Label>
                  <Input type="number" value={editing.price_from_usd} onChange={e => setEditing({ ...editing, price_from_usd: +e.target.value })} className="mt-1" style={{ background: '#222222', color: '#f0ede8', border: '0.5px solid rgba(255,255,255,0.2)', fontWeight: 600 }} autoComplete="off" />
                </div>
                <div>
                  <Label className="text-xs" style={{ color: 'rgba(240,237,232,0.6)', fontWeight: 700 }}>Orden</Label>
                  <Input type="number" value={editing.display_order} onChange={e => setEditing({ ...editing, display_order: +e.target.value })} className="mt-1" style={{ background: '#222222', color: '#f0ede8', border: '0.5px solid rgba(255,255,255,0.2)', fontWeight: 600 }} autoComplete="off" />
                </div>
              </div>

              <div>
                <Label className="text-xs" style={{ color: 'rgba(240,237,232,0.6)', fontWeight: 700 }}>Fotos (URLs, hasta 6)</Label>
                <div className="space-y-2 mt-1">
                  {[0,1,2,3,4,5].map(i => (
                    <Input key={i} value={editing.photos?.[i] || ''} onChange={e => setPhoto(i, e.target.value)}
                      placeholder={`URL foto ${i+1}`} className="text-xs" style={{ background: '#222222', color: '#f0ede8', border: '0.5px solid rgba(255,255,255,0.2)', fontWeight: 600 }} autoComplete="off" />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs" style={{ color: 'rgba(240,237,232,0.6)', fontWeight: 700 }}>Descripción ES</Label>
                  <textarea value={editing.description_es} onChange={e => setEditing({ ...editing, description_es: e.target.value })}
                    rows={3} className="mt-1 w-full rounded-md px-3 py-2 text-sm font-body resize-none" style={{ background: '#222222', color: '#f0ede8', border: '0.5px solid rgba(255,255,255,0.2)', fontWeight: 600 }} autoComplete="off" />
                </div>
                <div>
                  <Label className="text-xs" style={{ color: 'rgba(240,237,232,0.6)', fontWeight: 700 }}>Description EN</Label>
                  <textarea value={editing.description_en} onChange={e => setEditing({ ...editing, description_en: e.target.value })}
                    rows={3} className="mt-1 w-full rounded-md px-3 py-2 text-sm font-body resize-none" style={{ background: '#222222', color: '#f0ede8', border: '0.5px solid rgba(255,255,255,0.2)', fontWeight: 600 }} autoComplete="off" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs" style={{ color: 'rgba(240,237,232,0.6)', fontWeight: 700 }}>Elementos incluidos ES (uno por línea)</Label>
                  <textarea value={editing.included_elements_es} onChange={e => setEditing({ ...editing, included_elements_es: e.target.value })}
                    rows={5} className="mt-1 w-full rounded-md px-3 py-2 text-sm font-body resize-none" style={{ background: '#222222', color: '#f0ede8', border: '0.5px solid rgba(255,255,255,0.2)', fontWeight: 600 }} autoComplete="off" />
                </div>
                <div>
                  <Label className="text-xs" style={{ color: 'rgba(240,237,232,0.6)', fontWeight: 700 }}>Included elements EN (one per line)</Label>
                  <textarea value={editing.included_elements_en} onChange={e => setEditing({ ...editing, included_elements_en: e.target.value })}
                    rows={5} className="mt-1 w-full rounded-md px-3 py-2 text-sm font-body resize-none" style={{ background: '#222222', color: '#f0ede8', border: '0.5px solid rgba(255,255,255,0.2)', fontWeight: 600 }} autoComplete="off" />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Switch checked={editing.active} onCheckedChange={v => setEditing({ ...editing, active: v })} />
                <Label className="font-body text-sm" style={{ color: '#f0ede8', fontWeight: 600 }}>{lang === 'es' ? 'Activo' : 'Active'}</Label>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button variant="ghost" onClick={() => setOpen(false)} style={{ color: 'rgba(240,237,232,0.6)', background: 'transparent', border: '0.5px solid rgba(255,255,255,0.15)' }}>
                  {lang === 'es' ? 'Cancelar' : 'Cancel'}
                </Button>
                <Button onClick={() => saveMutation.mutate(editing)} disabled={saveMutation.isPending}
                  style={{ background: '#f0ede8', color: '#0a0a0a', fontWeight: 700 }}>
                  {lang === 'es' ? 'Guardar' : 'Save'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}