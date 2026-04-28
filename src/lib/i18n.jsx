import React, { createContext, useContext, useState } from 'react';

const translations = {
  // Nav & general
  'nav.quoter': { en: 'Start Your Project', es: 'Inicia Tu Proyecto' },
  'nav.admin': { en: 'Backoffice', es: 'Backoffice' },
  'lang.toggle': { en: 'ES', es: 'EN' },

  // Steps
  'step.1': { en: 'Choose Your Style', es: 'Elige Tu Estilo' },
  'step.2': { en: 'Customize Your Space', es: 'Personaliza Tu Espacio' },
  'step.3': { en: 'Team & Amenities', es: 'Equipo y Amenidades' },
  'step.4': { en: 'Your Investment', es: 'Tu Inversión' },
  'step.5': { en: 'Get Your Quote', es: 'Obtén Tu Cotización' },

  // Styles
  'style.modern': { en: 'Modern', es: 'Moderno' },
  'style.modern.desc': { en: 'Clean lines, glass, open plan', es: 'Líneas limpias, vidrio, planta abierta' },
  'style.industrial': { en: 'Industrial', es: 'Industrial' },
  'style.industrial.desc': { en: 'Exposed concrete, metal, raw textures', es: 'Concreto expuesto, metal, texturas crudas' },
  'style.classic': { en: 'Classic', es: 'Clásico' },
  'style.classic.desc': { en: 'Warm woods, refined finishes, timeless', es: 'Maderas cálidas, acabados refinados, atemporal' },
  'style.biophilic': { en: 'Biophilic', es: 'Biofílico' },
  'style.biophilic.desc': { en: 'Natural materials, plants, wellness-focused', es: 'Materiales naturales, plantas, enfoque wellness' },
  'style.minimalist': { en: 'Minimalist', es: 'Minimalista' },
  'style.minimalist.desc': { en: 'White space, precision, less is more', es: 'Espacio blanco, precisión, menos es más' },

  // Categories
  'cat.walls': { en: 'Walls', es: 'Muros' },
  'cat.floors': { en: 'Floors', es: 'Pisos' },
  'cat.ceilings': { en: 'Ceilings', es: 'Plafones' },
  'cat.furniture': { en: 'Furniture', es: 'Mobiliario' },
  'cat.blinds': { en: 'Blinds & Curtains', es: 'Persianas y Cortinas' },
  'cat.technology': { en: 'Technology', es: 'Tecnología' },
  'cat.installations': { en: 'Installations', es: 'Instalaciones' },

  // Space config
  'space.have': { en: 'I have a space', es: 'Tengo un espacio' },
  'space.looking': { en: "I'm looking for a space", es: 'Busco un espacio' },
  'space.sqm': { en: 'Square meters (m²)', es: 'Metros cuadrados (m²)' },
  'space.corridor': { en: 'Preferred corridor in CDMX', es: 'Corredor preferido en CDMX' },
  'space.directors': { en: 'Directors', es: 'Directores' },
  'space.managers': { en: 'Managers', es: 'Gerentes' },
  'space.operatives': { en: 'Operatives', es: 'Operativos' },
  'space.sqm_each': { en: 'm² each', es: 'm² c/u' },

  // Amenities
  'amenity.reception': { en: 'Reception', es: 'Recepción' },
  'amenity.kitchen': { en: 'Kitchen', es: 'Cocineta' },
  'amenity.dining': { en: 'Dining Room', es: 'Comedor' },
  'amenity.meeting': { en: 'Meeting Room', es: 'Sala de Juntas' },
  'amenity.bathrooms': { en: 'Bathrooms', es: 'Baños' },
  'amenity.server': { en: 'Server Room', es: 'Site / Servidor' },
  'amenity.lounge': { en: 'Lounge', es: 'Lounge' },

  // Quote
  'quote.total': { en: 'Total Investment', es: 'Inversión Total' },
  'quote.breakdown': { en: 'Investment Breakdown', es: 'Desglose de Inversión' },
  'quote.design': { en: 'Design & Executive Project', es: 'Diseño y Proyecto Ejecutivo' },
  'quote.construction': { en: 'Construction & Civil Works', es: 'Obra Civil y Construcción' },
  'quote.furniture': { en: 'Furniture & Ergonomics', es: 'Mobiliario y Ergonomía' },
  'quote.finishes': { en: 'Finishes & Materials', es: 'Acabados y Materiales' },
  'quote.electrical': { en: 'Electrical, HVAC & Data', es: 'Eléctrico, HVAC y Datos' },
  'quote.turnkey': { en: 'Turnkey, all-inclusive', es: 'Llave en mano, todo incluido' },
  'quote.usd': { en: 'USD', es: 'USD' },

  // Lead form
  'lead.name': { en: 'Full Name', es: 'Nombre Completo' },
  'lead.company': { en: 'Company', es: 'Empresa' },
  'lead.email': { en: 'Email', es: 'Correo Electrónico' },
  'lead.phone': { en: 'WhatsApp / Phone', es: 'WhatsApp / Teléfono' },
  'lead.submit': { en: 'Request Quote', es: 'Solicitar Cotización' },
  'lead.success': { en: 'Thank you! We\'ll contact you shortly.', es: '¡Gracias! Te contactaremos pronto.' },

  // Financing
  'finance.option': { en: 'Financing option', es: 'Opción de financiamiento' },
  'finance.down_months': { en: '30% down · 12 months 0% interest', es: '30% anticipo · 12 meses sin intereses' },
  'finance.down_label': { en: '30% Down', es: 'Anticipo 30%' },
  'finance.monthly_label': { en: 'Monthly', es: 'Mensualidad' },
  'finance.subject_credit': { en: 'Subject to credit approval.', es: 'Sujeto a calificación crediticia.' },
  'finance.down_payment': { en: '30% Down Payment', es: 'Anticipo 30%' },
  'finance.monthly_payment': { en: '12 monthly payments of', es: '12 mensualidades de' },
  'finance.per_month': { en: '/mo', es: '/mes' },
  'finance.badge': { en: '30% down · 12 months · 0% interest', es: '30% anticipo · 12 meses sin intereses · 0% interés' },
  'finance.qualification': { en: 'Subject to credit approval. Your advisor will explain the qualification process during the call.', es: 'Sujeto a calificación crediticia. Tu asesor te explicará el proceso durante la llamada.' },

  // Quote
  'quote.no_pricing': { en: 'No pricing available for this design.', es: 'No hay cotización disponible para este diseño.' },
  'quote.investment_turnkey': { en: 'Total investment · Turnkey', es: 'Inversión total · Llave en mano' },
  'quote.detailed_breakdown': { en: 'Detailed breakdown', es: 'Desglose detallado' },
  'quote.formal_request': { en: 'REQUEST FORMAL QUOTE →', es: 'SOLICITAR COTIZACIÓN FORMAL →' },
  'quote.no_commitment': { en: 'No commitment · No cost · Response in 24h', es: 'Sin compromiso · Sin costo · Respuesta en 24h' },
  'quote.save_proposal': { en: 'Save your full proposal:', es: 'Guarda tu propuesta completa:' },
  'quote.download_pdf': { en: 'DOWNLOAD PDF / DESCARGAR PDF →', es: 'DESCARGAR PDF / DOWNLOAD PDF →' },

  // Lead capture
  'lead.contact_header': { en: 'Contact', es: 'Contacto' },
  'lead.tell_us': { en: 'Tell us about yourself', es: 'Cuéntanos sobre ti' },
  'lead.get_quote_24h': { en: 'Receive your formal quote within 24 hours.', es: 'Recibe tu cotización formal en 24 horas.' },
  'lead.full_name': { en: 'Full name', es: 'Nombre completo' },
  'lead.company_label': { en: 'Company', es: 'Empresa' },
  'lead.email_label': { en: 'Email', es: 'Correo electrónico' },
  'lead.request_quote_btn': { en: 'REQUEST QUOTE →', es: 'SOLICITAR COTIZACIÓN →' },
  'lead.success_header': { en: 'Request submitted', es: 'Solicitud enviada' },
  'lead.perfect': { en: 'Perfect', es: 'Perfecto' },
  'lead.will_contact': { en: 'Your Theseus advisor will contact you before', es: 'Tu asesor Theseus te contactará antes del' },
  'lead.quote_summary': { en: 'Quote summary', es: 'Resumen de cotización' },
  'lead.design': { en: 'Design', es: 'Diseño' },
  'lead.area': { en: 'Area', es: 'Área' },
  'lead.price_per_sqm': { en: 'Price/m²', es: 'Precio/m²' },
  'lead.est_investment': { en: 'Est. investment', es: 'Inversión estimada' },

  // Buttons
  'btn.next': { en: 'Continue', es: 'Continuar' },
  'btn.back': { en: 'Back', es: 'Atrás' },
  'btn.start': { en: 'Start Quoting', es: 'Comenzar Cotización' },

  // Admin
  'admin.pricing': { en: 'Pricing Manager', es: 'Gestor de Precios' },
  'admin.catalog': { en: 'Product Catalog', es: 'Catálogo de Productos' },
  'admin.leads': { en: 'Leads Dashboard', es: 'Dashboard de Leads' },
  'admin.images': { en: 'Style Images', es: 'Imágenes de Estilos' },
  'admin.save': { en: 'Save Changes', es: 'Guardar Cambios' },
  'admin.export': { en: 'Export CSV', es: 'Exportar CSV' },
  'admin.status': { en: 'Status', es: 'Estado' },
  };

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('es');
  const toggleLang = () => setLang(l => l === 'es' ? 'en' : 'es');
  const t = (key) => translations[key]?.[lang] || key;
  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}