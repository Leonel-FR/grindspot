"use client";

import { useEffect } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import FilterPanel from "@/components/FilterPanel";

// Desktop-only (lg+) filter panel: a fixed column pinned to the left edge of
// the viewport, sitting just below the sticky top bar (which is lg:h-16 tall,
// hence top-16 / calc(100dvh-4rem) here). Slides in and out with translate-x
// while SpotsGrid pads the grid/map over to make room. Never used below lg —
// MobileFilterSheet covers that. `inert` when closed keeps the off-screen
// controls out of the tab order.
export default function FilterSidebar({
  open,
  onClose,
  triggerRef,
  sections,
  openNow,
  onOpenNowChange,
  notClosingSoon,
  onNotClosingSoonChange,
  view,
  onViewChange,
  hasActiveFilters,
  onClearAll,
}) {
  const { t } = useLanguage();

  const close = () => {
    onClose();
    triggerRef?.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- close is stable enough; re-binding on every render is wasteful
  }, [open]);

  return (
    <aside
      id="filter-panel"
      aria-label={t("mobileFilterSheet.title")}
      inert={!open}
      className={`fixed top-16 left-0 z-30 hidden h-[calc(100dvh-4rem)] w-80 flex-col border-r-2 border-gray-200 bg-white transition-transform duration-300 ease-out will-change-transform motion-reduce:transition-none lg:flex ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <header className="flex items-center justify-between px-5 py-4">
        <h2 className="text-lg font-bold text-black">
          {t("mobileFilterSheet.title")}
        </h2>
        <button
          type="button"
          onClick={close}
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

      <div className="flex-1 overflow-y-auto px-5 pb-24">
        <FilterPanel
          sections={sections}
          openNow={openNow}
          onOpenNowChange={onOpenNowChange}
          notClosingSoon={notClosingSoon}
          onNotClosingSoonChange={onNotClosingSoonChange}
          view={view}
          onViewChange={onViewChange}
          hasActiveFilters={hasActiveFilters}
          onClearAll={onClearAll}
        />
      </div>
    </aside>
  );
}
