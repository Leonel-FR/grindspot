export const PRICE_RANGES = [
  { label: "💵 $100 - $200", min: 100, max: 200 },
  { label: "💰 $200 - $300", min: 200, max: 300 },
];

const RANGE_BY_LABEL = new Map(PRICE_RANGES.map((range) => [range.label, range]));

export function spotMatchesPriceRanges(spot, selectedLabels) {
  return selectedLabels.some((label) => {
    const range = RANGE_BY_LABEL.get(label);
    return range && spot.priceMin >= range.min && spot.priceMax <= range.max;
  });
}
