import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLanguage } from '@/lib/i18n';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { useAdminToast, AdminToast } from '@/components/admin/AdminToast';

const categories = ['walls', 'floors', 'ceilings', 'furniture', 'blinds', 'technology', 'installations'];

const emptyProduct = {
  category: 'walls', name_en: '', name_es: '', description_en: '', description_es: '', price_usd: 0, image_url: '', active: true,
};

export default function CatalogManager() {
  const { t, lang } = useLanguage();
  const { toast: adminToast, show: showToast, dismiss: dismissToast } = useAdminToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [filterCat, setFilterCat] = useState('all');

  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => base44.entities.ProductCatalog.list(),
    initialData: [],
  });

  const saveMutation = useMutation({
    mutationFn: async (product) => {
      if (product.id) {
        const { id, created_date, updated_date, created_by, ...data } = product;
        await base44.entities.ProductCatalog.update(id, data);
      } else {
        await base44.entities.ProductCatalog.create(product);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setDialogOpen(false);
      setEditProduct(null);
      showToast(lang === 'es' ? 'Producto guardado' : 'Product saved');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.ProductCatalog.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      showToast(lang === 'es' ? 'Producto eliminado' : 'Product deleted');
    },
  });

  const filtered = filterCat === 'all' ? products : products.filter(p => p.category === filterCat);

  const openNew = () => { setEditProduct({ ...emptyProduct }); setDialogOpen(true); };
  const openEdit = (p) => { setEditProduct({ ...p }); setDialogOpen(true); };

  return (
    <div className="space-y-4">
      <AdminToast toast={adminToast} onDismiss={dismissToast} />
      <div className="flex flex-wrap items-center gap-3">
        <Select value={filterCat} onValueChange={setFilterCat}>
          <SelectTrigger className="w-40 bg-card border-border font-body text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{lang === 'es' ? 'Todas' : 'All'}</SelectItem>
            {categories.map(c => <SelectItem key={c} value={c}>{t(`cat.${c}`)}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button onClick={openNew} className="bg-primary text-primary-foreground hover:bg-primary/90 font-body text-sm">
          <Plus className="w-4 h-4 mr-1" /> {lang === 'es' ? 'Nuevo Producto' : 'New Product'}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-3 text-muted-foreground font-medium">{lang === 'es' ? 'Categoría' : 'Category'}</th>
                <th className="text-left py-3 px-3 text-muted-foreground font-medium">{lang === 'es' ? 'Nombre' : 'Name'}</th>
                <th className="text-left py-3 px-3 text-muted-foreground font-medium">{lang === 'es' ? 'Precio' : 'Price'}</th>
                <th className="text-left py-3 px-3 text-muted-foreground font-medium">{lang === 'es' ? 'Activo' : 'Active'}</th>
                <th className="py-3 px-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="py-3 px-3 text-muted-foreground capitalize">{t(`cat.${p.category}`)}</td>
                  <td className="py-3 px-3 text-foreground">{lang === 'es' ? p.name_es : p.name_en}</td>
                  <td className="py-3 px-3 text-foreground">${p.price_usd?.toLocaleString()}</td>
                  <td className="py-3 px-3">
                    <span className={`w-2 h-2 rounded-full inline-block ${p.active !== false ? 'bg-green-500' : 'bg-muted-foreground'}`} />
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(p)}>
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteMutation.mutate(p.id)}>
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading">{editProduct?.id ? (lang === 'es' ? 'Editar Producto' : 'Edit Product') : (lang === 'es' ? 'Nuevo Producto' : 'New Product')}</DialogTitle>
          </DialogHeader>
          {editProduct && (
            <div className="space-y-4">
              <div>
                <Label className="font-body text-xs text-muted-foreground">{lang === 'es' ? 'Categoría' : 'Category'}</Label>
                <Select value={editProduct.category} onValueChange={v => setEditProduct({ ...editProduct, category: v })}>
                  <SelectTrigger className="bg-background border-border mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categories.map(c => <SelectItem key={c} value={c}>{t(`cat.${c}`)}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="font-body text-xs text-muted-foreground">Name (EN)</Label>
                  <Input value={editProduct.name_en} onChange={e => setEditProduct({ ...editProduct, name_en: e.target.value })} className="mt-1 bg-background border-border" />
                </div>
                <div>
                  <Label className="font-body text-xs text-muted-foreground">Nombre (ES)</Label>
                  <Input value={editProduct.name_es} onChange={e => setEditProduct({ ...editProduct, name_es: e.target.value })} className="mt-1 bg-background border-border" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="font-body text-xs text-muted-foreground">Description (EN)</Label>
                  <Input value={editProduct.description_en} onChange={e => setEditProduct({ ...editProduct, description_en: e.target.value })} className="mt-1 bg-background border-border" />
                </div>
                <div>
                  <Label className="font-body text-xs text-muted-foreground">Descripción (ES)</Label>
                  <Input value={editProduct.description_es} onChange={e => setEditProduct({ ...editProduct, description_es: e.target.value })} className="mt-1 bg-background border-border" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="font-body text-xs text-muted-foreground">{lang === 'es' ? 'Precio USD' : 'Price USD'}</Label>
                  <Input type="number" value={editProduct.price_usd} onChange={e => setEditProduct({ ...editProduct, price_usd: parseFloat(e.target.value) || 0 })} className="mt-1 bg-background border-border" />
                </div>
                <div>
                  <Label className="font-body text-xs text-muted-foreground">Image URL</Label>
                  <Input value={editProduct.image_url || ''} onChange={e => setEditProduct({ ...editProduct, image_url: e.target.value })} className="mt-1 bg-background border-border" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={editProduct.active !== false} onCheckedChange={v => setEditProduct({ ...editProduct, active: v })} />
                <Label className="font-body text-sm">{lang === 'es' ? 'Activo' : 'Active'}</Label>
              </div>
              <Button
                onClick={() => saveMutation.mutate(editProduct)}
                disabled={saveMutation.isPending}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-body"
              >
                {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : t('admin.save')}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}