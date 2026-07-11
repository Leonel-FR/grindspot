import spots from "@/data/spots.json";
import SpotCard from "@/components/SpotCard";


export default function SpotsGrid () {
    return (
        <section className="max-w-6xl mx-auto px-6 py-1">
      <h2 className="font-display font-bold text-xl text-ink mb-6">
        {spots.length} spots to work from
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {spots.map((spot) => (
          <SpotCard key={spot.id} spot={spot} />
        ))}
      </div>
    </section>
    )
}