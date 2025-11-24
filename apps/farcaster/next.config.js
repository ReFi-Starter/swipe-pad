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
};

module.exports = nextConfig;
