/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['gateway.ipfs.io', 'cloudflare-ipfs.com'],
  },
  env: {
    NEXT_PUBLIC_CELO_NETWORK: process.env.NEXT_PUBLIC_CELO_NETWORK,
    NEXT_PUBLIC_CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    NEXT_PUBLIC_SELF_PROTOCOL_API_KEY: process.env.NEXT_PUBLIC_SELF_PROTOCOL_API_KEY,
    NEXT_PUBLIC_MENTO_CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_MENTO_CONTRACT_ADDRESS,
  },
}

module.exports = nextConfig
