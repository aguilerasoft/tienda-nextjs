import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  // Your existing config options here
  allowedDevOrigins: [
    'http://172.17.2.131:3000', // Your local development origin
    'http://localhost:3000',     // Default localhost
    // Add any other development origins you need
  ],
  // Other Next.js configurations can go here
};
export default nextConfig;