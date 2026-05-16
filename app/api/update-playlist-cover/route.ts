import { neon } from '@neondatabase/serverless';
import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/app/utils/cloudinary';

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

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'playlist-covers',
          resource_type: 'image',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    }) as any;

    const coverUrl = result.secure_url;

    // Update database with Cloudinary URL
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
