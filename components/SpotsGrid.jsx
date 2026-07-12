import spots from "@/data/spots.json";
import SpotCard from "@/components/SpotCard";

export default function SpotsGrid() {
  return (
    <section className="mx-auto max-w-345 px-6 py-1">
      <h2 className="font-display text-ink mb-6 text-xl font-bold">
        {spots.length} spots to work from
      </h2>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {spots.map((spot) => (
          <SpotCard key={spot.id} spot={spot} />
        ))}
      </div>
    </section>
  );
}
