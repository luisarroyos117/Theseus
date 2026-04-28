import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // Find the OfficeDesign with name_es "Nodo"
    const designs = await base44.entities.OfficeDesign.list();
    const nodoDesign = designs.find(d => d.name_es === 'Nodo');

    if (!nodoDesign) {
      return Response.json({ error: 'Design "Nodo" not found' }, { status: 404 });
    }

    // Filter out ibb.co URLs, keep Cloudinary URLs
    const currentPhotos = nodoDesign.photos || [];
    const cloudinaryPhotos = currentPhotos.filter(url => url && url.includes('cloudinary'));
    
    // New Cloudinary URL as first item
    const newCloudinaryUrl = 'https://res.cloudinary.com/djtk3pcud/image/upload/f_auto,q_auto/3b9d7926-dfd4-4b67-882f-1a087df5583c_x8vpij';
    const updatedPhotos = [newCloudinaryUrl, ...cloudinaryPhotos];

    // Update the record
    await base44.entities.OfficeDesign.update(nodoDesign.id, { photos: updatedPhotos });

    return Response.json({ 
      success: true, 
      design: nodoDesign.name_es,
      previousPhotosCount: currentPhotos.length,
      newPhotosCount: updatedPhotos.length,
      photos: updatedPhotos 
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});