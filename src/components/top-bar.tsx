'use client'

import { useWallet } from '@/hooks/useWallet'
import { LogoSmall } from '@/components/ui/logo-small'
import { AvatarCircle } from '@/components/ui/avatar-circle'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'

interface TopBarProps {
  className?: string
}

export function TopBar({ className }: TopBarProps) {
  const { address, isConnected, connectWallet } = useWallet()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMiniPay, setIsMiniPay] = useState(false)

  useEffect(() => {
    // Check if MiniPay is available
    if (typeof window !== 'undefined' && window.ethereum?.isMiniPay) {
      setIsMiniPay(true)
      // Auto connect if it's MiniPay
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
          address={isConnected ? address : undefined}
          onClick={handleAvatarClick}
          isMiniPay={isMiniPay}
        />
        <div className="w-2" /> {/* 8px spacing for future icons */}
        
        {/* Wallet Menu */}
        {isMenuOpen && isConnected && address && (
          <div className="absolute right-4 top-14 mt-1 w-48 rounded-lg bg-white shadow-lg border border-gray-100 py-1">
            <div className="px-4 py-2 text-sm text-gray-500 truncate">
              {address}
            </div>
            <button
              onClick={() => {
                setIsMenuOpen(false)
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