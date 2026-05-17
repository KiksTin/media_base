import { neon } from '@neondatabase/serverless';

export async function POST(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const body = await request.json();
    const { song_id, user_id, comment_text } = body;

    if (!song_id || !user_id || !comment_text) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO mb_comment (song_id, user_id, comment_text)
      VALUES (${song_id}, ${user_id}, ${comment_text})
      RETURNING comment_id
    `;

    return Response.json({ success: true, comment_id: result[0].comment_id });
  } catch (error) {
    console.error('Error adding comment:', error);
    return Response.json({ error: 'Failed to add comment' }, { status: 500 });
  }
}
