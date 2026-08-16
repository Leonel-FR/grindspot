import Image from "next/image";
import StatBar from "@/components/StatBar";

export default function SpotModal({ spot, onClose }) {
  // Stored as 24h "HH:MM" strings (isOpenNow.js compares them directly), but
  // shown as 12h with AM/PM.
  function formatTime(time) {
    const [hourStr, minute] = time.split(":");
    const hour = Number(hourStr);
    const period = hour >= 12 ? "PM" : "AM";
    return `${hour % 12 || 12}:${minute} ${period}`;
  }

  function formatHours(hours) {
    if (!hours || hours.closed) return "❌ Closed";
    return `${formatTime(hours.open)} - ${formatTime(hours.close)}`;
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

  // The spot's own local day, not the visitor's — a cafe in Tokyo open until
  // 22:00 should highlight Tokyo's "today", not whatever day it is for
  // someone browsing from New York.
  const currentDay = new Intl.DateTimeFormat("en-US", {
    timeZone: spot.timezone,
    weekday: "long",
  })
    .format(new Date())
    .toLowerCase();

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
          <p className="text-accent mt-1 flex items-baseline gap-1 text-sm font-semibold">
            <span>{spot.priceRange}</span>
            <span className="text-xs font-medium text-gray-500">MXN</span>
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
              const isToday = day === currentDay;
              return (
                <li
                  key={day}
                  className={`flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 ${
                    isToday ? "bg-blue-50 text-blue-700" : ""
                  }`}
                >
                  <span className="flex min-w-0 items-center gap-2 capitalize">
                    <span className="truncate">{day}</span>
                    {isToday && (
                      <span className="shrink-0 rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-bold tracking-wide text-white uppercase">
                        Today
                      </span>
                    )}
                  </span>
                  <span className="shrink-0">{formatHours(schedules)}</span>
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
