"use client";

import { useConnect, useAccount, useDisconnect } from 'wagmi';
import { celoAlfajores } from "wagmi/chains";
import { useEffect, useState } from "react";

/**
 * Hook for wallet connection and network management
 */
export function useWallet() {
  // State for SSR
  const [mounted, setMounted] = useState(false);
  
  // Connect related hooks
  const { connect, connectors, isPending: isConnecting } = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  // States to store client window information
  const [isMiniPay, setIsMiniPay] = useState(false);
  const [currentChainId, setCurrentChainId] = useState(0);
  
  // Update states when the component mounts
  useEffect(() => {
    setMounted(true);
    
    // Detect if MiniPay is available
    if (typeof window !== "undefined" && window.ethereum?.isMiniPay) {
      setIsMiniPay(true);
    }
    
    // Set current chain ID
    if (isConnected && typeof window !== "undefined" && window.ethereum?.networkVersion) {
      setCurrentChainId(Number(window.ethereum.networkVersion));
    }
  }, [isConnected]);

  // Celo Alfajores chain ID
  const celoAlfajoresChainId = celoAlfajores.id;
  
  // Network management
  const isOnCorrectNetwork = currentChainId === celoAlfajoresChainId;
  
  // Network name for display
  const networkName = "Celo Alfajores";

  // Connect to wallet
  const connectWallet = async () => {
    if (!mounted) return;
    
    try {
      // Find connector
      const connector = connectors.find(
        c => isMiniPay ? c.id === 'metaMask' : true
      );
      
      if (connector) {
        await connect({ connector });
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };
  
  // Disconnect wallet
  const disconnectWallet = () => {
    if (!mounted) return;
    disconnect();
  };
  
  // Switch network
  const switchNetwork = async () => {
    if (!mounted || typeof window === "undefined" || !window.ethereum) return;
    
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${celoAlfajoresChainId.toString(16)}` }],
      });
    } catch (error) {
      // Chain not added, try to add it
      interface SwitchChainError {
        code: number;
        message: string;
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
          });
        } catch (addError) {
          console.error("Failed to add network:", addError);
        }
      } else {
        console.error("Failed to switch network:", error);
      }
    }
  };

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
      switchNetwork
    };
  }

  return {
    isMiniPay,
    address,
    isConnected,
    isConnecting,
    isSwitchingNetwork: false, // Placeholder, implement if needed
    connectWallet,
    disconnect,
    disconnectWallet,
    isOnCorrectNetwork,
    currentChainId,
    networkName,
    switchNetwork
  };
} 