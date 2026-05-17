import { neon } from '@neondatabase/serverless';
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;
    const audioFile = formData.get('audio') as File;
    const song_id = formData.get('song_id') as string | null;
    const song_name = formData.get('song_name') as string | null;
    const song_artist = formData.get('song_artist') as string | null;
    const userId = formData.get('user_id') as string | null;

    if (!imageFile || !audioFile) {
      return NextResponse.json(
        { error: 'image file and audio file are required' },
        { status: 400 }
      );
    }

    // Create uploads directories if they don't exist
    const imagesDir = join(process.cwd(), 'public', 'uploads', 'songs', 'images');
    const audioDir = join(process.cwd(), 'public', 'uploads', 'songs', 'audio');
    
    if (!existsSync(imagesDir)) {
      await mkdir(imagesDir, { recursive: true });
    }
    if (!existsSync(audioDir)) {
      await mkdir(audioDir, { recursive: true });
    }

    // Generate unique filenames
    const timestamp = Date.now();
    const imageFilename = `song_image_${timestamp}${imageFile.name.substring(imageFile.name.lastIndexOf('.'))}`;
    const audioFilename = `song_audio_${timestamp}${audioFile.name.substring(audioFile.name.lastIndexOf('.'))}`;
    
    const imagePath = join(imagesDir, imageFilename);
    const audioPath = join(audioDir, audioFilename);

    // Convert files to buffers and save locally
    const imageArrayBuffer = await imageFile.arrayBuffer();
    const audioArrayBuffer = await audioFile.arrayBuffer();
    const imageBuffer = Buffer.from(imageArrayBuffer);
    const audioBuffer = Buffer.from(audioArrayBuffer);
    
    await writeFile(imagePath, imageBuffer);
    await writeFile(audioPath, audioBuffer);

    // Create URL paths for the files
    const coverUrl = `/uploads/songs/images/${imageFilename}`;
    const audioUrl = `/uploads/songs/audio/${audioFilename}`;

    const sql = neon(process.env.DATABASE_URL!);

    if (song_id) {
      await sql`
        UPDATE mb_song_tbl
        SET song_image = ${coverUrl},
            song_audio = ${audioUrl}
        WHERE song_id = ${song_id}
      `;
      console.log('Song updated:', song_id);
    } else {
      if (!song_name) {
        return NextResponse.json(
          { error: 'song_name is required when creating a new song' },
          { status: 400 }
        );
      }
      const result = await sql`
        INSERT INTO mb_song_tbl (song_name, song_image, song_audio, song_artist, user_id)
        VALUES (${song_name}, ${coverUrl}, ${audioUrl}, ${song_artist}, ${userId})
        RETURNING song_id, song_name, song_image, song_audio, song_artist, user_id
      `;
      console.log('New song created:', result[0]);
    }

    return NextResponse.json(
      { success: true, message: song_id ? 'Song updated successfully' : 'Song created successfully', cover_url: coverUrl, audio_url: audioUrl },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing song:', error);
    return NextResponse.json(
      { error: 'Failed to process song' },
      { status: 500 }
    );
  }
}
