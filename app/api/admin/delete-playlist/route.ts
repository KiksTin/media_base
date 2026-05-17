import { neon } from '@neondatabase/serverless';

export async function POST(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const body = await request.json();
    const { id } = body;

    console.log('Deleting playlist:', id);

    if (!id) {
      return Response.json({ error: 'Playlist ID is required' }, { status: 400 });
    }

    // Delete songs from playlist_song junction table
    await sql`
      DELETE FROM mb_playlist_song
      WHERE playlist_id = ${id}
    `;

    // Delete the playlist
    await sql`
      DELETE FROM mb_playlist
      WHERE playlist_id = ${id}
    `;

    console.log('Playlist deleted successfully:', id);

    return Response.json({ success: true, message: 'Playlist deleted successfully' });
  } catch (error) {
    console.error('Error deleting playlist:', error);
    return Response.json({ error: 'Failed to delete playlist' }, { status: 500 });
  }
}
