// app/auth/error/page.js
import Link from "next/link";

export default async function AuthErrorPage({ searchParams }) {
  const { error } = await searchParams;

  const isAccessDenied = error === "AccessDenied";

  return (
    <main className="flex min-h-full flex-col items-center justify-center gap-4 px-6 py-20 md:py-32">
      <h1 className="text-center text-3xl font-bold">
        {isAccessDenied ? "You do not have access ❌" : "Something went wrong"}
      </h1>
      <p className="max-w-lg text-center text-lg text-gray-600">
        {isAccessDenied
          ? "This email doesn’t have an active paid account on GrindSpot. If you’ve already paid, please make sure you’re logged in with the same email address you used to make the payment."
          : "An error occurred while trying to log in. Please try again."}
      </p>
      <Link href="/">
        <button className="cursor-pointer rounded-lg bg-[#FF5A5F] px-6 py-3 font-bold text-white">
          Return to home
        </button>
      </Link>
    </main>
  );
}
