"use client";

import { useEffect } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import FilterPanel from "@/components/FilterPanel";

// Full-screen filter takeover for anything below lg (phones + small tablets).
// On lg+ the docked FilterSidebar is used instead, so this is `lg:hidden` and
// SpotsGrid only mounts it when the viewport is actually below that.
export default function MobileFilterSheet({
  sections,
  openNow,
  onOpenNowChange,
  notClosingSoon,
  onNotClosingSoonChange,
  view,
  onViewChange,
  onClose,
  resultsCount,
  hasActiveFilters,
  onClearAll,
}) {
  const { t } = useLanguage();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t("mobileFilterSheet.title")}
      className="fixed inset-0 z-50 flex flex-col bg-white lg:hidden"
    >
      <header className="flex items-center justify-between px-5 py-4">
        <h2 className="text-xl font-bold text-black">
          {t("mobileFilterSheet.title")}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label={t("mobileFilterSheet.close")}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 border-gray-300 font-bold text-black focus:border-[#FF5A5F] focus:ring-2 focus:ring-[#ffa49f] focus:outline-none"
        >
          <svg
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
            className="h-4 w-4"
          >
            <path
              d="M5 5 15 15M15 5 5 15"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-5 pb-6">
        <FilterPanel
          sections={sections}
          openNow={openNow}
          onOpenNowChange={onOpenNowChange}
          notClosingSoon={notClosingSoon}
          onNotClosingSoonChange={onNotClosingSoonChange}
          view={view}
          // Picking a view from inside the sheet also dismisses it, so the
          // result is visible right away.
          onViewChange={(v) => {
            onViewChange(v);
            onClose();
          }}
          hasActiveFilters={hasActiveFilters}
          onClearAll={onClearAll}
        />
      </div>

      <button
        type="button"
        onClick={onClose}
        className="w-full cursor-pointer bg-[#FF5A5F] py-4 text-lg font-bold text-white focus:outline-none"
      >
        {t("mobileFilterSheet.showResults")}
        {hasActiveFilters ? ` (${resultsCount})` : ""}
      </button>
    </div>
  );
}
