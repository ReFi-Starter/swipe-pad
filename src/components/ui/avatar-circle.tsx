'use client'

import { blo } from 'blo'
import { cn } from '@/lib/utils'

interface AvatarCircleProps {
  className?: string
  address?: `0x${string}`
  onClick?: () => void
}

export function AvatarCircle({ className, address, onClick }: AvatarCircleProps) {
  if (!address) {
    return (
      <div
        onClick={onClick}
        className={cn(
          'h-8 w-8 rounded-full border border-[#E0E0E0] bg-gray-50 flex items-center justify-center cursor-pointer',
          className
        )}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 8C9.65685 8 11 6.65685 11 5C11 3.34315 9.65685 2 8 2C6.34315 2 5 3.34315 5 5C5 6.65685 6.34315 8 8 8Z"
            fill="#A0A0A0"
          />
          <path
            d="M8 9C5.67 9 1 10.17 1 12.5V13C1 13.55 1.45 14 2 14H14C14.55 14 15 13.55 15 13V12.5C15 10.17 10.33 9 8 9Z"
            fill="#A0A0A0"
          />
        </svg>
      </div>
    )
  }

  return (
    <img
      src={blo(address)}
      alt={`Address ${address}`}
      onClick={onClick}
      className={cn(
        'h-8 w-8 rounded-full border border-[#E0E0E0] cursor-pointer',
        className
      )}
    />
  )
} 