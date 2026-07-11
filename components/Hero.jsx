
export default function Hero() {
    return (
       <section className="relative py-20 md:py-32 px-6">
    <button className="absolute top-4 right-4 md:top-6 md:right-6 px-5 py-2.5 md:px-6 md:py-3 bg-[#FF5A5F] text-white font-bold rounded-xl cursor-pointer text-sm md:text-base">
        Login
    </button>

    <div className="flex flex-col items-center text-center space-y-5 md:space-y-6">
        <h1 className="text-4xl md:text-6xl font-black leading-none tracking-[-0.4px] max-w-4xl md:max-w-6xl text-ink">
    Find your next remote work spot,<br className="hidden md:block" /> verified before you go
</h1>
<p className="text-base font-normal leading-relaxed max-w-lg text-muted">
    Your next great work session is closer than you think. Explore the best spots in the city, all in one place.
</p>
        <button className="px-6 py-3 bg-[#FF5A5F] text-white font-bold rounded-lg cursor-pointer">
            Get Started
        </button>
    </div>
</section>
    )
}