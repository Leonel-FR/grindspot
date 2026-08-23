import { getSpots } from "@/lib/spots";

const BASE_URL = "https://grind-spot.com";

// Now DB-backed (city/spot entries), and Next prerenders metadata routes
// like this one at build time by default — same build-time-DB problem
// app/page.js already documents (Railway's private network isn't reachable
// at build time).
export const dynamic = "force-dynamic";

export default async function sitemap() {
  const spots = await getSpots();
  const citySlugs = [...new Set(spots.map((spot) => spot.citySlug))];

  const cityEntries = citySlugs.map((citySlug) => ({
    url: `${BASE_URL}/${citySlug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const spotEntries = spots.map((spot) => ({
    url: `${BASE_URL}/${spot.citySlug}/${spot.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date("2026-08-09"),
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date("2026-08-09"),
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${BASE_URL}/cookies`,
      lastModified: new Date("2026-08-09"),
      changeFrequency: "yearly",
      priority: 0.2,
    },
    ...cityEntries,
    ...spotEntries,
  ];
}
