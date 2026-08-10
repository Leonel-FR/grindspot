export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/auth/", "/success"],
    },
    sitemap: "https://grind-spot.com/sitemap.xml",
  };
}
