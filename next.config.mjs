/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "grindspot-pull-zone.b-cdn.net",
        pathname: "/spots/**",
      },
    ],
  },
};

export default nextConfig;
