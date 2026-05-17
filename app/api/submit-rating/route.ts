import { neon } from '@neondatabase/serverless';

export async function POST(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const body = await request.json();
    const { user_id, rating, comment } = body;

    if (!user_id || !rating) {
      return Response.json({ error: 'User ID and rating are required' }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return Response.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    // Insert rating into database
    const result = await sql`
      INSERT INTO mb_rating (user_id, rating, comment)
      VALUES (${user_id}, ${rating}, ${comment || null})
      RETURNING rating_id
    `;

    console.log('Rating submitted successfully for user:', user_id);

    return Response.json({ 
      success: true, 
      message: 'Rating submitted successfully',
      rating_id: result[0].rating_id
    });
  } catch (error) {
    console.error('Error submitting rating:', error);
    return Response.json({ error: 'Failed to submit rating' }, { status: 500 });
  }
}
