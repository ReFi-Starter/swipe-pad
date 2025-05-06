'use client'

import { WagmiProvider, createConfig, http } from 'wagmi'
import { celoAlfajores } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode, useEffect, useRef } from 'react'
import { toast } from 'sonner'

// NetworkSwitcher component to handle automatic network switching
function NetworkSwitcher() {
    const hasAttemptedSwitch = useRef(false)

    useEffect(() => {
        const switchToCeloAlfajores = async () => {
            // Only attempt switch once on initial load
            if (hasAttemptedSwitch.current) return
            if (typeof window === 'undefined' || !window.ethereum || window.ethereum.isMiniPay) return

            hasAttemptedSwitch.current = true

            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: `0x${celoAlfajores.id.toString(16)}` }],
                })
            } catch (error: unknown) {
                // If the chain hasn't been added to MetaMask
                if (error && typeof error === 'object' && 'code' in error && error.code === 4902) {
                    try {
                        await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [
                                {
                                    chainId: `0x${celoAlfajores.id.toString(16)}`,
                                    chainName: 'Celo Alfajores',
                                    nativeCurrency: {
                                        name: 'CELO',
                                        symbol: 'CELO',
                                        decimals: 18,
                                    },
                                    rpcUrls: ['https://alfajores-forno.celo-testnet.org'],
                                    blockExplorerUrls: ['https://explorer.celo.org/alfajores'],
                                },
                            ],
                        })
                    } catch (addError) {
                        console.error('Failed to add network:', addError)
                        toast.error('Failed to add Celo Alfajores network')
                    }
                } else {
                    console.error('Failed to switch network:', error)
                    toast.error('Failed to switch to Celo Alfajores network')
                }
            }
        }

        // Check and switch network on mount
        switchToCeloAlfajores()
    }, [])

    return null
}

const config = createConfig({
    chains: [celoAlfajores],
    transports: {
        [celoAlfajores.id]: http('https://alfajores-forno.celo-testnet.org'),
    },
})

const queryClient = new QueryClient()

interface WalletProviderProps {
    children: ReactNode
}

export function WalletProvider({ children }: WalletProviderProps) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <NetworkSwitcher />
                {children}
            </QueryClientProvider>
        </WagmiProvider>
    )
}
