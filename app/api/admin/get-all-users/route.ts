import { neon } from '@neondatabase/serverless';

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);

    const users = await sql`
      SELECT user_id, user_name, user_email, user_profile, user_cover
      FROM mb_user
      ORDER BY user_id
    `;

    console.log('Fetched all users:', users.length);

    return Response.json({ success: true, users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return Response.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
