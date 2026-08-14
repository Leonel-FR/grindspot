import Hero from "@/components/Hero";
import SpotsGrid from "@/components/SpotsGrid";
import Footer from "@/components/Footer";
import { getSpots } from "@/lib/spots";
import { getPremiumUser, getLikedSpotIds } from "@/lib/access";

// Reads the DB and the session on every request, so it was never a
// candidate for static generation anyway — forcing it explicitly skips
// Next's build-time prerender trial, which would otherwise run getSpots()
// against a database that isn't reachable yet at build time (Railway's
// private network only exists at runtime, not during the build step).
export const dynamic = "force-dynamic";

export default async function Home() {
  const spots = await getSpots();
  const user = await getPremiumUser();
  const likedSpotIds = user ? await getLikedSpotIds(user.id) : [];

  return (
    <main>
      <Hero hasAccess={Boolean(user)} />
      <SpotsGrid
        spots={spots}
        hasAccess={Boolean(user)}
        likedSpotIds={likedSpotIds}
      />
      <Footer />
    </main>
  );
}
