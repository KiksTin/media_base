import { neon } from '@neondatabase/serverless';

export async function GET(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');

    console.log('Fetching comments for user:', user_id);

    if (!user_id) {
      return Response.json({ error: 'User ID is required' }, { status: 400 });
    }

    // First, get the song IDs of the user's uploaded songs
    const songs = await sql`
      SELECT song_id
      FROM mb_song_tbl
      WHERE user_id = ${user_id}
    `;

    console.log('User songs:', songs.length);

    if (songs.length === 0) {
      return Response.json({ success: true, comments: [] });
    }

    const songIds = songs.map((s: any) => s.song_id);

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

    console.log('Fetched comments:', comments.length);

    return Response.json({ success: true, comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return Response.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}
