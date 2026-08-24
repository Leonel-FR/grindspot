"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { InlineAuthButton } from "@/components/AuthButton";
import MultiSelectDropdown from "@/components/MultiSelectDropdown";
import MobileFilterSheet from "@/components/MobileFilterSheet";
import ToggleFilterButton from "@/components/ToggleFilterButton";
import ViewSwitcher from "@/components/ViewSwitcher";
import { useLanguage } from "@/components/LanguageProvider";
import { PRICE_RANGES } from "@/lib/priceRanges";
import { RATING_CATEGORIES } from "@/lib/ratingCategory";

const PRICE_OPTIONS = PRICE_RANGES.map((range) => range.label);
const RATING_OPTIONS = RATING_CATEGORIES.map((entry) => entry.label);

export default function FilterBar({
  openNow,
  onOpenNowChange,
  notClosingSoon,
  onNotClosingSoonChange,
  view,
  onViewChange,
  cityOptions,
  cities,
  onCitiesChange,
  prices,
  onPricesChange,
  placeTypeOptions,
  placeTypes,
  onPlaceTypesChange,
  ratings,
  onRatingsChange,
  search,
  onSearchChange,
  resultsCount,
  onRequestAccess,
  hasAccess,
}) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const { data: session } = useSession();
  const { t } = useLanguage();
  // Mirrors Hero's own visibility check: when both are true, Hero renders
  // `null` and this becomes the first thing on the page, so it needs extra
  // top breathing room on mobile (desktop already has its own top padding
  // via the row below).
  const heroHidden = Boolean(session) && hasAccess;

  const sections = [
    {
      title: t("filterBar.city"),
      options: cityOptions,
      selected: cities,
      onChange: onCitiesChange,
    },
    {
      title: t("filterBar.price"),
      options: PRICE_OPTIONS,
      selected: prices,
      onChange: onPricesChange,
    },
    {
      title: t("filterBar.placeType"),
      options: placeTypeOptions,
      selected: placeTypes,
      onChange: onPlaceTypesChange,
    },
    // Rating filter hidden for now (not in use yet), logic kept intact.
    // {
    //   title: "Rating",
    //   options: RATING_OPTIONS,
    //   selected: ratings,
    //   onChange: onRatingsChange,
    // },
  ];

  // Includes openNow/notClosingSoon so the mobile Filters button's badge
  // (and the sheet's "Show results" count) still reflect them now that
  // they live inside MobileFilterSheet instead of their own visible row.
  const totalSelected =
    sections.reduce((count, section) => count + section.selected.length, 0) +
    (openNow ? 1 : 0) +
    (notClosingSoon ? 1 : 0);
  const hasActiveFilters = totalSelected > 0 || search.trim().length > 0;
  const isMapView = view === "map";

  return (
    <div
      className={
        // Map view: SpotsMap renders full-screen behind everything, so this
        // becomes a floating, transparent overlay instead of an in-flow
        // section — the pill-shaped controls below already carry their own
        // solid backgrounds, so they stay legible over the map.
        isMapView
          ? "fixed inset-x-0 top-0 z-20 px-6 py-3"
          : `pb-5 ${heroHidden ? "pt-3 sm:pt-6" : ""}`
      }
    >
      <div className={isMapView ? "mx-auto max-w-345" : ""}>
        {/* Mobile: Filters button + search bar */}
        <div className="flex items-center gap-3 sm:hidden">
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="flex shrink-0 items-center gap-1.5 rounded-3xl border-2 border-[#FF5A5F] bg-white px-4 py-2 font-bold text-[#FF5A5F] shadow-md focus:ring-2 focus:ring-[#ffa49f] focus:outline-none"
          >
            {t("filterBar.filtersButton")}
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
            className="w-full min-w-0 flex-1 rounded-3xl border-2 border-gray-300 px-4 py-2 font-bold placeholder:font-bold placeholder:text-black focus:border-[#ffa49f] focus:ring-2 focus:ring-[#ffa49f] focus:outline-none"
          />
        </div>
        <div className="mt-3 flex items-center justify-between gap-3 sm:hidden">
          <ViewSwitcher view={view} onViewChange={onViewChange} />
          {heroHidden && <InlineAuthButton />}
        </div>

        {/* Desktop: search bar + dropdowns */}
        <div className="hidden sm:flex sm:flex-wrap sm:items-center sm:gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t("filterBar.searchPlaceholder")}
            className="rounded-3xl border-2 border-gray-300 px-4 py-2 font-bold placeholder:font-bold placeholder:text-black focus:border-[#ffa49f] focus:ring-2 focus:ring-[#ffa49f] focus:outline-none"
          />
          {sections.map((section) => (
            <MultiSelectDropdown
              key={section.title}
              label={section.title}
              options={section.options}
              selected={section.selected}
              onChange={section.onChange}
            />
          ))}
          <ToggleFilterButton
            checked={openNow}
            onChange={onOpenNowChange}
            label={t("filterBar.openNow")}
          />
          <ToggleFilterButton
            checked={notClosingSoon}
            onChange={onNotClosingSoonChange}
            label={t("filterBar.notClosingSoon")}
          />
          <ViewSwitcher view={view} onViewChange={onViewChange} />

          {!hasAccess && (
            <button
              className="cursor-pointer rounded-3xl bg-[#FF5A5F] px-4 py-3 font-bold text-white shadow-md"
              onClick={onRequestAccess}
            >
              {t("filterBar.join")}
            </button>
          )}
          {heroHidden && (
            // ml-auto (not the parent's justify-between) so this stays
            // pinned to the row's right edge when it fits, but still wraps
            // onto — and re-pins to the right of — its own line instead of
            // overflowing when the filters above it already fill the row.
            <InlineAuthButton className="ml-auto flex shrink-0 cursor-pointer items-center gap-2 rounded-3xl bg-[#FF5A5F] px-4 py-2 font-bold text-white shadow-md disabled:cursor-not-allowed disabled:opacity-70" />
          )}
        </div>
      </div>

      {sheetOpen && (
        <MobileFilterSheet
          sections={sections}
          openNow={openNow}
          onOpenNowChange={onOpenNowChange}
          notClosingSoon={notClosingSoon}
          onNotClosingSoonChange={onNotClosingSoonChange}
          onClose={() => setSheetOpen(false)}
          resultsCount={resultsCount}
          hasActiveFilters={hasActiveFilters}
        />
      )}
    </div>
  );
}
