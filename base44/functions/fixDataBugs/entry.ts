import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // BUG 1: Fix DesignPricing base_price_usd values
    const pricingUpdates = [
      { name: 'Arca', value: 950 },
      { name: 'Cima', value: 420 },
      { name: 'Nodo', value: 380 },
      { name: 'Axis', value: 250 },
      { name: 'Lumen', value: 880 },
      { name: 'AMMA', value: 530 }
    ];

    const allPricings = await base44.entities.DesignPricing.list();
    for (const update of pricingUpdates) {
      const record = allPricings.find(p => p.design_name === update.name);
      if (record) {
        await base44.entities.DesignPricing.update(record.id, { base_price_usd: update.value });
      }
    }

    // BUG 2: Fix SiteConfig hero_image_url
    const heroConfigs = await base44.entities.SiteConfig.filter({ key: 'hero_image_url' });
    if (heroConfigs.length > 0) {
      await base44.entities.SiteConfig.update(heroConfigs[0].id, { 
        value: 'https://res.cloudinary.com/djtk3pcud/image/upload/v1777264229/d90b77f3-3235-42c0-b92a-61894321fe79_oowdms.png'
      });
    }

    // BUG 3: Fix AMMA style_key
    const allDesigns = await base44.entities.OfficeDesign.list();
    const amma = allDesigns.find(d => d.name_es === 'AMMA');
    if (amma) {
      await base44.entities.OfficeDesign.update(amma.id, { style_key: 'modern' });
    }

    // BUG 4: Clear Cima photos
    const cima = allDesigns.find(d => d.name_es === 'Cima');
    if (cima) {
      await base44.entities.OfficeDesign.update(cima.id, { photos: [] });
    }

    return Response.json({ 
      success: true, 
      message: 'All 4 data bugs fixed',
      bugs: {
        bug1: '6 DesignPricing records updated with correct base_price_usd',
        bug2: 'SiteConfig hero_image_url updated to Cloudinary',
        bug3: 'AMMA style_key set to modern',
        bug4: 'Cima photos cleared to empty array'
      }
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});