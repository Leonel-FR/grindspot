"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <main className="flex min-h-full flex-col items-center justify-center gap-4 px-6 py-20 md:py-32">
      <p className="text-6xl font-black text-[#FF5A5F]">404</p>
      <h1 className="text-center text-3xl font-bold">{t("notFound.title")}</h1>
      <p className="max-w-lg text-center text-lg text-gray-600">
        {t("notFound.message")}
      </p>
      <Link href="/">
        <button className="cursor-pointer rounded-lg bg-[#FF5A5F] px-6 py-3 font-bold text-white">
          {t("notFound.homeButton")}
        </button>
      </Link>
    </main>
  );
}
