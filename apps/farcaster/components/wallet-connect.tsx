"use client";

import { sdk } from "@farcaster/miniapp-sdk";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

export function WalletConnect() {
  const { isConnected } = useAccount();
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

  // If in MiniApp, we rely on the MiniApp connector (which should auto-connect).
  // We hide the RainbowKit button to avoid confusion.
  if (isMiniApp) {
      return null;
  }

  // Web environment: Show RainbowKit ConnectButton
  return (
    <div className="flex justify-center p-4">
      <ConnectButton />
    </div>
  );
}
