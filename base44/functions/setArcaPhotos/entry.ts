import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const designId = '69eea0483584e6d158c90369';
    const newPhotos = [
      'https://res.cloudinary.com/djtk3pcud/image/upload/v1777264233/df8df86f-9095-4710-8b32-ac1ae024c6b8_wi6mmw.png'
    ];

    await base44.entities.OfficeDesign.update(designId, { photos: newPhotos });

    return Response.json({ 
      success: true, 
      message: 'Arca photos updated',
      photos: newPhotos 
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});