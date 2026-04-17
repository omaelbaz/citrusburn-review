import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable React strict mode for catching bugs early
  reactStrictMode: true,

  // Optimize images — no external domains needed (all images are local /public)
  images: {
    formats: ['image/avif', 'image/webp'],
  },

  // Trailing slash for cleaner Vercel routing
  trailingSlash: false,
};

export default nextConfig;
