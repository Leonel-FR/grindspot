"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
  return <div className="skeleton-card animate-skeleton fixed inset-0" />;
}

// maplibre-gl touches window/DOM on import, so it can only ever run in the
// browser — ssr:false keeps it (and its bundle) out of the server render
// and out of the initial JS payload for everyone still on the grid view.
const SpotsMap = dynamic(() => import("@/components/SpotsMap"), {
  ssr: false,
  loading: MapSkeleton,
});

// Filters/view persist across reloads via localStorage — restored client-side
// after mount (see the effect below), never read during the initial render,
// so server and client still produce the same first paint.
const FILTERS_STORAGE_KEY = "grindspot:filters";

export default function SpotsGrid({
  spots,
  hasAccess,
  likedSpotIds,
  initialCity,
  footer,
}) {
  const { t } = useLanguage();
  const { data: session } = useSession();
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [loadingSpotId, setLoadingSpotId] = useState(null);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [likedIds, setLikedIds] = useState(() => new Set(likedSpotIds));
  const [openNow, setOpenNow] = useState(false);
  const [notClosingSoon, setNotClosingSoon] = useState(false);
  const [cities, setCities] = useState(() =>
    initialCity ? [initialCity] : []
  );
  const [prices, setPrices] = useState([]);
  const [placeTypes, setPlaceTypes] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [search, setSearch] = useState("");
  const [view, setView] = useState("grid");
  // Coordinates are premium data (see lib/spots.js), so they're never part
  // of the `spots` teaser prop — fetched on demand, once, the first time
  // the user actually switches to the map.
  const [coordinates, setCoordinates] = useState(null);
  // Guards the persist effect below against writing the still-default
  // state back over a just-restored value — see that effect's comment.
  const skipNextPersistRef = useRef(true);

  // Restores filters/view from a previous visit. Runs once, client-only,
  // after the initial (default-state) render already matched the server —
  // reading localStorage during the render itself would make the very
  // first client paint diverge from what the server sent.
  //
  // Gated on hasAccess: every one of these setters is normally only
  // reachable through gate() (see below), which swaps the action for the
  // sign-up modal when the visitor has no access. A lapsed or logged-out
  // visitor restoring filters from an earlier, paid session would silently
  // skip that prompt, so restoration mirrors the same access check instead.
  useEffect(() => {
    if (!hasAccess) return;

    let stored;
    try {
      stored = JSON.parse(localStorage.getItem(FILTERS_STORAGE_KEY));
    } catch {
      return;
    }
    if (!stored) return;

    // One-time restore from localStorage on mount — there's no way to read
    // it before the client mounts, so this necessarily happens in an
    // effect rather than during render.
    /* eslint-disable react-hooks/set-state-in-effect */
    if (stored.openNow) setOpenNow(true);
    if (stored.notClosingSoon) setNotClosingSoon(true);
    // /[city] routes already picked an intentional city from the URL — a
    // stale value from browsing a different city in an earlier visit
    // shouldn't silently override it.
    if (!initialCity && Array.isArray(stored.cities)) {
      setCities(stored.cities);
    }
    if (Array.isArray(stored.prices)) setPrices(stored.prices);
    if (Array.isArray(stored.placeTypes)) setPlaceTypes(stored.placeTypes);
    if (Array.isArray(stored.ratings)) setRatings(stored.ratings);
    if (typeof stored.search === "string") setSearch(stored.search);
    if (stored.view === "map") setView("map");
    /* eslint-enable react-hooks/set-state-in-effect */
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally once, on mount only
  }, []);

  // Persists filters/view any time they change, so a reload restores them
  // (see the effect above). Skips its very first run: that fires before the
  // restore effect's setState calls above have flowed into a new render, so
  // it would otherwise briefly overwrite storage with the stale defaults.
  useEffect(() => {
    if (skipNextPersistRef.current) {
      skipNextPersistRef.current = false;
      return;
    }
    try {
      localStorage.setItem(
        FILTERS_STORAGE_KEY,
        JSON.stringify({
          openNow,
          notClosingSoon,
          cities,
          prices,
          placeTypes,
          ratings,
          search,
          view,
        })
      );
    } catch {
      // Private browsing, storage disabled, quota exceeded, etc. — filters
      // just won't persist; nothing else depends on this write succeeding.
    }
  }, [
    openNow,
    notClosingSoon,
    cities,
    prices,
    placeTypes,
    ratings,
    search,
    view,
  ]);

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

  // Map view goes full-screen (fixed inset-0), so the page underneath it
  // has nothing left to scroll — locking it here matches what
  // MobileFilterSheet already does for its own full-screen overlay.
  useEffect(() => {
    document.body.style.overflow = view === "map" ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [view]);

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
    <>
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
          <p
            className={
              view === "map"
                ? "fixed inset-0 flex items-center justify-center bg-white text-center text-lg font-bold text-gray-500"
                : "py-16 text-center text-lg font-bold text-gray-500"
            }
          >
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
          <SpotModal
            spot={selectedSpot}
            onClose={() => setSelectedSpot(null)}
          />
        )}

        {showEmailModal && (
          <EmailModal
            onClose={() => setEmailModalOpen(false)}
            dismissable={!forcedGate}
          />
        )}
      </section>
      {view !== "map" && footer}
    </>
  );
}
