import { neon } from '@neondatabase/serverless';

export async function POST(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const body = await request.json();
    const { id } = body;

    console.log('Deleting user:', id);

    if (!id) {
      return Response.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Delete user's playlists
    await sql`
      DELETE FROM mb_playlist
      WHERE user_id = ${id}
    `;

    // Delete user's songs
    await sql`
      DELETE FROM mb_song_tbl
      WHERE user_id = ${id}
    `;

    // Delete user's comments
    await sql`
      DELETE FROM mb_comment
      WHERE user_id = ${id}
    `;

    // Delete user's recent plays
    await sql`
      DELETE FROM mb_recent
      WHERE user_id = ${id}
    `;

    // Delete the user account
    await sql`
      DELETE FROM mb_user
      WHERE user_id = ${id}
    `;

    console.log('User deleted successfully:', id);

    return Response.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return Response.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
