export default function Hero() {
  return (
    <section className="relative overflow-hidden px-6 py-20 md:py-32">
      <video
        autoPlay
        loop
        muted
        playsInline
        poster="/hero-poster.jpg"
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/35" />

      <button className="absolute top-4 right-4 z-10 cursor-pointer rounded-xl bg-[#FF5A5F] px-5 py-2.5 text-sm font-bold text-white md:top-6 md:right-6 md:px-6 md:py-3 md:text-base">
        Login
      </button>

      <div className="relative z-10 flex flex-col items-center space-y-5 text-center md:space-y-6">
        <h1 className="max-w-4xl text-4xl leading-none font-black tracking-[-0.4px] text-white md:max-w-6xl md:text-6xl">
          Find your next remote work spot,
          <br className="hidden md:block" /> verified before you go
        </h1>
        <p className="max-w-lg text-base leading-relaxed font-normal text-white/80">
          Your next great work session is closer than you think. Explore the
          best spots in the city, all in one place.
        </p>
        <button className="cursor-pointer rounded-lg bg-[#FF5A5F] px-6 py-3 font-bold text-white">
          Get Started
        </button>
      </div>

      <svg
        className="absolute bottom-0 left-0 h-20 w-full md:h-32"
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,100 C360,200 1080,0 1440,100 L1440,200 L0,200 Z"
          fill="#FFFFFF"
        />
      </svg>
    </section>
  );
}
