import Image from "next/image";
import StatBar from "@/components/StatBar";

export default function SpotCard({ spot, onClick }) {
  return (
    <div
      onClick={onClick}
      className="group border-line cursor-pointer overflow-hidden rounded-2xl border border-gray-300 bg-white"
    >
      <div className="bg-secondary relative aspect-5/4.5">
        <Image src={spot.image} alt={spot.name} fill className="object-cover" />

        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/5 px-4 opacity-100 transition-opacity duration-25 group-hover:opacity-0">
          <h3 className="font-display text-center text-2xl font-bold text-white [text-shadow:0_2px_2px_rgba(0,0,0,0.9)] md:text-3xl">
            {spot.name}
          </h3>
          <h3 className="font-display text-center text-xl font-medium text-white [text-shadow:0_2px_2px_rgba(0,0,0,0.9)] md:text-xl">
            {spot.city}
          </h3>
        </div>

        <div className="absolute inset-0 flex flex-col justify-center gap-4 bg-black/70 px-6 opacity-0 transition-opacity duration-50 group-hover:opacity-100">
          <StatBar
            label="⭐️ Rating"
            value={(spot.rating / 5) * 100}
            animateOnHover
          />
          <StatBar label="💻 Work" value={spot.workFriendly} animateOnHover />
          <StatBar label="🤫 Quiet" value={spot.quiet} animateOnHover />
          <StatBar label="💰 Value" value={spot.value} animateOnHover />
        </div>

        <span className="absolute right-2 bottom-2 rounded px-2 py-1 text-lg font-bold text-white opacity-100 transition-opacity duration-50 [text-shadow:0_2px_2px_rgba(0,0,0,0.9)] group-hover:opacity-0">
          {spot.priceRange}
        </span>

        <span className="absolute bottom-2 left-2 rounded px-2 py-1 text-lg font-bold text-white opacity-100 transition-opacity duration-50 [text-shadow:0_2px_2px_rgba(0,0,0,0.9)] group-hover:opacity-0">
          ✅ Opened
        </span>
      </div>
    </div>
  );
}
