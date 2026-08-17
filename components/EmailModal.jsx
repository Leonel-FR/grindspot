"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import toast from "react-hot-toast";
import { useLanguage } from "@/components/LanguageProvider";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

// Rendered only while open, so every open starts from a clean state instead of
// inheriting the previous attempt's loading state.
export default function EmailModal({ onClose }) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const submittingRef = useRef(false);
  const [turnstileReady, setTurnstileReady] = useState(false);
  const [turnstileError, setTurnstileError] = useState(false);
  const turnstileContainerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const tokenRef = useRef("");
  const [demoPlaying, setDemoPlaying] = useState(false);
  const demoVideoRef = useRef(null);

  // Set optimistically so the play button disappears the instant it's
  // clicked; a real user gesture practically never fails, but roll back if
  // it somehow does so the button doesn't vanish with nothing playing.
  async function playDemo() {
    const video = demoVideoRef.current;
    if (!video) return;
    setDemoPlaying(true);
    try {
      await video.play();
    } catch (err) {
      console.error(err);
      setDemoPlaying(false);
    }
  }

  // Redirecting to Stripe never unmounts this page, so coming back through the
  // browser's back/forward cache restores it verbatim — button included, still
  // frozen on "Redirecting...". Clear the in-flight state on that restore.
  useEffect(() => {
    const handlePageShow = (e) => {
      if (!e.persisted) return;
      submittingRef.current = false;
      setLoading(false);
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  // Rendered explicitly (render=explicit in the script src) instead of via
  // the script's own auto-scan, which only scans the DOM once on load and
  // would miss this container on every open after the first — the script
  // stays cached across opens, but this component remounts fresh each time.
  useEffect(() => {
    if (!turnstileReady || !turnstileContainerRef.current) return;

    widgetIdRef.current = window.turnstile.render(
      turnstileContainerRef.current,
      {
        sitekey: TURNSTILE_SITE_KEY,
        callback: (token) => {
          tokenRef.current = token;
        },
        "expired-callback": () => {
          tokenRef.current = "";
        },
        "error-callback": () => {
          tokenRef.current = "";
        },
      }
    );

    return () => {
      if (widgetIdRef.current) {
        window.turnstile?.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [turnstileReady]);

  async function handleSubmit(e) {
    e.preventDefault();

    // `loading` only blocks the button after a re-render; this blocks the
    // second submit of a fast double-click within the same tick.
    if (submittingRef.current) return;

    if (!tokenRef.current) {
      toast.error(
        turnstileError
          ? t("emailModal.verificationLoadError")
          : t("emailModal.verificationRequired")
      );
      return;
    }

    submittingRef.current = true;

    const email = e.target.email.value;

    setLoading(true);
    try {
      const res = await fetch("/api/billing/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, turnstileToken: tokenRef.current }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }

      // Reached on rate-limiting, a failed bot check, or a genuine Stripe
      // error — the "already has access" case above always returns a url,
      // never lands here. The server sends an error *code*, never
      // user-facing text, so the message shown always matches the selected
      // language.
      toast.error(
        data.error === "rate_limited"
          ? t("emailModal.rateLimited")
          : data.error === "verification_failed"
            ? t("emailModal.verificationFailed")
            : t("emailModal.genericError")
      );
    } catch (err) {
      console.error(err);
      toast.error(t("emailModal.genericError"));
    }

    // Tokens are single-use, so a widget left showing a stale one would just
    // fail verification again — reset it so the retry gets a fresh token.
    if (widgetIdRef.current) {
      window.turnstile?.reset(widgetIdRef.current);
    }
    tokenRef.current = "";

    // Only reached when no redirect happened, so the user can correct the
    // email and submit again.
    submittingRef.current = false;
    setLoading(false);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 px-4 py-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={() => setTurnstileReady(true)}
        onError={() => setTurnstileError(true)}
      />
      <div
        className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-gray-500"
        >
          ✕
        </button>

        <div className="relative mb-6 aspect-video overflow-hidden rounded-xl bg-black">
          <video
            ref={demoVideoRef}
            controls={demoPlaying}
            preload="metadata"
            playsInline
            className="h-full w-full object-cover"
            onPause={() => setDemoPlaying(false)}
            onEnded={() => setDemoPlaying(false)}
          >
            <source
              src="https://grindspot-pull-zone.b-cdn.net/hero-section/demo-grindspot.mp4"
              type="video/mp4"
            />
          </video>

          {!demoPlaying && (
            <button
              type="button"
              onClick={playDemo}
              aria-label={t("emailModal.playDemo")}
              className="group absolute inset-0 flex cursor-pointer items-center justify-center bg-black/20 transition-colors hover:bg-black/30"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform group-hover:scale-105">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  fill="#111827"
                  className="h-6 w-6"
                >
                  <path d="M8 5v14l11-7-11-7Z" />
                </svg>
              </span>
            </button>
          )}
        </div>

        <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">
          {t("emailModal.title")}
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          {t("emailModal.subtitle")}
        </p>

        <form className="mt-6 flex flex-col gap-3" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            required
            placeholder={t("emailModal.emailPlaceholder")}
            className="text-mc text-md w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#ffa49f] focus:ring-2 focus:ring-[#ffa49f] focus:outline-none"
          />
          {turnstileError ? (
            <p className="text-center text-xs text-gray-400">
              {t("emailModal.verificationLoadError")}
            </p>
          ) : (
            <div ref={turnstileContainerRef} className="flex justify-center" />
          )}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#FF5A5F] px-4 py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading && (
              // Sized in `em` so it tracks the button's font size at any breakpoint.
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                fill="none"
                className="h-[1em] w-[1em] shrink-0 animate-spin"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  opacity="0.3"
                />
                <path
                  d="M12 2a10 10 0 0 1 10 10"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            )}
            {loading ? t("emailModal.redirecting") : t("emailModal.continue")}
          </button>
        </form>
      </div>
    </div>
  );
}
