import { cache } from "react";
import sql from "@/lib/db";
import { isSpotOpenNow } from "@/lib/isOpenNow";
import { slugify } from "@/lib/slugify";

// Public teaser data only — matches what SpotCard renders. Deliberately
// excludes address, maps_url and the raw hours/timezone columns so the
// premium detail (unlocked only via getSpotById behind an access check)
// never reaches the client for users who haven't paid.
//
// Cached per request: the pSEO routes (app/[city], app/[city]/[spot]) and
// their generateMetadata both need this list, and without cache() that's
// two DB round trips for what's otherwise the same data within one request.
export const getSpots = cache(async () => {
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
    // No slug column exists in the DB (schema has no migration tooling in
    // this repo) — derived here once so the pSEO routes and sitemap all
    // read the same precomputed value instead of re-slugifying separately.
    citySlug: slugify(spot.city),
    slug: slugify(spot.name),
  }));
});

// Both pSEO routes need to resolve a URL param back to a spot/city without
// duplicating the slug-matching logic (and risking the page and its
// generateMetadata drifting out of sync on how they match).
export function findCitySpots(spots, citySlug) {
  return spots.filter((spot) => spot.citySlug === citySlug);
}

export function findSpot(spots, citySlug, slug) {
  return spots.find((spot) => spot.citySlug === citySlug && spot.slug === slug);
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
