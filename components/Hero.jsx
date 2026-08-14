"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import EmailModal from "./EmailModal";
import { signIn, signOut, useSession } from "next-auth/react";
import toast from "react-hot-toast";

export default function Hero({ hasAccess }) {
  const [modalOpened, setModalOpened] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef(null);
  const { data: session } = useSession();

  // signIn/signOut both redirect through Google or NextAuth's own routes and
  // back, so the "success" moment isn't reachable from the click handler's
  // own scope — it's flagged via a callbackUrl query param and picked up
  // here once the fresh page lands. The redirect is also load-bearing: it's
  // a full navigation, so the server re-renders `hasAccess`/session-derived
  // props from scratch instead of leaving them stale (a signed-out session
  // with `hasAccess` still `true` from before would keep showing premium
  // gates unlocked and make every gated fetch 401 until a manual reload).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authEvent = params.get("auth");
    if (authEvent === "signed-in") toast.success("Signed in successfully!");
    else if (authEvent === "signed-out")
      toast.success("Signed out successfully!");
    else return;
    window.history.replaceState(null, "", window.location.pathname);
  }, []);

  // Same reasoning as SpotCard's image: don't gate the video's own
  // visibility on this state (that would reintroduce a hydration-timed
  // flash). The shimmer sits behind the video in the DOM and gets covered
  // natively once a frame paints; this state only unmounts it afterwards.
  useLayoutEffect(() => {
    if (videoRef.current?.readyState >= 2) setVideoLoaded(true);
  }, []);

  // Paying users have nothing to buy: the CTA is hidden, and the handler
  // refuses anyway so a stale render can't start a second checkout.
  const openCheckout = () => {
    if (hasAccess) return;
    setModalOpened(true);
  };
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

      {session ? (
        <button
          className="fixed top-4 right-4 z-10 flex cursor-pointer items-center gap-2 rounded-xl bg-[#FF5A5F] px-4 py-2.5 text-sm font-bold text-white md:top-6 md:right-6 md:px-5 md:py-2 md:text-base"
          onClick={() => signOut({ callbackUrl: "/?auth=signed-out" })}
        >
          {session.user?.image && (
            <Image
              src={session.user.image}
              alt=""
              width={24}
              height={24}
              className="rounded-full"
            />
          )}
          Sign Out
        </button>
      ) : (
        <button
          className="fixed top-4 right-4 z-10 cursor-pointer rounded-xl bg-[#FF5A5F] px-4 py-2.5 text-sm font-bold text-white md:top-6 md:right-6 md:px-5 md:py-2 md:text-base"
          onClick={() => signIn("google", { callbackUrl: "/?auth=signed-in" })}
        >
          Login
        </button>
      )}

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
