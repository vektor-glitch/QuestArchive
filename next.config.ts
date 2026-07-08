import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{
      protocol: 'https',
      hostname: 'images.unsplash.com',
    },
    {
      protocol: 'https',
      hostname: 'tailwindcss.com',
    },
    {
      protocol: 'https',
      hostname: 'media.rawg.io',
    },
    ],
  },
};

export default nextConfig;
