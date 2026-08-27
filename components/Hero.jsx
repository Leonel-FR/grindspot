"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import EmailModal from "./EmailModal";
import { useSession } from "next-auth/react";
import { useLanguage } from "@/components/LanguageProvider";

export default function Hero({ hasAccess }) {
  const [modalOpened, setModalOpened] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef(null);
  const { data: session } = useSession();
  const { t } = useLanguage();

  // Same reasoning as SpotCard's image: don't gate the video's own
  // visibility on this state (that would reintroduce a hydration-timed
  // flash). The shimmer sits behind the video in the DOM and gets covered
  // natively once a frame paints; this state only unmounts it afterwards.
  useLayoutEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.readyState >= 2) setVideoLoaded(true);
    video.play().catch(() => {});
  }, []);

  // Some mobile browsers refuse autoplay outright no matter what the markup
  // says — iOS Safari's "Auto-Play Video Previews" setting defaults to
  // Wi-Fi only, and Android's Data Saver mode does the same over cellular.
  // Both still allow playback triggered by a real user gesture, so the
  // page's very first tap/scroll retries it once as a fallback.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const retryPlay = () => {
      if (video.paused) video.play().catch(() => {});
    };
    document.addEventListener("pointerdown", retryPlay, { once: true });
    document.addEventListener("scroll", retryPlay, {
      once: true,
      passive: true,
    });
    return () => {
      document.removeEventListener("pointerdown", retryPlay);
      document.removeEventListener("scroll", retryPlay);
    };
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
        <div className="animate-shimmer absolute inset-0 hidden h-full w-full bg-linear-to-r from-gray-200 via-gray-100 to-gray-200 bg-size-[200%_100%] sm:block" />
      )}

      {/* Below sm (mobile), the `source[media]` query never matches, so the
          browser never fetches the video and the `poster` image just sits
          there as a plain static background — no autoplay to fight with and
          no video bytes spent on what's often a cellular connection. */}
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
          media="(min-width: 640px)"
        />
      </video>

      <div className="absolute inset-0 bg-black/35" />

      <div className="relative z-10 flex flex-col items-center space-y-5 text-center md:space-y-6">
        <h1 className="font-serif max-w-4xl text-balance text-4xl leading-none font-black tracking-[-0.4px] text-white [text-shadow:0_2px_2px_rgba(0,0,0,0.9)] md:max-w-6xl md:text-6xl">
          {t("hero.title")}
        </h1>
        <p className="max-w-xl text-lg leading-relaxed font-normal text-white/80 [text-shadow:0_2px_2px_rgba(0,0,0,0.9)] md:text-xl">
          {t("hero.subtitle")}
        </p>
        {!hasAccess && (
          <button
            className="cursor-pointer rounded-lg bg-[#FF5A5F] px-6 py-3 font-bold text-white"
            onClick={openCheckout}
          >
            {t("hero.cta")}
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
          fill="#fbfaf8"
        />
      </svg>
    </section>
  );
}
