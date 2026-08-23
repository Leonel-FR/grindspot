"use client";

import { useRouter } from "next/navigation";
import EmailModal from "@/components/EmailModal";

// Closes via an explicit push to closeHref rather than router.back() — see
// the comment in app/@modal/(...)[city]/[spot]/page.js for why back() isn't
// safe to rely on here.
export default function InterceptedEmailModal({ closeHref }) {
  const router = useRouter();

  return <EmailModal onClose={() => router.push(closeHref)} />;
}
