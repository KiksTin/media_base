import { neon } from '@neondatabase/serverless';

export async function POST(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const body = await request.json();
    const { id } = body;

    console.log('Deleting comment:', id);

    if (!id) {
      return Response.json({ error: 'Comment ID is required' }, { status: 400 });
    }

    // Delete the comment
    await sql`
      DELETE FROM mb_comment
      WHERE comment_id = ${id}
    `;

    console.log('Comment deleted successfully:', id);

    return Response.json({ success: true, message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return Response.json({ error: 'Failed to delete comment' }, { status: 500 });
  }
}
