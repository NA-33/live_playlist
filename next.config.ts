import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
    // Cache optimized images for 60 days
    minimumCacheTTL: 60 * 60 * 24 * 60,
  },

  // Compression and bundling
  compress: true,
  productionBrowserSourceMaps: false,

  // React strict mode for development
  reactStrictMode: true,

  // Headers for better caching
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
      {
        source: "/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // Redirects for SEO
  async redirects() {
    return [
      {
        source: "/playlist/:slug",
        destination: "/?slug=:slug",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
