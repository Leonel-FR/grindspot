import Image from "next/image";

export default function SpotCard({ spot }) {
  return (
    <div className="group border-line cursor-pointer overflow-hidden rounded-2xl border border-gray-300 bg-white">
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
          <StatBar label="⭐️ Rating" value={(spot.rating / 5) * 100} />
          <StatBar label="💻 Work" value={spot.workFriendly} />
          <StatBar label="🤫 Quiet" value={spot.quiet} />
          <StatBar label="💰 Value" value={spot.value} />
        </div>

        <span className="absolute right-2 bottom-2 rounded px-2 py-1 text-lg font-bold text-white opacity-100 transition-opacity duration-50 [text-shadow:0_2px_2px_rgba(0,0,0,0.9)] group-hover:opacity-0">
          {spot.priceRange}
        </span>
      </div>
    </div>
  );
}

function StatBar({ label, value }) {
  return (
    <div className="flex items-center gap-15">
      <span className="text-sm- w-17 shrink-0 text-white">{label}</span>
      <div className="mt-1 h-6 w-full rounded-full bg-white/20">
        <div
          className={`h-full w-0 rounded-l-full transition-[width] duration-225 ease-out ${`group-hover:w-(--fill)`} ${getBarColor(value)}`}
          style={{ "--fill": `${value}%` }}
        />
      </div>
    </div>
  );
}

function getBarColor(value) {
  if (value < 40) return "bg-[#ff4843]";
  if (value < 70) return "bg-[#ffc925]";
  return "bg-[#2bde73]";
}
