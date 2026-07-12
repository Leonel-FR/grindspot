import Image from "next/image";

export default function SpotCard({ spot }) {
  return (
    <div className="border-line cursor-pointer overflow-hidden rounded-2xl border border-gray-300 bg-white">
      <div className="bg-secondary relative aspect-5/4.5">
        <Image src={spot.image} alt={spot.name} fill className="object-cover" />

        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/5 px-4">
          <h3 className="font-display text-center text-2xl font-bold text-white [text-shadow:0_2px_2px_rgba(0,0,0,0.9)] md:text-3xl">
            {spot.name}
          </h3>
          <h3 className="font-display text-center text-xl font-medium text-white [text-shadow:0_2px_2px_rgba(0,0,0,0.9)] md:text-xl">
            {spot.city}
          </h3>
        </div>

        <span className="absolute right-2 bottom-2 rounded px-2 py-1 text-lg font-bold text-white [text-shadow:0_2px_2px_rgba(0,0,0,0.9)]">
          {spot.priceRange}
        </span>
      </div>
    </div>
  );
}
