"use client";
// Thirdweb Wagmi Adapter
import { inAppWalletConnector } from "@thirdweb-dev/wagmi-adapter";
import { createThirdwebClient } from "thirdweb";
import { ThirdwebProvider } from "thirdweb/react";


import { AuthKitProvider } from "@farcaster/auth-kit";
import { farcasterMiniApp as miniAppConnector } from "@farcaster/miniapp-wagmi-connector";
import { connectorsForWallets, darkTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { coinbaseWallet, metaMaskWallet, rainbowWallet, walletConnectWallet } from '@rainbow-me/rainbowkit/wallets';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { createConfig, http, WagmiProvider } from "wagmi";
import { celo } from "wagmi/chains";
import { ErrorBoundary } from "./ErrorBoundary";
import { FarcasterLifecycle } from "./FarcasterLifecycle";
import dynamic from "next/dynamic";

const SafeThirdwebProvider = ThirdwebProvider as any;


const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "",
});

const config = {
    rpcUrl: "https://mainnet.optimism.io",
    domain: "farcaster.swipepad.xyz",
    siweUri: "https://farcaster.swipepad.xyz/login",
};

function ProvidersInner({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    const [wagmiConfig] = useState(() => {
        const connectors = connectorsForWallets(
            [
                {
                    groupName: 'Recommended',
                    wallets: [rainbowWallet, metaMaskWallet, coinbaseWallet, walletConnectWallet],
                },
            ],
            {
                appName: 'SwipePad',
                projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
            }
        );

        return createConfig({
            chains: [celo],
            transports: {
                [celo.id]: http(),
            },
            connectors: [
                inAppWalletConnector({ client }) as any,
                miniAppConnector(),
                ...connectors
            ],
        });
    });

    return (
        <ErrorBoundary>
            <SafeThirdwebProvider client={client}>
            <WagmiProvider config={wagmiConfig}>
                <QueryClientProvider client={queryClient}>
                    <RainbowKitProvider theme={darkTheme()}>
                        <AuthKitProvider config={config}>
                            <FarcasterLifecycle />
                            {children}
                        </AuthKitProvider>
                    </RainbowKitProvider>
                </QueryClientProvider>
            </WagmiProvider>
            </SafeThirdwebProvider>
        </ErrorBoundary>
    );
}

const Providers = dynamic(() => Promise.resolve(ProvidersInner), {
  ssr: false,
});

export default Providers;
