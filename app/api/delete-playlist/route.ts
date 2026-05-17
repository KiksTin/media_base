import { neon } from '@neondatabase/serverless';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { playlist_id, user_id } = await request.json();
    
    if (!playlist_id || !user_id) {
      return NextResponse.json(
        { error: 'playlist_id and user_id are required' },
        { status: 400 }
      );
    }

    const sql = neon(process.env.DATABASE_URL!);

    // First, delete all songs from the playlist
    await sql`
      DELETE FROM mb_playlist_song
      WHERE playlist_id = ${playlist_id}
    `;

    // Then, delete the playlist itself
    await sql`
      DELETE FROM mb_playlist
      WHERE playlist_id = ${playlist_id} AND user_id = ${user_id}
    `;

    console.log('Playlist deleted:', playlist_id);

    return NextResponse.json(
      { success: true, message: 'Playlist deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting playlist:', error);
    return NextResponse.json(
      { error: 'Failed to delete playlist' },
      { status: 500 }
    );
  }
}
