"use client";

import { AuthKitProvider } from "@farcaster/auth-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { sdk } from "@farcaster/miniapp-sdk";
import { useEffect, useState } from "react";
import { createConfig, http, WagmiProvider } from "wagmi";
import { celo } from "wagmi/chains";
import { injected } from "wagmi/connectors";
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
    connectors: [injected()],
});

export default function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    useEffect(() => {
        const load = async () => {
            if (sdk && sdk.actions) {
                await sdk.actions.ready();
            }
        };
        load();
    }, []);

    return (
        <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>
                <AuthKitProvider config={config}>
                    <SelfProvider>
                        {children}
                    </SelfProvider>
                </AuthKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
