import sql from "@/lib/db";
import { isSpotOpenNow } from "@/lib/isOpenNow";

// Public teaser data only — matches what SpotCard renders. Deliberately
// excludes address, maps_url and the raw hours/timezone columns so the
// premium detail (unlocked only via getSpotById behind an access check)
// never reaches the client for users who haven't paid.
export async function getSpots() {
  const rows = await sql`
    SELECT id, name, city, image, rating, work_friendly, quiet, value,
           price_min, price_max, place_type, hours, timezone
    FROM spots
    ORDER BY name
  `;

  return rows.map((spot) => ({
    id: spot.id,
    name: spot.name,
    city: spot.city,
    image: spot.image,
    rating: Number(spot.rating),
    workFriendly: spot.workFriendly,
    quiet: spot.quiet,
    value: spot.value,
    placeType: spot.placeType,
    priceMin: spot.priceMin,
    priceMax: spot.priceMax,
    priceRange: `$${spot.priceMin} - $${spot.priceMax}`,
    openNow: isSpotOpenNow(spot),
  }));
}

// Full detail, including address, maps_url and hours — only ever called from
// a route that has already verified premium access.
export async function getSpotById(id) {
  const [spot] = await sql`select * from spots where id = ${id}`;

  if (!spot) return null;

  return {
    ...spot,
    rating: Number(spot.rating),
    priceRange: `$${spot.priceMin} - $${spot.priceMax}`,
  };
}
