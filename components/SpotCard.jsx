import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import StatBar from "@/components/StatBar";
import { isSpotOpenNow } from "@/lib/isOpenNow";

export default function SpotCard({ spot, onClick, liked, onToggleLike }) {
  const openNow = isSpotOpenNow(spot);
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgRef = useRef(null);

  // A cached image can finish before this even mounts, so onLoad alone
  // would still flash the skeleton for one frame. Checking `complete`
  // synchronously before paint skips that flash for already-cached images.
  useLayoutEffect(() => {
    if (imgRef.current?.complete) setImageLoaded(true);
  }, []);

  return (
    <div
      onClick={onClick}
      className="group border-line cursor-pointer overflow-hidden rounded-2xl border border-gray-300 bg-white"
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
          className="object-cover"
          onLoad={() => setImageLoaded(true)}
        />

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

        <button
          type="button"
          aria-label={liked ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={liked}
          onClick={(e) => {
            // Keep the card's own click from opening the spot modal.
            e.stopPropagation();
            onToggleLike();
          }}
          className="absolute top-2 left-2 cursor-pointer p-1 opacity-0 transition-opacity duration-50 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            fill={liked ? "#FF5A5F" : "none"}
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-8 w-8 drop-shadow-[0_2px_2px_rgba(0,0,0,0.9)] transition-colors"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        </button>

        <span className="absolute right-2 bottom-2 rounded px-2 py-1 text-lg font-bold text-white opacity-100 transition-opacity duration-50 [text-shadow:0_2px_2px_rgba(0,0,0,0.9)] group-hover:opacity-0">
          {spot.priceRange}
        </span>

        <span className="absolute bottom-2 left-2 rounded px-2 py-1 text-lg font-bold text-white opacity-100 transition-opacity duration-50 [text-shadow:0_2px_2px_rgba(0,0,0,0.9)] group-hover:opacity-0">
          {openNow ? "✅ Opened" : "❌ Closed"}
        </span>
      </div>
    </div>
  );
}
