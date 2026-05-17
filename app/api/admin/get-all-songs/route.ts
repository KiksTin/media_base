import { neon } from '@neondatabase/serverless';

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);

    const songs = await sql`
      SELECT song_id, song_name, song_artist, song_image, song_audio, user_id
      FROM mb_song_tbl
      ORDER BY song_id
    `;

    console.log('Fetched all songs:', songs.length);

    return Response.json({ success: true, songs });
  } catch (error) {
    console.error('Error fetching songs:', error);
    return Response.json({ error: 'Failed to fetch songs' }, { status: 500 });
  }
}
