import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/images/**', // Or more specific if your project ID is always in the path
      },
    ],
  },
  /* other config options can go here */
};

export default nextConfig;
