import { neon } from '@neondatabase/serverless';

export async function GET(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    console.log('Fetching uploaded songs for user:', userId);

    if (!userId) {
      return Response.json({ error: 'user_id is required' }, { status: 400 });
    }

    const songs = await sql`
      SELECT 
        song_id,
        song_name,
        song_artist,
        song_image,
        song_audio,
        user_id
      FROM mb_song_tbl
      WHERE user_id = ${userId}
    `;

    console.log('Uploaded songs API - Found', songs.length, 'songs');

    return Response.json(songs);
  } catch (error) {
    console.error('Error fetching uploaded songs:', error);
    console.error('Error type:', typeof error);
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    return Response.json({ error: 'Failed to fetch uploaded songs', message: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
