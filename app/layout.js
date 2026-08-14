import { Geist, Geist_Mono } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://grind-spot.com";
const SITE_NAME = "GrindSpot";
const SITE_DESCRIPTION =
  "Find remote work spots verified for wifi, noise level, and work-friendliness before you go. Discover the best cafes, coworking spaces, and libraries near you.";

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
      className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
    >
      <SessionProvider>
        <body className="flex min-h-full flex-col">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          <Toaster position="top-center" />
          {children}
        </body>
      </SessionProvider>
    </html>
  );
}
