import { neon } from '@neondatabase/serverless';

export async function GET(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    console.log('Playlist API - User ID received:', userId);

    if (!userId) {
      console.log('Playlist API - No user ID provided');
      return Response.json({ error: 'User ID is required' }, { status: 400 });
    }
    
    let allPlaylists;
    try {
      allPlaylists = await sql`SELECT * FROM mb_playlist`;
      console.log('Playlist API - All playlists in database:', allPlaylists);
    } catch (error) {
      console.log('Playlist API - mb_playlist table might not exist:', error);
      return Response.json([], { status: 200 });
    }

    try {
      console.log('Playlist API - Attempting query for user_id:', userId, 'type:', typeof userId);
      
      let playlists = [];
      
      try {
        playlists = await sql`
          SELECT * FROM mb_playlist 
          WHERE user_id = ${userId}
        `;
            console.log('Playlist API - Approach 3 successful:', playlists.length, 'playlists');
          } catch (error3) {
            console.log('Playlist API - Approach 3 failed:', error3);
            throw error3;
          }
      
      console.log('Playlist API - Final result:', playlists.length, 'playlists');
      
      try {
        const allPlaylistSongs = await sql`SELECT COUNT(*) as count FROM mb_playlist_song`;
        console.log('Playlist API - Total songs in mb_playlist_song table:', allPlaylistSongs);
        
        const samplePlaylistSongs = await sql`SELECT * FROM mb_playlist_song LIMIT 5`;
        console.log('Playlist API - Sample playlist-song relationships:', samplePlaylistSongs);
      } catch (testError) {
        console.log('Playlist API - Error testing mb_playlist_song table:', testError);
      }
    
      const playlistsWithSongs = await Promise.all(
        playlists.map(async (playlist: any) => {
          try {
            console.log(`Playlist API - Fetching songs for playlist ${playlist.playlist_id}`);
            
            const songs = await sql`
              SELECT 
                ps.mb_playlist_song_id,
                ps.playlist_id,
                ps.song_id,
                ps.date_added
              FROM mb_playlist_song ps
              WHERE ps.playlist_id = ${playlist.playlist_id}
            `;
            
            console.log(`Playlist API - Playlist ${playlist.playlist_id} has ${songs.length} songs:`, songs);
            
            return {
              ...playlist,
              songs: songs
            };
          } catch (songError) {
            console.log(`Playlist API - Error getting songs for playlist ${playlist.playlist_id}:`, songError);
            return {
              ...playlist,
              songs: []
            };
          }
        })
      );
      
      console.log('Playlist API - Final playlists with songs:', playlistsWithSongs);
      return Response.json(playlistsWithSongs);
      
    } catch (error) {
      console.error('Playlist API - All query approaches failed:', error);
      return Response.json({ 
        error: 'All query approaches failed', 
        details: error instanceof Error ? error.message : 'Unknown error',
        user_id: userId,
        user_id_type: typeof userId
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error fetching user playlists:', error);
    return Response.json({ error: 'Failed to fetch playlists' }, { status: 500 });
  }
}
