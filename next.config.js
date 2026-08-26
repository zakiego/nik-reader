/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async redirects() {
    return [
      // /login used to host a credentials form; the app has no auth any more.
      { source: "/login", destination: "/", permanent: true },
    ];
  },

  async rewrites() {
    return [
      // Sitemap lives under pages/api so it can run on the Workers runtime.
      { source: "/sitemap.xml", destination: "/api/sitemap.xml" },
    ];
  },
};

module.exports = nextConfig;
