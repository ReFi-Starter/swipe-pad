import { farcasterMiniApp } from '@farcaster/miniapp-wagmi-connector';
import { createConfig, http } from 'wagmi';
import { celo } from 'wagmi/chains';

export const config = createConfig({
  chains: [celo],
  transports: {
    [celo.id]: http(),
  },
  // Only initialize connectors on the client side to avoid window access during build
  connectors: typeof window !== 'undefined' ? [farcasterMiniApp()] : [],
  ssr: true,
});
