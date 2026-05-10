import { neon } from '@neondatabase/serverless';

export async function GET(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    
    console.log('Fetching recently played songs for user:', userId);
    
    // Test table structure first
    try {
      const tableTest = await sql`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'mb_recent'
      `;
      console.log('Recently played API - Table structure:', tableTest);
    } catch (tableError) {
      console.log('Recently played API - Could not check table structure:', tableError);
    }
    
    let playedSongs = [];
      
      try {
        playedSongs = await sql`
          SELECT * FROM mb_recent 
          WHERE user_id = ${userId}
        `;
            console.log('Recently played API - Basic query successful:', playedSongs.length, 'songs');
          } catch (error3) {
            console.log('Recently played API - Basic query failed:', error3);
            throw error3;
          }

    let query;
    try {
      if (userId) {
        console.log('Recently played API - Querying for user:', userId);
        query = sql`
          SELECT 
            s.song_id,
            s.song_name,
            s.song_image,
            s.song_audio,
            s.song_artist,
            s.song_genre,
            r.date_played
          FROM mb_recent r
          LEFT JOIN mb_song_tbl s ON r.song_id = s.song_id
          WHERE r.user_id = ${userId}
          ORDER BY r.date_played DESC
        `;
      } else {
        console.log('Recently played API - No user ID provided');
        query = sql`
          SELECT 
            s.song_id,
            s.song_name,
            s.song_image,
            s.song_audio,
            s.song_artist,
            s.song_genre
          FROM mb_song_tbl s
        `;
      }
      
      const response = await query;
      console.log('Recently played API - Query successful, response length:', response.length);
      console.log('Recently played API - Sample response:', response[0]);
      
      return Response.json(response);
    } catch (queryError) {
      console.error('Recently played API - Query failed:', queryError);
      console.error('Recently played API - Error details:', queryError instanceof Error ? queryError.message : 'Unknown error');
      return Response.json({ 
        error: 'Failed to fetch recently played', 
        details: queryError instanceof Error ? queryError.message : 'Unknown error',
        userId: userId
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('Error fetching recently played:', error);
    return Response.json({ error: 'Failed to fetch recently played', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
