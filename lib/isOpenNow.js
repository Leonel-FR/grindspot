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
