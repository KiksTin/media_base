import { neon } from '@neondatabase/serverless';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const formData = await request.formData();
    const image = formData.get('image') as File;
    const user_id = formData.get('user_id') as string;

    console.log('Changing profile picture for user:', user_id);

    if (!image || !user_id) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'profiles');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `profile_${user_id}_${timestamp}${image.name.substring(image.name.lastIndexOf('.'))}`;
    const filepath = join(uploadsDir, filename);

    // Convert file to buffer and save locally
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Create URL path for the image
    const imageUrl = `/uploads/profiles/${filename}`;

    // Update the user profile picture in database
    await sql`
      UPDATE mb_user
      SET user_profile = ${imageUrl}
      WHERE user_id = ${user_id}
    `;

    console.log('Profile picture updated successfully for user:', user_id);

    return Response.json({ 
      success: true, 
      message: 'Profile picture changed successfully',
      profile_url: imageUrl
    });
  } catch (error) {
    console.error('Error changing profile picture:', error);
    return Response.json({ error: 'Failed to change profile picture' }, { status: 500 });
  }
}
