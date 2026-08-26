"use client";

import { useSession } from "next-auth/react";
import ProfileMenu from "@/components/ProfileMenu";
import ViewSwitcher from "@/components/ViewSwitcher";
import { useLanguage } from "@/components/LanguageProvider";

// Slim top bar shown on every breakpoint: profile avatar · Filters toggle ·
// search · (lg+) Grid/Map switch · Join CTA for signed-out / unpaid visitors.
// The filters themselves live in FilterSidebar (lg+) / MobileFilterSheet
// (below lg), both owned by SpotsGrid — this is just the always-visible row.
export default function FilterBar({
  search,
  onSearchChange,
  view,
  onViewChange,
  filtersOpen,
  onToggleFilters,
  totalSelected,
  hasAccess,
  onRequestAccess,
  filtersButtonRef,
}) {
  const { data: session } = useSession();
  const { t } = useLanguage();
  // When both are true, Hero renders null and this row is the first thing on
  // the page — that's also the only case the inline profile avatar shows
  // (otherwise the fixed top-right AuthButton is handling sign-in/out).
  const heroHidden = Boolean(session) && hasAccess;

  return (
    <div className="flex w-full items-center gap-3">
      {heroHidden && <ProfileMenu />}

      <button
        ref={filtersButtonRef}
        type="button"
        onClick={onToggleFilters}
        aria-expanded={filtersOpen}
        aria-controls="filter-panel"
        className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-3xl border-2 border-[#FF5A5F] bg-white px-4 py-2 font-bold text-[#FF5A5F] shadow-md focus:ring-2 focus:ring-[#ffa49f] focus:outline-none"
      >
        {filtersOpen
          ? t("filterBar.closeFilters")
          : t("filterBar.filtersButton")}
        {totalSelected > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#FF5A5F] px-1.5 text-xs font-bold text-white">
            {totalSelected}
          </span>
        )}
      </button>

      <input
        type="text"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={t("filterBar.searchPlaceholder")}
        className="min-w-0 flex-1 rounded-3xl border-2 border-gray-300 bg-white px-4 py-2 font-bold placeholder:font-bold placeholder:text-black focus:border-[#ffa49f] focus:ring-2 focus:ring-[#ffa49f] focus:outline-none lg:w-96 lg:flex-none"
      />

      <ViewSwitcher
        view={view}
        onViewChange={onViewChange}
        className="ml-auto hidden lg:flex"
      />

      {!hasAccess && (
        <button
          type="button"
          onClick={onRequestAccess}
          className="hidden shrink-0 cursor-pointer rounded-3xl bg-[#FF5A5F] px-4 py-2 font-bold text-white shadow-md sm:block"
        >
          {t("filterBar.join")}
        </button>
      )}
    </div>
  );
}
