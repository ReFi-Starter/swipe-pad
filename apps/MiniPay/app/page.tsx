// https://github.com/ReFi-Starter/swipe-pad/blob/main/apps/MiniPay/app/page.tsx
'use client';

import * as React from 'react';
import { useConnect, useAccount } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { IS_MINIPAY_ENVIRONMENT } from '../lib/constants'; // Import MiniPay check

// Assume your swiping UI component is called SwipingInterface
import { SwipingInterface } from '../components/SwipingInterface'; 
// Assume your standard wallet button is called WalletConnectButton
import { WalletConnectButton } from '../components/WalletConnectButton'; 

function MiniAppController() {
  const { isConnected, isConnecting } = useAccount();
  const { connect } = useConnect();

  React.useEffect(() => {
    // 1. Auto-connect if in MiniPay environment AND not already connecting/connected
    if (IS_MINIPAY_ENVIRONMENT && !isConnected && !isConnecting) {
      // Use the injected connector set up in wagmiConfig.ts
      connect({ connector: injected() });
    }
  }, [isConnected, isConnecting, connect]);

  // 2. Control visibility of the Connect button
  // Only show the button if NOT in MiniPay environment AND NOT connected
  const shouldShowConnectButton = !IS_MINIPAY_ENVIRONMENT && !isConnected;

  if (isConnecting) {
    return <div className="text-center p-8">Connecting to MiniPay...</div>;
  }
  
  return (
    <div>
      {/* Conditionally render the Wallet Connect Button */}
      {shouldShowConnectButton && <WalletConnectButton />}
      
      {/* Render the core app if connected */}
      {isConnected ? <SwipingInterface /> : (
        <div className="text-center p-8">
          {IS_MINIPAY_ENVIRONMENT ? "Awaiting MiniPay connection..." : "Please connect your wallet to start."}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return <MiniAppController />;
}

