import { neon } from '@neondatabase/serverless';

export async function POST(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const { song_id, user_id } = await request.json();
    
    if (!song_id || !user_id) {
      return Response.json({ error: 'song_id and user_id are required' }, { status: 400 });
    }
    
    await sql`
      DELETE FROM mb_liked 
      WHERE song_id = ${song_id} AND user_id = ${user_id}
    `;
    
    return Response.json({ success: true, message: 'Song removed from liked songs' });
    
  } catch (error) {
    console.error('Error removing liked song:', error);
    return Response.json({ 
      error: 'Failed to remove liked song', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
