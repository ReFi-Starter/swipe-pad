/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@vercel/og'],
  },
  images: {
    domains: [
      'localhost',
      'swipepad.xyz',
      'farcaster.swipepad.xyz',
      'supabase.co',
      'supabase.com',
      '*.supabase.co',
      '*.supabase.com',
      'ipfs.io',
      'gateway.ipfs.io',
      'cloudflare-ipfs.com',
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  env: {
    NEXT_PUBLIC_FRAME_URL: process.env.NEXT_PUBLIC_FRAME_URL,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      // Mocks the React Native module for the web build
      '@react-native-async-storage/async-storage': false, 
    };
    return config;
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://client.warpcast.com https://warpcast.com https://assets.neynar.com;",
          },
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
