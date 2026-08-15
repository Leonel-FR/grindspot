"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { InlineAuthButton } from "@/components/AuthButton";
import MultiSelectDropdown from "@/components/MultiSelectDropdown";
import MobileFilterSheet from "@/components/MobileFilterSheet";
import { PRICE_RANGES } from "@/lib/priceRanges";
import { RATING_CATEGORIES } from "@/lib/ratingCategory";

const PRICE_OPTIONS = PRICE_RANGES.map((range) => range.label);
const RATING_OPTIONS = RATING_CATEGORIES.map((entry) => entry.label);

function OpenNowToggle({ checked, onChange, className = "" }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={(e) => {
        onChange(!checked);
        e.currentTarget.blur();
      }}
      className={`flex shrink-0 cursor-pointer items-center gap-2 rounded-3xl border-2 bg-white px-4 py-2 font-bold text-black transition-colors focus:border-[#ffa49f] focus:ring-2 focus:ring-[#ffa49f] focus:outline-none ${
        checked ? "border-[#FF5A5F]" : "border-gray-300"
      } ${className}`}
    >
      <span
        aria-hidden="true"
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
          checked ? "border-[#FF5A5F] bg-[#FF5A5F]" : "border-gray-300"
        }`}
      >
        {checked && (
          <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5">
            <path
              d="M4.5 10.5 8.5 14.5 15.5 6"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      Open now
    </button>
  );
}

export default function FilterBar({
  openNow,
  onOpenNowChange,
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
  // Mirrors Hero's own visibility check: when both are true, Hero renders
  // `null` and this becomes the first thing on the page, so it needs extra
  // top breathing room on mobile (desktop already has its own top padding
  // via the row below).
  const heroHidden = Boolean(session) && hasAccess;

  const sections = [
    {
      title: "City",
      options: cityOptions,
      selected: cities,
      onChange: onCitiesChange,
    },
    {
      title: "Price",
      options: PRICE_OPTIONS,
      selected: prices,
      onChange: onPricesChange,
    },
    {
      title: "Place type",
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

  const totalSelected = sections.reduce(
    (count, section) => count + section.selected.length,
    0
  );
  const hasActiveFilters =
    totalSelected > 0 || openNow || search.trim().length > 0;

  return (
    <div className={`pb-5 ${heroHidden ? "pt-3 sm:pt-0" : ""}`}>
      {/* Mobile: Filters button + search bar */}
      <div className="flex items-center gap-3 sm:hidden">
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          className="flex shrink-0 items-center gap-1.5 rounded-3xl border-2 border-[#FF5A5F] bg-white px-4 py-2 font-bold text-[#FF5A5F] shadow-md focus:ring-2 focus:ring-[#ffa49f] focus:outline-none"
        >
          Filters
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
          placeholder="Search for name"
          className="w-full min-w-0 flex-1 rounded-3xl border-2 border-gray-300 px-4 py-2 font-bold placeholder:font-bold placeholder:text-black focus:border-[#ffa49f] focus:ring-2 focus:ring-[#ffa49f] focus:outline-none"
        />
      </div>
      <div className="mt-3 flex items-center justify-between gap-3 sm:hidden">
        <OpenNowToggle checked={openNow} onChange={onOpenNowChange} />
        {heroHidden && <InlineAuthButton />}
      </div>

      {/* Desktop: search bar + dropdowns */}
      <div className="hidden sm:flex sm:flex-wrap sm:items-center sm:gap-3 sm:pt-6">
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search for name"
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
        <OpenNowToggle checked={openNow} onChange={onOpenNowChange} />

        {!hasAccess && (
          <button
            className="cursor-pointer rounded-3xl bg-[#FF5A5F] px-4 py-3 font-bold text-white shadow-md"
            onClick={onRequestAccess}
          >
            Join Grind-Spot.com
          </button>
        )}
      </div>

      {sheetOpen && (
        <MobileFilterSheet
          sections={sections}
          onClose={() => setSheetOpen(false)}
          resultsCount={resultsCount}
          hasActiveFilters={hasActiveFilters}
        />
      )}
    </div>
  );
}
