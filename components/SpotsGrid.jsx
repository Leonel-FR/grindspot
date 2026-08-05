"use client";

import { useMemo, useState } from "react";
import SpotCard from "@/components/SpotCard";
import SpotModal from "@/components/SpotModal";
import FilterBar from "@/components/FilterBar";
import { isSpotOpenNow } from "@/lib/isOpenNow";

export default function SpotsGrid({ spots }) {
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [openNow, setOpenNow] = useState(false);

  const visibleSpots = useMemo(
    () => (openNow ? spots.filter((spot) => isSpotOpenNow(spot)) : spots),
    [spots, openNow]
  );

  return (
    <section className="mx-auto max-w-345 px-6 py-1">
      {/*<h2 className="font-display text-ink mb-6 text-xl font-bold">
        {spots.length} spots to work from
      </h2>
      */}
      <FilterBar openNow={openNow} onOpenNowChange={setOpenNow} />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {visibleSpots.map((spot) => (
          <SpotCard
            key={spot.id}
            spot={spot}
            onClick={() => setSelectedSpot(spot)}
          />
        ))}
      </div>

      {selectedSpot && (
        <SpotModal spot={selectedSpot} onClose={() => setSelectedSpot(null)} />
      )}
    </section>
  );
}
