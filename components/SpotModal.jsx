import Image from "next/image";
import StatBar from "@/components/StatBar";

export default function SpotModal({ spot, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-md flex-col overflow-y-auto rounded-2xl bg-white sm:max-w-lg md:max-h-[80vh] md:max-w-3xl md:flex-row md:overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="text-ink absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90"
        >
          ✕
        </button>

        <div className="relative aspect-[5/4.5] w-full shrink-0 md:aspect-auto md:h-full md:w-2/5">
          <Image
            src={spot.image}
            alt={spot.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="p-5 sm:p-6 md:w-3/5 md:overflow-y-auto">
          <h2 className="font-display text-ink text-xl font-bold sm:text-2xl">
            {spot.name}
          </h2>
          <p className="text-muted mt-1 text-sm">{spot.address}</p>
          <p className="text-accent mt-1 text-sm font-semibold">
            {spot.priceRange}
          </p>

          <div className="mt-6 flex flex-col gap-4">
            <StatBar label="⭐️ Rating" value={(spot.rating / 5) * 100} light />
            <StatBar label="💻 Work" value={spot.workFriendly} light />
            <StatBar label="🤫 Quiet" value={spot.quiet} light />
            <StatBar label="💰 Value" value={spot.value} light />
          </div>

          {spot.busyHours && (
            <p className="text-muted mt-4 text-sm">🕑 {spot.busyHours}</p>
          )}

          <a
            href={spot.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-accent mt-6 block w-full rounded-md px-6 py-3 text-center text-sm font-semibold text-black"
          >
            Open in Google Maps
          </a>
        </div>
      </div>
    </div>
  );
}
