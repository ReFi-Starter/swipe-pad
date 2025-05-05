'use client'

import { LogoSmall } from '@/components/ui/logo-small'
import { AvatarCircle } from '@/components/ui/avatar-circle'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface TopBarProps {
  className?: string
}

export function TopBar({ className }: TopBarProps) {
  const [address, setAddress] = useState<`0x${string}` | undefined>()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleAvatarClick = () => {
    if (address) {
      setIsMenuOpen(!isMenuOpen)
    } else {
      // TODO: Implement wallet connection
      setAddress('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045')
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
          address={address}
          onClick={handleAvatarClick}
        />
        <div className="w-2" /> {/* 8px spacing for future icons */}
        
        {/* Wallet Menu */}
        {isMenuOpen && address && (
          <div className="absolute right-4 top-14 mt-1 w-48 rounded-lg bg-white shadow-lg border border-gray-100 py-1">
            <div className="px-4 py-2 text-sm text-gray-500 truncate">
              {address}
            </div>
            <button
              onClick={() => {
                setAddress(undefined)
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