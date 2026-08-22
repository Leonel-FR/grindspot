import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import Script from "next/script";
import { LanguageProvider } from "@/components/LanguageProvider";
import LanguageToggle from "@/components/LanguageToggle";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const SITE_URL = "https://grind-spot.com";
const SITE_NAME = "GrindSpot";
const SITE_DESCRIPTION =
  "Find remote work spots verified for wifi, noise level, and work-friendliness before you go. Discover the best coffee shops, restaurants, coworking spaces, and libraries near you.";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "GrindSpot — Find Verified Remote Work Spots",
    template: "%s | GrindSpot",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "remote work spots",
    "coworking finder",
    "best cafes to work from",
    "work friendly cafes",
    "digital nomad spots",
    "wifi cafes near me",
    "lugares para trabajar remoto",
    "cafeterías para trabajar remoto",
    "lugares de trabajo remoto",
    "cafés con wifi",
    "cafés para hacer home office",
    "Lugares para hacer home office",
    "Lugares para trabajar con laptop",
  ],
  applicationName: SITE_NAME,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "GrindSpot — Find Verified Remote Work Spots",
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "GrindSpot",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GrindSpot — Find Verified Remote Work Spots",
    description: SITE_DESCRIPTION,
    images: ["/opengraph-image.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/logoAndName.png`,
      sameAs: ["https://www.instagram.com/trygrindspot"],
    },
    {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full scroll-smooth antialiased`}
    >
      <LanguageProvider>
        <SessionProvider>
          <body className="flex min-h-full flex-col">
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Toaster position="top-center" />
            <LanguageToggle className="fixed bottom-4 left-4 z-20 flex shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/90 px-4 py-2 text-sm font-bold text-black shadow-md backdrop-blur-sm transition-colors hover:bg-white" />
            <Script
              src="https://datafa.st/js/script.js"
              data-website-id="dfid_Db0mcaFtGlQOhXaes5qBT"
              data-domain="grind-spot.com"
              strategy="afterInteractive"
            />
            {children}
          </body>
        </SessionProvider>
      </LanguageProvider>
    </html>
  );
}
