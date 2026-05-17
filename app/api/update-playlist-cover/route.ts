import { neon } from '@neondatabase/serverless';
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;
    const playlist_id = formData.get('playlist_id') as string;

    if (!file || !playlist_id) {
      return NextResponse.json(
        { error: 'image file and playlist_id are required' },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'playlists');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `playlist_cover_${playlist_id}_${timestamp}${file.name.substring(file.name.lastIndexOf('.'))}`;
    const filepath = join(uploadsDir, filename);

    // Convert file to buffer and save locally
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await writeFile(filepath, buffer);

    // Create URL path for the image
    const coverUrl = `/uploads/playlists/${filename}`;

    // Update database with local URL
    const sql = neon(process.env.DATABASE_URL!);
    await sql`
      UPDATE mb_playlist
      SET playlist_cover = ${coverUrl}
      WHERE playlist_id = ${playlist_id}
    `;

    console.log('Cover URL updated for playlist:', playlist_id, coverUrl);

    return NextResponse.json(
      { success: true, message: 'Cover updated successfully', cover_url: coverUrl },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating playlist cover:', error);
    return NextResponse.json(
      { error: 'Failed to update playlist cover' },
      { status: 500 }
    );
  }
}
