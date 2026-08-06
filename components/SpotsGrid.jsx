"use client";

import { useMemo, useState } from "react";
import SpotCard from "@/components/SpotCard";
import SpotModal from "@/components/SpotModal";
import FilterBar from "@/components/FilterBar";
import { isSpotOpenNow } from "@/lib/isOpenNow";
import { spotMatchesPriceRanges } from "@/lib/priceRanges";
import { spotMatchesRatingCategories } from "@/lib/ratingCategory";
import { formatPlaceType } from "@/lib/placeTypes";

export default function SpotsGrid({ spots }) {
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [openNow, setOpenNow] = useState(false);
  const [cities, setCities] = useState([]);
  const [prices, setPrices] = useState([]);
  const [placeTypes, setPlaceTypes] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [search, setSearch] = useState("");

  const cityOptions = useMemo(
    () => [...new Set(spots.map((spot) => spot.city))].sort(),
    [spots]
  );

  const placeTypeOptions = useMemo(
    () =>
      [...new Set(spots.map((spot) => spot.placeType))]
        .sort()
        .map(formatPlaceType),
    [spots]
  );

  const visibleSpots = useMemo(() => {
    const query = search.trim().toLowerCase();

    return spots.filter((spot) => {
      if (openNow && !isSpotOpenNow(spot)) return false;
      if (cities.length > 0 && !cities.includes(spot.city)) return false;
      if (prices.length > 0 && !spotMatchesPriceRanges(spot, prices))
        return false;
      if (
        placeTypes.length > 0 &&
        !placeTypes.includes(formatPlaceType(spot.placeType))
      )
        return false;
      if (ratings.length > 0 && !spotMatchesRatingCategories(spot, ratings))
        return false;
      if (query && !spot.name.toLowerCase().includes(query)) return false;
      return true;
    });
  }, [spots, openNow, cities, prices, placeTypes, ratings, search]);

  return (
    <section className="mx-auto max-w-345 px-6 py-1">
      {/*<h2 className="font-display text-ink mb-6 text-xl font-bold">
        {spots.length} spots to work from
      </h2>
      */}
      <FilterBar
        openNow={openNow}
        onOpenNowChange={setOpenNow}
        cityOptions={cityOptions}
        cities={cities}
        onCitiesChange={setCities}
        prices={prices}
        onPricesChange={setPrices}
        placeTypeOptions={placeTypeOptions}
        placeTypes={placeTypes}
        onPlaceTypesChange={setPlaceTypes}
        ratings={ratings}
        onRatingsChange={setRatings}
        search={search}
        onSearchChange={setSearch}
        resultsCount={visibleSpots.length}
      />
      {visibleSpots.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {visibleSpots.map((spot) => (
            <SpotCard
              key={spot.id}
              spot={spot}
              onClick={() => setSelectedSpot(spot)}
            />
          ))}
        </div>
      ) : (
        <p className="py-16 text-center text-lg font-bold text-gray-500">
          🔍 No spots found
        </p>
      )}

      {selectedSpot && (
        <SpotModal spot={selectedSpot} onClose={() => setSelectedSpot(null)} />
      )}
    </section>
  );
}
