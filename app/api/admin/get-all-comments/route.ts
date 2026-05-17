import { neon } from '@neondatabase/serverless';

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);

    const comments = await sql`
      SELECT comment_id, comment_text, user_id, song_id
      FROM mb_comment
      ORDER BY comment_id
    `;

    console.log('Fetched all comments:', comments.length);

    return Response.json({ success: true, comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return Response.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}
