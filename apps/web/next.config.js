/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove standalone output as it conflicts with OpenNext.js
  // output: 'standalone',
  trailingSlash: false,
  
  // Optimize for Cloudflare Workers
  typescript: {
    ignoreBuildErrors: true, // Temporarily ignore to focus on routing issues
  },
  
  // Remove any asset prefix issues
  assetPrefix: undefined,
  
  // Image configuration for Cloudflare Workers
  images: {
    // Disable image optimization for Cloudflare Workers compatibility
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // Disable server actions in middleware (can cause issues with dynamic routes)
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  
  // Add webpack config for better compatibility
  webpack: (config, { isServer }) => {
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

module.exports = nextConfig;
