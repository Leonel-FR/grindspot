export const CLOSING_SOON_WINDOW_MINUTES = 120;

export function isSpotOpenNow(spot, now = new Date()) {
  if (!spot?.timezone || !spot?.hours) return false;

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: spot.timezone,
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);

  const get = (type) => parts.find((part) => part.type === type)?.value;
  const day = get("weekday")?.toLowerCase();
  const currentTime = `${get("hour")}:${get("minute")}`;

  const todayHours = spot.hours[day];
  if (!todayHours || todayHours.closed) return false;

  const { open, close } = todayHours;
  if (close < open) {
    // Overnight hours, e.g. open 18:00, close 02:00
    return currentTime >= open || currentTime < close;
  }
  return currentTime >= open && currentTime < close;
}

// True when the spot is open right now AND will still be open
// `windowMinutes` from now — powers the "not closing soon" filter, which
// hides spots about to close (e.g. open now but closing in 20 minutes).
// Reuses isSpotOpenNow against a future instant so day-of-week rollovers
// (checking at 11pm, +2h lands the next day) resolve the same way "Open
// now" already does for overnight hours.
export function isSpotOpenBeyond(
  spot,
  windowMinutes = CLOSING_SOON_WINDOW_MINUTES,
  now = new Date()
) {
  if (!isSpotOpenNow(spot, now)) return false;

  const future = new Date(now.getTime() + windowMinutes * 60 * 1000);
  return isSpotOpenNow(spot, future);
}
