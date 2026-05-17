import { neon } from '@neondatabase/serverless';

export async function POST(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const body = await request.json();
    const { user_id, current_password, new_password } = body;

    console.log('Changing password for user:', user_id);

    if (!user_id || !current_password || !new_password) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // First, verify the current password
    const user = await sql`
      SELECT user_password
      FROM mb_user
      WHERE user_id = ${user_id}
    `;

    if (user.length === 0) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    // In a real application, you would hash the password and compare
    // For now, we'll do a simple comparison (NOT SECURE - for demo only)
    if (user[0].user_password !== current_password) {
      return Response.json({ error: 'Current password is incorrect' }, { status: 400 });
    }

    // Update the password
    await sql`
      UPDATE mb_user
      SET user_password = ${new_password}
      WHERE user_id = ${user_id}
    `;

    console.log('Password updated successfully for user:', user_id);

    return Response.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    return Response.json({ error: 'Failed to change password' }, { status: 500 });
  }
}
