  import { neon } from '@neondatabase/serverless';

export async function POST(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const { song_id, user_id } = await request.json();
    
    if (!song_id || !user_id) {
      return Response.json({ error: 'song_id and user_id are required' }, { status: 400 });
    }
    
    // Check if the song is already in recently played for this user
    const existing = await sql`
      SELECT recent_id FROM mb_recent 
      WHERE song_id = ${song_id} AND user_id = ${user_id}
    `;
    
    if (existing.length > 0) {
      // Update the existing record with current date
      await sql`
        UPDATE mb_recent 
        SET date_played = CURRENT_DATE 
        WHERE song_id = ${song_id} AND user_id = ${user_id}
      `;
    } else {
      // Insert new record
      await sql`
        INSERT INTO mb_recent (song_id, user_id, date_played) 
        VALUES (${song_id}, ${user_id}, CURRENT_DATE)
      `;
    }
    
    return Response.json({ success: true, message: 'Song added to recently played' });
    
  } catch (error) {
    console.error('Error adding recently played:', error);
    return Response.json({ 
      error: 'Failed to add recently played', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
