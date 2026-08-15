const isProd = process.env.NODE_ENV === "production";

// script/style 'unsafe-inline' is required for the JSON-LD <script> tags in
// layout.js/faq/page.js (no nonce plumbing exists yet) and for Tailwind's
// injected styles. Checkout redirects to Stripe via a full-page navigation
// (window.location.href), not stripe.js/an iframe, so no Stripe origins are
// needed here — add them if Stripe Elements/embedded checkout are adopted.
// 'unsafe-eval' is dev-only: React/Fast Refresh use eval() for dev-mode
// debugging (stack traces, HMR) and never in a production build.
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' https://datafa.st${isProd ? "" : " 'unsafe-eval'"}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://grindspot-pull-zone.b-cdn.net https://lh3.googleusercontent.com",
  "media-src 'self' https://grindspot-pull-zone.b-cdn.net",
  "font-src 'self' data:",
  "connect-src 'self' https://datafa.st",
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
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
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
