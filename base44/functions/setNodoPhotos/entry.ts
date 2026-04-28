import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const designId = '69eea0483584e6d158c9036b';
    const newPhotos = [
      'https://res.cloudinary.com/djtk3pcud/image/upload/f_auto,q_auto/3b9d7926-dfd4-4b67-882f-1a087df5583c_x8vpij',
      'https://res.cloudinary.com/djtk3pcud/image/upload/v1777264081/9d0963f5-249b-4cd4-a91c-976d0a6dc89a_wz3ps3.png'
    ];

    await base44.entities.OfficeDesign.update(designId, { photos: newPhotos });

    return Response.json({ 
      success: true, 
      message: 'Nodo photos updated',
      photos: newPhotos 
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});