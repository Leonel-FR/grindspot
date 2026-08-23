"use client";

import { useRouter } from "next/navigation";
import EmailModal from "@/components/EmailModal";

export default function InterceptedEmailModal() {
  const router = useRouter();

  return <EmailModal onClose={() => router.back()} />;
}
