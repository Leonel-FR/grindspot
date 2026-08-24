const isProd = process.env.NODE_ENV === "production";

// script/style 'unsafe-inline' is required for the JSON-LD <script> tags in
// layout.js/faq/page.js (no nonce plumbing exists yet) and for Tailwind's
// injected styles. Checkout redirects to Stripe via a full-page navigation
// (window.location.href), not stripe.js/an iframe, so no Stripe origins are
// needed here — add them if Stripe Elements/embedded checkout are adopted.
// 'unsafe-eval' is dev-only: React/Fast Refresh use eval() for dev-mode
// debugging (stack traces, HMR) and never in a production build.
// challenges.cloudflare.com is Turnstile (bot check in EmailModal): the
// widget script needs script-src, the challenge widget renders in a
// sandboxed iframe so it needs frame-src, and some challenge modes call out
// over XHR so it needs connect-src too.
// tiles.openfreemap.org is SpotsMap's tile/style/sprite/glyph server
// (maplibre-gl fetches all of it via connect-src, never <img src>); worker-src
// blob: is needed because maplibre-gl parses vector tiles in a Web Worker it
// spins up from a blob: URL, which falls back to default-src (no blob:)
// without this.
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' https://datafa.st https://challenges.cloudflare.com${isProd ? "" : " 'unsafe-eval'"}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://grindspot-pull-zone.b-cdn.net https://lh3.googleusercontent.com",
  "media-src 'self' https://grindspot-pull-zone.b-cdn.net",
  "font-src 'self' data:",
  "connect-src 'self' https://datafa.st https://challenges.cloudflare.com https://tiles.openfreemap.org",
  "worker-src 'self' blob:",
  "frame-src https://challenges.cloudflare.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  isProd ? "upgrade-insecure-requests" : "",
]
  .filter(Boolean)
  .join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // geolocation=(self) — SpotsMap uses navigator.geolocation to show "you
  // are here"; the previous geolocation=() disabled it site-wide, including
  // for our own pages, not just third-party embeds.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(self)",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "grindspot-pull-zone.b-cdn.net",
        pathname: "/spots/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
