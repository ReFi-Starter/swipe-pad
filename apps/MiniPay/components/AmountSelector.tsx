// apps/MiniPay/components/AmountSelector.tsx
'use client';

import * as React from 'react';
import { SUPPORTED_STABLECOINS } from '../lib/constants';

export default function AmountSelector() {
  const [selectedCoin, setSelectedCoin] = React.useState(SUPPORTED_STABLECOINS[0]);
  // ... rest of your state (e.g., amount, swipe count)

  return (
    <div className="p-4">
      <h3>Select Stablecoin</h3>
      <div className="flex space-x-2">
        {/* Iterate only over the restricted list of stablecoins */}
        {SUPPORTED_STABLECOINS.map((coin) => (
          <button
            key={coin.symbol}
            onClick={() => setSelectedCoin(coin)}
            className={`px-4 py-2 rounded ${
              selectedCoin.symbol === coin.symbol ? 'bg-yellow-500' : 'bg-gray-700'
            }`}
          >
            {coin.symbol}
          </button>
        ))}
      </div>
      {/* ... rest of the UI for selecting amount and starting swipes */}
    </div>
  );
}
