"use client";

import { sdk } from "@farcaster/miniapp-sdk";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useEffect, useState } from 'react';
import { useAccount, useConnect } from 'wagmi';

export function WalletConnect() {
  const { isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const [isMiniApp, setIsMiniApp] = useState(false);

  useEffect(() => {
    // Check if running in Farcaster MiniApp
    sdk.context.then((context) => {
        if (context && context.user) {
            setIsMiniApp(true);
        }
    }).catch(() => {
        // Not in MiniApp or error
    });
  }, []);

  if (isConnected) return null;

  // If in MiniApp, show a specific connect button if not connected
  if (isMiniApp) {
      return (
        <div className="flex justify-center p-4">
          <button
            onClick={() => {
              const miniAppConnector = connectors.find(c => c.id === 'farcaster-miniapp' || c.name === 'Farcaster MiniApp');
              if (miniAppConnector) {
                connect({ connector: miniAppConnector });
              } else {
                // Fallback to first available or show error
                console.error("MiniApp connector not found");
              }
            }}
            className="bg-[#7C65C1] text-white px-6 py-2 rounded-full font-bold hover:bg-[#6952A3] transition-colors flex items-center gap-2"
          >
            <span>⚡ Connect Wallet</span>
          </button>
        </div>
      );
  }

  // Web environment: Show RainbowKit ConnectButton
  return (
    <div className="flex justify-center p-4">
      <ConnectButton />
    </div>
  );
}
