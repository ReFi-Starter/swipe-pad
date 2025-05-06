'use client'

import { useConnect, useAccount, useDisconnect } from 'wagmi'
import { celoAlfajores } from 'wagmi/chains'
import { useEffect, useState } from 'react'
import { injected } from 'wagmi/connectors'
import { createWalletClient, custom } from 'viem'
import { toast } from 'sonner'

/**
 * Hook for wallet connection and network management
 */
export function useWallet() {
    // State for SSR
    const [mounted, setMounted] = useState(false)

    // Connect related hooks
    const { connect, connectors } = useConnect()
    const { address: wagmiAddress, isConnected } = useAccount()
    const { disconnect } = useDisconnect()

    // States to store client window information
    const [isMiniPay, setIsMiniPay] = useState(false)
    const [miniPayAddress, setMiniPayAddress] = useState<string | null>(null)
    const [currentChainId, setCurrentChainId] = useState(0)

    // Get the effective address (either from MiniPay or wagmi)
    const address = miniPayAddress || wagmiAddress

    // Initial MiniPay detection and address fetch
    useEffect(() => {
        const initMiniPay = async () => {
            if (typeof window !== 'undefined' && window.ethereum?.isMiniPay) {
                setIsMiniPay(true)

                try {
                    // Create a viem wallet client for direct interaction
                    const walletClient = createWalletClient({
                        chain: celoAlfajores,
                        transport: custom(window.ethereum),
                    })

                    // Get address directly from MiniPay
                    const [address] = await walletClient.getAddresses()
                    setMiniPayAddress(address)

                    // Also connect through wagmi for other functionality
                    await connect({
                        connector: injected({
                            target: 'metaMask',
                        }),
                    })
                } catch (error) {
                    console.error('Failed to initialize MiniPay:', error)
                }
            }
        }

        if (!isConnected && mounted) {
            initMiniPay()
        }
    }, [mounted, isConnected, connect])

    // Handle mounting and chain ID
    useEffect(() => {
        setMounted(true)

        // Set current chain ID and listen for changes
        if (typeof window !== 'undefined' && window.ethereum) {
            // Set initial chain ID
            if (window.ethereum.networkVersion) {
                setCurrentChainId(Number(window.ethereum.networkVersion))
            }

            // Listen for chain changes
            const handleChainChanged = (chainId: string) => {
                const newChainId = Number(chainId)
                setCurrentChainId(newChainId)
                if (newChainId !== celoAlfajores.id) {
                    toast.warning('Please switch to Celo Alfajores network')
                }
            }

            window.ethereum.on('chainChanged', handleChainChanged)

            return () => {
                window.ethereum.removeListener('chainChanged', handleChainChanged)
            }
        }
    }, [])

    // Celo Alfajores chain ID
    const celoAlfajoresChainId = celoAlfajores.id

    // Network management
    const isOnCorrectNetwork = currentChainId === celoAlfajoresChainId

    // Network name for display
    const networkName = 'Celo Alfajores'

    // Connect to wallet
    const connectWallet = async () => {
        if (!mounted) return

        try {
            if (isMiniPay) {
                // Create a viem wallet client for direct interaction
                const walletClient = createWalletClient({
                    chain: celoAlfajores,
                    transport: custom(window.ethereum),
                })

                // Get address directly from MiniPay
                const [address] = await walletClient.getAddresses()
                setMiniPayAddress(address)

                // Also connect through wagmi
                await connect({
                    connector: injected({
                        target: 'metaMask',
                    }),
                })
            } else {
                // For non-MiniPay, use the first available connector
                const connector = connectors[0]
                if (connector) {
                    await connect({ connector })
                }
            }
        } catch (error) {
            console.error('Failed to connect wallet:', error)
        }
    }

    // Disconnect wallet
    const disconnectWallet = () => {
        if (!mounted) return
        setMiniPayAddress(null)
        disconnect()
    }

    // Switch network
    const switchNetwork = async () => {
        if (!mounted || typeof window === 'undefined' || !window.ethereum) return

        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: `0x${celoAlfajoresChainId.toString(16)}` }],
            })
            toast.success(`Successfully switched to ${networkName}`)
        } catch (error) {
            // Chain not added, try to add it
            interface SwitchChainError {
                code: number
                message: string
            }

            if ((error as SwitchChainError).code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [
                            {
                                chainId: `0x${celoAlfajoresChainId.toString(16)}`,
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
                    toast.success('Successfully added and switched to Celo Alfajores network')
                } catch (addError) {
                    console.error('Failed to add network:', addError)
                    toast.error('Failed to add Celo Alfajores network. Please try again.')
                }
            } else {
                console.error('Failed to switch network:', error)
                toast.error('Failed to switch network. Please try again.')
            }
        }
    }

    // If not mounted, return a default state for SSR
    if (!mounted) {
        return {
            isMiniPay: false,
            address: undefined,
            isConnected: false,
            isConnecting: false,
            isSwitchingNetwork: false,
            connectWallet,
            disconnect,
            disconnectWallet,
            isOnCorrectNetwork: false,
            currentChainId: 0,
            networkName,
            switchNetwork,
        }
    }

    return {
        isMiniPay,
        address,
        isConnected: Boolean(address),
        isConnecting: false,
        isSwitchingNetwork: false,
        connectWallet,
        disconnect,
        disconnectWallet,
        isOnCorrectNetwork,
        currentChainId,
        networkName,
        switchNetwork,
    }
}
