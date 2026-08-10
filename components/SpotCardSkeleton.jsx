export default function SpotCardSkeleton() {
  return (
    <div className="border-line overflow-hidden rounded-2xl border border-gray-300 bg-white">
      <div className="aspect-5/4.5 animate-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]" />
    </div>
  );
}

// Reuse for any grid that needs to show N cards worth of placeholders at
// once, e.g. the first paint before spots arrive, or a "loading next page"
// batch appended while more spots are fetched.
export function SpotsGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <SpotCardSkeleton key={i} />
      ))}
    </div>
  );
}
