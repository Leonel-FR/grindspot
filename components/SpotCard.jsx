
import Image from "next/image";

export default function SpotCard({ spot }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-line border-gray-300 bg-white cursor-pointer">
      <div className="relative aspect-4/3 bg-secondary">
        <Image
          src={spot.image}
          alt={spot.name}
          fill
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/5 flex items-center justify-center px-4">
          <h3 className="font-display font-bold text-xl md:text-2xl text-white text-center text-shadow-lg">
  {spot.name}
</h3>
        </div>

        <span className="absolute bottom-2 right-2 text-lg font-bold px-2 py-1 rounded text-white">
          {spot.priceRange}
        </span>
      </div>
    </div>
  );
}

