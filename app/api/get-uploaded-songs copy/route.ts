import { neon } from '@neondatabase/serverless';

export async function GET(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    console.log('Fetching comments for user:', userId);

    if (!userId) {
      return Response.json({ error: 'user_id is required' }, { status: 400 });
    }

    // First, get the user's uploaded songs
    const songs = await sql`
      SELECT song_id
      FROM mb_song_tbl
      WHERE user_id = ${userId}
    `;

    console.log('User uploaded songs:', songs);

    if (songs.length === 0) {
      console.log('No uploaded songs found for user');
      return Response.json([]);
    }

    // Extract song_ids
    const songIds = songs.map((s: any) => s.song_id);
    console.log('Song IDs:', songIds);

    // For multiple songs, use ANY() with the array and JOIN to get song_name and user details
    const comments = await sql`
      SELECT
        c.comment_id,
        c.comment_text,
        c.user_id,
        c.song_id,
        s.song_name,
        u.user_name,
        u.user_profile
      FROM mb_comment c
      LEFT JOIN mb_song_tbl s ON c.song_id = s.song_id
      LEFT JOIN mb_user u ON c.user_id = u.user_id
      WHERE c.song_id = ANY(${songIds})
    `;

    console.log('Found comments:', comments.length);
    console.log('Comments data:', comments);

    return Response.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    console.error('Error type:', typeof error);
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    return Response.json({ error: 'Failed to fetch comments', message: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
