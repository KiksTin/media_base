import { neon } from '@neondatabase/serverless';

export async function POST(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const body = await request.json();
    const { username, password } = body;

    console.log('Login attempt for user:', username);

    if (!username || !password) {
      return Response.json({ error: 'Username and password are required' }, { status: 400 });
    }

    // Query the database for the user
    const users = await sql`
      SELECT user_id, user_name, user_email, user_password, user_profile, user_cover
      FROM mb_user
      WHERE user_name = ${username}
    `;

    console.log('Found users:', users.length);

    if (users.length === 0) {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const user = users[0];

    // In a real application, you would hash the password and compare
    // For now, we'll do a simple comparison (NOT SECURE - for demo only)
    if (user.user_password !== password) {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Return user data (excluding password)
    const { user_password, ...userWithoutPassword } = user;

    console.log('Login successful for user:', username);

    return Response.json({ 
      success: true, 
      user: userWithoutPassword 
    });
  } catch (error) {
    console.error('Error during login:', error);
    return Response.json({ error: 'Login failed' }, { status: 500 });
  }
}
