"use client";

import { AuthKitProvider } from "@farcaster/auth-kit";
import { darkTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { WagmiProvider } from "wagmi";
import { ErrorBoundary } from "./ErrorBoundary";
import { FarcasterLifecycle } from "./FarcasterLifecycle";

const authConfig = {
    rpcUrl: "https://mainnet.optimism.io",
    domain: "farcaster.swipepad.xyz",
    siweUri: "https://farcaster.swipepad.xyz/login",
};

import { config } from "@/lib/wagmiConfig";

// ... imports

// Remove inline wagmiConfig and connectors definition


export default function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <ErrorBoundary>
            <WagmiProvider config={config}>
                <QueryClientProvider client={queryClient}>
                    <FarcasterLifecycle />
                    <RainbowKitProvider theme={darkTheme()}>
                        <AuthKitProvider config={authConfig}>
                            {children}
                        </AuthKitProvider>
                    </RainbowKitProvider>
                </QueryClientProvider>
            </WagmiProvider>
        </ErrorBoundary>
    );
}
