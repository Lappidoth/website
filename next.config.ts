import type { NextConfig } from "next";

const securityHeaders = [
  // Don't let other sites put this one in a frame (stops "clickjacking")
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
  // Browsers must respect the file types we send
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Don't leak full page addresses to other sites
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // The site never needs these device features
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // Never cache or index the back office
      {
        source: "/admin/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ];
  },
};

export default nextConfig;
