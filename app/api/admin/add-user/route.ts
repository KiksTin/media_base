import { neon } from '@neondatabase/serverless';
import { hash } from 'bcrypt';

export async function POST(request: Request) {
  const saltRounds = 10;
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const body = await request.json();
    const { user_name, user_password, user_email } = body;
    
    if (!user_name || !user_password) {
      return Response.json({ error: 'Username and password are required' }, { status: 400 });
    }

    const existingUser = await sql`
      SELECT user_id FROM mb_user WHERE user_name = ${user_name}
    `;

    if (existingUser.length > 0) {
      return Response.json({ error: 'Username already exists' }, { status: 409 });
    }

    const passwordHash = await hash(user_password, saltRounds);
    const result = await sql`
      INSERT INTO mb_user (user_name, user_password, user_email, user_profile, user_cover)
      VALUES (${user_name}, ${passwordHash}, ${user_email || null}, NULL, NULL)
      RETURNING user_id
    `;
    
    return Response.json({ success: true, user_id: result[0].user_id });
  } catch (error) {
    console.error('Error adding user:', error);
    return Response.json({ error: 'Failed to add user' }, { status: 500 });
  }
}
