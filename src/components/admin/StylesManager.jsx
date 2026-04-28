import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLanguage } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Plus, Trash2 } from 'lucide-react';
import { useAdminToast, AdminToast } from '@/components/admin/AdminToast';

const EMPTY = { style_key: '', name_es: '', name_en: '', description_es: '', description_en: '', active: true };

export default function StylesManager() {
  const { lang } = useLanguage();
  const { toast: adminToast, show: showToast, dismiss: dismissToast } = useAdminToast();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);

  const { data: styles = [], isLoading } = useQuery({
    queryKey: ['officeStyles'],
    queryFn: () => base44.entities.OfficeStyle.list('style_key'),
  });

  const saveMutation = useMutation({
    mutationFn: (s) => s.id
      ? base44.entities.OfficeStyle.update(s.id, s)
      : base44.entities.OfficeStyle.create(s),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['officeStyles'] });
      showToast(lang === 'es' ? 'Guardado' : 'Saved');
      setOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.OfficeStyle.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['officeStyles'] });
      showToast(lang === 'es' ? 'Eliminado' : 'Deleted');
    },
  });

  const toggleActive = (style) => {
    base44.entities.OfficeStyle.update(style.id, { active: !style.active })
      .then(() => queryClient.invalidateQueries({ queryKey: ['officeStyles'] }));
  };

  const openNew = () => { setEditing({ ...EMPTY }); setOpen(true); };
  const openEdit = (s) => { setEditing({ ...s }); setOpen(true); };

  return (
    <div className="space-y-4">
      <AdminToast toast={adminToast} onDismiss={dismissToast} />

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-heading font-semibold text-foreground">
          {lang === 'es' ? 'Estilos de Diseño' : 'Design Styles'}
        </h2>
        <Button onClick={openNew} size="sm" className="bg-primary text-primary-foreground gap-2">
          <Plus className="w-4 h-4" />
          {lang === 'es' ? 'Agregar estilo' : 'Add style'}
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-10 text-muted-foreground font-body text-sm">
          {lang === 'es' ? 'Cargando...' : 'Loading...'}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Key</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Nombre ES</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Name EN</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Descripción ES</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Description EN</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Activo</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {styles.map(s => (
                <tr key={s.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground bg-muted/10">{s.style_key}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => openEdit(s)} className="text-foreground font-medium hover:text-primary transition-colors text-left">
                      {s.name_es}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{s.name_en}</td>
                  <td className="px-4 py-3 text-muted-foreground max-w-xs truncate">{s.description_es || '—'}</td>
                  <td className="px-4 py-3 text-muted-foreground max-w-xs truncate">{s.description_en || '—'}</td>
                  <td className="px-4 py-3">
                    <Switch checked={!!s.active} onCheckedChange={() => toggleActive(s)} />
                  </td>
                  <td className="px-4 py-3">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-card border-border">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="font-heading">
                            {lang === 'es' ? '¿Eliminar estilo?' : 'Delete style?'}
                          </AlertDialogTitle>
                          <AlertDialogDescription className="font-body text-muted-foreground">
                            {lang === 'es'
                              ? '¿Seguro que quieres eliminar este estilo? Los proyectos asignados a este estilo quedarán sin clasificar.'
                              : 'Are you sure you want to delete this style? Projects assigned to it will become unclassified.'}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="font-body">{lang === 'es' ? 'Cancelar' : 'Cancel'}</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteMutation.mutate(s.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-body"
                          >
                            {lang === 'es' ? 'Eliminar' : 'Delete'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-heading">
              {editing?.id
                ? (lang === 'es' ? 'Editar Estilo' : 'Edit Style')
                : (lang === 'es' ? 'Nuevo Estilo' : 'New Style')}
            </DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              {!editing.id && (
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Style key <span className="text-destructive">*</span>
                    <span className="ml-1 text-muted-foreground/60">(lowercase, use _ for spaces, e.g. art_deco)</span>
                  </Label>
                  <Input
                    value={editing.style_key}
                    onChange={e => setEditing({ ...editing, style_key: e.target.value.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '') })}
                    placeholder="e.g. art_deco"
                    className="mt-1 bg-background font-mono"
                    autoComplete="off"
                  />
                </div>
              )}
              {editing.id && (
                <div>
                  <Label className="text-xs text-muted-foreground">Style key</Label>
                  <Input value={editing.style_key} disabled className="mt-1 bg-muted font-mono opacity-60" />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Nombre ES <span className="text-destructive">*</span></Label>
                  <Input value={editing.name_es} onChange={e => setEditing({ ...editing, name_es: e.target.value })} className="mt-1 bg-background" autoComplete="off" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Name EN <span className="text-destructive">*</span></Label>
                  <Input value={editing.name_en} onChange={e => setEditing({ ...editing, name_en: e.target.value })} className="mt-1 bg-background" />
                </div>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Descripción ES</Label>
                <textarea
                  value={editing.description_es}
                  onChange={e => setEditing({ ...editing, description_es: e.target.value })}
                  rows={2}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-body resize-none"
                  autoComplete="off"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Description EN</Label>
                <textarea
                  value={editing.description_en}
                  onChange={e => setEditing({ ...editing, description_en: e.target.value })}
                  rows={2}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-body resize-none"
                  autoComplete="off"
                />
              </div>

              <div className="flex items-center gap-3">
                <Switch checked={editing.active} onCheckedChange={v => setEditing({ ...editing, active: v })} />
                <Label className="font-body text-sm">{lang === 'es' ? 'Activo' : 'Active'}</Label>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button variant="ghost" onClick={() => setOpen(false)}>{lang === 'es' ? 'Cancelar' : 'Cancel'}</Button>
                <Button
                  onClick={() => saveMutation.mutate(editing)}
                  disabled={saveMutation.isPending || !editing.style_key || !editing.name_es || !editing.name_en}
                  className="bg-primary text-primary-foreground"
                >
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