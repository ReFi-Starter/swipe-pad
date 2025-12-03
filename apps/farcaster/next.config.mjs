import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "coinbase-wallet-sdk": path.resolve(__dirname, "coinbase-wallet-sdk-mock.js"),
      "porto/internal": false,
      "@safe-global/safe-apps-provider": false,
      "@safe-global/safe-apps-sdk": false,
      "@walletconnect/ethereum-provider": false,
      "@metamask/sdk": false,
      "@gemini-wallet/core": false,
      "@base-org/account": false,
    }
    config.externals.push("pino-pretty", "lokijs", "encoding", "porto")
    return config
  },
}

export default nextConfig