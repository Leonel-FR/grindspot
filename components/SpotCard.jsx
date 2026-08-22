import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import StatBar from "@/components/StatBar";
import { useLanguage } from "@/components/LanguageProvider";

export default function SpotCard({
  spot,
  onClick,
  liked,
  onToggleLike,
  loading,
}) {
  const { t } = useLanguage();
  const openNow = spot.openNow;
  const [imageLoaded, setImageLoaded] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const imgRef = useRef(null);
  const cardRef = useRef(null);

  // A cached image can finish before this even mounts, so onLoad alone
  // would still flash the skeleton for one frame. Checking `complete`
  // synchronously before paint skips that flash for already-cached images.
  useLayoutEffect(() => {
    if (imgRef.current?.complete) setImageLoaded(true);
  }, []);

  // Touchscreens have no cursor to hover with, so the stats overlay below
  // (a hover-only reveal) is otherwise unreachable there. A tap outside the
  // card while revealed collapses it back, mirroring how hover ends when
  // the cursor moves away.
  useEffect(() => {
    if (!revealed) return;
    const collapse = (e) => {
      if (!cardRef.current?.contains(e.target)) setRevealed(false);
    };
    document.addEventListener("pointerdown", collapse);
    return () => document.removeEventListener("pointerdown", collapse);
  }, [revealed]);

  // On a device with no hover, the first tap only reveals the stats a
  // cursor would already be showing; the second tap acts as the real click.
  const handleClick = () => {
    if (window.matchMedia("(hover: none)").matches && !revealed) {
      setRevealed(true);
      return;
    }
    setRevealed(false);
    onClick();
  };

  return (
    <div
      ref={cardRef}
      data-revealed={revealed}
      onClick={handleClick}
      aria-busy={loading}
      className={`group border-line cursor-pointer overflow-hidden rounded-2xl border border-gray-300 bg-white ${
        loading ? "pointer-events-none opacity-70" : ""
      }`}
    >
      <div className="bg-secondary relative aspect-5/4.5">
        {!imageLoaded && (
          <div className="animate-shimmer absolute inset-0 bg-linear-to-r from-gray-200 via-gray-100 to-gray-200 bg-size-[200%_100%]" />
        )}

        <Image
          ref={imgRef}
          src={spot.image}
          alt={spot.name}
          fill
          sizes="(min-width: 1024px) 320px, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
          quality={100}
          className="object-cover"
          onLoad={() => setImageLoaded(true)}
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/5 px-4 opacity-100 transition-opacity duration-25 group-hover:opacity-0 group-data-[revealed=true]:opacity-0">
          <h3 className="font-display text-center text-2xl font-bold text-white [text-shadow:0_2px_2px_rgba(0,0,0,0.9)] md:text-3xl">
            {spot.name}
          </h3>
          <h3 className="font-display text-center text-xl font-medium text-white [text-shadow:0_2px_2px_rgba(0,0,0,0.9)] md:text-xl">
            {spot.city}
          </h3>
        </div>

        <div className="absolute inset-0 grid grid-cols-[auto_1fr] content-center items-center gap-x-3 gap-y-4 bg-black/70 px-6 opacity-0 transition-opacity duration-50 group-hover:opacity-100 group-data-[revealed=true]:opacity-100">
          <StatBar
            label={t("stats.rating")}
            value={(spot.rating / 5) * 100}
            animateOnHover
          />
          <StatBar
            label={t("stats.work")}
            value={spot.workFriendly}
            animateOnHover
          />
          <StatBar
            label={t("stats.quiet")}
            value={spot.quiet}
            animateOnHover
          />
          <StatBar
            label={t("stats.value")}
            value={spot.value}
            animateOnHover
          />
        </div>

        <button
          type="button"
          aria-label={liked ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={liked}
          onClick={(e) => {
            // Keep the card's own click from opening the spot modal.
            e.stopPropagation();
            onToggleLike();
          }}
          className="absolute top-2 left-2 cursor-pointer p-1 opacity-0 transition-opacity duration-50 group-hover:opacity-100 group-data-[revealed=true]:opacity-100 focus-visible:opacity-100 focus-visible:outline-none"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            fill={liked ? "#FF5A5F" : "none"}
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-8 w-8 drop-shadow-[0_2px_2px_rgba(0,0,0,0.9)] transition-colors"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        </button>

        <span className="absolute right-2 bottom-2 flex items-baseline gap-1 rounded px-2 py-1 text-white opacity-100 transition-opacity duration-50 [text-shadow:0_2px_2px_rgba(0,0,0,0.9)] group-hover:opacity-0 group-data-[revealed=true]:opacity-0">
          {spot.priceMin === 0 && spot.priceMax === 0 ? (
            <span className="text-base font-bold sm:text-lg">
              {t("common.free")}
            </span>
          ) : (
            <>
              <span className="text-base font-bold sm:text-lg">
                {spot.priceRange}
              </span>
              <span className="text-[10px] font-semibold sm:text-xs">
                MXN
              </span>
            </>
          )}
        </span>

        <span className="absolute bottom-2 left-2 rounded px-2 py-1 text-lg font-bold text-white opacity-100 transition-opacity duration-50 [text-shadow:0_2px_2px_rgba(0,0,0,0.9)] group-hover:opacity-0 group-data-[revealed=true]:opacity-0">
          {openNow ? t("common.open") : t("common.closed")}
        </span>
      </div>
    </div>
  );
}
