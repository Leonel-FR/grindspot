"use client";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useLanguage } from "@/components/LanguageProvider";

export default function Success() {
  const { data: session } = useSession();
  const { t } = useLanguage();

  return (
    <main className="flex min-h-full flex-col items-center justify-center gap-4 px-6 py-20 md:py-32">
      <h1 className="text-center text-3xl font-bold">{t("success.title")}</h1>
      <p className="max-w-lg text-center text-lg text-gray-600">
        {session
          ? t("success.messageSignedIn")
          : t("success.messageSignedOut")}
      </p>
      {session ? (
        <Link href="/">
          <button className="cursor-pointer rounded-lg bg-[#FF5A5F] px-6 py-3 font-bold text-white">
            {t("success.homeButton")}
          </button>
        </Link>
      ) : (
        <button
          // Explicit callbackUrl: signIn() otherwise returns to the page it
          // was called from — landing back on /success after a successful
          // login instead of taking the user into the app.
          onClick={() => signIn("google", { callbackUrl: "/?auth=signed-in" })}
          className="cursor-pointer rounded-lg bg-[#FF5A5F] px-6 py-3 font-bold text-white"
        >
          {t("auth.signInWithGoogle")}
        </button>
      )}
    </main>
  );
}
