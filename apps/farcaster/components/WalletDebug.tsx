'use client';
import { useAccount } from 'wagmi';

export function WalletDebug() {
  const { address, isConnected, status } = useAccount();
  
  if (process.env.NODE_ENV === 'production') return null;

  return (
    <div className="fixed top-0 right-0 bg-black/80 text-white p-2 text-xs z-50 pointer-events-none">
      <p>Status: {status}</p>
      <p>Connected: {isConnected ? 'Yes' : 'No'}</p>
      <p>Address: {address?.slice(0, 6)}...{address?.slice(-4)}</p>
    </div>
  );
}
