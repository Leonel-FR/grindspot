import { notFound } from "next/navigation";
import InterceptedSpotModal from "@/components/InterceptedSpotModal";
import InterceptedEmailModal from "@/components/InterceptedEmailModal";
import { getSpots, findSpot, getSpotById } from "@/lib/spots";
import { getPremiumUser } from "@/lib/access";

// Intercepts client-side navigation to /[city]/[spot] from anywhere in the
// app ((...) matches from the root) so the spot opens as a modal over the
// grid instead of navigating away from it. A hard reload or a direct/shared
// URL skips this entirely and renders app/[city]/[spot]/page.js instead —
// same gate as SpotsGrid used to run client-side, just decided here now
// since the click that reaches this route is a real navigation, not a
// client fetch.
export default async function InterceptedSpotPage({ params }) {
  const { city: citySlug, spot: spotSlug } = await params;
  const spots = await getSpots();
  const spot = findSpot(spots, citySlug, spotSlug);

  if (!spot) notFound();

  const user = await getPremiumUser();
  if (!user) return <InterceptedEmailModal />;

  const fullDetail = await getSpotById(spot.id);
  return <InterceptedSpotModal spot={fullDetail} />;
}
