"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import SpotCard from "@/components/SpotCard";
import FilterBar from "@/components/FilterBar";
import EmailModal from "@/components/EmailModal";
import { useLanguage } from "@/components/LanguageProvider";
import { spotMatchesPriceRanges } from "@/lib/priceRanges";
import { spotMatchesRatingCategories } from "@/lib/ratingCategory";
import { formatPlaceType } from "@/lib/placeTypes";
import { slugify } from "@/lib/slugify";

export default function SpotsGrid({
  spots,
  hasAccess,
  likedSpotIds,
  initialCity,
}) {
  const { t } = useLanguage();
  const router = useRouter();
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [likedIds, setLikedIds] = useState(() => new Set(likedSpotIds));
  const [openNow, setOpenNow] = useState(false);
  const [cities, setCities] = useState(() => (initialCity ? [initialCity] : []));
  const [prices, setPrices] = useState([]);
  const [placeTypes, setPlaceTypes] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [search, setSearch] = useState("");

  // Keeps the URL bar in sync with the single-city case (grind-spot.com/
  // zapopan) without a real navigation — a route change here would remount
  // this component and lose every other filter (price, placeType, search).
  // Same technique AuthButton.jsx already uses to scrub its own query param
  // without a refetch.
  useEffect(() => {
    const path = cities.length === 1 ? `/${slugify(cities[0])}` : "/";
    if (window.location.pathname !== path) {
      window.history.replaceState(null, "", path);
    }
  }, [cities]);

  // Paying users have nothing to buy, so the checkout modal never opens for
  // them — this also keeps a stale render from starting a second payment.
  const requestAccess = () => {
    if (hasAccess) return;
    setEmailModalOpen(true);
  };

  // Filtering and liking are premium: without access the action is swapped
  // for the sign-up modal. Opening a spot isn't gated here anymore — the
  // route it navigates to decides that server-side (see app/@modal).
  const gate =
    (action) =>
    (...args) => {
      if (!hasAccess) {
        requestAccess();
        return;
      }
      action(...args);
    };

  async function toggleLike(spot) {
    const liked = likedIds.has(spot.id);

    const applyLiked = (shouldLike) =>
      setLikedIds((prev) => {
        const next = new Set(prev);
        if (shouldLike) {
          next.add(spot.id);
        } else {
          next.delete(spot.id);
        }
        return next;
      });

    applyLiked(!liked);

    try {
      const res = await fetch(`/api/spots/${spot.id}/like`, {
        method: liked ? "DELETE" : "POST",
      });
      if (!res.ok) throw new Error("Like request failed");
    } catch (err) {
      console.error(err);
      applyLiked(liked);
    }
  }

  const cityOptions = useMemo(
    () => [...new Set(spots.map((spot) => spot.city))].sort(),
    [spots]
  );

  const placeTypeOptions = useMemo(
    () =>
      [...new Set(spots.map((spot) => spot.placeType))]
        .sort()
        .map(formatPlaceType),
    [spots]
  );

  const visibleSpots = useMemo(() => {
    const query = search.trim().toLowerCase();

    return spots.filter((spot) => {
      if (openNow && !spot.openNow) return false;
      if (cities.length > 0 && !cities.includes(spot.city)) return false;
      if (prices.length > 0 && !spotMatchesPriceRanges(spot, prices))
        return false;
      if (
        placeTypes.length > 0 &&
        !placeTypes.includes(formatPlaceType(spot.placeType))
      )
        return false;
      if (ratings.length > 0 && !spotMatchesRatingCategories(spot, ratings))
        return false;
      if (query && !spot.name.toLowerCase().includes(query)) return false;
      return true;
    });
  }, [spots, openNow, cities, prices, placeTypes, ratings, search]);

  return (
    <section className="mx-auto max-w-345 px-6 py-1">
      <FilterBar
        openNow={openNow}
        onOpenNowChange={gate(setOpenNow)}
        cityOptions={cityOptions}
        cities={cities}
        onCitiesChange={gate(setCities)}
        prices={prices}
        onPricesChange={gate(setPrices)}
        placeTypeOptions={placeTypeOptions}
        placeTypes={placeTypes}
        onPlaceTypesChange={gate(setPlaceTypes)}
        ratings={ratings}
        onRatingsChange={gate(setRatings)}
        search={search}
        onSearchChange={gate(setSearch)}
        resultsCount={visibleSpots.length}
        onRequestAccess={requestAccess}
        hasAccess={hasAccess}
      />
      {visibleSpots.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {visibleSpots.map((spot) => (
            <SpotCard
              key={spot.id}
              spot={spot}
              onClick={() => router.push(`/${spot.citySlug}/${spot.slug}`)}
              liked={likedIds.has(spot.id)}
              onToggleLike={gate(() => toggleLike(spot))}
            />
          ))}
        </div>
      ) : (
        <p className="py-16 text-center text-lg font-bold text-gray-500">
          {t("spotsGrid.noResults")}
        </p>
      )}

      {emailModalOpen && (
        <EmailModal onClose={() => setEmailModalOpen(false)} />
      )}
    </section>
  );
}
