import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLanguage } from '@/lib/i18n';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, Save, Loader2, ImageIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const styleKeys = ['modern', 'industrial', 'classic', 'biophilic', 'minimalist'];

export default function StyleImagesManager() {
  const { t, lang } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState({});

  const { data: images, isLoading } = useQuery({
    queryKey: ['styleImages'],
    queryFn: () => base44.entities.StyleImage.list(),
    initialData: [],
  });

  const saveMutation = useMutation({
    mutationFn: async ({ styleKey, imageUrl }) => {
      const existing = images.find(i => i.style_key === styleKey);
      if (existing) {
        await base44.entities.StyleImage.update(existing.id, { image_url: imageUrl });
      } else {
        await base44.entities.StyleImage.create({ style_key: styleKey, image_url: imageUrl });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['styleImages'] });
      toast({ title: lang === 'es' ? 'Imagen guardada' : 'Image saved' });
    },
  });

  const handleFileUpload = async (styleKey, file) => {
    setUploading(prev => ({ ...prev, [styleKey]: true }));
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    await saveMutation.mutateAsync({ styleKey, imageUrl: file_url });
    setUploading(prev => ({ ...prev, [styleKey]: false }));
  };

  const getImage = (key) => images.find(i => i.style_key === key)?.image_url;

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {styleKeys.map(key => {
        const imgUrl = getImage(key);
        return (
          <div key={key} className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="aspect-video bg-muted relative flex items-center justify-center">
              {imgUrl ? (
                <img src={imgUrl} alt={key} className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-10 h-10 text-muted-foreground" />
              )}
            </div>
            <div className="p-4 space-y-3">
              <h4 className="font-heading font-semibold text-foreground capitalize">{t(`style.${key}`)}</h4>
              <div>
                <Label className="text-xs text-muted-foreground font-body">
                  {lang === 'es' ? 'Subir imagen' : 'Upload image'}
                </Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(key, file);
                  }}
                  className="mt-1 bg-background border-border text-xs"
                  disabled={uploading[key]}
                />
                {uploading[key] && (
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <Loader2 className="w-3 h-3 animate-spin" /> {lang === 'es' ? 'Subiendo...' : 'Uploading...'}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}