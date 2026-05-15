import { neon } from '@neondatabase/serverless';

export async function POST(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const { song_id, user_id } = await request.json();
    
    if (!song_id || !user_id) {
      return Response.json({ error: 'song_id and user_id are required' }, { status: 400 });
    }
    
    const existing = await sql`
      SELECT like_id FROM mb_liked 
      WHERE song_id = ${song_id} AND user_id = ${user_id}
    `;
    
    if (existing.length > 0) {
  
      await sql`
        UPDATE mb_liked 
        SET date_liked = CURRENT_DATE 
        WHERE song_id = ${song_id} AND user_id = ${user_id}
      `;
    } else {
     
      await sql`
        INSERT INTO mb_liked (song_id, user_id, date_liked) 
        VALUES (${song_id}, ${user_id}, CURRENT_DATE)
      `;
    }
    
    return Response.json({ success: true, message: 'Song added to liked song' });
    
  } catch (error) {
    console.error('Error adding liked song:', error);
    return Response.json({ 
      error: 'Failed to add liked song', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
