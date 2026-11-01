import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcrypt';


export async function POST(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const body = await request.json();
    const { username, password, answer } = body;

    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

    console.log('Login attempt for user:', username);

    if (!username || !password) {
      await sql`
        INSERT INTO mb_login_log (user_name, attempt_time, attempt_date, success, ip_address)
        VALUES (${username}, CURRENT_TIME, CURRENT_DATE, false, ${ip})
      `;
      console.log('incorrect username or password');
      return Response.json({ error: 'Username and password are required' }, { status: 400 });
    }

    // Query for user
    const users = await sql`
      SELECT user_id, user_name, user_email, user_password, user_profile, user_cover, user_question, user_answer
      FROM mb_user
      WHERE user_name = ${username}
    `;

    console.log('Found users:', users.length);

    if (users.length === 0) {
      await sql`
        INSERT INTO mb_login_log (user_name, attempt_time, attempt_date, success, ip_address)
        VALUES (${username}, CURRENT_TIME, CURRENT_DATE, false, ${ip})
      `;
      return Response.json({ error: 'Invalid user' }, { status: 401 });
    }

    const user = users[0];
    
    //Conpare Input and Hashed/Saved Password
    const passwordMatch = await bcrypt.compare(password, user.user_password);
    if (!passwordMatch) {
      await sql`
        INSERT INTO mb_login_log (user_name, attempt_time, attempt_date, success, ip_address)
        VALUES (${username}, CURRENT_TIME, CURRENT_DATE, false, ${ip})
      `;
      return Response.json({ error: 'Wrong Password' }, { status: 401 });
    }

    // Verify security answer
    if (!answer || answer.trim() !== user.user_answer) {
      await sql`
        INSERT INTO mb_login_log (user_name, attempt_time, attempt_date, success, ip_address)
        VALUES (${username}, CURRENT_TIME, CURRENT_DATE, false, ${ip})
      `;
      return Response.json({ error: 'Invalid security answer' }, { status: 401 });
    }

    const { user_password, ...userWithoutPassword } = user;

    await sql`
      INSERT INTO mb_login_log (user_name, attempt_time, attempt_date, success, ip_address)
      VALUES (${username}, CURRENT_TIME, CURRENT_DATE, true, ${ip})
    `;

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
