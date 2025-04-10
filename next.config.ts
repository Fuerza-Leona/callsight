import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  publicRuntimeConfig: {
    baseApiUrl: process.env.BASE_API_URL || 'http://localhost:8000',
    apiVersion: process.env.API_VERSION || 'v1',
  },
};

export default nextConfig;
