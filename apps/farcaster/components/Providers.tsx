"use client";

import { AuthKitProvider } from "@farcaster/auth-kit";
import { sdk } from "@farcaster/miniapp-sdk";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { createConfig, http, WagmiProvider } from "wagmi";
import { celo } from "wagmi/chains";
import { injected } from "wagmi/connectors";
import { ErrorBoundary } from "./ErrorBoundary";
import { FarcasterLifecycle } from "./FarcasterLifecycle";
import { SelfProvider } from "./SelfProvider";

const config = {
    rpcUrl: "https://mainnet.optimism.io",
    domain: "farcaster.swipepad.xyz",
    siweUri: "https://farcaster.swipepad.xyz/login",
};

const wagmiConfig = createConfig({
    chains: [celo],
    transports: {
        [celo.id]: http(),
    },
    connectors: [
        injected(),
        injected({
            target: () => ({
                id: 'farcaster',
                name: 'Farcaster Wallet',
                provider: sdk.provider as any
            }),
        })
    ],
});


export default function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <ErrorBoundary>
            <WagmiProvider config={wagmiConfig}>
                <QueryClientProvider client={queryClient}>
                    <AuthKitProvider config={config}>
                        <FarcasterLifecycle />
                        <SelfProvider>
                            {children}
                        </SelfProvider>
                    </AuthKitProvider>
                </QueryClientProvider>
            </WagmiProvider>
        </ErrorBoundary>
    );
}
