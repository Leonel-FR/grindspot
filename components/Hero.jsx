export default function Hero() {
  return (
    <section className="relative px-6 py-20 md:py-21">
      <button className="absolute top-4 right-4 cursor-pointer rounded-xl bg-[#FF5A5F] px-5 py-2.5 text-sm font-bold text-white md:top-6 md:right-6 md:px-6 md:py-3 md:text-base">
        Login
      </button>

      <div className="flex flex-col items-center space-y-5 text-center md:space-y-6">
        <h1 className="text-ink max-w-4xl text-4xl leading-none font-black tracking-[-0.4px] md:max-w-6xl md:text-6xl">
          Find your next remote work spot,
          <br className="hidden md:block" /> verified before you go
        </h1>
        <p className="text-muted max-w-lg text-base leading-relaxed font-normal">
          Your next great work session is closer than you think. Explore the
          best spots in the city, all in one place.
        </p>
        <button className="cursor-pointer rounded-lg bg-[#FF5A5F] px-6 py-3 font-bold text-white">
          Get Started
        </button>
      </div>
    </section>
  );
}
