// app/auth/error/page.js
import Link from "next/link";

export default async function AuthErrorPage({ searchParams }) {
  const { error } = await searchParams;

  const isAccessDenied = error === "AccessDenied";

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold text-gray-800">
          {isAccessDenied ? "You do not have access" : "Something went wrong"}
        </h1>
        <p className="mt-3 text-gray-500">
          {isAccessDenied
            ? "This email does not have an active payment account in GrindSpot. If you have already paid, make sure you are logged in with the same email you used to pay."
            : "An error occurred while trying to log in. Please try again."}
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-[#FF5A5F] px-6 py-3 font-medium text-white"
        >
          Return to home
        </Link>
      </div>
    </div>
  );
}
