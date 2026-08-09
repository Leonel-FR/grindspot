import Hero from "@/components/Hero";
import SpotsGrid from "@/components/SpotsGrid";
import Footer from "@/components/Footer";
import { getSpots } from "@/lib/spots";
import { getPremiumUser, getLikedSpotIds } from "@/lib/access";

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
