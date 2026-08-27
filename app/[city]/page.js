import { notFound } from "next/navigation";
import Hero from "@/components/Hero";
import AuthButton from "@/components/AuthButton";
import SpotsGrid from "@/components/SpotsGrid";
import Footer from "@/components/Footer";
import { getSpots, findCitySpots } from "@/lib/spots";
import { getPremiumUser, getLikedSpotIds } from "@/lib/access";
import en from "@/lib/i18n/dictionaries/en";

const SITE_URL = "https://grind-spot.com";

// Same reason as app/page.js: reads the DB on every request, and the DB
// (Railway private network) isn't reachable at build time anyway.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { city: citySlug } = await params;
  const spots = await getSpots();
  const citySpots = findCitySpots(spots, citySlug);

  if (citySpots.length === 0) {
    return { title: "Remote Work Spots" };
  }

  const cityName = citySpots[0].city;
  const count = citySpots.length;

  return {
    title: `${en.cityPage.headingPrefix} ${cityName}`,
    description: `${en.cityPage.introPrefix} ${count} ${
      count === 1 ? en.cityPage.introSpotSingular : en.cityPage.introSpotPlural
    } ${en.cityPage.introConnector} ${cityName}.`,
    alternates: {
      canonical: `/${citySlug}`,
    },
  };
}

// Same composition as app/page.js, just pre-filtered to one city via
// SpotsGrid's initialCity — so this route is both the pSEO landing page and
// the real interactive app, not two separate implementations.
export default async function CityPage({ params }) {
  const { city: citySlug } = await params;
  const spots = await getSpots();
  const citySpots = findCitySpots(spots, citySlug);

  if (citySpots.length === 0) notFound();

  const cityName = citySpots[0].city;

  const user = await getPremiumUser();
  const likedSpotIds = user ? await getLikedSpotIds(user.id) : [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${en.cityPage.headingPrefix} ${cityName}`,
    url: `${SITE_URL}/${citySlug}`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: citySpots.map((spot, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${SITE_URL}/${citySlug}/${spot.slug}`,
        name: spot.name,
      })),
    },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SpotsGrid
        spots={spots}
        initialCity={cityName}
        hasAccess={Boolean(user)}
        likedSpotIds={likedSpotIds}
        hero={[
          <AuthButton key="auth" hasAccess={Boolean(user)} />,
          <Hero key="hero" hasAccess={Boolean(user)} />,
        ]}
        footer={<Footer />}
      />
    </main>
  );
}
