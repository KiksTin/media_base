import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const body = await request.json();
    const { admin_name, password } = body;

    console.log('Login attempt for user:', admin_name);

    if (!admin_name || !password) {
      return Response.json({ error: 'Username and password are required' }, { status: 400 });
    }

    const users = await sql`
      SELECT id, name, email, password
      FROM mb_admin
      WHERE name = ${admin_name}
    `;

    console.log('Found users:', users.length);

    if (users.length === 0) {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const user = users[0];

    console.log('Stored hash:', user.password);
    console.log('Password to compare:', password);

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    return Response.json({
      success: true,
      user: {
        user_id: user.id,
        user_name: user.name,
        user_email: user.email
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Error during login:', error);
    return Response.json({ error: 'Login failed' }, { status: 500 });
  }
}
