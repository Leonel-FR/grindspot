"use client";
import { useLayoutEffect, useRef, useState } from "react";
import EmailModal from "./EmailModal";
import { useSession } from "next-auth/react";

export default function Hero({ hasAccess }) {
  const [modalOpened, setModalOpened] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef(null);
  const { data: session } = useSession();

  // Same reasoning as SpotCard's image: don't gate the video's own
  // visibility on this state (that would reintroduce a hydration-timed
  // flash). The shimmer sits behind the video in the DOM and gets covered
  // natively once a frame paints; this state only unmounts it afterwards.
  //
  // The explicit mute + play() retry below works around a React SSR gap:
  // React never writes `muted` into the server-rendered HTML (it only sets
  // it as a DOM property, not an attribute), so the video briefly exists as
  // an unmuted autoplaying element until hydration runs. Mobile browsers
  // check muted state at the moment they'd start autoplay and, if hydration
  // hasn't caught up yet, permanently block that attempt — later setting
  // `.muted` doesn't undo the block, only an explicit `.play()` retry does.
  useLayoutEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    if (video.readyState >= 2) setVideoLoaded(true);
    video.play().catch(() => {});
  }, []);

  // Paying users have nothing to buy: the CTA is hidden, and the handler
  // refuses anyway so a stale render can't start a second checkout.
  const openCheckout = () => {
    if (hasAccess) return;
    setModalOpened(true);
  };
  if (session && hasAccess) return null;

  return (
    <section className="relative overflow-hidden px-6 py-20 md:py-32">
      {!videoLoaded && (
        <div className="animate-shimmer absolute inset-0 h-full w-full bg-linear-to-r from-gray-200 via-gray-100 to-gray-200 bg-size-[200%_100%]" />
      )}

      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        poster="/hero-poster.webp"
        onLoadedData={() => setVideoLoaded(true)}
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source
          src="https://grindspot-pull-zone.b-cdn.net/hero-section/hero-section-video.mp4"
          type="video/mp4"
        />
      </video>

      <div className="absolute inset-0 bg-black/35" />

      <div className="relative z-10 flex flex-col items-center space-y-5 text-center md:space-y-6">
        <h1 className="max-w-4xl text-4xl leading-none font-black tracking-[-0.4px] text-white [text-shadow:0_2px_2px_rgba(0,0,0,0.9)] md:max-w-6xl md:text-6xl">
          Find your next remote work spot,
          <br className="hidden md:block" /> verified before you go
        </h1>
        <p className="max-w-lg text-base leading-relaxed font-normal text-white/80 [text-shadow:0_2px_2px_rgba(0,0,0,0.9)]">
          Your next great work session is closer than you think. Explore the
          best spots in the city, all in one place.
        </p>
        {!hasAccess && (
          <button
            className="cursor-pointer rounded-lg bg-[#FF5A5F] px-6 py-3 font-bold text-white"
            onClick={openCheckout}
          >
            Get Started
          </button>
        )}
      </div>

      {modalOpened && <EmailModal onClose={() => setModalOpened(false)} />}

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
