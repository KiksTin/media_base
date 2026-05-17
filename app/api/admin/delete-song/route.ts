import { neon } from '@neondatabase/serverless';

export async function POST(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const body = await request.json();
    const { id } = body;

    console.log('Deleting song:', id);

    if (!id) {
      return Response.json({ error: 'Song ID is required' }, { status: 400 });
    }

    // Delete song from playlist_song junction table
    await sql`
      DELETE FROM mb_playlist_song
      WHERE song_id = ${id}
    `;

    // Delete song comments
    await sql`
      DELETE FROM mb_comment
      WHERE song_id = ${id}
    `;

    // Delete the song
    await sql`
      DELETE FROM mb_song_tbl
      WHERE song_id = ${id}
    `;

    console.log('Song deleted successfully:', id);

    return Response.json({ success: true, message: 'Song deleted successfully' });
  } catch (error) {
    console.error('Error deleting song:', error);
    return Response.json({ error: 'Failed to delete song' }, { status: 500 });
  }
}
