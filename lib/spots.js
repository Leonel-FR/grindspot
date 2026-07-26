import sql from "@/lib/db";

export async function getSpots() {
  const rows = await sql`select * from spots order by name`;

  return rows.map((spot) => ({
    ...spot,
    rating: Number(spot.rating),
    priceRange: `$${spot.priceMin} - $${spot.priceMax}`,
  }));
}
