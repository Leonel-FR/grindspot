"use client";
import { useEffect } from "react";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import toast from "react-hot-toast";

function AuthButtonContent({ session, className }) {
  return session ? (
    <button
      className={className}
      onClick={() => signOut({ callbackUrl: "/?auth=signed-out" })}
    >
      {session.user?.image && (
        <Image
          src={session.user.image}
          alt=""
          width={20}
          height={20}
          className="rounded-full"
        />
      )}
      Sign Out
    </button>
  ) : (
    <button
      className={className}
      onClick={() => signIn("google", { callbackUrl: "/?auth=signed-in" })}
    >
      Login
    </button>
  );
}

// Mirrors Hero's own visibility check: whenever Hero is showing (anyone
// without a session, or signed in without access), this renders fixed
// top-right on every screen size, same spot the button lived in before it
// was pulled out of Hero. Once Hero hides itself (signed in + access),
// mobile has nowhere fixed-positioned to put this without covering other
// content, so it's hidden here in favor of InlineAuthButton rendered inline
// in FilterBar instead.
export default function AuthButton({ hasAccess }) {
  const { data: session } = useSession();
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
    if (authEvent === "signed-in") toast.success("Signed in successfully!");
    else if (authEvent === "signed-out")
      toast.success("Signed out successfully!");
    else return;
    window.history.replaceState(null, "", window.location.pathname);
  }, []);

  return (
    <AuthButtonContent
      session={session}
      className={`fixed top-4 right-4 z-10 cursor-pointer items-center gap-2 rounded-xl bg-[#FF5A5F] px-4 py-2.5 text-sm font-bold text-white md:top-6 md:right-6 md:px-5 md:py-2 md:text-base ${
        heroHidden ? "hidden sm:flex" : "flex"
      }`}
    />
  );
}

// Renders in-flow (not fixed) for the mobile FilterBar layout. Only meant
// to be mounted by the caller when heroHidden is true — see AuthButton's
// comment above for why mobile needs a non-fixed fallback in that case.
export function InlineAuthButton() {
  const { data: session } = useSession();

  return (
    <AuthButtonContent
      session={session}
      className="flex shrink-0 cursor-pointer items-center gap-2 rounded-3xl bg-[#FF5A5F] px-4 py-2 text-sm font-bold text-white sm:hidden"
    />
  );
}
