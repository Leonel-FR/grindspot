import Image from "next/image";
import StatBar from "@/components/StatBar";

export default function SpotModal({ spot, onClose }) {
  function formatHours(hours) {
    if (!hours || hours.closed) return "❌ Closed";
    return `${hours.open} - ${hours.close}`;
  }

  const Days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 px-4 py-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-md flex-col overflow-y-auto rounded-2xl bg-white sm:max-w-lg md:h-[min(80vh,50vw,32rem)] md:max-w-4xl md:flex-row md:overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="text-ink absolute top-4 right-4 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white/50"
        >
          ✕
        </button>

        <div className="relative aspect-5/4.5 w-full shrink-0 md:aspect-square md:h-full md:w-auto">
          <Image
            src={spot.image}
            alt={spot.name}
            fill
            sizes="(min-width: 640px) 512px, 100vw"
            quality={100}
            className="object-cover"
          />
        </div>

        <div className="min-w-0 p-5 sm:p-6 md:flex-1 md:overflow-y-auto">
          <h2 className="font-display text-ink text-xl font-bold sm:text-2xl">
            {spot.name}
          </h2>
          <p className="text-muted mt-1 text-sm">{spot.address}</p>
          <p className="text-accent mt-1 text-sm font-semibold">
            {spot.priceRange}
          </p>

          <div className="mt-6 flex flex-col gap-4">
            <StatBar
              label="⭐️ Rating"
              value={(spot.rating / 5) * 100}
              light
              animateOnMount
            />
            <StatBar
              label="💻 Work"
              value={spot.workFriendly}
              light
              animateOnMount
            />
            <StatBar label="🤫 Quiet" value={spot.quiet} light animateOnMount />
            <StatBar label="💰 Value" value={spot.value} light animateOnMount />
          </div>

          <ul className="pt-6 font-semibold">
            {Days.map((day) => {
              const schedules = spot.hours[day];
              return (
                <li key={day} className="flex justify-between">
                  <span className="capitalize">{day}</span>
                  <span>{formatHours(schedules)}</span>
                </li>
              );
            })}
          </ul>

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
