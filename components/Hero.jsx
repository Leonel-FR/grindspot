"use client";
import { useState } from "react";
import EmailModal from "./EmailModal";
export default function Hero() {
  const [modalOpened, setModalOpened] = useState(false);
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

      <button className="fixed top-4 right-4 z-10 cursor-pointer rounded-xl bg-[#FF5A5F] px-4 py-2.5 text-sm font-bold text-white md:top-6 md:right-6 md:px-5 md:py-2 md:text-base">
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
        <button
          className="cursor-pointer rounded-lg bg-[#FF5A5F] px-6 py-3 font-bold text-white"
          onClick={() => {
            setModalOpened(true);
          }}
        >
          Get Started
        </button>
      </div>

      <EmailModal
        isOpen={modalOpened}
        onClose={() => setModalOpened(false)}
      />

      <svg
        className="absolute bottom-0 left-0 h-24 w-full md:h-40"
        viewBox="0 0 1440 220"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,110 C300,240 1140,-20 1440,110 L1440,220 L0,220 Z"
          fill="#FFFFFF"
        />
      </svg>
    </section>
  );
}
