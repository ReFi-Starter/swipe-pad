// https://github.com/ReFi-Starter/swipe-pad/blob/main/apps/MiniPay/lib/wagmiConfig.ts

import { createConfig, http } from 'wagmi'
import { celo, celoAlfajores } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'
import { CELO_MAINNET_ID } from './constants'

// Define the chains supported by MiniPay (Celo Mainnet is the target, ID: 42220)
const chains = [celo, celoAlfajores] as const

// The injected connector is necessary for auto-connecting to MiniPay
const minipayConnector = injected({
  target: 'metamask',
  // Custom provider detection is used to prioritize the MiniPay wallet interface
  getProvider() {
    if (typeof window !== 'undefined' && (window.ethereum as any)?.isMiniPay) {
      return window.ethereum;
    }
    return undefined; 
  },
})

export const config = createConfig({
  chains,
  transports: {
    [celo.id]: http(), // Celo Mainnet transport
    [celoAlfajores.id]: http(), // Celo Alfajores Testnet transport
  },
  // We explicitly use the injected connector for MiniPay/Mobile compatibility
  connectors: [minipayConnector],
})

// Export Celo Mainnet ID
export const CELO_CHAIN_ID = CELO_MAINNET_ID;
