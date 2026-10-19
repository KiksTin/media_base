import { neon } from '@neondatabase/serverless';

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);

    const logs = await sql`
      SELECT log_id, user_name, attempt_time, attempt_date, success, ip_address
      FROM mb_login_log
      ORDER BY attempt_time DESC
      LIMIT 100
    `;

    return Response.json({ success: true, logs });
  } catch (error) {
    console.error('Error fetching login logs:', error);
    return Response.json({ error: 'Failed to fetch login logs' }, { status: 500 });
  }
}
