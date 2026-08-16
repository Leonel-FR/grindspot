"use client";

import { useLanguage } from "@/components/LanguageProvider";

// Shows the language you'd switch *to*, not the current one — same pattern
// as Wikipedia's language links, no flag icons (a flag maps to a country,
// not a language, and MXN/ES here isn't tied to a specific country flag).
export default function LanguageToggle({ className }) {
  const { language, setLanguage, t } = useLanguage();
  const nextLanguage = language === "en" ? "es" : "en";

  return (
    <button
      type="button"
      onClick={() => setLanguage(nextLanguage)}
      aria-label={t("language.label")}
      className={
        className ??
        "flex shrink-0 cursor-pointer items-center justify-center rounded-3xl border-2 border-gray-300 bg-white px-3 py-2 text-sm font-bold text-black transition-colors hover:border-[#FF5A5F] focus:border-[#ffa49f] focus:ring-2 focus:ring-[#ffa49f] focus:outline-none"
      }
    >
      {t("language.switchTo")}
    </button>
  );
}
