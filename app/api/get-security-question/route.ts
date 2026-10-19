import { neon } from '@neondatabase/serverless';

export async function POST(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const body = await request.json();
    const { username } = body;

    if (!username) {
      return Response.json({ error: 'Username is required' }, { status: 400 });
    }

    const users = await sql`
      SELECT user_question
      FROM mb_user
      WHERE user_name = ${username}
    `;

    if (users.length === 0) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    return Response.json({ question: users[0].user_question });
  } catch (error) {
    console.error('Error fetching security question:', error);
    return Response.json({ error: 'Failed to fetch security question' }, { status: 500 });
  }
}
