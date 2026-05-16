import { neon } from '@neondatabase/serverless';

export async function POST(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const { playlist_name, user_id } = await request.json();
    
    if (!playlist_name || !user_id) {
      return Response.json({ error: 'playlist_name and user_id are required' }, { status: 400 });
    }
    
    if (playlist_name.trim().length < 2 || playlist_name.trim().length > 50) {
      return Response.json({ error: 'Playlist name must be between 2 and 50 characters' }, { status: 400 });
    }
    
    const trimmedName = playlist_name.trim();
    
    let existingPlaylist: any[] = [];
    
    try {
      existingPlaylist = await sql`
        SELECT playlist_id FROM mb_playlist
        WHERE playlist_name = ${trimmedName} AND user_id = ${user_id}
      `;
    } catch (error) {
      console.log('Playlist query failed, table might not exist yet:', error);
      existingPlaylist = [];
    }
    
    if (existingPlaylist && existingPlaylist.length > 0) {
      return Response.json({ error: 'You already have a playlist with this name' }, { status: 409 });
    }
   
    try {
      const result = await sql`
        INSERT INTO mb_playlist(playlist_name, user_id, date_created) 
        VALUES (${trimmedName}, ${user_id}, CURRENT_DATE)
        RETURNING playlist_id, playlist_name, date_created
      `;
      
      const newPlaylist = result[0];
      
      return Response.json({ 
        success: true, 
        message: 'Playlist created successfully',
        playlist: newPlaylist
      });
      
    } catch (error) {
      console.log('Insert failed, table might not exist:', error);
      return Response.json({ 
        error: 'Failed to create playlist', 
        details: 'Database table may not exist' 
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('Error creating playlist:', error);
    return Response.json({ 
      error: 'Failed to create playlist', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}