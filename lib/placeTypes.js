const PLACE_TYPE_EMOJIS = {
  "Coffee Shop": "☕",
  Coworking: "💻",
  Restaurant: "🍽️",
};

export function formatPlaceType(placeType) {
  const emoji = PLACE_TYPE_EMOJIS[placeType] ?? "📍";
  return `${emoji} ${placeType}`;
}
