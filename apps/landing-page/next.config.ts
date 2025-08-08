const { initOpenNextCloudflareForDev } = require("@opennextjs/cloudflare");
initOpenNextCloudflareForDev();

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove standalone output as it conflicts with OpenNext.js
  // output: 'standalone',
  trailingSlash: false,

  // Optimize for Cloudflare Workers
  typescript: {
    ignoreBuildErrors: false, // Keep strict for landing page
  },

  // Remove any asset prefix issues
  assetPrefix: undefined,

  // Image configuration for Cloudflare Workers
  images: {
    // Disable image optimization for Cloudflare Workers compatibility
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // Add webpack config for better compatibility
  webpack: (config: any, { isServer }: { isServer: boolean }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

export default nextConfig;
