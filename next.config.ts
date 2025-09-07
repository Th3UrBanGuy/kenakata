
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allows any hostname
      },
      {
        protocol: 'http',
        hostname: '**', // Also allow http sources
      },
    ],
  },
};

export default nextConfig;
