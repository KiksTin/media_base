import { neon } from '@neondatabase/serverless';

export async function POST(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const { song_id, user_id } = await request.json();
    
    if (!song_id || !user_id) {
      return Response.json({ error: 'song_id and user_id are required' }, { status: 400 });
    }
    
    const songExists = await sql`
      SELECT * FROM mb_song_tbl 
      WHERE song_id = ${song_id}
    `;
    
    if (songExists.length === 0) {
      return Response.json({ error: 'Song not found' }, { status: 404 });
    }
    
    const song = songExists[0];
    
   
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS mb_downloads (
          download_id SERIAL PRIMARY KEY,
          song_id INTEGER NOT NULL,
          user_id INTEGER NOT NULL,
          download_date DATE NOT NULL DEFAULT CURRENT_DATE,
          FOREIGN KEY (song_id) REFERENCES mb_song_tbl(song_id),
          UNIQUE(song_id, user_id)
        )
      `;
    } catch (tableError) {
      console.log('Table creation error (might already exist):', tableError);
    }
    

    let existingDownload: any[] = [];
    try {
      existingDownload = await sql`
        SELECT download_id FROM mb_downloads 
        WHERE song_id = ${song_id} AND user_id = ${user_id}
      `;
    } catch (error) {
      console.log('Downloads table query failed, might not exist yet:', error);
      existingDownload = [];
    }
    
    if (existingDownload && existingDownload.length > 0) {
   
      try {
        await sql`
          UPDATE mb_downloads 
          SET download_date = CURRENT_DATE 
          WHERE song_id = ${song_id} AND user_id = ${user_id}
        `;
      } catch (error) {
        console.log('Update failed, table might not exist:', error);
      }
    } else {
     
      try {
        await sql`
          INSERT INTO mb_downloads (song_id, user_id, download_date) 
          VALUES (${song_id}, ${user_id}, CURRENT_DATE)
        `;
      } catch (error) {
        console.log('Insert failed, table might not exist:', error);
    
      }
    }
    
    return Response.json({ 
      success: true, 
      message: 'Song downloaded successfully',
      song: {
        song_id: song.song_id,
        song_name: song.song_name,
        song_artist: song.song_artist,
        song_image: song.song_image,
        song_audio: song.song_audio,
        song_genre: song.song_genre,
        download_date: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Error downloading song:', error);
    return Response.json({ 
      error: 'Failed to download song', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    
    if (!userId) {
      return Response.json({ error: 'user_id is required' }, { status: 400 });
    }
    
    let downloads: any[] = [];
    
    try {
      // Try to create the downloads table if it doesn't exist
      await sql`
        CREATE TABLE IF NOT EXISTS mb_downloads (
          download_id SERIAL PRIMARY KEY,
          song_id INTEGER NOT NULL,
          user_id INTEGER NOT NULL,
          download_date DATE NOT NULL DEFAULT CURRENT_DATE,
          FOREIGN KEY (song_id) REFERENCES mb_song_tbl(song_id),
          UNIQUE(song_id, user_id)
        )
      `;
      
      downloads = await sql`
        SELECT 
          s.song_id,
          s.song_name,
          s.song_artist,
          s.song_image,
          s.song_audio,
          s.song_genre,
          d.download_date
        FROM mb_downloads d
        LEFT JOIN mb_song_tbl s ON d.song_id = s.song_id
        WHERE d.user_id = ${userId}
        ORDER BY d.download_date DESC
      `;
    } catch (error) {
      console.log('Downloads table might not exist or query failed:', error);
      downloads = [];
    }
    
    return Response.json(downloads);
    
  } catch (error) {
    console.error('Error fetching downloads:', error);
    return Response.json({ 
      error: 'Failed to fetch downloads', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
