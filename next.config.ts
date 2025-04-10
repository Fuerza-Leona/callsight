import type { NextConfig } from 'next';

const baseApiUrl = process.env.BASE_API_URL || 'http://localhost:8000';
const apiVersion = process.env.API_VERSION || 'v1';

const nextConfig: NextConfig = {
  publicRuntimeConfig: {
    apiUrl: `${baseApiUrl}/api/${apiVersion}`,
  },
};

export default nextConfig;
