import React, { useState } from 'react';
import { useLanguage } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const S = {
  input: { width: '100%', background: 'rgba(0,0,0,0.04)', border: '0.5px solid rgba(0,0,0,0.15)', padding: '12px 14px', color: '#0a0a0a', fontSize: 14, fontFamily: "'Helvetica Neue', Arial, sans-serif", outline: 'none', boxSizing: 'border-box' },
  label: { fontSize: 10, letterSpacing: '0.18em', color: 'rgba(10,10,10,0.4)', textTransform: 'uppercase', marginBottom: 8, display: 'block', fontFamily: "'Helvetica Neue', Arial, sans-serif" },
};

export default function LeadCapture({ onSubmit, isSubmitting, isSuccess, breakdown, selectedDesign, spaceConfig }) {
  const { lang, t } = useLanguage();
  const [form, setForm] = useState({ full_name: '', company: '', email: '', phone: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  if (isSuccess) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toLocaleDateString(lang === 'es' ? 'es-MX' : 'en-US', {
      weekday: 'long', day: 'numeric', month: 'long'
    });
    const designName = selectedDesign
      ? (lang === 'es' ? (selectedDesign.name_es || selectedDesign.name_en) : (selectedDesign.name_en || selectedDesign.name_es))
      : '—';

    const catLabelsEN = {
      design: 'Design & Executive Project',
      construction: 'Construction & Civil Works',
      furniture: 'Furniture & Ergonomics',
      finishes: 'Finishes (floors, walls, blinds)',
      electrical: 'Installations (HVAC, electrical, IT)',
    };

    const catLabelsES = {
      design: 'Diseño & Proyecto Ejecutivo',
      construction: 'Construcción & Obra Civil',
      furniture: 'Mobiliario & Ergonomía',
      finishes: 'Acabados (pisos, muros, blinds)',
      electrical: 'Instalaciones (AC, eléctrico, IT)',
    };

    const catLabels = lang === 'es' ? catLabelsES : catLabelsEN;

    const generatePDF = () => {
      const photos = Array.isArray(selectedDesign?.photos) ? selectedDesign.photos.filter(Boolean) : [];
      const PHOTO_1 = photos[0] || '';
      const PHOTO_2 = photos[1] || '';
      const PHOTO_3 = photos[2] || '';
      const DESIGN_NAME = selectedDesign?.name_es || selectedDesign?.name_en || '—';
      const styleKey = selectedDesign?.style_key || '';
      const STYLE_LABEL = styleKey.charAt(0).toUpperCase() + styleKey.slice(1);
      const DESCRIPTION = selectedDesign?.description_es || selectedDesign?.description_en || '';
      const elementsRaw = selectedDesign?.included_elements_es || selectedDesign?.included_elements_en || '';
      const ELEMENTS_HTML = elementsRaw
        .split('\n').map(s => s.trim()).filter(Boolean)
        .map(el => `<div class="element-item">${el}</div>`).join('');
      const CLIENT_NAME = form.full_name || '—';
      const CLIENT_COMPANY = form.company || '';
      const DATE = new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });
      const TOTAL = breakdown?.total || 0;
      const TOTAL_FORMATTED = TOTAL.toLocaleString('en-US');
      const PRICE_PER_M2 = (breakdown?.pricePerSqm || 0).toLocaleString('en-US');
      const TOTAL_M2 = breakdown?.totalSqm || 0;
      const DOWN_PAYMENT = Math.round(TOTAL * 0.30).toLocaleString('en-US');
      const MONTHLY = Math.round(TOTAL * 0.70 / 12).toLocaleString('en-US');
      const DIRECTORS = spaceConfig?.directors || 0;
      const MANAGERS = spaceConfig?.managers || 0;
      const OPERATIVES = spaceConfig?.operatives || 0;


      const BREAKDOWN_HTML = [
        { key: 'design', pct: breakdown?.pct_design, amt: breakdown?.amt_design },
        { key: 'construction', pct: breakdown?.pct_construction, amt: breakdown?.amt_construction },
        { key: 'furniture', pct: breakdown?.pct_furniture, amt: breakdown?.amt_furniture },
        { key: 'finishes', pct: breakdown?.pct_finishes, amt: breakdown?.amt_finishes },
        { key: 'electrical', pct: breakdown?.pct_electrical, amt: breakdown?.amt_electrical },
      ].map(({ key, pct, amt }) => `
        <div class="breakdown-item">
          <div>
            <div class="breakdown-label">${catLabels[key]}</div>
            <div class="breakdown-bar-wrap">
              <div class="breakdown-bar"><div class="breakdown-bar-fill" style="width:${pct || 0}%"></div></div>
            </div>
          </div>
          <div class="breakdown-value">$${(amt || 0).toLocaleString('en-US')} <span style="font-size:11px;color:#888">${pct}%</span></div>
        </div>
      `).join('');

      const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1a1a1a; }
    .page { width: 210mm; min-height: 297mm; padding: 20mm; page-break-after: always; }
    @media print { .page { page-break-after: always; } }
    .cover { background: #0a0a0a; color: #f0ede8; display: flex; flex-direction: column; justify-content: space-between; }
    .cover-logo { font-size: 36px; font-weight: 800; letter-spacing: -0.04em; color: #6b6b6b; margin-bottom: 8px; }
    .cover-tagline { font-size: 12px; letter-spacing: 0.2em; color: rgba(240,237,232,0.5); text-transform: uppercase; }
    .cover-image { width: 100%; height: 160mm; object-fit: cover; margin: 20mm 0 0; display: block; }
    .cover-image-placeholder { width: 100%; height: 160mm; background: #1a1a1a; display: flex; align-items: center; justify-content: center; margin: 20mm 0 0; }
    .cover-project { margin-top: auto; padding-top: 20mm; }
    .cover-project-name { font-size: 48px; font-weight: 800; letter-spacing: -0.04em; color: #f0ede8; }
    .cover-style { font-size: 13px; color: #6b6b6b; margin-top: 8px; letter-spacing: 0.1em; text-transform: uppercase; }
    .cover-client { margin-top: 16mm; padding-top: 8mm; border-top: 1px solid rgba(240,237,232,0.15); display: flex; justify-content: space-between; }
    .cover-client-name { font-size: 14px; color: rgba(240,237,232,0.7); }
    .cover-date { font-size: 12px; color: rgba(240,237,232,0.4); }
    .section-label { font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: #6b6b6b; margin-bottom: 8px; }
    .section-title { font-size: 28px; font-weight: 700; letter-spacing: -0.03em; margin-bottom: 8mm; }
    .description { font-size: 15px; line-height: 1.7; color: #333; margin-bottom: 10mm; }
    .photos-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4mm; margin-bottom: 10mm; }
    .photo-item img { width: 100%; height: 65mm; object-fit: cover; }
    .photo-placeholder { width: 100%; height: 65mm; background: #f0ede8; }
    .elements-title { font-size: 13px; font-weight: 600; margin-bottom: 4mm; }
    .elements-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2mm; }
    .element-item { font-size: 12px; color: #444; padding: 2mm 0; border-bottom: 0.5px solid #eee; }
    .element-item::before { content: "✓ "; color: #6b6b6b; font-weight: 600; }
    .quote-total { font-size: 52px; font-weight: 800; letter-spacing: -0.04em; color: #0a0a0a; margin: 6mm 0 2mm; }
    .quote-sub { font-size: 14px; color: #888; margin-bottom: 10mm; }
    .breakdown-item { display: flex; justify-content: space-between; align-items: center; padding: 4mm 0; border-bottom: 0.5px solid #eee; }
    .breakdown-label { font-size: 13px; color: #444; }
    .breakdown-value { font-size: 14px; font-weight: 600; }
    .breakdown-bar { height: 3px; background: #eee; border-radius: 2px; margin-top: 1mm; }
    .breakdown-bar-fill { height: 3px; background: #6b6b6b; border-radius: 2px; }
    .team-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 4mm; margin-top: 8mm; }
    .team-card { background: #f8f8f6; padding: 4mm; border-radius: 4px; text-align: center; }
    .team-number { font-size: 24px; font-weight: 700; color: #0a0a0a; }
    .team-label { font-size: 11px; color: #888; margin-top: 1mm; }
    .financing-hero { background: #0a0a0a; color: #f0ede8; padding: 16mm; border-radius: 8px; margin-bottom: 10mm; text-align: center; }
    .financing-title { font-size: 22px; font-weight: 700; color: #6b6b6b; margin-bottom: 6mm; }
    .financing-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6mm; margin: 6mm 0; }
    .financing-item { background: rgba(240,237,232,0.08); padding: 6mm; border-radius: 4px; text-align: center; }
    .financing-number { font-size: 28px; font-weight: 800; color: #f0ede8; }
    .financing-label { font-size: 11px; color: rgba(240,237,232,0.6); margin-top: 2mm; letter-spacing: 0.08em; text-transform: uppercase; }
    .financing-badge { display: inline-block; background: #6b6b6b; color: #0a0a0a; font-size: 11px; font-weight: 700; padding: 2mm 6mm; border-radius: 20px; margin-top: 4mm; letter-spacing: 0.05em; }
    .steps-title { font-size: 16px; font-weight: 600; margin-bottom: 4mm; }
    .step-item { display: flex; align-items: flex-start; gap: 4mm; padding: 3mm 0; border-bottom: 0.5px solid #eee; }
    .step-num { width: 7mm; height: 7mm; background: #6b6b6b; color: #0a0a0a; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; flex-shrink: 0; }
    .step-text { font-size: 13px; color: #444; line-height: 1.4; }
    .contact-page { background: #0a0a0a; color: #f0ede8; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; }
    .contact-logo { font-size: 64px; font-weight: 800; letter-spacing: -0.04em; color: #6b6b6b; margin-bottom: 4mm; }
    .contact-domain { font-size: 18px; color: rgba(240,237,232,0.6); margin-bottom: 12mm; }
    .contact-message { font-size: 16px; color: rgba(240,237,232,0.8); margin-bottom: 16mm; max-width: 120mm; line-height: 1.6; }
    .contact-divider { width: 40mm; height: 1px; background: rgba(240,237,232,0.2); margin: 8mm auto; }
    .contact-disclaimer { font-size: 10px; color: rgba(240,237,232,0.3); max-width: 140mm; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="page cover">
    <div>
      <div class="cover-logo">THESEUS</div>
      <div class="cover-tagline">Propuesta de Diseño · Design Proposal</div>
    </div>
    ${PHOTO_1 ? `<img class="cover-image" src="${PHOTO_1}" />` : `<div class="cover-image-placeholder"></div>`}
    <div class="cover-project">
      <div class="cover-project-name">${DESIGN_NAME}</div>
      <div class="cover-style">${STYLE_LABEL}</div>
      <div class="cover-client">
        <div class="cover-client-name">${CLIENT_NAME}${CLIENT_COMPANY ? ' · ' + CLIENT_COMPANY : ''}</div>
        <div class="cover-date">${DATE}</div>
      </div>
    </div>
  </div>

  <div class="page">
    <div class="section-label">El Espacio / The Space</div>
    <div class="section-title">${DESIGN_NAME}</div>
    ${DESCRIPTION ? `<div class="description">${DESCRIPTION}</div>` : ''}
    <div class="photos-grid">
      ${PHOTO_2 ? `<div class="photo-item"><img src="${PHOTO_2}" /></div>` : `<div class="photo-placeholder"></div>`}
      ${PHOTO_3 ? `<div class="photo-item"><img src="${PHOTO_3}" /></div>` : `<div class="photo-placeholder"></div>`}
    </div>
    <div class="elements-title">Incluye / Includes</div>
    <div class="elements-grid">${ELEMENTS_HTML}</div>
  </div>

  <div class="page">
    <div class="section-label">Inversión / Investment</div>
    <div class="section-title">Tu Cotización</div>
    <div class="quote-total">$${TOTAL_FORMATTED} USD</div>
    <div class="quote-sub">$${PRICE_PER_M2} USD/m² · ${TOTAL_M2} m²</div>
    ${BREAKDOWN_HTML}
    <div class="team-grid">
      <div class="team-card"><div class="team-number">${DIRECTORS}</div><div class="team-label">Directores</div></div>
      <div class="team-card"><div class="team-number">${MANAGERS}</div><div class="team-label">Gerentes</div></div>
      <div class="team-card"><div class="team-number">${OPERATIVES}</div><div class="team-label">Operativos</div></div>
    </div>
  </div>

  <div class="page">
    <div class="section-label">Financiamiento / Financing</div>
    <div class="section-title">Haz realidad tu oficina hoy</div>
    <div class="financing-hero">
      <div class="financing-title">30% anticipo · 12 meses sin intereses</div>
      <div class="financing-grid">
        <div class="financing-item">
          <div class="financing-number">$${DOWN_PAYMENT} USD</div>
          <div class="financing-label">Anticipo / Down payment</div>
        </div>
        <div class="financing-item">
          <div class="financing-number">$${MONTHLY} USD</div>
          <div class="financing-label">Mensualidad / Monthly</div>
        </div>
      </div>
      <div class="financing-badge">0% INTERÉS · 0% INTEREST</div>
    </div>
    <div class="steps-title">Próximos pasos / Next steps</div>
    <div class="step-item"><div class="step-num">1</div><div class="step-text">Agenda tu llamada con un asesor Theseus</div></div>
    <div class="step-item"><div class="step-num">2</div><div class="step-text">Visita de sitio gratuita y sin compromiso</div></div>
    <div class="step-item"><div class="step-num">3</div><div class="step-text">Propuesta ejecutiva detallada con planos</div></div>
    <div class="step-item"><div class="step-num">4</div><div class="step-text">Inicio de obra en fecha acordada</div></div>
  </div>

  <div class="page contact-page">
    <div class="contact-logo">THESEUS</div>
    <div class="contact-domain">theseus-office.com</div>
    <div class="contact-message">Un asesor te contactará en menos de 24 horas para agendar tu llamada de 30 minutos.</div>
    <div class="contact-divider"></div>
    <div class="contact-disclaimer">Esta cotización es una referencia estimada. El precio final se confirma tras visita de sitio y alcance detallado. Sujeto a disponibilidad y calificación crediticia para opciones de financiamiento.</div>
  </div>

  <script>window.onload = () => window.print();</script>
</body>
</html>`;

      const win = window.open('', '_blank');
      win.document.write(html);
      win.document.close();
    };

    return (
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        {/* Success header */}
        <div style={{ marginBottom: 32, paddingBottom: 28, borderBottom: '0.5px solid rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 32, height: 32, background: '#6b6b6b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: 16, color: '#0a0a0a', fontWeight: 700 }}>✓</span>
            </div>
            <div style={{ fontSize: 10, letterSpacing: '0.2em', color: '#6b6b6b', textTransform: 'uppercase' }}>
              {lang === 'es' ? 'Solicitud enviada' : 'Request submitted'}
            </div>
          </div>
          <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', color: '#0a0a0a', marginBottom: 10 }}>
            {lang === 'es' ? `Perfecto, ${form.full_name.split(' ')[0]}.` : `Perfect, ${form.full_name.split(' ')[0]}.`}
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(10,10,10,0.45)', lineHeight: 1.7 }}>
            {lang === 'es'
              ? `Tu asesor Theseus te contactará antes del ${dateStr}.`
              : `Your Theseus advisor will contact you before ${dateStr}.`}
          </p>
        </div>

        {/* Quote summary */}
        {breakdown && (
          <div style={{ marginBottom: 24, padding: '20px 24px', background: 'rgba(0,0,0,0.03)', border: '0.5px solid rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: 10, letterSpacing: '0.18em', color: 'rgba(10,10,10,0.35)', textTransform: 'uppercase', marginBottom: 14 }}>
              {t('lead.quote_summary')}
            </div>
            {[
              [t('lead.design'), designName],
              [t('lead.area'), `${breakdown.totalSqm} m²`],
              [t('lead.price_per_sqm'), `$${breakdown.pricePerSqm?.toLocaleString()} USD`],
              [t('lead.est_investment'), `$${breakdown.total?.toLocaleString('en-US')} USD`],
            ].map(([label, value]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '0.5px solid rgba(0,0,0,0.05)' }}>
                <span style={{ fontSize: 12, color: 'rgba(10,10,10,0.4)' }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#0a0a0a' }}>{value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Financing */}
        {breakdown?.total > 0 && (
          <div style={{ marginBottom: 32, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'rgba(0,0,0,0.06)' }}>
            <div style={{ background: '#f8f7f4', padding: '18px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 10, color: 'rgba(10,10,10,0.35)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>{t('finance.down_label')}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#6b6b6b' }}>${Math.round(breakdown.total * 0.30).toLocaleString('en-US')}</div>
              <div style={{ fontSize: 11, color: 'rgba(10,10,10,0.55)', marginTop: 2 }}>USD</div>
            </div>
            <div style={{ background: '#f8f7f4', padding: '18px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 10, color: 'rgba(10,10,10,0.35)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>{t('finance.monthly_label')}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#6b6b6b' }}>${Math.round((breakdown.total * 0.70) / 12).toLocaleString('en-US')}</div>
              <div style={{ fontSize: 11, color: 'rgba(10,10,10,0.55)', marginTop: 2 }}>USD × 12</div>
            </div>
          </div>
        )}

        {/* PDF button */}
        <div>
          <div style={{ fontSize: 11, color: 'rgba(10,10,10,0.55)', marginBottom: 12, letterSpacing: '0.05em' }}>
            {t('quote.save_proposal')}
          </div>
          <button onClick={generatePDF} style={{
            width: '100%', background: '#6b6b6b', color: '#ffffff', border: 'none',
            padding: '15px 24px', fontSize: 12, fontWeight: 700, letterSpacing: '0.12em',
            textTransform: 'uppercase', cursor: 'pointer', fontFamily: "'Helvetica Neue', Arial, sans-serif",
            transition: 'opacity 0.2s',
          }}
            onMouseEnter={e => e.target.style.opacity = '0.85'}
            onMouseLeave={e => e.target.style.opacity = '1'}
          >
            {t('quote.download_pdf')}
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 10, letterSpacing: '0.25em', color: '#6b6b6b', textTransform: 'uppercase', marginBottom: 10 }}>
          {t('lead.contact_header')}
        </div>
        <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', color: '#0a0a0a', marginBottom: 8 }}>
          {t('lead.tell_us')}
        </h2>
        <p style={{ fontSize: 13, color: 'rgba(10,10,10,0.4)', lineHeight: 1.6 }}>
          {t('lead.get_quote_24h')}
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {[
          { key: 'full_name', label: t('lead.full_name'), placeholder: 'Juan Pérez', required: true, type: 'text' },
          { key: 'company', label: t('lead.company_label'), placeholder: 'Empresa S.A. de C.V.', required: false, type: 'text' },
          { key: 'email', label: t('lead.email_label'), placeholder: 'juan@empresa.com', required: true, type: 'email' },
          { key: 'phone', label: lang === 'es' ? 'WhatsApp / Teléfono' : 'WhatsApp / Phone', placeholder: '+52 55 1234 5678', required: false, type: 'tel' },
        ].map(field => (
          <div key={field.key}>
            <label style={S.label}>{field.label}{field.required && <span style={{ color: '#6b6b6b', marginLeft: 4 }}>*</span>}</label>
            <input
              type={field.type}
              required={field.required}
              value={form[field.key]}
              onChange={e => setForm({ ...form, [field.key]: e.target.value })}
              placeholder={field.placeholder}
              style={{ ...S.input, colorScheme: 'light' }}
            />
          </div>
        ))}

        <button type="submit" disabled={isSubmitting} style={{
          width: '100%', background: '#6b6b6b', color: '#ffffff', border: 'none',
          padding: '16px 24px', fontSize: 13, fontWeight: 700, letterSpacing: '0.12em',
          textTransform: 'uppercase', cursor: isSubmitting ? 'not-allowed' : 'pointer',
          fontFamily: "'Helvetica Neue', Arial, sans-serif", opacity: isSubmitting ? 0.6 : 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, transition: 'opacity 0.2s',
        }}>
          {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : t('lead.request_quote_btn')}
          </button>

          <div style={{ fontSize: 11, color: 'rgba(10,10,10,0.5)', textAlign: 'center' }}>
          {t('quote.no_commitment')}
          </div>
      </form>
    </div>
  );
}