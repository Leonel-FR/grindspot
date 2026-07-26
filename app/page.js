import Hero from "@/components/Hero";
import SpotsGrid from "@/components/SpotsGrid";
import { getSpots } from "@/lib/spots";

export default async function Home() {
  const spots = await getSpots();

  return (
    <main>
      <Hero />
      <SpotsGrid spots={spots} />
    </main>
  );
}

  