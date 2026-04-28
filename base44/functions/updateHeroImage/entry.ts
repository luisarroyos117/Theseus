import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const imageUrl = 'https://res.cloudinary.com/djtk3pcud/image/upload/v1777264229/d90b77f3-3235-42c0-b92a-61894321fe79_oowdms.png';
    
    // Find and update, or create if doesn't exist
    const existing = await base44.entities.SiteConfig.filter({ key: 'hero_image_url' });
    
    if (existing.length > 0) {
      await base44.entities.SiteConfig.update(existing[0].id, { value: imageUrl });
    } else {
      await base44.entities.SiteConfig.create({ key: 'hero_image_url', value: imageUrl, section: 'hero' });
    }

    return Response.json({ success: true, message: 'Hero image updated', url: imageUrl });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});