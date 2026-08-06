import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white px-6 py-10">
      <div className="mx-auto flex max-w-345 flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:justify-between sm:text-left">
        <div className="max-w-sm">
          <span className="text-xl font-black text-[#FF5A5F]">GrindSpot</span>
          <p className="mt-2 text-sm text-gray-500">
            Find your next remote work spot, verified before you go.
          </p>
        </div>

        <nav className="flex gap-6 text-sm font-bold text-gray-600">
          <Link href="/terms" className="hover:text-[#FF5A5F]">
            Terms & Conditions
          </Link>
          <Link href="/privacy" className="hover:text-[#FF5A5F]">
            Privacy Policy
          </Link>
        </nav>
      </div>

      <p className="mt-8 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} GrindSpot
      </p>
    </footer>
  );
}
