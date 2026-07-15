"use client";

import { useState } from "react";
import MultiSelectDropdown from "@/components/MultiSelectDropdown";
import MobileFilterSheet from "@/components/MobileFilterSheet";

const CITY_OPTIONS = ["📍 Guadalajara", "🏙️ CDMX", "⛰️ Monterrey"];
const PRICE_OPTIONS = ["💵 $100 - $200", "💸 $150 - $200", "💰 $200 - $300"];
const PLACE_TYPE_OPTIONS = ["☕ Café", "📚 Library", "💻 Coworking", "🌳 Park"];
const RATING_OPTIONS = ["⭐️ Low", "⭐️⭐️ Medium", "⭐️⭐️⭐️ High"];

export default function FilterBar() {
  const [cities, setCities] = useState([]);
  const [prices, setPrices] = useState([]);
  const [placeTypes, setPlaceTypes] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [sheetOpen, setSheetOpen] = useState(false);

  const sections = [
    {
      title: "City",
      options: CITY_OPTIONS,
      selected: cities,
      onChange: setCities,
    },
    {
      title: "Price",
      options: PRICE_OPTIONS,
      selected: prices,
      onChange: setPrices,
    },
    {
      title: "Place type",
      options: PLACE_TYPE_OPTIONS,
      selected: placeTypes,
      onChange: setPlaceTypes,
    },
    {
      title: "Rating",
      options: RATING_OPTIONS,
      selected: ratings,
      onChange: setRatings,
    },
  ];

  const totalSelected = sections.reduce(
    (count, section) => count + section.selected.length,
    0
  );

  return (
    <div className="pb-5">
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
          placeholder="Search for name"
          className="w-full min-w-0 flex-1 rounded-3xl border-2 border-gray-300 px-4 py-2 font-bold placeholder:font-bold placeholder:text-black focus:border-[#ffa49f] focus:ring-2 focus:ring-[#ffa49f] focus:outline-none"
        />
      </div>

      {/* Desktop: search bar + dropdowns */}
      <div className="hidden sm:flex sm:flex-wrap sm:items-center sm:gap-3">
        <input
          type="text"
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

        <button className="cursor-pointer rounded-3xl bg-[#FF5A5F] px-4 py-3 font-bold text-white shadow-md">
          Join GrindSpot.com
        </button>
      </div>

      {sheetOpen && (
        <MobileFilterSheet
          sections={sections}
          onClose={() => setSheetOpen(false)}
        />
      )}
    </div>
  );
}
