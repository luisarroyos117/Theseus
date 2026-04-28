import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';

const defaultOfficeDesigns = [
  { name_en: "Polanco Executive", name_es: "Polanco Ejecutivo", style_key: "classic", size_min_sqm: 300, size_max_sqm: 600, price_from_usd: 270000, photos: ["https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80","https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80","https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80"], description_en: "A refined executive office blending warm wood tones, leather accents, and premium marble finishes.", description_es: "Una oficina ejecutiva refinada que combina tonos de madera cálida, detalles de cuero y acabados de mármol premium.", included_elements_en: "Premium marble reception desk\nWarm oak wood paneling\nLeather executive furniture\nAcoustic ceiling panels\nCustom wallcovering\nLED ambient lighting\nConference room with AV system\nPrivate executive offices", included_elements_es: "Recepción de mármol premium\nPaneles de madera de roble cálido\nMobiliario ejecutivo de cuero\nPaneles acústicos de plafón\nTapiz personalizado\nIluminación ambiental LED\nSala de juntas con sistema AV\nOficinas privadas ejecutivas", active: true, display_order: 1 },
  { name_en: "Reforma Modern", name_es: "Reforma Moderno", style_key: "modern", size_min_sqm: 200, size_max_sqm: 400, price_from_usd: 160000, photos: ["https://images.unsplash.com/photo-1568992688065-536aad8a12f6?w=800&q=80","https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=800&q=80","https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80"], description_en: "A sleek open-plan office with glass partitions, polished concrete floors, and clean geometric lines.", description_es: "Una oficina de planta abierta con particiones de vidrio, pisos de concreto pulido y líneas geométricas limpias.", included_elements_en: "Glass and aluminum partitions\nPolished concrete flooring\nMinimalist ergonomic workstations\nOpen collaboration zones\nModular lounge furniture\nIntelligent LED lighting\nHigh-speed IT infrastructure\nKitchenette with island", included_elements_es: "Particiones de vidrio y aluminio\nPiso de concreto pulido\nEstaciones de trabajo ergonómicas minimalistas\nZonas de colaboración abierta\nMobiliario lounge modular\nIluminación LED inteligente\nInfraestructura de TI de alta velocidad\nCocineta con isla", active: true, display_order: 2 },
  { name_en: "Santa Fe Industrial", name_es: "Santa Fe Industrial", style_key: "industrial", size_min_sqm: 400, size_max_sqm: 800, price_from_usd: 320000, photos: ["https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80","https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80","https://images.unsplash.com/photo-1568992688065-536aad8a12f6?w=800&q=80"], description_en: "Raw exposed concrete walls, steel beams, and reclaimed wood surfaces create an authentic industrial aesthetic.", description_es: "Muros de concreto expuesto, vigas de acero y superficies de madera recuperada crean una auténtica estética industrial.", included_elements_en: "Exposed concrete walls and ceilings\nSteel structural beams\nReclaimed wood flooring\nIndustrial pendant lighting\nOpen ductwork HVAC\nLoft-style meeting rooms\nCustom steel shelving\nBreak area with concrete countertops", included_elements_es: "Muros y plafones de concreto expuesto\nVigas estructurales de acero\nPiso de madera recuperada\nLuminarias industriales colgantes\nHVAC con ductos vistos\nSalas de juntas estilo loft\nEstanterías de acero a medida\nÁrea de descanso con encimeras de concreto", active: true, display_order: 3 },
  { name_en: "Insurgentes Biophilic", name_es: "Insurgentes Biofílico", style_key: "biophilic", size_min_sqm: 250, size_max_sqm: 500, price_from_usd: 210000, photos: ["https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80","https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80","https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=800&q=80"], description_en: "A wellness-focused workspace immersed in natural elements — living plant walls, bamboo surfaces, and abundant natural light.", description_es: "Un espacio de trabajo orientado al bienestar rodeado de elementos naturales: muros vegetales, superficies de bambú y abundante luz natural.", included_elements_en: "Living plant walls\nBamboo and wood natural surfaces\nBiophilic ceiling with skylights\nNatural fiber rugs and textiles\nSensory garden lounge area\nCircadian lighting system\nAir purification system\nNatural stone reception", included_elements_es: "Muros vegetales vivos\nSuperficies naturales de bambú y madera\nPlafón biofílico con claraboyas\nAlfombras y textiles de fibra natural\nÁrea lounge jardín sensorial\nSistema de iluminación circadiana\nSistema de purificación de aire\nRecepción de piedra natural", active: true, display_order: 4 },
  { name_en: "Bosques Minimalist", name_es: "Bosques Minimalista", style_key: "minimalist", size_min_sqm: 150, size_max_sqm: 300, price_from_usd: 115000, photos: ["https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80","https://images.unsplash.com/photo-1568992688065-536aad8a12f6?w=800&q=80","https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80"], description_en: "White space, precision craftsmanship, and intentional silence. Every element serves a purpose.", description_es: "El espacio blanco, la artesanía de precisión y el silencio intencional. Cada elemento tiene un propósito.", included_elements_en: "All-white seamless surfaces\nBuilt-in minimalist storage\nFlush LED ceiling lighting\nPrecision-cut stone flooring\nWhite lacquered furniture\nHidden cable management\nFloor-to-ceiling glazing\nMonochromatic reception", included_elements_es: "Superficies blancas sin costuras\nAlmacenamiento minimalista integrado\nIluminación de techo LED empotrada\nPiso de piedra cortada con precisión\nMobiliario lacado en blanco\nGestión de cables oculta\nMuros de piso a techo acristalados\nRecepción monocromática", active: true, display_order: 5 },
  { name_en: "Lomas Classic Plus", name_es: "Lomas Clásico Plus", style_key: "classic", size_min_sqm: 500, size_max_sqm: 1000, price_from_usd: 480000, photos: ["https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80","https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80","https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80"], description_en: "The pinnacle of classic corporate design — grand reception halls, private executive suites, and full AV-integrated boardrooms.", description_es: "El pináculo del diseño corporativo clásico: grandes halls de recepción, suites ejecutivas privadas y salas de consejo con AV integrado.", included_elements_en: "Grand marble reception hall\nImported Italian stone flooring\nCustom millwork and wainscoting\nFull executive suite wing\nBoardroom with integrated AV\nPaneled private offices\nExecutive dining room\nPremium acoustic wallcovering", included_elements_es: "Gran hall de recepción en mármol\nPiso de piedra italiana importada\nCarpintería y revestimiento personalizados\nAla de suite ejecutiva completa\nSala de consejo con AV integrado\nOficinas privadas con panelería\nComedor ejecutivo\nTapiz acústico premium", active: true, display_order: 6 },
];
import { useQueryClient } from '@tanstack/react-query';
import { useLanguage } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Database, Loader2, CheckCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const defaultPricing = [
  { style_key: 'modern', base_price_per_sqm: 850, pct_design: 11, pct_construction: 33, pct_furniture: 24, pct_finishes: 18, pct_electrical: 14 },
  { style_key: 'industrial', base_price_per_sqm: 780, pct_design: 10, pct_construction: 36, pct_furniture: 20, pct_finishes: 22, pct_electrical: 12 },
  { style_key: 'classic', base_price_per_sqm: 1100, pct_design: 12, pct_construction: 30, pct_furniture: 28, pct_finishes: 18, pct_electrical: 12 },
  { style_key: 'biophilic', base_price_per_sqm: 980, pct_design: 11, pct_construction: 32, pct_furniture: 22, pct_finishes: 22, pct_electrical: 13 },
  { style_key: 'minimalist', base_price_per_sqm: 820, pct_design: 10, pct_construction: 34, pct_furniture: 22, pct_finishes: 20, pct_electrical: 14 },
];

const defaultProducts = [
  { category: 'walls', name_en: 'Acoustic Panel', name_es: 'Panel Acústico', description_en: 'Sound-absorbing wall panels', description_es: 'Paneles absorbentes de sonido', price_usd: 85, active: true },
  { category: 'walls', name_en: 'Wallcovering', name_es: 'Tapiz Mural', description_en: 'Premium vinyl wallcovering', description_es: 'Tapiz vinílico premium', price_usd: 65, active: true },
  { category: 'walls', name_en: 'Paint Finish', name_es: 'Acabado en Pintura', description_en: 'High-end matte paint', description_es: 'Pintura mate de alta gama', price_usd: 35, active: true },
  { category: 'floors', name_en: 'Carpet Tile', name_es: 'Alfombra Modular', description_en: 'Interface carpet tile system', description_es: 'Sistema de alfombra modular', price_usd: 75, active: true },
  { category: 'floors', name_en: 'Engineered Wood', name_es: 'Madera Engineered', description_en: 'Oak engineered wood flooring', description_es: 'Piso de madera engineered roble', price_usd: 120, active: true },
  { category: 'floors', name_en: 'Porcelain Tile', name_es: 'Porcelanato', description_en: 'Large format porcelain', description_es: 'Porcelanato gran formato', price_usd: 90, active: true },
  { category: 'ceilings', name_en: 'Acoustic Ceiling', name_es: 'Plafón Acústico', description_en: 'Armstrong acoustic ceiling tiles', description_es: 'Plafón acústico Armstrong', price_usd: 55, active: true },
  { category: 'ceilings', name_en: 'Exposed Ceiling', name_es: 'Plafón Expuesto', description_en: 'Painted exposed concrete', description_es: 'Concreto expuesto pintado', price_usd: 40, active: true },
  { category: 'ceilings', name_en: 'Drywall Ceiling', name_es: 'Plafón de Tablaroca', description_en: 'Custom drywall ceiling', description_es: 'Plafón de tablaroca personalizado', price_usd: 65, active: true },
  { category: 'furniture', name_en: 'Executive Desk', name_es: 'Escritorio Ejecutivo', description_en: 'Premium executive desk with storage', description_es: 'Escritorio ejecutivo premium', price_usd: 1800, active: true },
  { category: 'furniture', name_en: 'Operative Chair', name_es: 'Silla Operativa', description_en: 'Ergonomic task chair', description_es: 'Silla de trabajo ergonómica', price_usd: 450, active: true },
  { category: 'furniture', name_en: 'Executive Chair', name_es: 'Silla Ejecutiva', description_en: 'Premium leather executive chair', description_es: 'Silla ejecutiva de piel premium', price_usd: 950, active: true },
  { category: 'blinds', name_en: 'Roller Blinds', name_es: 'Persianas Enrollables', description_en: 'Motorized roller blinds', description_es: 'Persianas enrollables motorizadas', price_usd: 110, active: true },
  { category: 'blinds', name_en: 'Sheer Curtains', name_es: 'Cortinas Traslúcidas', description_en: 'Elegant sheer curtains', description_es: 'Cortinas traslúcidas elegantes', price_usd: 85, active: true },
  { category: 'technology', name_en: 'Display Screen', name_es: 'Pantalla', description_en: '75-inch 4K display for meetings', description_es: 'Pantalla 4K de 75" para juntas', price_usd: 2200, active: true },
  { category: 'technology', name_en: 'Structured Cabling', name_es: 'Cableado Estructurado', description_en: 'Cat6A network cabling per point', description_es: 'Cableado Cat6A por punto', price_usd: 180, active: true },
  { category: 'technology', name_en: 'IT Equipment', name_es: 'Equipo de TI', description_en: 'Network switches, access points', description_es: 'Switches de red, access points', price_usd: 3500, active: true },
  { category: 'installations', name_en: 'AC System', name_es: 'Sistema de A/C', description_en: 'VRF air conditioning system', description_es: 'Sistema VRF de aire acondicionado', price_usd: 4500, active: true },
  { category: 'installations', name_en: 'Fire Protection', name_es: 'Protección contra Incendio', description_en: 'Sprinkler and detection system', description_es: 'Sistema de rociadores y detección', price_usd: 3200, active: true },
  { category: 'installations', name_en: 'Electrical System', name_es: 'Sistema Eléctrico', description_en: 'Complete electrical infrastructure', description_es: 'Infraestructura eléctrica completa', price_usd: 2800, active: true },
];

export default function SeedData() {
  const { lang } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [seeding, setSeeding] = useState(false);
  const [done, setDone] = useState(false);

  const handleSeed = async () => {
    setSeeding(true);
    // Check if data exists
    const existingPricing = await base44.entities.StylePricing.list();
    if (existingPricing.length === 0) {
      await base44.entities.StylePricing.bulkCreate(defaultPricing);
    }
    const existingProducts = await base44.entities.ProductCatalog.list();
    if (existingProducts.length === 0) {
      await base44.entities.ProductCatalog.bulkCreate(defaultProducts);
    }
    const existingDesigns = await base44.entities.OfficeDesign.list();
    if (existingDesigns.length === 0) {
      await base44.entities.OfficeDesign.bulkCreate(defaultOfficeDesigns);
    }
    queryClient.invalidateQueries();
    setSeeding(false);
    setDone(true);
    toast({ title: lang === 'es' ? 'Datos iniciales cargados' : 'Initial data loaded' });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center gap-4">
        <Database className="w-5 h-5 text-primary" />
        <div className="flex-1">
          <p className="font-body font-medium text-foreground text-sm">
            {lang === 'es' ? 'Cargar datos iniciales' : 'Load initial data'}
          </p>
          <p className="text-xs text-muted-foreground font-body">
            {lang === 'es' ? 'Carga precios base y catálogo de productos de ejemplo' : 'Load base pricing and sample product catalog'}
          </p>
        </div>
        <Button
          onClick={handleSeed}
          disabled={seeding || done}
          variant={done ? 'outline' : 'default'}
          className="font-body text-sm"
        >
          {seeding ? <Loader2 className="w-4 h-4 animate-spin" /> : done ? <><CheckCircle className="w-4 h-4 mr-1" /> {lang === 'es' ? 'Listo' : 'Done'}</> : lang === 'es' ? 'Cargar Datos' : 'Load Data'}
        </Button>
      </div>
    </div>
  );
}