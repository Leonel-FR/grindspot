"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useLanguage } from "@/components/LanguageProvider";

// Sized in `em` so it tracks the button's font size at any breakpoint.
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

function AuthButtonContent({ session, className }) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  // `loading` only blocks the button after a re-render; this blocks the
  // second click of a fast double-click within the same tick.
  const pendingRef = useRef(false);

  // signIn/signOut both redirect through Google or NextAuth's own routes and
  // never resolve on this page when that redirect succeeds, so bfcache
  // restoring this page via back/forward would otherwise leave the button
  // frozen mid-spin (same issue EmailModal has with its Stripe redirect).
  useEffect(() => {
    const handlePageShow = (e) => {
      if (!e.persisted) return;
      pendingRef.current = false;
      setLoading(false);
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  async function handleClick() {
    if (pendingRef.current) return;
    pendingRef.current = true;
    setLoading(true);

    try {
      if (session) {
        await signOut({ callbackUrl: "/?auth=signed-out" });
      } else {
        await signIn("google", { callbackUrl: "/?auth=signed-in" });
      }
    } catch (err) {
      console.error(err);
      toast.error(t("auth.genericError"));
      pendingRef.current = false;
      setLoading(false);
    }
  }

  return (
    <button
      className={className}
      onClick={handleClick}
      disabled={loading}
      aria-busy={loading}
    >
      {loading ? (
        <Spinner />
      ) : (
        session?.user?.image && (
          <Image
            src={session.user.image}
            alt=""
            width={20}
            height={20}
            className="rounded-full"
          />
        )
      )}
      {loading
        ? t("auth.redirecting")
        : session
          ? t("auth.signOut")
          : t("auth.login")}
    </button>
  );
}

// Mirrors Hero's own visibility check: whenever Hero is showing (anyone
// without a session, or signed in without access), this renders fixed
// top-right on every screen size, same spot the button lived in before it
// was pulled out of Hero. Once Hero hides itself (signed in + access),
// there's nowhere fixed-positioned to put this without covering other
// content at any width, so it's hidden here entirely in favor of
// InlineAuthButton rendered inline in FilterBar (both the mobile and the
// desktop row) instead.
export default function AuthButton({ hasAccess }) {
  const { data: session } = useSession();
  const { t } = useLanguage();
  const heroHidden = Boolean(session) && hasAccess;

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
    if (authEvent === "signed-in") toast.success(t("auth.signedIn"));
    else if (authEvent === "signed-out") toast.success(t("auth.signedOut"));
    else return;
    window.history.replaceState(null, "", window.location.pathname);
  }, [t]);

  return (
    <AuthButtonContent
      session={session}
      className={`fixed top-4 right-4 z-10 cursor-pointer items-center gap-2 rounded-xl bg-[#FF5A5F] px-4 py-2.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-70 md:top-6 md:right-6 md:px-5 md:py-2 md:text-base ${
        heroHidden ? "hidden" : "flex"
      }`}
    />
  );
}

// Renders in-flow (not fixed) for the FilterBar layout — both its mobile
// and desktop rows mount this with their own className, since the two
// layouts need different sizing. Only meant to be mounted by the caller
// when heroHidden is true — see AuthButton's comment above for why nothing
// fixed-positioned works once Hero hides itself.
export function InlineAuthButton({ className }) {
  const { data: session } = useSession();

  return (
    <AuthButtonContent
      session={session}
      className={
        className ??
        "flex shrink-0 cursor-pointer items-center gap-2 rounded-3xl bg-[#FF5A5F] px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-70 sm:hidden"
      }
    />
  );
}
