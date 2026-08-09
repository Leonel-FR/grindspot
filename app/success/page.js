"use client";
import Link from "next/link";
export default function Success() {
  return (
    <main className="flex min-h-full flex-col items-center justify-center gap-4 px-6 py-20 md:py-32">
      <h1 className="text-center text-3xl font-bold">Payment Successful!</h1>
      <p className="text-center text-lg text-gray-600">
        Thank you for your payment. Your transaction has been completed
        successfully, you can now go to the home page and login into your
        account!
      </p>
      <Link href="/">
        <button className="cursor-pointer rounded-lg bg-[#FF5A5F] px-6 py-3 font-bold text-white">
          Home Page
        </button>
      </Link>
    </main>
  );
}
