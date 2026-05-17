import { neon } from '@neondatabase/serverless';

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);

    const playlists = await sql`
      SELECT playlist_id, playlist_name, playlist_cover, user_id
      FROM mb_playlist
      ORDER BY playlist_id
    `;

    console.log('Fetched all playlists:', playlists.length);

    return Response.json({ success: true, playlists });
  } catch (error) {
    console.error('Error fetching playlists:', error);
    return Response.json({ error: 'Failed to fetch playlists' }, { status: 500 });
  }
}
