"use client";

import { useEffect, useRef } from "react";
import {
  Map as MapLibreMap,
  Marker,
  NavigationControl,
  LngLatBounds,
  setWorkerUrl,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

// maplibre-gl normally resolves its Web Worker via import.meta.url, which
// Next's bundler doesn't rewrite correctly — the worker silently fails to
// load, so the style's background paints but no vector tile data (roads,
// labels, land) ever does. Pointing it at a self-hosted copy (kept in sync
// by scripts/copy-maplibre-worker.mjs, see package.json's predev/prebuild)
// sidesteps that resolution entirely.
setWorkerUrl("/maplibre-gl-worker.mjs");

const MAP_STYLE = "https://tiles.openfreemap.org/styles/dark";

// Guadalajara/Zapopan midpoint — only used before any spot or user location
// is known, so the map never renders pointed at [0, 0].
const FALLBACK_CENTER = [-103.38, 20.68];
const FALLBACK_ZOOM = 11;

function createSpotMarkerElement(spot) {
  const el = document.createElement("div");
  el.setAttribute("role", "button");
  el.setAttribute("aria-label", spot.name);
  el.title = spot.name;
  el.style.cssText = `
    width: 16px;
    height: 16px;
    border-radius: 9999px;
    border: 2px solid white;
    box-shadow: 0 1px 4px rgba(0,0,0,0.5);
    cursor: pointer;
    background-color: ${spot.openNow ? "#22c55e" : "#ef4444"};
  `;
  return el;
}

function createUserMarkerElement() {
  const wrapper = document.createElement("div");
  wrapper.style.cssText =
    "position: relative; width: 16px; height: 16px; display: flex; align-items: center; justify-content: center;";

  const ring = document.createElement("div");
  ring.className = "animate-pulse-ring";
  ring.style.cssText =
    "position: absolute; width: 16px; height: 16px; border-radius: 9999px; background-color: #3b82f6;";

  const dot = document.createElement("div");
  dot.style.cssText =
    "position: relative; width: 12px; height: 12px; border-radius: 9999px; background-color: #3b82f6; border: 2px solid white; box-shadow: 0 1px 4px rgba(0,0,0,0.5);";

  wrapper.append(ring, dot);
  return wrapper;
}

export default function SpotsMap({ spots, onSpotClick }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const userMarkerRef = useRef(null);
  const hasFittedRef = useRef(false);
  const hasCenteredOnUserRef = useRef(false);
  // SpotsGrid passes a freshly-wrapped onSpotClick on every render (it's
  // gated), which would otherwise rebuild every marker's DOM element any
  // time something unrelated changes elsewhere on the page.
  const onSpotClickRef = useRef(onSpotClick);
  useEffect(() => {
    onSpotClickRef.current = onSpotClick;
  }, [onSpotClick]);

  // Map instance: created once, torn down on unmount. Everything else
  // (spot markers, user location) reacts to prop/geolocation changes
  // without recreating the map itself.
  useEffect(() => {
    const map = new MapLibreMap({
      container: containerRef.current,
      style: MAP_STYLE,
      center: FALLBACK_CENTER,
      zoom: FALLBACK_ZOOM,
    });
    map.addControl(new NavigationControl(), "top-right");
    mapRef.current = map;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const lngLat = [longitude, latitude];

          userMarkerRef.current?.remove();
          userMarkerRef.current = new Marker({
            element: createUserMarkerElement(),
          })
            .setLngLat(lngLat)
            .addTo(map);

          // Only steer the camera toward the user on the first fix, and
          // only if spot markers haven't already framed the view — a late
          // geolocation response shouldn't yank the map out from under
          // someone who's already looking around.
          if (!hasCenteredOnUserRef.current && !hasFittedRef.current) {
            map.easeTo({ center: lngLat, zoom: 13, duration: 600 });
          }
          hasCenteredOnUserRef.current = true;
        },
        () => {
          // Denied or unavailable — the map still works, just without a
          // "you are here" marker.
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      userMarkerRef.current?.remove();
      userMarkerRef.current = null;
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Spot markers: rebuilt whenever the filtered spot list changes.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = spots.map((spot) => {
      const marker = new Marker({
        element: createSpotMarkerElement(spot),
      })
        .setLngLat([spot.lng, spot.lat])
        .addTo(map);

      marker
        .getElement()
        .addEventListener("click", () => onSpotClickRef.current(spot));
      return marker;
    });

    // Frame every visible spot the first time markers land, unless the
    // user's own location already claimed the initial view above.
    if (
      !hasFittedRef.current &&
      !hasCenteredOnUserRef.current &&
      spots.length > 0
    ) {
      const bounds = new LngLatBounds();
      spots.forEach((spot) => bounds.extend([spot.lng, spot.lat]));
      map.fitBounds(bounds, { padding: 60, maxZoom: 15, duration: 0 });
    }
    if (spots.length > 0) hasFittedRef.current = true;
  }, [spots]);

  return (
    <div
      ref={containerRef}
      className="h-[70vh] min-h-100 w-full overflow-hidden rounded-2xl border border-gray-300"
    />
  );
}
