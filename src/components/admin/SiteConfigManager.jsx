import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

export default function SiteConfigManager() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    hero_image_url: '',
    hero_project_name: '',
    hero_project_meta: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  // Fetch SiteConfig records
  const { data: configRecords = [], isLoading } = useQuery({
    queryKey: ['siteConfig'],
    queryFn: () => base44.entities.SiteConfig.list(),
  });

  // Populate form when data loads
  useEffect(() => {
    if (configRecords.length > 0) {
      const data = {};
      configRecords.forEach(record => {
        data[record.key] = record.value || '';
      });
      setFormData(prev => ({ ...prev, ...data }));
    }
  }, [configRecords]);

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save or update each field
      for (const [key, value] of Object.entries(formData)) {
        const existing = configRecords.find(r => r.key === key);
        if (existing) {
          await base44.entities.SiteConfig.update(existing.id, { value });
        } else {
          await base44.entities.SiteConfig.create({ key, value, section: 'hero' });
        }
      }
      queryClient.invalidateQueries({ queryKey: ['siteConfig'] });
    } catch (error) {
      console.error('Error saving config:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
        <Loader2 size={20} className="animate-spin" style={{ color: '#6b6b6b' }} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600 }}>
      <div style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Configuración del Sitio</h2>
        <p style={{ fontSize: 13, color: 'rgba(10,10,10,0.55)' }}>Gestiona la foto y texto del hero de la página de inicio</p>
      </div>

      {/* Hero Image URL */}
      <div style={{ marginBottom: 32 }}>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 8, color: '#0a0a0a', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Foto principal (URL)
        </label>
        <input
          type="text"
          value={formData.hero_image_url}
          onChange={e => handleChange('hero_image_url', e.target.value)}
          placeholder="https://example.com/image.jpg"
          style={{
            width: '100%',
            padding: '12px 14px',
            border: '0.5px solid rgba(0,0,0,0.15)',
            background: '#f8f7f4',
            fontSize: 14,
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
            boxSizing: 'border-box',
            outline: 'none',
            color: '#0a0a0a',
          }}
        />
        <div style={{ fontSize: 11, color: 'rgba(10,10,10,0.5)', marginTop: 8 }}>
          Sube tu foto a imgbb.com y pega el link directo aquí
        </div>
        {formData.hero_image_url && (
          <img src={formData.hero_image_url} alt="Preview" style={{ width: '100%', height: 200, objectFit: 'cover', marginTop: 12, border: '0.5px solid rgba(0,0,0,0.08)' }} onError={() => {}} />
        )}
      </div>

      {/* Hero Project Name */}
      <div style={{ marginBottom: 32 }}>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 8, color: '#0a0a0a', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Nombre del proyecto
        </label>
        <input
          type="text"
          value={formData.hero_project_name}
          onChange={e => handleChange('hero_project_name', e.target.value)}
          placeholder="Arca Office"
          style={{
            width: '100%',
            padding: '12px 14px',
            border: '0.5px solid rgba(0,0,0,0.15)',
            background: '#f8f7f4',
            fontSize: 14,
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
            boxSizing: 'border-box',
            outline: 'none',
            color: '#0a0a0a',
          }}
        />
      </div>

      {/* Hero Project Meta */}
      <div style={{ marginBottom: 32 }}>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 8, color: '#0a0a0a', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Texto descriptivo
        </label>
        <input
          type="text"
          value={formData.hero_project_meta}
          onChange={e => handleChange('hero_project_meta', e.target.value)}
          placeholder="Clásico · Premium · $950/m²"
          style={{
            width: '100%',
            padding: '12px 14px',
            border: '0.5px solid rgba(0,0,0,0.15)',
            background: '#f8f7f4',
            fontSize: 14,
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
            boxSizing: 'border-box',
            outline: 'none',
            color: '#0a0a0a',
          }}
        />
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={isSaving}
        style={{
          width: '100%',
          background: '#6b6b6b',
          color: '#ffffff',
          border: 'none',
          padding: '14px 20px',
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          cursor: isSaving ? 'not-allowed' : 'pointer',
          fontFamily: "'Helvetica Neue', Arial, sans-serif",
          opacity: isSaving ? 0.6 : 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          transition: 'opacity 0.2s',
        }}
        onMouseEnter={e => !isSaving && (e.target.style.opacity = '0.85')}
        onMouseLeave={e => !isSaving && (e.target.style.opacity = '1')}
      >
        {isSaving ? <Loader2 size={14} className="animate-spin" /> : null}
        {isSaving ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}
      </button>
    </div>
  );
}