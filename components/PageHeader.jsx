import Link from "next/link";

export default function PageHeader() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-345 items-center justify-between px-6 py-4">
        <Link href="/" className="cursor-pointer text-xl font-black text-[#FF5A5F]">
          GrindSpot
        </Link>
        <Link
          href="/"
          className="cursor-pointer text-sm font-bold text-gray-600 hover:text-[#FF5A5F]"
        >
          ← Back to home
        </Link>
      </div>
    </header>
  );
}
