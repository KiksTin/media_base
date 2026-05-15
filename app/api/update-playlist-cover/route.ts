import { neon } from '@neondatabase/serverless';

export async function POST(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const { playlist_id, user_id, cover_url } = await request.json();
    
    if (!playlist_id || !user_id || !cover_url) {
      return Response.json({ error: 'playlist_id, user_id, and cover_url are required' }, { status: 400 });
    }
    
    try {
      const url = new URL(cover_url);
      const validImageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
      const hasValidExtension = validImageExtensions.some(ext => 
        url.pathname.toLowerCase().endsWith(ext)
      );
      
      if (!hasValidExtension) {
        return Response.json({ 
          error: 'Invalid image URL. Must end with .jpg, .jpeg, .png, .gif, .webp, or .svg' 
        }, { status: 400 });
      }
      
      const response = await fetch(cover_url, { method: 'HEAD' });
      if (!response.ok) {
        return Response.json({ 
          error: 'Unable to access the provided image URL' 
        }, { status: 400 });
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.startsWith('image/')) {
        return Response.json({ 
          error: 'URL does not point to a valid image file' 
        }, { status: 400 });
      }
      
    } catch (urlError) {
      return Response.json({ 
        error: 'Invalid URL format provided' 
      }, { status: 400 });
    }
    
    try {
      const result = await sql`
        UPDATE mb_playlist 
        SET playlist_cover = ${cover_url}
        WHERE playlist_id = ${playlist_id} AND user_id = ${user_id}
        RETURNING playlist_id, playlist_name, playlist_cover, date_created
      `;
      
      const updatedPlaylist = result[0];
      
      return Response.json({ 
        success: true, 
        message: 'Playlist cover updated successfully',
        playlist: updatedPlaylist
      });
      
    } catch (error) {
      console.error('Error updating playlist cover:', error);
      return Response.json({ 
        error: 'Failed to update playlist cover', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('Error in update playlist cover API:', error);
    return Response.json({ 
      error: 'Failed to update playlist cover', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
