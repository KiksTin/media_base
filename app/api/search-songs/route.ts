import { neon } from '@neondatabase/serverless';

export async function GET(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    
    if (!query || query.trim().length < 2) {
      return Response.json([]);
    }
    
    const searchTerm = query.trim();
    
    const searchResults = await sql`
      SELECT 
        song_id,
        song_name,
        song_artist,
        song_image,
        song_audio,
        song_genre
      FROM mb_song_tbl 
      WHERE 
        LOWER(song_name) LIKE LOWER(${'%' + searchTerm + '%'})
        OR LOWER(song_artist) LIKE LOWER(${'%' + searchTerm + '%'})
      ORDER BY 
        CASE 
          WHEN LOWER(song_name) LIKE LOWER(${searchTerm + '%'}) THEN 1
          WHEN LOWER(song_artist) LIKE LOWER(${searchTerm + '%'}) THEN 2
          ELSE 3
        END,
        song_name
      LIMIT 20
    `;
    
    return Response.json(searchResults);
    
  } catch (error) {
    console.error('Error searching songs:', error);
    return Response.json({ 
      error: 'Failed to search songs', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
