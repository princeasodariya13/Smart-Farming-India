import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React strict mode for better hydration performance
  reactStrictMode: true,

  // Optimize images: use WebP/AVIF, enable lazy loading globally
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    minimumCacheTTL: 31536000, // 1 year
    dangerouslyAllowSVG: false,
  },

  // Production-grade caching headers
  async headers() {
    return [
      {
        source: "/:all*(svg|jpg|jpeg|png|gif|ico|webp|avif|woff|woff2)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // Reduce JS bundle size — skip source maps in production
  productionBrowserSourceMaps: false,

  // Compress responses
  compress: true,
};

export default nextConfig;
