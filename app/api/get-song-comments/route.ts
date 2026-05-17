import { neon } from '@neondatabase/serverless';

export async function GET(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const { searchParams } = new URL(request.url);
    const song_id = searchParams.get('song_id');

    if (!song_id) {
      return Response.json({ error: 'Song ID is required' }, { status: 400 });
    }

    const comments = await sql`
      SELECT
        c.comment_id,
        c.comment_text,
        c.user_id,
        c.song_id,
        u.user_name,
        u.user_profile
      FROM mb_comment c
      LEFT JOIN mb_user u ON c.user_id = u.user_id
      WHERE c.song_id = ${song_id}
      ORDER BY c.comment_id DESC
    `;

    return Response.json({ success: true, comments });
  } catch (error) {
    console.error('Error fetching song comments:', error);
    return Response.json({ error: 'Failed to fetch song comments' }, { status: 500 });
  }
}
