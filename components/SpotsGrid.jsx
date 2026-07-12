"use client";

import { useState } from "react";
import spots from "@/data/spots.json";
import SpotCard from "@/components/SpotCard";
import SpotModal from "@/components/SpotModal";

export default function SpotsGrid() {
  const [selectedSpot, setSelectedSpot] = useState(null);

  return (
    <section className="mx-auto max-w-345 px-6 py-1">
      <h2 className="font-display text-ink mb-6 text-xl font-bold">
        {spots.length} spots to work from
      </h2>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {spots.map((spot) => (
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
