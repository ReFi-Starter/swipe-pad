'use client'
import { useAccount, useBalance, useConnect, useDisconnect } from 'wagmi'
import { useEffect, useState } from 'react'
import { formatEther } from 'viem'
export function WalletConnector() {
  const { address, isConnected, isConnecting } = useAccount()
  const { data: balance } = useBalance({ address: address as `0x${string}` })
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const [attempted, setAttempted] = useState(false)
  useEffect(() => {
    if (!isConnected && !attempted && connectors[0]) {
      connect({ connector: connectors[0] })
      setAttempted(true)
    }
  }, [isConnected, attempted, connect, connectors])
  if (isConnecting || isPending) return <div className="p-6 bg-white rounded-lg shadow-lg"><div className="flex items-center space-x-3"><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div><p>Connecting...</p></div></div>
  if (!isConnected) return <div className="p-6 bg-white rounded-lg shadow-lg text-center"><h3 className="text-lg font-semibold mb-2">Wallet Not Connected</h3><button onClick={() => connect({ connector: connectors[0] })} className="py-3 px-4 bg-blue-600 text-white rounded-lg">Connect</button></div>
  return <div className="p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg shadow-lg"><div className="space-y-4"><div className="flex justify-between"><h3 className="font-semibold">Connected</h3><button onClick={() => disconnect()} className="text-sm text-red-600">Disconnect</button></div><div><label className="text-xs text-gray-500">Address</label><p className="font-mono text-sm">{address}</p></div>{balance && <div><label className="text-xs text-gray-500">Balance</label><p className="text-lg font-semibold">{parseFloat(formatEther(balance.value)).toFixed(4)} {balance.symbol}</p></div>}</div></div>
}
