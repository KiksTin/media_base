import { neon } from '@neondatabase/serverless';

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const response = await sql`SELECT * FROM mb_song_tbl`;
    console.log(response);
    return Response.json(response);
  } catch (error) {
    console.error('Error fetching songs:', error);
    return Response.json({ error: 'Failed to fetch songs' }, { status: 500 });
  }
}
