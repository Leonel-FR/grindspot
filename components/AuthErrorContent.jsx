"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";

// Split out of the auth error page (an async Server Component reading
// `searchParams`) because the language preference only lives in client
// state — same reasoning as Footer/FooterContent and FAQ/FAQContent.
export default function AuthErrorContent({ isAccessDenied }) {
  const { t } = useLanguage();

  return (
    <main className="flex min-h-full flex-col items-center justify-center gap-4 px-6 py-20 md:py-32">
      <h1 className="text-center text-3xl font-bold">
        {isAccessDenied
          ? t("authError.accessDeniedTitle")
          : t("authError.genericTitle")}
      </h1>
      <p className="max-w-lg text-center text-lg text-gray-600">
        {isAccessDenied
          ? t("authError.accessDeniedMessage")
          : t("authError.genericMessage")}
      </p>
      <Link href="/">
        <button className="cursor-pointer rounded-lg bg-[#FF5A5F] px-6 py-3 font-bold text-white">
          {t("authError.returnHome")}
        </button>
      </Link>
    </main>
  );
}
