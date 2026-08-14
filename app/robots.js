export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/auth/", "/success", "/welcome-back"],
    },
    sitemap: "https://grind-spot.com/sitemap.xml",
  };
}
