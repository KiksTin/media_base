import { neon } from '@neondatabase/serverless';
import { hash } from 'bcrypt';
import {compare} from 'bcrypt';

export async function POST(request: Request) {
    const saltRounds = 10;
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const body = await request.json();
    const { user_id, current_password, new_password } = body;

    console.log('Changing password for user:', user_id);

    if (!user_id || !current_password || !new_password) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

     const passwordHash = await hash(new_password, saltRounds);

    // First, verify the current password
    const user = await sql`
      SELECT user_password
      FROM mb_user
      WHERE user_id = ${user_id}
    `;
    
    if (!await compare(current_password, user[0].user_password)) {
      return Response.json({ error: 'Current password is incorrect' }, { status: 400 });
    }

    // Update the password
    await sql`
      UPDATE mb_user
      SET user_password = ${passwordHash}
      WHERE user_id = ${user_id}
    `;

    console.log('Password updated successfully for user:', user_id);

    return Response.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    return Response.json({ error: 'Failed to change password' }, { status: 500 });
  }
}
