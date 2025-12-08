"use client"

import { useProfile } from "@farcaster/auth-kit"
import { useEffect, useState } from "react"
import { useAccount, useConnect } from "wagmi"

interface WalletConnectProps {
  onConnect: () => void
}

export function WalletConnect({ onConnect }: WalletConnectProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const { profile } = useProfile()
  const { connect, connectors } = useConnect()
  const { isConnected } = useAccount()

  // Auto-proceed if already connected
  useEffect(() => {
    if (isConnected) {
        onConnect()
    }
  }, [isConnected, onConnect])

  const handleConnect = async () => {
    setIsConnecting(true)
    console.log("Available connectors:", connectors.map(c => c.name));
    
    // Prefer Farcaster Wallet, otherwise fallback to first available (Injected)
    const fcConnector = connectors.find(c => c.name === "Farcaster Wallet");
    const targetConnector = fcConnector || connectors[0];

    if (!isConnected && targetConnector) {
        try {
            console.log("Connecting to:", targetConnector.name);
            connect({ connector: targetConnector })
            // We don't call onConnect here immediately; useEffect will handle it when isConnected becomes true
        } catch (e) {
            console.error("Connection failed:", e)
            setIsConnecting(false)
        }
    } else {
        // Fallback simulation if no connectors or already connected (should be handled by useEffect)
        setTimeout(() => {
            setIsConnecting(false)
            onConnect()
        }, 1500)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 h-full">
      {/* Top Navigation Bar - WITHOUT SwipePad text to avoid duplication */}
      <div className="flex items-center justify-between w-full mb-8 px-2">
        {/* Profile Picture Removed */}
        <div className="w-12 h-12"></div>

        {/* Empty space where SwipePad text was */}
        <div className="flex-1"></div>

        <div className="flex space-x-2">
          <button className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-700">
            <TrendingIcon />
          </button>
          <button className="flex items-center justify-center w-12 h-12 rounded-full bg-[#677FEB]">
            <CartIcon />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="mb-8 flex justify-center w-full">
          <h1 className="text-4xl font-bold text-center" style={{ fontFamily: "Pixelify Sans, monospace" }}>
            SwipePad
          </h1>
        </div>

        <h2 className="text-2xl font-bold mb-2 text-center">Welcome to SwipePad!</h2>
        <p className="text-gray-300 text-center mb-8 max-w-sm">
          Support vetted projects with micro-donations through simple swipes on the Celo Network.
        </p>

        <div className="w-full max-w-sm space-y-4">
          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className="w-full bg-[#FFD600] hover:bg-[#E6C200] text-black font-bold py-4 px-6 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isConnecting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                Connecting...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm2 2a1 1 0 000 2h.01a1 1 0 100-2H5zm3 0a1 1 0 000 2h3a1 1 0 100-2H8z"
                    clipRule="evenodd"
                  />
                </svg>
                Enter MiniApp
              </>
            )}
          </button>

          <div className="text-center">
            <p className="text-xs text-gray-400 max-w-xs mx-auto">
              By connecting, you agree to our Terms of Service and Privacy Policy. Your funds remain secure in your
              wallet at all times.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function CartIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  )
}

function TrendingIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  )
}
