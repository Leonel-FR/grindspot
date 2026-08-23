"use client";

import { useRouter } from "next/navigation";
import SpotModal from "@/components/SpotModal";

// Closes via an explicit push to closeHref rather than router.back() — see
// the comment in app/@modal/(...)[city]/[spot]/page.js for why back() isn't
// safe to rely on here.
export default function InterceptedSpotModal({ spot, closeHref }) {
  const router = useRouter();

  return <SpotModal spot={spot} onClose={() => router.push(closeHref)} />;
}
