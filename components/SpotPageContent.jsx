"use client";

import Image from "next/image";
import Link from "next/link";
import StatBar from "@/components/StatBar";
import UnlockAccessCTA from "@/components/UnlockAccessCTA";
import { useLanguage } from "@/components/LanguageProvider";

const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

// Duplicated from SpotModal.jsx rather than extracted — that file is the
// live paying-customer modal path, not worth touching for a ~12-line dedup.
function formatTime(time) {
  const [hourStr, minute] = time.split(":");
  const hour = Number(hourStr);
  const period = hour >= 12 ? "PM" : "AM";
  return `${hour % 12 || 12}:${minute} ${period}`;
}

function formatHours(hours, closedLabel) {
  if (!hours || hours.closed) return closedLabel;
  return `${formatTime(hours.open)} - ${formatTime(hours.close)}`;
}

// Deliberately mirrors SpotModal.jsx's markup (same image treatment, price
// line, stats grid, hours list) so a visitor landing here directly sees the
// same design as the in-app modal — just as a standalone page instead of a
// floating dialog, so no overlay/backdrop/close button. Note: SpotModal.jsx
// itself styles its address text and Maps button with `text-muted`/
// `bg-accent`/`text-ink` — those Tailwind classes aren't defined anywhere in
// the theme and render as nothing (verified against the compiled CSS), so
// this uses the equivalent classes already proven to render correctly
// elsewhere in the app (gray-900/gray-500/#FF5A5F) instead of copying that
// pre-existing bug forward.
export default function SpotPageContent({ spot, fullDetail, citySlug }) {
  const { t } = useLanguage();

  const currentDay = fullDetail
    ? new Intl.DateTimeFormat("en-US", {
        timeZone: fullDetail.timezone,
        weekday: "long",
      })
        .format(new Date())
        .toLowerCase()
    : null;

  return (
    <section className="mx-auto max-w-4xl px-6 py-12">
      <div className="relative mt-4 flex w-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white md:h-128 md:flex-row">
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
          <h1 className="font-display text-xl font-bold text-gray-900 sm:text-2xl">
            {spot.name}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {fullDetail ? fullDetail.address : spot.city}
          </p>
          <p className="mt-1 flex items-baseline gap-1 text-sm font-semibold">
            {spot.priceMin === 0 && spot.priceMax === 0 ? (
              <span>{t("common.free")}</span>
            ) : (
              <>
                <span>{spot.priceRange}</span>
                <span className="text-xs font-medium text-gray-500">MXN</span>
              </>
            )}
          </p>

          <div className="mt-6 grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-4">
            <StatBar
              label={t("stats.rating")}
              value={(spot.rating / 5) * 100}
              light
              animateOnMount
            />
            <StatBar
              label={t("stats.work")}
              value={spot.workFriendly}
              light
              animateOnMount
            />
            <StatBar
              label={t("stats.quiet")}
              value={spot.quiet}
              light
              animateOnMount
            />
            <StatBar
              label={t("stats.value")}
              value={spot.value}
              light
              animateOnMount
            />
          </div>

          {fullDetail ? (
            <>
              <ul className="pt-6 font-semibold">
                {DAYS.map((day) => {
                  const schedule = fullDetail.hours[day];
                  const isToday = day === currentDay;
                  return (
                    <li
                      key={day}
                      className={`flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 ${
                        isToday ? "bg-blue-50 text-blue-700" : ""
                      }`}
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        <span className="truncate">
                          {t(`spotModal.days.${day}`)}
                        </span>
                        {isToday && (
                          <span className="shrink-0 rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-bold tracking-wide text-white uppercase">
                            {t("spotModal.today")}
                          </span>
                        )}
                      </span>
                      <span className="shrink-0">
                        {formatHours(schedule, t("common.closed"))}
                      </span>
                    </li>
                  );
                })}
              </ul>

              <a
                href={fullDetail.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 block w-full cursor-pointer rounded-md bg-[#FF5A5F] px-6 py-3 text-center text-sm font-semibold text-white"
              >
                {t("spotModal.openInMaps")}
              </a>
            </>
          ) : (
            <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-5 text-center">
              <h2 className="text-base font-bold text-gray-900">
                {t("spotPage.ctaTitle")}
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                {t("spotPage.ctaBody")}
              </p>
              <UnlockAccessCTA />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
