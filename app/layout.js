import { Geist, Geist_Mono } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Grind Spot",
  description: "A place to find remote work spots",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
    >
      <SessionProvider>
        <body className="flex min-h-full flex-col">{children}</body>
      </SessionProvider>
    </html>
  );
}
