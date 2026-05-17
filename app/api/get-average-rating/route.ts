import { neon } from '@neondatabase/serverless';

export async function GET(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);

    // Get all ratings to calculate average manually
    const ratings = await sql`
      SELECT rating
      FROM mb_rating
    `;

    console.log('All ratings:', ratings);

    if (!ratings || ratings.length === 0) {
      return Response.json({ 
        success: true, 
        average_rating: 0,
        total_ratings: 0
      });
    }

    // Calculate average manually
    const numericRatings = ratings.map((r: any) => parseFloat(r.rating)).filter((r: number) => !isNaN(r));
    const totalRatings = numericRatings.length;
    const sum = numericRatings.reduce((acc: number, curr: number) => acc + curr, 0);
    const averageRating = totalRatings > 0 ? sum / totalRatings : 0;

    console.log('Numeric ratings:', numericRatings);
    console.log('Sum:', sum, 'Total:', totalRatings, 'Average:', averageRating);

    return Response.json({ 
      success: true, 
      average_rating: parseFloat(averageRating.toFixed(1)),
      total_ratings: totalRatings
    });
  } catch (error) {
    console.error('Error fetching average rating:', error);
    return Response.json({ error: 'Failed to fetch average rating' }, { status: 500 });
  }
}
