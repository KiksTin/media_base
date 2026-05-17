import { neon } from '@neondatabase/serverless';

export async function POST(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const body = await request.json();
    const { user_id, new_username, password } = body;

    console.log('Changing username for user:', user_id);

    if (!user_id || !new_username || !password) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // First, verify the password
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
    if (user[0].user_password !== password) {
      return Response.json({ error: 'Password is incorrect' }, { status: 400 });
    }

    // Check if the new username is already taken
    const existingUser = await sql`
      SELECT user_id
      FROM mb_user
      WHERE user_name = ${new_username}
    `;

    if (existingUser.length > 0) {
      return Response.json({ error: 'Username is already in use' }, { status: 400 });
    }

    // Update the username
    await sql`
      UPDATE mb_user
      SET user_name = ${new_username}
      WHERE user_id = ${user_id}
    `;

    console.log('Username updated successfully for user:', user_id);

    return Response.json({ success: true, message: 'Username changed successfully' });
  } catch (error) {
    console.error('Error changing username:', error);
    return Response.json({ error: 'Failed to change username' }, { status: 500 });
  }
}
