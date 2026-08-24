"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import SpotCard from "@/components/SpotCard";
import SpotModal from "@/components/SpotModal";
import FilterBar from "@/components/FilterBar";
import EmailModal from "@/components/EmailModal";
import { useLanguage } from "@/components/LanguageProvider";
import { spotMatchesPriceRanges } from "@/lib/priceRanges";
import { spotMatchesRatingCategories } from "@/lib/ratingCategory";
import { formatPlaceType } from "@/lib/placeTypes";
import { slugify } from "@/lib/slugify";

function MapSkeleton() {
  return (
    <div className="skeleton-card animate-skeleton h-[70vh] min-h-100 w-full rounded-2xl border border-gray-300" />
  );
}

// maplibre-gl touches window/DOM on import, so it can only ever run in the
// browser — ssr:false keeps it (and its bundle) out of the server render
// and out of the initial JS payload for everyone still on the grid view.
const SpotsMap = dynamic(() => import("@/components/SpotsMap"), {
  ssr: false,
  loading: MapSkeleton,
});

export default function SpotsGrid({
  spots,
  hasAccess,
  likedSpotIds,
  initialCity,
}) {
  const { t } = useLanguage();
  const { data: session } = useSession();
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [loadingSpotId, setLoadingSpotId] = useState(null);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [likedIds, setLikedIds] = useState(() => new Set(likedSpotIds));
  const [openNow, setOpenNow] = useState(false);
  const [notClosingSoon, setNotClosingSoon] = useState(false);
  const [cities, setCities] = useState(() => (initialCity ? [initialCity] : []));
  const [prices, setPrices] = useState([]);
  const [placeTypes, setPlaceTypes] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [search, setSearch] = useState("");
  const [view, setView] = useState("grid");
  // Coordinates are premium data (see lib/spots.js), so they're never part
  // of the `spots` teaser prop — fetched on demand, once, the first time
  // the user actually switches to the map.
  const [coordinates, setCoordinates] = useState(null);

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

  // Reaching /[city] directly (typed URL, Google) with no session at all is
  // the pSEO landing page's job — force the signup modal immediately instead
  // of letting an anonymous visitor browse it like a signed-in-but-unpaid
  // one could. Scoped to initialCity (the /[city] routes) so the plain
  // homepage keeps showing the free teaser grid untouched. Derived directly
  // (not synced via an effect + setState) so it can't ever be dismissed —
  // there's no state to reset.
  const forcedGate = Boolean(initialCity) && !session && !hasAccess;
  const showEmailModal = emailModalOpen || forcedGate;

  // Paying users have nothing to buy, so the checkout modal never opens for
  // them — this also keeps a stale render from starting a second payment.
  const requestAccess = () => {
    if (hasAccess) return;
    setEmailModalOpen(true);
  };

  // Filtering, opening a spot and liking are premium: without access the
  // action is swapped for the sign-up modal. The /[city]/[spot] pages exist
  // purely for Google/direct links — the interactive app never navigates to
  // them, it always opens the modal in place.
  const gate =
    (action) =>
    (...args) => {
      if (!hasAccess) {
        requestAccess();
        return;
      }
      action(...args);
    };

  // Unlike the other filters above, switching to Map can't just reuse
  // gate() — Grid must stay freely selectable (it's the existing free
  // experience) while only Map itself is premium.
  function handleViewChange(nextView) {
    if (nextView === "map" && !hasAccess) {
      requestAccess();
      return;
    }
    setView(nextView);
  }

  // Coordinates are fetched once, the first time the user actually opens
  // the map, and kept for the rest of the session — switching back and
  // forth between Grid and Map shouldn't re-fetch every time. `coordinates`
  // staying null while view === "map" doubles as the loading flag below.
  useEffect(() => {
    if (view !== "map" || !hasAccess || coordinates) return;

    let cancelled = false;

    fetch("/api/spots/map")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load map data");
        return res.json();
      })
      .then((rows) => {
        if (cancelled) return;
        setCoordinates(
          new Map(rows.map((row) => [row.id, { lat: row.lat, lng: row.lng }]))
        );
      })
      .catch((err) => {
        if (cancelled) return;
        console.error(err);
        toast.error(t("spotsGrid.genericError"));
        setView("grid");
      });

    return () => {
      cancelled = true;
    };
  }, [view, hasAccess, coordinates, t]);

  // Cards only carry teaser fields (no address/mapsUrl/hours), so opening the
  // modal fetches the full detail from the access-gated route on demand.
  async function openSpot(spot) {
    if (loadingSpotId) return;
    setLoadingSpotId(spot.id);

    try {
      const res = await fetch(`/api/spots/${spot.id}`);
      if (!res.ok) throw new Error("Failed to load spot details");
      setSelectedSpot(await res.json());
    } catch (err) {
      console.error(err);
      toast.error(t("spotsGrid.genericError"));
    } finally {
      setLoadingSpotId(null);
    }
  }

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
      if (notClosingSoon && !spot.notClosingSoon) return false;
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
  }, [
    spots,
    openNow,
    notClosingSoon,
    cities,
    prices,
    placeTypes,
    ratings,
    search,
  ]);

  const spotsWithCoords = useMemo(() => {
    if (!coordinates) return [];
    return visibleSpots.flatMap((spot) => {
      const coord = coordinates.get(spot.id);
      return coord ? [{ ...spot, lat: coord.lat, lng: coord.lng }] : [];
    });
  }, [visibleSpots, coordinates]);

  return (
    <section className="mx-auto max-w-345 px-6 py-1">
      <FilterBar
        openNow={openNow}
        onOpenNowChange={gate(setOpenNow)}
        notClosingSoon={notClosingSoon}
        onNotClosingSoonChange={gate(setNotClosingSoon)}
        view={view}
        onViewChange={handleViewChange}
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
      {visibleSpots.length === 0 ? (
        <p className="py-16 text-center text-lg font-bold text-gray-500">
          {t("spotsGrid.noResults")}
        </p>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {visibleSpots.map((spot) => (
            <SpotCard
              key={spot.id}
              spot={spot}
              onClick={gate(() => openSpot(spot))}
              liked={likedIds.has(spot.id)}
              onToggleLike={gate(() => toggleLike(spot))}
              loading={loadingSpotId === spot.id}
            />
          ))}
        </div>
      ) : coordinates ? (
        <SpotsMap spots={spotsWithCoords} onSpotClick={gate(openSpot)} />
      ) : (
        <MapSkeleton />
      )}

      {selectedSpot && (
        <SpotModal spot={selectedSpot} onClose={() => setSelectedSpot(null)} />
      )}

      {showEmailModal && (
        <EmailModal
          onClose={() => setEmailModalOpen(false)}
          dismissable={!forcedGate}
        />
      )}
    </section>
  );
}
