import { neon } from '@neondatabase/serverless';

export async function POST(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const body = await request.json();
    const { user_id, password } = body;

    console.log('Deleting account for user:', user_id);

    if (!user_id || !password) {
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

    // Delete user's playlists
    await sql`
      DELETE FROM mb_playlist
      WHERE user_id = ${user_id}
    `;

    // Delete user's songs
    await sql`
      DELETE FROM mb_song_tbl
      WHERE user_id = ${user_id}
    `;

    // Delete user's comments
    await sql`
      DELETE FROM mb_comment
      WHERE user_id = ${user_id}
    `;

    // Delete user's recent plays
    await sql`
      DELETE FROM mb_recent
      WHERE user_id = ${user_id}
    `;

    // Delete the user account
    await sql`
      DELETE FROM mb_user
      WHERE user_id = ${user_id}
    `;

    console.log('Account deleted successfully for user:', user_id);

    return Response.json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting account:', error);
    return Response.json({ error: 'Failed to delete account' }, { status: 500 });
  }
}
