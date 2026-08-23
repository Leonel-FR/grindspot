"use client";

import { useRouter } from "next/navigation";
import SpotModal from "@/components/SpotModal";

// router.back() (not a Link) so backwards navigation genuinely closes the
// modal instead of pushing a new "closed" entry — the documented pattern
// for intercepted-route modals.
export default function InterceptedSpotModal({ spot }) {
  const router = useRouter();

  return <SpotModal spot={spot} onClose={() => router.back()} />;
}
