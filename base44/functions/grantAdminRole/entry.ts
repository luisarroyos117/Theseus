import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { email } = await req.json();
    if (!email) {
      return Response.json({ error: 'Email is required' }, { status: 400 });
    }

    // Find user by email
    const users = await base44.asServiceRole.entities.User.filter({ email });
    if (users.length === 0) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    const targetUser = users[0];

    // Update role to admin
    await base44.asServiceRole.entities.User.update(targetUser.id, { role: 'admin' });

    return Response.json({ success: true, message: `${email} is now an admin` });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});