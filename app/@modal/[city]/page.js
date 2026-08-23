// Matches the @modal slot at exactly one segment (/zapopan, /faq, etc.) —
// same reasoning as app/@modal/page.js (which covers the zero-segment "/"
// case). Named [city] (not e.g. [closedRoute]) because Next requires a
// parallel slot's dynamic segment to share its name with the sibling slot
// at the same URL position (app/[city]) — a mismatched name is an
// "ambiguous route" build error. Deliberately a single segment, not a
// [...catchAll]: a catch-all also matches two-segment paths like
// /guadalajara/casa-curra, which overlapped with the intercepted
// (...)[city]/[spot] route below and made Next fall back to a full
// navigation instead of intercepting.
export default function ClosedCityRoute() {
  return null;
}
