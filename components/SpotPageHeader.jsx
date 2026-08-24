"use client";

import { useState } from "react";
import Link from "next/link";
import EmailModal from "@/components/EmailModal";
import { useLanguage } from "@/components/LanguageProvider";

// Same header as PageHeader.jsx, except the "Back to home" link is swapped
// for the join CTA (same button FilterBar shows non-premium visitors) when
// this spot's visitor doesn't have access — nudging the exact audience this
// pSEO page is built for toward signing up, instead of just sending them
// back to the homepage.
export default function SpotPageHeader({ hasAccess }) {
  const { t } = useLanguage();
  const [emailModalOpen, setEmailModalOpen] = useState(false);

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-345 items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="cursor-pointer text-xl font-black text-[#FF5A5F]"
        >
          GrindSpot
        </Link>
        {hasAccess ? (
          <Link
            href="/"
            className="cursor-pointer text-sm font-bold text-gray-600 hover:text-[#FF5A5F]"
          >
            ← Back to home
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => setEmailModalOpen(true)}
            className="cursor-pointer rounded-3xl bg-[#FF5A5F] px-4 py-3 font-bold text-white shadow-md"
          >
            {t("filterBar.join")}
          </button>
        )}
      </div>

      {emailModalOpen && (
        <EmailModal onClose={() => setEmailModalOpen(false)} />
      )}
    </header>
  );
}
