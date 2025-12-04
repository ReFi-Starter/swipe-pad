"use client";

import { AuthKitProvider } from "@farcaster/auth-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { createConfig, http, WagmiProvider } from "wagmi";
import { celo, celoAlfajores, celoSepolia } from "wagmi/chains";
import { injected } from "wagmi/connectors";
import { SelfProvider } from "./SelfProvider";

const config = {
    rpcUrl: "https://mainnet.optimism.io",
    domain: "farcaster.swipepad.xyz",
    siweUri: "https://farcaster.swipepad.xyz/login",
};

const wagmiConfig = createConfig({
    chains: [celo, celoAlfajores, celoSepolia],
    transports: {
        [celo.id]: http(),
        [celoAlfajores.id]: http(),
        [celoSepolia.id]: http(),
    },
    connectors: [injected()],
});

export default function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

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
