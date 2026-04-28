import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const ADMIN_EMAIL = 'hola@theseus-office.com';

function fmtUSD(n) {
  return '$' + (n || 0).toLocaleString('en-US', { maximumFractionDigits: 0 }) + ' USD';
}

function clientEmailHTML(lang, contactInfo, selectedDesign, breakdown, spaceConfig) {
  const isEs = lang === 'es';
  const designName = isEs ? (selectedDesign?.name_es || '') : (selectedDesign?.name_en || '');
  const heroPhoto = selectedDesign?.photos?.[0] || '';
  const includedElements = isEs
    ? (selectedDesign?.included_elements_es || '')
    : (selectedDesign?.included_elements_en || '');
  const elementsHTML = includedElements
    .split('\n')
    .filter(Boolean)
    .map(el => `<li style="margin:4px 0;color:#c8b89a;">${el.trim()}</li>`)
    .join('');

  const amenityLabels = {
    reception: isEs ? 'Recepción' : 'Reception',
    kitchen: isEs ? 'Cocineta' : 'Kitchen',
    dining: isEs ? 'Comedor' : 'Dining Room',
    meeting: isEs ? 'Salas de Juntas' : 'Meeting Rooms',
    bathrooms: isEs ? 'Baños' : 'Bathrooms',
    server: isEs ? 'Site / Servidor' : 'Server Room',
    lounge: 'Lounge',
    ac: isEs ? 'Aire Acondicionado' : 'AC System',
    fire: isEs ? 'Protección contra Incendios' : 'Fire Protection',
    it_screens: isEs ? 'TI / Pantallas' : 'IT / Screens',
  };

  const amenitiesHTML = (spaceConfig?.selectedAmenities || [])
    .map(k => `<span style="display:inline-block;background:#2a2d35;color:#c8b89a;border-radius:4px;padding:3px 10px;margin:3px;font-size:13px;">${amenityLabels[k] || k}</span>`)
    .join('');

  const breakdown_rows = [
    { label: isEs ? 'Diseño & Proyecto Ejecutivo' : 'Design & Executive Project', pct: breakdown?.pct_design, amt: breakdown?.amt_design },
    { label: isEs ? 'Construcción & Obra Civil' : 'Construction & Civil Works', pct: breakdown?.pct_construction, amt: breakdown?.amt_construction },
    { label: isEs ? 'Mobiliario & Ergonomía' : 'Furniture & Ergonomics', pct: breakdown?.pct_furniture, amt: breakdown?.amt_furniture },
    { label: isEs ? 'Acabados (paneles, pisos, persianas)' : 'Finishes (acoustic, flooring, blinds)', pct: breakdown?.pct_finishes, amt: breakdown?.amt_finishes },
    { label: isEs ? 'Eléctrico, HVAC & Datos' : 'Electrical, HVAC & Data', pct: breakdown?.pct_electrical, amt: breakdown?.amt_electrical },
  ];

  const breakdownRowsHTML = breakdown_rows.map(r => `
    <tr>
      <td style="padding:10px 14px;color:#c8b89a;font-size:14px;border-bottom:1px solid #2a2d35;">${r.label}</td>
      <td style="padding:10px 14px;color:#8a8d96;font-size:14px;border-bottom:1px solid #2a2d35;text-align:center;">${r.pct || 0}%</td>
      <td style="padding:10px 14px;color:#e8dcc8;font-size:14px;border-bottom:1px solid #2a2d35;text-align:right;font-weight:600;">${fmtUSD(r.amt)}</td>
    </tr>
  `).join('');

  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0f1117;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:620px;margin:0 auto;background:#0f1117;">

    <!-- HEADER -->
    <div style="background:#13161e;padding:40px 40px 32px;text-align:center;border-bottom:1px solid #2a2d35;">
      <div style="font-size:28px;font-weight:700;letter-spacing:6px;color:#e8dcc8;font-family:Georgia,serif;">THESEUS</div>
      <div style="margin-top:10px;font-size:14px;color:#8a8d96;letter-spacing:2px;">
        ${isEs ? 'Tu oficina ideal, hecha realidad' : 'Your ideal office, brought to life'}
      </div>
    </div>

    <!-- GREETING -->
    <div style="padding:32px 40px 0;">
      <p style="font-size:18px;color:#e8dcc8;margin:0 0 8px;">
        ${isEs ? `Hola ${contactInfo.full_name?.split(' ')[0] || ''},` : `Hi ${contactInfo.full_name?.split(' ')[0] || ''},`}
      </p>
      <p style="font-size:14px;color:#8a8d96;margin:0;">
        ${isEs
          ? 'Aquí está el resumen de tu cotización personalizada con Theseus.'
          : 'Here is a summary of your personalized Theseus quote.'}
      </p>
    </div>

    <!-- DESIGN SECTION -->
    <div style="padding:32px 40px;">
      <div style="font-size:10px;letter-spacing:3px;color:#c29b5a;text-transform:uppercase;margin-bottom:16px;">
        ${isEs ? 'Diseño Seleccionado' : 'Selected Design'}
      </div>
      ${heroPhoto ? `<img src="${heroPhoto}" alt="${designName}" style="width:100%;border-radius:8px;margin-bottom:20px;display:block;" />` : ''}
      <div style="background:#13161e;border:1px solid #2a2d35;border-radius:8px;padding:24px;">
        <div style="font-size:22px;font-weight:700;color:#e8dcc8;font-family:Georgia,serif;margin-bottom:8px;">${designName}</div>
        <div style="font-size:13px;color:#8a8d96;margin-bottom:16px;text-transform:capitalize;">
          ${selectedDesign?.style_key || ''} · ${(selectedDesign?.quality_tiers || []).join(', ')}
        </div>
        ${elementsHTML ? `
        <div style="font-size:12px;letter-spacing:2px;color:#c29b5a;text-transform:uppercase;margin-bottom:10px;">${isEs ? 'Incluye' : 'Includes'}</div>
        <ul style="margin:0;padding-left:18px;">${elementsHTML}</ul>
        ` : ''}
      </div>
    </div>

    <!-- QUOTE SECTION -->
    <div style="padding:0 40px 32px;">
      <div style="font-size:10px;letter-spacing:3px;color:#c29b5a;text-transform:uppercase;margin-bottom:16px;">
        ${isEs ? 'Tu Cotización' : 'Your Quote'}
      </div>
      <div style="background:#13161e;border:1px solid #2a2d35;border-radius:8px;padding:24px;margin-bottom:20px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <span style="font-size:13px;color:#8a8d96;">${isEs ? 'Inversión total estimada' : 'Total estimated investment'}</span>
        </div>
        <div style="font-size:32px;font-weight:700;color:#c29b5a;margin-bottom:4px;">
          ${fmtUSD(breakdown?.total)}
        </div>
        <div style="font-size:12px;color:#6a6d76;">
          ${isEs ? 'Rango referencial:' : 'Reference range:'} ${fmtUSD(breakdown?.totalMin)} – ${fmtUSD(breakdown?.totalMax)}
        </div>
        <div style="display:flex;gap:24px;margin-top:16px;padding-top:16px;border-top:1px solid #2a2d35;">
          <div>
            <div style="font-size:11px;color:#6a6d76;margin-bottom:2px;">${isEs ? 'Superficie' : 'Area'}</div>
            <div style="font-size:15px;color:#e8dcc8;font-weight:600;">${breakdown?.totalSqm || 0} m²</div>
          </div>
          <div>
            <div style="font-size:11px;color:#6a6d76;margin-bottom:2px;">${isEs ? 'Precio/m²' : 'Price/m²'}</div>
            <div style="font-size:15px;color:#e8dcc8;font-weight:600;">${fmtUSD(breakdown?.pricePerSqm)}/m²</div>
          </div>
        </div>
      </div>

      <!-- Breakdown table -->
      <table style="width:100%;border-collapse:collapse;background:#13161e;border:1px solid #2a2d35;border-radius:8px;overflow:hidden;">
        <thead>
          <tr style="background:#1d2029;">
            <th style="padding:10px 14px;text-align:left;font-size:11px;letter-spacing:2px;color:#6a6d76;text-transform:uppercase;">${isEs ? 'Concepto' : 'Category'}</th>
            <th style="padding:10px 14px;text-align:center;font-size:11px;letter-spacing:2px;color:#6a6d76;text-transform:uppercase;">%</th>
            <th style="padding:10px 14px;text-align:right;font-size:11px;letter-spacing:2px;color:#6a6d76;text-transform:uppercase;">USD</th>
          </tr>
        </thead>
        <tbody>${breakdownRowsHTML}</tbody>
      </table>
    </div>

    <!-- CONFIGURATION -->
    <div style="padding:0 40px 32px;">
      <div style="font-size:10px;letter-spacing:3px;color:#c29b5a;text-transform:uppercase;margin-bottom:16px;">
        ${isEs ? 'Tu Configuración' : 'Your Configuration'}
      </div>
      <div style="background:#13161e;border:1px solid #2a2d35;border-radius:8px;padding:24px;space-y:8px;">
        <div style="margin-bottom:12px;">
          <span style="font-size:12px;color:#6a6d76;">${isEs ? 'Equipo:' : 'Team:'}</span>
          <span style="font-size:14px;color:#c8b89a;margin-left:8px;">
            ${[
              spaceConfig?.directors > 0 ? `${spaceConfig.directors} ${isEs ? 'Director(es)' : 'Director(s)'}` : '',
              spaceConfig?.managers > 0 ? `${spaceConfig.managers} ${isEs ? 'Gerente(s)' : 'Manager(s)'}` : '',
              spaceConfig?.operatives > 0 ? `${spaceConfig.operatives} ${isEs ? 'Operativo(s)' : 'Operative(s)'}` : '',
            ].filter(Boolean).join(', ') || '—'}
          </span>
        </div>
        ${spaceConfig?.corridor ? `
        <div style="margin-bottom:12px;">
          <span style="font-size:12px;color:#6a6d76;">${isEs ? 'Corredor:' : 'Corridor:'}</span>
          <span style="font-size:14px;color:#c8b89a;margin-left:8px;">${spaceConfig.corridor}</span>
        </div>` : ''}
        ${amenitiesHTML ? `
        <div>
          <div style="font-size:12px;color:#6a6d76;margin-bottom:8px;">${isEs ? 'Amenidades:' : 'Amenities:'}</div>
          <div>${amenitiesHTML}</div>
        </div>` : ''}
      </div>
    </div>

    <!-- FINANCING -->
    <div style="padding:0 40px 32px;">
      <div style="font-size:10px;letter-spacing:3px;color:#c29b5a;text-transform:uppercase;margin-bottom:16px;">
        ${isEs ? 'Opción de Financiamiento' : 'Financing Option'}
      </div>
      <div style="background:#13161e;border:1px solid #2a2d35;border-radius:8px;padding:24px;">
        <div style="display:inline-block;background:#c29b5a22;color:#c29b5a;border:1px solid #c29b5a44;border-radius:20px;padding:4px 14px;font-size:12px;margin-bottom:20px;">
          ${isEs ? '30% anticipo · 12 meses sin intereses' : '30% down · 12 months 0% interest'}
        </div>
        <div style="display:flex;gap:24px;flex-wrap:wrap;">
          <div style="flex:1;min-width:140px;background:#1d2029;border-radius:8px;padding:16px;text-align:center;">
            <div style="font-size:11px;color:#6a6d76;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">${isEs ? 'Anticipo' : 'Down Payment'}</div>
            <div style="font-size:24px;font-weight:700;color:#e8dcc8;">${fmtUSD(Math.round((breakdown?.total || 0) * 0.30))}</div>
            <div style="font-size:11px;color:#6a6d76;margin-top:4px;">30%</div>
          </div>
          <div style="flex:1;min-width:140px;background:#1d2029;border-radius:8px;padding:16px;text-align:center;">
            <div style="font-size:11px;color:#6a6d76;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">${isEs ? 'Mensualidad' : 'Monthly Payment'}</div>
            <div style="font-size:24px;font-weight:700;color:#e8dcc8;">${fmtUSD(Math.round(((breakdown?.total || 0) * 0.70) / 12))}</div>
            <div style="font-size:11px;color:#6a6d76;margin-top:4px;">${isEs ? '× 12 meses' : '× 12 months'}</div>
          </div>
        </div>
        <p style="margin:16px 0 0;font-size:12px;color:#6a6d76;text-align:center;">
          ${isEs ? 'Pregunta a tu asesor sobre opciones de financiamiento.' : 'Ask your advisor about financing options.'}
        </p>
      </div>
    </div>

    <!-- NEXT STEPS -->
    <div style="padding:0 40px 32px;">
      <div style="background:linear-gradient(135deg,#1d2029,#13161e);border:1px solid #c29b5a33;border-radius:8px;padding:28px;text-align:center;">
        <div style="font-size:14px;color:#c29b5a;font-weight:600;margin-bottom:8px;">
          ${isEs ? '¿Qué sigue?' : 'What\'s next?'}
        </div>
        <p style="font-size:14px;color:#c8b89a;margin:0 0 16px;line-height:1.7;">
          ${isEs
            ? 'Un asesor Theseus te contactará antes de mañana para agendar tu llamada de 30 minutos sin compromiso.'
            : 'A Theseus advisor will contact you before tomorrow to schedule your complimentary 30-minute call.'}
        </p>
        <a href="https://theseus-office.com" style="display:inline-block;background:#c29b5a;color:#0f1117;text-decoration:none;padding:12px 28px;border-radius:6px;font-size:13px;font-weight:700;letter-spacing:1px;">
          theseus-office.com
        </a>
      </div>
    </div>

    <!-- FOOTER -->
    <div style="padding:24px 40px;border-top:1px solid #2a2d35;text-align:center;">
      <div style="font-size:20px;font-weight:700;letter-spacing:5px;color:#3a3d45;font-family:Georgia,serif;margin-bottom:10px;">THESEUS</div>
      <p style="font-size:11px;color:#4a4d55;margin:0;line-height:1.6;">
        ${isEs
          ? 'Este presupuesto es una referencia. El precio final se define tras visita de sitio y levantamiento de requerimientos.'
          : 'This quote is a reference estimate. Final pricing is confirmed after site visit and requirements assessment.'}
      </p>
    </div>

  </div>
</body>
</html>`;
}

function adminEmailHTML(contactInfo, selectedDesign, breakdown, spaceConfig) {
  const amenityLabels = {
    reception: 'Recepción', kitchen: 'Cocineta', dining: 'Comedor',
    meeting: 'Salas de Juntas', bathrooms: 'Baños', server: 'Site / Servidor',
    lounge: 'Lounge', ac: 'Aire Acondicionado', fire: 'Protección Incendios', it_screens: 'TI / Pantallas',
  };

  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:20px;background:#f5f5f5;font-family:Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;border:1px solid #ddd;">
    <div style="background:#0f1117;padding:24px;text-align:center;">
      <div style="font-size:22px;font-weight:700;letter-spacing:5px;color:#c29b5a;">THESEUS</div>
      <div style="font-size:12px;color:#8a8d96;margin-top:4px;">Nuevo Lead</div>
    </div>
    <div style="padding:28px;">
      <table style="width:100%;border-collapse:collapse;">
        <tr><td colspan="2" style="padding:0 0 14px;font-size:11px;letter-spacing:2px;color:#c29b5a;text-transform:uppercase;">Cliente</td></tr>
        <tr><td style="padding:6px 0;font-size:13px;color:#555;width:140px;">Nombre</td><td style="padding:6px 0;font-size:13px;font-weight:600;color:#111;">${contactInfo.full_name || '—'}</td></tr>
        <tr><td style="padding:6px 0;font-size:13px;color:#555;">Empresa</td><td style="padding:6px 0;font-size:13px;font-weight:600;color:#111;">${contactInfo.company || '—'}</td></tr>
        <tr><td style="padding:6px 0;font-size:13px;color:#555;">Email</td><td style="padding:6px 0;font-size:13px;color:#111;"><a href="mailto:${contactInfo.email}" style="color:#c29b5a;">${contactInfo.email || '—'}</a></td></tr>
        <tr><td style="padding:6px 0;font-size:13px;color:#555;">WhatsApp</td><td style="padding:6px 0;font-size:13px;color:#111;">${contactInfo.phone || '—'}</td></tr>
        
        <tr><td colspan="2" style="padding:20px 0 14px;font-size:11px;letter-spacing:2px;color:#c29b5a;text-transform:uppercase;">Cotización</td></tr>
        <tr><td style="padding:6px 0;font-size:13px;color:#555;">Diseño</td><td style="padding:6px 0;font-size:13px;font-weight:600;color:#111;">${selectedDesign?.name_es || selectedDesign?.name_en || '—'}</td></tr>
        <tr><td style="padding:6px 0;font-size:13px;color:#555;">Estilo</td><td style="padding:6px 0;font-size:13px;color:#111;text-transform:capitalize;">${selectedDesign?.style_key || '—'}</td></tr>
        <tr><td style="padding:6px 0;font-size:13px;color:#555;">Superficie</td><td style="padding:6px 0;font-size:13px;color:#111;">${breakdown?.totalSqm || 0} m²</td></tr>
        <tr><td style="padding:6px 0;font-size:13px;color:#555;">Precio/m²</td><td style="padding:6px 0;font-size:13px;color:#111;">${fmtUSD(breakdown?.pricePerSqm)}/m²</td></tr>
        <tr style="background:#fafafa;">
          <td style="padding:10px 6px;font-size:14px;font-weight:700;color:#0f1117;">Inversión estimada</td>
          <td style="padding:10px 6px;font-size:16px;font-weight:700;color:#c29b5a;">${fmtUSD(breakdown?.total)}</td>
        </tr>

        <tr><td colspan="2" style="padding:20px 0 14px;font-size:11px;letter-spacing:2px;color:#c29b5a;text-transform:uppercase;">Equipo</td></tr>
        <tr><td style="padding:6px 0;font-size:13px;color:#555;">Directores</td><td style="padding:6px 0;font-size:13px;color:#111;">${spaceConfig?.directors || 0}</td></tr>
        <tr><td style="padding:6px 0;font-size:13px;color:#555;">Gerentes</td><td style="padding:6px 0;font-size:13px;color:#111;">${spaceConfig?.managers || 0}</td></tr>
        <tr><td style="padding:6px 0;font-size:13px;color:#555;">Operativos</td><td style="padding:6px 0;font-size:13px;color:#111;">${spaceConfig?.operatives || 0}</td></tr>
        ${spaceConfig?.corridor ? `<tr><td style="padding:6px 0;font-size:13px;color:#555;">Corredor</td><td style="padding:6px 0;font-size:13px;color:#111;">${spaceConfig.corridor}</td></tr>` : ''}
        ${(spaceConfig?.selectedAmenities || []).length > 0 ? `
        <tr><td style="padding:6px 0;font-size:13px;color:#555;vertical-align:top;">Amenidades</td><td style="padding:6px 0;font-size:13px;color:#111;">${(spaceConfig.selectedAmenities || []).map(k => amenityLabels[k] || k).join(', ')}</td></tr>
        ` : ''}
      </table>

      <div style="margin-top:24px;text-align:center;">
        <a href="https://app.base44.com" style="display:inline-block;background:#0f1117;color:#c29b5a;text-decoration:none;padding:10px 24px;border-radius:6px;font-size:13px;font-weight:600;">Ver en Backoffice →</a>
      </div>
    </div>
  </div>
</body>
</html>`;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { lang, contactInfo, selectedDesign, breakdown, spaceConfig } = await req.json();

    const isEs = lang === 'es';
    const designName = isEs ? (selectedDesign?.name_es || '') : (selectedDesign?.name_en || '');

    // Email to client
    await base44.asServiceRole.integrations.Core.SendEmail({
      to: contactInfo.email,
      from_name: 'Theseus',
      subject: isEs
        ? `Tu cotización Theseus · ${designName}`
        : `Your Theseus Quote · ${designName}`,
      body: clientEmailHTML(lang, contactInfo, selectedDesign, breakdown, spaceConfig),
    });

    // Email to admin
    await base44.asServiceRole.integrations.Core.SendEmail({
      to: ADMIN_EMAIL,
      from_name: 'Theseus Leads',
      subject: `Nuevo lead Theseus — ${contactInfo.full_name} · ${contactInfo.company || '—'} · ${fmtUSD(breakdown?.total)}`,
      body: adminEmailHTML(contactInfo, selectedDesign, breakdown, spaceConfig),
    });

    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});