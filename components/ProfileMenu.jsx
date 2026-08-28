"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useLanguage } from "@/components/LanguageProvider";

// Sized in `em` so it tracks the surrounding font size — mirrors the
// spinner AuthButton already uses.
function Spinner() {
  return (
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
  );
}

// Replaces the old inline "Log out" pill: a circular avatar of the signed-in
// user that toggles a small menu holding the sign-out action. Only mounted
// by FilterBar when the visitor is signed in *and* has access (the same
// `heroHidden` gate InlineAuthButton lived behind), so `session` is always
// present by the time this renders.
export default function ProfileMenu({ className = "" }) {
  const { data: session } = useSession();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  // Blocks the second click of a fast double-click within the same tick,
  // before `loading` has re-rendered the button disabled.
  const pendingRef = useRef(false);
  const menuId = useId();

  // signOut redirects through NextAuth and never resolves on this page, so
  // a bfcache restore (back/forward) would otherwise leave this frozen
  // mid-spin — same guard AuthButton uses for the same reason.
  useEffect(() => {
    const handlePageShow = (e) => {
      if (!e.persisted) return;
      pendingRef.current = false;
      setLoading(false);
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  // Close on any pointer press outside the whole widget — matches the
  // pattern in ViewSwitcher / MultiSelectDropdown.
  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (e) => {
      if (!containerRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  // Move focus into the menu when it opens via the keyboard, so Tab / Esc
  // have somewhere to land.
  useEffect(() => {
    if (open) menuRef.current?.querySelector("button")?.focus();
  }, [open]);

  if (!session?.user) return null;

  const { name, email, image } = session.user;
  const initial = (name || email || "?").trim().charAt(0).toUpperCase();

  async function handleSignOut() {
    if (pendingRef.current) return;
    pendingRef.current = true;
    setLoading(true);
    try {
      await signOut({ callbackUrl: "/?auth=signed-out" });
    } catch (err) {
      console.error(err);
      toast.error(t("auth.genericError"));
      pendingRef.current = false;
      setLoading(false);
    }
  }

  const handleTriggerKeyDown = (e) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen(true);
    }
  };

  const handleMenuKeyDown = (e) => {
    if (e.key === "Escape") {
      setOpen(false);
      triggerRef.current?.focus();
    }
  };

  // Tabbing out of the widget closes it, without stealing the click that
  // moves focus between the trigger and the menu.
  const handleBlur = (e) => {
    if (!containerRef.current?.contains(e.relatedTarget)) setOpen(false);
  };

  return (
    <div
      ref={containerRef}
      onBlur={handleBlur}
      className={`relative shrink-0 ${className}`}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label={t("auth.accountMenu")}
        onClick={() => setOpen((prev) => !prev)}
        onKeyDown={handleTriggerKeyDown}
        // The avatar itself never changes on click/open — the menu popping
        // up is the only state cue. focus-visible (not focus) means the ring
        // shows only for keyboard focus, never a mouse click, while still
        // keeping the control keyboard-accessible.
        //
        // transform-gpu + backface-hidden: this sits inside the sticky
        // FilterBar, and mobile Safari otherwise leaves the avatar's shadow
        // ghosting over the neighbouring Filters button when the viewport
        // resizes mid-scroll. Its own compositor layer repaints cleanly.
        className="flex h-10 w-10 transform-gpu cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-white bg-[#FF5A5F] font-bold text-white shadow-md backface-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ffa49f] sm:h-11 sm:w-11"
      >
        {image ? (
          <Image
            src={image}
            alt=""
            width={44}
            height={44}
            className="h-full w-full rounded-full object-cover"
          />
        ) : (
          <span aria-hidden="true">{initial}</span>
        )}
      </button>

      {open && (
        <div
          ref={menuRef}
          id={menuId}
          role="menu"
          aria-label={t("auth.accountMenu")}
          onKeyDown={handleMenuKeyDown}
          // left-0 (not right-0): the avatar is now the left-most control in
          // the bar, so the menu hangs off its left edge and stays on
          // screen. max-w keeps it inside the viewport on the narrowest
          // phones even so.
          className="absolute left-0 z-30 mt-2 w-44 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border-2 border-gray-300 bg-white shadow-lg"
        >
          <div className="p-2">
            <button
              type="button"
              role="menuitem"
              onClick={handleSignOut}
              disabled={loading}
              aria-busy={loading}
              // Only the background reacts — to hover and to keyboard/click
              // focus. Text and icon stay a plain, constant color.
              className="flex w-full cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-left font-bold text-black transition-colors hover:bg-gray-100 focus:bg-gray-100 focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? <Spinner /> : <span>❌</span>}
              <span>{loading ? t("auth.redirecting") : t("auth.signOut")}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
