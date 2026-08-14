"use client";

import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

// Rendered only while open, so every open starts from a clean state instead of
// inheriting the previous attempt's loading state.
export default function EmailModal({ onClose }) {
  const [loading, setLoading] = useState(false);
  const submittingRef = useRef(false);

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

  async function handleSubmit(e) {
    e.preventDefault();

    // `loading` only blocks the button after a re-render; this blocks the
    // second submit of a fast double-click within the same tick.
    if (submittingRef.current) return;
    submittingRef.current = true;

    const email = e.target.email.value;

    setLoading(true);
    try {
      const res = await fetch("/api/billing/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }

      // Reached on rate-limiting or a genuine Stripe error — the "already
      // has access" case above always returns a url, never lands here.
      toast.error(data.error || "Something went wrong. Please try again.");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    }

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
      <div
        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-gray-500"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">
          Get started now
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Join GrindSpot and find your next favorite work spot.
        </p>

        <form className="mt-6 flex flex-col gap-3" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            required
            placeholder="Enter your email"
            className="text-mc text-md w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#ffa49f] focus:ring-2 focus:ring-[#ffa49f] focus:outline-none"
          />
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
            {loading ? "Redirecting..." : "Continue to checkout"}
          </button>
        </form>
      </div>
    </div>
  );
}
