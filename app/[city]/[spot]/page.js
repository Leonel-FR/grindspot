import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import Footer from "@/components/Footer";
import SpotPageContent from "@/components/SpotPageContent";
import { getSpots, findSpot, getSpotById } from "@/lib/spots";
import { getPremiumUser } from "@/lib/access";
import en from "@/lib/i18n/dictionaries/en";

const SITE_URL = "https://grind-spot.com";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { city: citySlug, spot: spotSlug } = await params;
  const spots = await getSpots();
  const spot = findSpot(spots, citySlug, spotSlug);

  if (!spot) return { title: "Remote Work Spot" };

  return {
    title: `${spot.name} — ${spot.city}`,
    description: `${spot.name} — ${spot.placeType} ${en.spotPage.introConnector} ${spot.city}. ${spot.rating}/5 ${en.spotPage.ratingSuffix}.`,
    alternates: {
      canonical: `/${citySlug}/${spotSlug}`,
    },
  };
}

export default async function SpotPage({ params }) {
  const { city: citySlug, spot: spotSlug } = await params;
  const spots = await getSpots();
  const spot = findSpot(spots, citySlug, spotSlug);

  if (!spot) notFound();

  // A visitor who's already signed in with premium access gets the same
  // full detail the modal shows elsewhere — everyone else (including every
  // anonymous/crawler request) only ever sees the teaser fields below.
  const user = await getPremiumUser();
  const fullDetail = user ? await getSpotById(spot.id) : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Place",
    name: spot.name,
    image: spot.image,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: spot.rating,
      bestRating: 5,
    },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader />
      <SpotPageContent spot={spot} fullDetail={fullDetail} citySlug={citySlug} />
      <Footer />
    </main>
  );
}
