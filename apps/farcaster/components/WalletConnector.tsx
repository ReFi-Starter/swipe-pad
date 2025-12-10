'use client'

import { useAccount, useBalance, useConnect, useDisconnect } from 'wagmi'
import { useEffect, useState } from 'react'
import { formatEther } from 'viem'

export function WalletConnector() {
  const { address, isConnected, isConnecting } = useAccount()
  const { data: balance, isLoading: balanceLoading } = useBalance({ 
    address: address as `0x${string}`,
  })
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const [hasAttemptedConnect, setHasAttemptedConnect] = useState(false)

  useEffect(() => {
    if (!isConnected && !hasAttemptedConnect && connectors.length > 0) {
      console.log('🔌 Auto-connecting to Farcaster wallet...')
      console.log('Available connectors:', connectors.map(c => c.name))
      const farcasterConnector = connectors[0]
      if (farcasterConnector) {
        connect({ connector: farcasterConnector })
        setHasAttemptedConnect(true)
      }
    }
  }, [isConnected, hasAttemptedConnect, connect, connectors])

  if (isConnecting || isPending) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          <p className="text-gray-700">Connecting wallet...</p>
        </div>
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <div className="mb-4">
            <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Wallet Not Connected</h3>
          <p className="text-sm text-gray-600 mb-4">Connect your wallet to start supporting ReFi projects</p>
          {connectors.length > 0 && (
            <button
              onClick={() => connect({ connector: connectors[0] })}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Connect Farcaster Wallet
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg shadow-lg">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Wallet Connected</h3>
          <button onClick={() => disconnect()} className="text-sm text-red-600 hover:text-red-700 font-medium">
            Disconnect
          </button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Address</label>
            <p className="mt-1 font-mono text-sm text-gray-900 break-all">{address}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Balance</label>
            {balanceLoading ? (
              <p className="mt-1 text-sm text-gray-600">Loading...</p>
            ) : balance ? (
              <p className="mt-1 text-lg font-semibold text-gray-900">
                {parseFloat(formatEther(balance.value)).toFixed(4)} {balance.symbol}
              </p>
            ) : (
              <p className="mt-1 text-sm text-gray-600">Unable to load balance</p>
            )}
          </div>
        </div>
        <div className="pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">✓ Connected to Celo Mainnet</p>
        </div>
      </div>
    </div>
  )
}
