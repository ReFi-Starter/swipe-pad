'use client'

import { useWallet } from '@/hooks/use-wallet'
import { LogoSmall } from '@/components/ui/logo-small'
import { AvatarCircle } from '@/components/ui/avatar-circle'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'

interface TopBarProps {
  className?: string
}

export function TopBar({ className }: TopBarProps) {
  const { address, isConnected, connectWallet, disconnectWallet, isMiniPay } = useWallet()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    // Auto connect if it's MiniPay
    if (typeof window !== 'undefined' && window.ethereum?.isMiniPay) {
      connectWallet()
    }
  }, [connectWallet])

  const handleAvatarClick = () => {
    if (isConnected) {
      setIsMenuOpen(!isMenuOpen)
    } else {
      connectWallet()
    }
  }

  // Ensure address is in the correct format for AvatarCircle
  const formattedAddress = address as `0x${string}` | undefined

  return (
    <div
      className={cn(
        'h-14 flex items-center justify-between px-4 relative',
        className
      )}
    >
      <LogoSmall />
      <div className="flex items-center">
        <AvatarCircle
          address={isConnected ? formattedAddress : undefined}
          onClick={handleAvatarClick}
          isMiniPay={isMiniPay}
        />
        <div className="w-2" /> {/* 8px spacing for future icons */}
        
        {/* Wallet Menu */}
        {isMenuOpen && isConnected && address && (
          <div className="absolute right-4 top-14 mt-1 w-48 rounded-lg shadow-lg border border-gray-100 py-1">
            <div className="px-4 py-2 text-sm text-gray-500 truncate">
              {address}
            </div>
            <button
              onClick={() => {
                disconnectWallet();
                setIsMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Disconnect
            </button>
          </div>
        )}
      </div>
    </div>
  )
} 