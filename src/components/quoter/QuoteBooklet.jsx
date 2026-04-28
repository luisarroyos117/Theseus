import React from 'react';
import { useLanguage } from '@/lib/i18n';

const bookletStyles = `
#quote-booklet { display: none; }
@media print {
  body > * { display: none !important; }
  #quote-booklet { display: block !important; }
  * { margin:0; padding:0; box-sizing:border-box; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
  @page { size: A4 portrait; margin: 0; }
  .booklet-root { font-family: 'Inter','Helvetica Neue',sans-serif; color:#e8dfc8; }
  .booklet-page { width:210mm; height:297mm; page-break-after:always; position:relative; overflow:hidden; background:#131720; }
  /* Cover */
  .cover-page { display:flex; flex-direction:column; justify-content:space-between; }
  .cover-hero { width:100%; height:110mm; object-fit:cover; object-position:center; display:block; }
  .cover-hero-placeholder { width:100%; height:110mm; background:#1a1f2e; display:flex; align-items:center; justify-content:center; }
  .cover-hero-placeholder-text { font-family:'Playfair Display','Georgia',serif; font-size:18pt; color:#3a3525; letter-spacing:0.2em; }
  .cover-overlay-area { flex:1; display:flex; flex-direction:column; justify-content:space-between; padding:10mm 14mm 14mm; background:linear-gradient(to bottom,#131720 0%,#0e1118 100%); }
  .theseus-wordmark { font-family:'Playfair Display','Georgia',serif; font-size:22pt; font-weight:700; color:#c29b5a; letter-spacing:0.15em; }
  .cover-subtitle { font-size:9pt; color:#a09070; letter-spacing:0.25em; text-transform:uppercase; margin-top:1.5mm; }
  .cover-design-name { font-family:'Playfair Display','Georgia',serif; font-size:26pt; font-weight:600; color:#e8dfc8; line-height:1.2; margin-bottom:3mm; }
  .cover-tags { display:flex; gap:3mm; margin-bottom:6mm; }
  .tag { border:1px solid #c29b5a; color:#c29b5a; font-size:7pt; letter-spacing:0.18em; text-transform:uppercase; padding:1mm 3mm; border-radius:2mm; }
  .cover-client-name { font-size:12pt; font-weight:600; color:#e8dfc8; }
  .cover-client-company { font-size:9pt; color:#a09070; margin-top:1mm; }
  .cover-date { font-size:8pt; color:#6b6050; margin-top:2mm; }
  /* Interior */
  .interior-page { padding:12mm 14mm; display:flex; flex-direction:column; gap:5mm; }
  .page-header { display:flex; align-items:center; gap:4mm; border-bottom:1px solid #c29b5a; padding-bottom:3mm; }
  .page-header-brand { font-family:'Playfair Display','Georgia',serif; font-size:10pt; font-weight:700; color:#c29b5a; letter-spacing:0.15em; }
  .page-header-divider { width:0.4mm; height:4mm; background:#c29b5a; opacity:0.5; }
  .page-header-title { font-size:8pt; color:#a09070; letter-spacing:0.2em; text-transform:uppercase; }
  .page-section-title { font-family:'Playfair Display','Georgia',serif; font-size:18pt; font-weight:600; color:#e8dfc8; }
  .page-description { font-size:8.5pt; color:#a09070; line-height:1.6; }
  /* Photo grid */
  .photo-grid { display:grid; grid-template-columns:1fr 1fr; gap:3mm; height:50mm; }
  .photo-grid-img { width:100%; height:100%; object-fit:cover; object-position:center; border-radius:1.5mm; display:block; }
  .photo-placeholder { width:100%; height:100%; background:#1a1f2e; border-radius:1.5mm; display:flex; align-items:center; justify-content:center; }
  .photo-placeholder-text { font-size:7pt; color:#3a3525; letter-spacing:0.15em; text-transform:uppercase; }
  /* Elements */
  .elements-section { margin-top:1mm; }
  .elements-title { font-size:7.5pt; color:#c29b5a; text-transform:uppercase; letter-spacing:0.15em; margin-bottom:2.5mm; }
  .elements-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:2mm; }
  .element-item { display:flex; align-items:flex-start; gap:2mm; font-size:8pt; color:#c8bfa8; }
  .element-check { color:#c29b5a; font-size:8.5pt; margin-top:0.2mm; }
  /* Investment hero */
  .investment-hero { background:rgba(194,155,90,0.08); border:1px solid #c29b5a; border-radius:2mm; padding:5mm 7mm; text-align:center; }
  .investment-hero-label { font-size:7.5pt; color:#a09070; letter-spacing:0.15em; text-transform:uppercase; margin-bottom:1.5mm; }
  .investment-hero-amount { font-family:'Playfair Display','Georgia',serif; font-size:26pt; font-weight:700; color:#c29b5a; }
  .investment-hero-meta { font-size:8.5pt; color:#a09070; margin-top:1mm; }
  /* Breakdown */
  .breakdown-list { display:flex; flex-direction:column; gap:2.5mm; }
  .breakdown-row { display:grid; grid-template-columns:58mm 1fr 12mm 24mm; align-items:center; gap:2.5mm; }
  .breakdown-label { font-size:8pt; color:#c8bfa8; }
  .breakdown-bar-wrap { background:rgba(255,255,255,0.06); height:2mm; border-radius:1mm; overflow:hidden; }
  .breakdown-bar { height:100%; background:#c29b5a; border-radius:1mm; }
  .breakdown-pct { font-size:7.5pt; color:#a09070; text-align:right; }
  .breakdown-amt { font-size:8pt; color:#e8dfc8; font-weight:600; text-align:right; }
  /* Team */
  .team-section { border-top:1px solid rgba(194,155,90,0.2); padding-top:3.5mm; }
  .team-title { font-size:7.5pt; color:#c29b5a; text-transform:uppercase; letter-spacing:0.15em; margin-bottom:2.5mm; }
  .team-row { display:flex; gap:5mm; margin-bottom:2.5mm; }
  .team-item { display:flex; flex-direction:column; align-items:center; }
  .team-count { font-size:14pt; font-weight:700; color:#c29b5a; }
  .team-label { font-size:7pt; color:#a09070; }
  .amenities-list { font-size:8pt; color:#c8bfa8; }
  .amenities-label { color:#a09070; }
  /* Financing */
  .financing-headline { font-family:'Playfair Display','Georgia',serif; font-size:20pt; font-weight:600; color:#e8dfc8; text-align:center; }
  .financing-badge { background:rgba(194,155,90,0.15); border:1px solid #c29b5a; color:#c29b5a; font-size:8.5pt; letter-spacing:0.08em; text-align:center; padding:2mm 5mm; border-radius:2mm; align-self:center; }
  .financing-grid { display:grid; grid-template-columns:1fr 1fr; gap:5mm; margin-top:2mm; }
  .financing-box { background:rgba(194,155,90,0.06); border:1px solid rgba(194,155,90,0.4); border-radius:2mm; padding:5mm; text-align:center; }
  .financing-box-label { font-size:7.5pt; color:#a09070; text-transform:uppercase; letter-spacing:0.1em; margin-bottom:1.5mm; }
  .financing-box-amount { font-family:'Playfair Display','Georgia',serif; font-size:22pt; font-weight:700; color:#c29b5a; }
  .financing-box-sub { font-size:7.5pt; color:#a09070; margin-top:1mm; }
  .financing-disclaimer { font-size:7pt; color:#6b6050; text-align:center; line-height:1.5; }
  .next-steps { border-top:1px solid rgba(194,155,90,0.2); padding-top:3.5mm; }
  .next-steps-title { font-size:7.5pt; color:#c29b5a; text-transform:uppercase; letter-spacing:0.15em; margin-bottom:3mm; }
  .next-step-item { display:flex; align-items:center; gap:3.5mm; margin-bottom:2.5mm; }
  .next-step-num { width:5.5mm; height:5.5mm; border-radius:50%; background:#c29b5a; color:#131720; font-size:7.5pt; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .next-step-text { font-size:8.5pt; color:#c8bfa8; }
  /* Contact */
  .contact-page { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:5mm; padding:14mm; background:#0e1118; }
  .contact-brand { font-family:'Playfair Display','Georgia',serif; font-size:34pt; font-weight:700; color:#c29b5a; letter-spacing:0.15em; }
  .contact-tagline { font-size:10pt; color:#a09070; text-align:center; font-style:italic; }
  .contact-website { font-size:11pt; color:#e8dfc8; letter-spacing:0.1em; }
  .qr-placeholder { width:28mm; height:28mm; border:1px solid rgba(194,155,90,0.4); border-radius:2mm; display:flex; align-items:center; justify-content:center; }
  .qr-label { font-size:7.5pt; color:#6b6050; letter-spacing:0.2em; }
  .contact-promise { font-size:9.5pt; color:#c8bfa8; text-align:center; }
  .contact-footer { font-size:6.5pt; color:#6b6050; text-align:center; line-height:1.6; position:absolute; bottom:10mm; }
}
`;

function fmt(n) {
  if (!n) return '0';
  return Math.round(n).toLocaleString('en-US');
}

const CATEGORY_LABELS = {
  es: {
    design: 'Diseño & Proyecto Ejecutivo',
    construction: 'Construcción & Obra Civil',
    furniture: 'Mobiliario & Ergonomía',
    finishes: 'Acabados (pisos, muros, blinds)',
    electrical: 'Instalaciones (AC, eléctrico, IT)',
  },
  en: {
    design: 'Design & Executive Project',
    construction: 'Construction & Civil Works',
    furniture: 'Furniture & Ergonomics',
    finishes: 'Finishes (floors, walls, blinds)',
    electrical: 'Installations (HVAC, electrical, IT)',
  },
};

const AMENITY_NAMES = {
  es: { reception:'Recepción', kitchen:'Cocina', dining:'Comedor', meeting:'Sala de juntas', bathrooms:'Baños', server:'Sala de servidores', lounge:'Área lounge' },
  en: { reception:'Reception', kitchen:'Kitchen', dining:'Dining area', meeting:'Meeting room', bathrooms:'Bathrooms', server:'Server room', lounge:'Lounge area' },
};

const STYLE_MAP = {
  es: { modern:'Moderno', industrial:'Industrial', classic:'Clásico', biophilic:'Biofílico', minimalist:'Minimalista' },
  en: { modern:'Modern', industrial:'Industrial', classic:'Classic', biophilic:'Biophilic', minimalist:'Minimalist' },
};

export default function QuoteBooklet({ breakdown, selectedDesign, spaceConfig, contactInfo, tier }) {
  const { lang, t } = useLanguage();

  if (!breakdown || !selectedDesign) return null;

  const l = lang === 'es' ? 'es' : 'en';
  const designName = l === 'es' ? (selectedDesign.name_es || selectedDesign.name_en || '—') : (selectedDesign.name_en || selectedDesign.name_es || '—');
  const designDesc = l === 'es' ? (selectedDesign.description_es || selectedDesign.description_en) : (selectedDesign.description_en || selectedDesign.description_es);
  const includedRaw = l === 'es' ? (selectedDesign.included_elements_es || selectedDesign.included_elements_en) : (selectedDesign.included_elements_en || selectedDesign.included_elements_es);
  const includedLines = (includedRaw || '').split('\n').map(s => s.trim()).filter(Boolean);
  const photos = Array.isArray(selectedDesign.photos) ? selectedDesign.photos.filter(Boolean) : [];

  const tierName = tier ? (l === 'es' ? tier.name_es : tier.name_en) : '';
  const styleName = (STYLE_MAP[l] || STYLE_MAP.en)[selectedDesign.style_key] || selectedDesign.style_key;

  const catLabels = CATEGORY_LABELS[l];
  const cats = [
    { key:'design',        pct: breakdown.pct_design,        amt: breakdown.amt_design },
    { key:'construction',  pct: breakdown.pct_construction,  amt: breakdown.amt_construction },
    { key:'furniture',     pct: breakdown.pct_furniture,     amt: breakdown.amt_furniture },
    { key:'finishes',      pct: breakdown.pct_finishes,      amt: breakdown.amt_finishes },
    { key:'electrical',    pct: breakdown.pct_electrical,    amt: breakdown.amt_electrical },
  ];

  const downPayment = Math.round((breakdown.total || 0) * 0.30);
  const monthly = Math.round(((breakdown.total || 0) * 0.70) / 12);
  const today = new Date().toLocaleDateString(l === 'es' ? 'es-MX' : 'en-US', { year:'numeric', month:'long', day:'numeric' });

  const aNames = AMENITY_NAMES[l];
  const selectedAmenities = spaceConfig?.selectedAmenities || [];

  return (
    <div id="quote-booklet" className="booklet-root">
      <style dangerouslySetInnerHTML={{ __html: bookletStyles }} />

      {/* ── PAGE 1: COVER ── */}
      <div className="booklet-page cover-page">
        {/* Hero photo or placeholder */}
        {photos[0] ? (
          <img
            src={photos[0]}
            alt={designName}
            className="cover-hero"
            style={{ width: '100%', height: '110mm', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
          />
        ) : (
          <div className="cover-hero-placeholder">
            <span className="cover-hero-placeholder-text">THESEUS</span>
          </div>
        )}

        <div className="cover-overlay-area">
          <div>
            <div className="theseus-wordmark">THESEUS</div>
            <div className="cover-subtitle">{l === 'es' ? 'Propuesta de Diseño' : 'Design Proposal'}</div>
          </div>
          <div>
            <div className="cover-design-name">{designName}</div>
            <div className="cover-tags">
              <span className="tag">{styleName}</span>
              {tierName && <span className="tag">{tierName}</span>}
            </div>
            <div className="cover-client-name">{contactInfo?.full_name || '—'}</div>
            {contactInfo?.company && <div className="cover-client-company">{contactInfo.company}</div>}
            <div className="cover-date">{today}</div>
          </div>
        </div>
      </div>

      {/* ── PAGE 2: THE SPACE ── */}
      <div className="booklet-page interior-page">
        <div className="page-header">
          <div className="page-header-brand">THESEUS</div>
          <div className="page-header-divider" />
          <div className="page-header-title">{l === 'es' ? 'El Espacio' : 'The Space'}</div>
        </div>

        <div className="page-section-title">{designName}</div>

        {designDesc && <p className="page-description">{designDesc}</p>}

        {/* 2-column photo grid */}
        <div className="photo-grid">
          {[photos[1], photos[2]].map((url, i) =>
            url ? (
              <img key={i} src={url} alt="" className="photo-grid-img" style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center', display:'block' }} />
            ) : (
              <div key={i} className="photo-placeholder">
                <span className="photo-placeholder-text">{designName}</span>
              </div>
            )
          )}
        </div>

        {includedLines.length > 0 && (
          <div className="elements-section">
            <div className="elements-title">{l === 'es' ? 'Elementos incluidos' : 'Included elements'}</div>
            <div className="elements-grid">
              {includedLines.map((line, i) => (
                <div key={i} className="element-item">
                  <span className="element-check">✓</span>
                  <span>{line}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── PAGE 3: QUOTE ── */}
      <div className="booklet-page interior-page">
        <div className="page-header">
          <div className="page-header-brand">THESEUS</div>
          <div className="page-header-divider" />
          <div className="page-header-title">{l === 'es' ? 'Tu Cotización' : 'Your Quote'}</div>
        </div>

        <div className="investment-hero">
          <div className="investment-hero-label">{l === 'es' ? 'Inversión estimada total' : 'Estimated total investment'}</div>
          <div className="investment-hero-amount">${fmt(breakdown.total)} USD</div>
          <div className="investment-hero-meta">
            {breakdown.totalSqm} m² · ${fmt(breakdown.pricePerSqm)} USD/m²
          </div>
        </div>

        <div className="breakdown-list">
          {cats.map(cat => (
            <div key={cat.key} className="breakdown-row">
              <div className="breakdown-label">{catLabels[cat.key]}</div>
              <div className="breakdown-bar-wrap">
                <div className="breakdown-bar" style={{ width: `${cat.pct || 0}%` }} />
              </div>
              <div className="breakdown-pct">{cat.pct}%</div>
              <div className="breakdown-amt">${fmt(cat.amt)}</div>
            </div>
          ))}
        </div>

        <div className="team-section">
          <div className="team-title">{l === 'es' ? 'Configuración del equipo' : 'Team configuration'}</div>
          <div className="team-row">
            {(spaceConfig?.directors || 0) > 0 && (
              <div className="team-item">
                <span className="team-count">{spaceConfig.directors}</span>
                <span className="team-label">{l === 'es' ? 'Directores' : 'Directors'}</span>
              </div>
            )}
            {(spaceConfig?.managers || 0) > 0 && (
              <div className="team-item">
                <span className="team-count">{spaceConfig.managers}</span>
                <span className="team-label">{l === 'es' ? 'Gerentes' : 'Managers'}</span>
              </div>
            )}
            {(spaceConfig?.operatives || 0) > 0 && (
              <div className="team-item">
                <span className="team-count">{spaceConfig.operatives}</span>
                <span className="team-label">{l === 'es' ? 'Operativos' : 'Operatives'}</span>
              </div>
            )}
          </div>
          {selectedAmenities.length > 0 && (
            <div className="amenities-list">
              <span className="amenities-label">{l === 'es' ? 'Amenidades: ' : 'Amenities: '}</span>
              {selectedAmenities.map(a => aNames[a] || a).join(' · ')}
            </div>
          )}
        </div>
      </div>

      {/* ── PAGE 4: FINANCING ── */}
      <div className="booklet-page interior-page">
        <div className="page-header">
          <div className="page-header-brand">THESEUS</div>
          <div className="page-header-divider" />
          <div className="page-header-title">{l === 'es' ? 'Financiamiento' : 'Financing'}</div>
        </div>

        <div className="financing-headline">
          {l === 'es' ? 'Haz realidad tu oficina hoy' : 'Make your office a reality today'}
        </div>

        <div className="financing-badge">
          {l === 'es' ? '30% anticipo · 12 meses sin intereses' : '30% down · 12 months 0% interest'}
        </div>

        <div className="financing-grid">
          <div className="financing-box">
            <div className="financing-box-label">{l === 'es' ? 'Anticipo 30%' : '30% Down Payment'}</div>
            <div className="financing-box-amount">${fmt(downPayment)}</div>
            <div className="financing-box-sub">USD</div>
          </div>
          <div className="financing-box">
            <div className="financing-box-label">{t('finance.monthly_payment')}</div>
            <div className="financing-box-amount">${fmt(monthly)}</div>
            <div className="financing-box-sub">USD{t('finance.per_month')}</div>
          </div>
        </div>

        <p className="financing-disclaimer">
          {l === 'es'
            ? 'Sujeto a calificación crediticia. Tu asesor te explicará el proceso durante la llamada.'
            : 'Subject to credit approval. Your advisor will explain the qualification process during the call.'}
        </p>

        <div className="next-steps">
          <div className="next-steps-title">{l === 'es' ? 'Próximos pasos' : 'Next steps'}</div>
          {[
            l === 'es' ? 'Agenda tu llamada con un asesor Theseus' : 'Schedule your call with a Theseus advisor',
            l === 'es' ? 'Visita de sitio gratuita' : 'Free site visit',
            l === 'es' ? 'Propuesta ejecutiva detallada' : 'Detailed executive proposal',
            l === 'es' ? 'Inicio de obra' : 'Project kickoff',
          ].map((step, i) => (
            <div key={i} className="next-step-item">
              <div className="next-step-num">{i + 1}</div>
              <div className="next-step-text">{step}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── PAGE 5: CONTACT ── */}
      <div className="booklet-page contact-page">
        <div className="contact-brand">THESEUS</div>
        <div className="contact-tagline">
          {l === 'es' ? 'Espacios que inspiran, equipos que logran.' : 'Spaces that inspire, teams that achieve.'}
        </div>
        <div className="contact-website">theseus-office.com</div>
        <div className="qr-placeholder">
          <div className="qr-label">QR</div>
        </div>
        <div className="contact-promise">
          {l === 'es' ? 'Un asesor te contactará en menos de 24 horas' : 'An advisor will contact you within 24 hours'}
        </div>
        <div className="contact-footer">
          {l === 'es'
            ? 'Esta cotización es una referencia. El precio final se confirma tras la visita de sitio.'
            : 'This quote is a reference. Final price is confirmed after the site visit.'}
          <br />© {new Date().getFullYear()} THESEUS. {l === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.'}
        </div>
      </div>
    </div>
  );
}