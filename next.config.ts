import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'thegate-estates.com',
      },
      {
        protocol: 'https',
        hostname: 'api.thegate-estates.com',
      },
      {
        protocol: 'https',
        hostname: 'websiterealstate.runasp.net',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/backend/:path*',
        destination: 'https://api.thegate-estates.com/:path*',
      },
    ];
  },
};

export default nextConfig;
