import type { NextConfig } from "next";
import { API_DOMAIN } from "./lib/api/config";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'winners-realty.com',
      },
      {
        protocol: 'https',
        hostname: 'api.thegate-estates.com',
      },
      {
        protocol: 'https',
        hostname: API_DOMAIN.replace('https://', ''),
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/backend/:path*',
        destination: `${API_DOMAIN}/:path*`,
      },
    ];
  },
};

export default nextConfig;
// Forced reload for new API_DOMAIN
