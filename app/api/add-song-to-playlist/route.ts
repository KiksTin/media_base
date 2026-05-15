import { neon } from '@neondatabase/serverless';

export async function POST(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const { song_id, playlist_id, user_id } = await request.json();
    
    if (!song_id || !playlist_id || !user_id) {
      return Response.json({ error: 'song_id, playlist_id, and user_id are required' }, { status: 400 });
    }
    
    // Try to create the playlist songs table if it doesn't exist
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS mb_playlist_song (
          mb_playlist_song_id SERIAL PRIMARY KEY,
          playlist_id INTEGER NOT NULL,
          song_id INTEGER NOT NULL,
          date_added DATE NOT NULL DEFAULT CURRENT_DATE,
          FOREIGN KEY (playlist_id) REFERENCES mb_playlist(playlist_id),
          FOREIGN KEY (song_id) REFERENCES mb_song_tbl(song_id),
          UNIQUE(playlist_id, song_id)
        )
      `;
    } catch (tableError) {
      console.log('Table creation error (might already exist):', tableError);
    }
    
    // Check if song is already in the playlist
    let existingEntry: any[] = [];
    try {
      existingEntry = await sql`
        SELECT mb_playlist_song_id FROM mb_playlist_song 
        WHERE playlist_id = ${playlist_id} AND song_id = ${song_id}
      `;
    } catch (error) {
      console.log('Query failed, table might not exist yet:', error);
      existingEntry = [];
    }
    
    if (existingEntry && existingEntry.length > 0) {
      return Response.json({ error: 'Song is already in this playlist' }, { status: 409 });
    }
    
    // Add song to playlist
    try {
      const result = await sql`
        INSERT INTO mb_playlist_song (playlist_id, song_id, date_added) 
        VALUES (${playlist_id}, ${song_id}, CURRENT_DATE)
        RETURNING mb_playlist_song_id, playlist_id, song_id, date_added
      `;
      
      const newEntry = result[0];
      
      return Response.json({ 
        success: true, 
        message: 'Song added to playlist successfully',
        entry: newEntry
      });
      
    } catch (error) {
      console.log('Insert failed, table might not exist:', error);
      return Response.json({ 
        error: 'Failed to add song to playlist', 
        details: 'Database table may not exist' 
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('Error adding song to playlist:', error);
    return Response.json({ 
      error: 'Failed to add song to playlist', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
