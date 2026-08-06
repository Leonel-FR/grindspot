export const RATING_CATEGORIES = [
  { label: "⭐️ Low", category: "low" },
  { label: "⭐️⭐️ Medium", category: "medium" },
  { label: "⭐️⭐️⭐️ High", category: "high" },
];

const CATEGORY_BY_LABEL = new Map(
  RATING_CATEGORIES.map((entry) => [entry.label, entry.category])
);

export function getRatingCategory(rating) {
  const percentage = (rating / 5) * 100;
  if (percentage < 40) return "low";
  if (percentage < 70) return "medium";
  return "high";
}

export function spotMatchesRatingCategories(spot, selectedLabels) {
  const spotCategory = getRatingCategory(spot.rating);
  return selectedLabels.some(
    (label) => CATEGORY_BY_LABEL.get(label) === spotCategory
  );
}
