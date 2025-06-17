import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    nodeMiddleware: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: "localhost",
        port: "9000",
        pathname: "/images/**",
      },
      {
        hostname: "notables.aa55h.dev",
        pathname: "/images/**",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
