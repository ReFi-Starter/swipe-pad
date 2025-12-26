import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider, createConfig } from 'wagmi';
import { base, baseSepolia, optimism, optimismSepolia, polygon, polygonMumbai } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { injected, metaMask, safe, walletConnect } from 'wagmi/connectors';
import { farcasterConnector } from '@farcaster/miniapp-wagmi-connector';

const queryClient = new QueryClient();

const config = createConfig({
  chains: [base, baseSepolia, optimism, optimismSepolia, polygon, polygonMumbai],
  connectors: [
    injected(),
    walletConnect({ projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '' }),
    metaMask(),
    safe(),
    farcasterConnector({
      client: {
        relayUrl: process.env.NEXT_PUBLIC_FARCASTER_RELAY_URL || 'https://relay.farcaster.xyz',
      },
    }),
  ],
  publicClient: publicProvider(),
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
