'use client'

import { blo } from 'blo'
import { cn } from '@/lib/styles/tailwind'
import Image from 'next/image'

interface AvatarCircleProps {
    className?: string
    address?: `0x${string}`
    onClick?: () => void
    isMiniPay?: boolean
}

export function AvatarCircle({ className, address, onClick, isMiniPay }: AvatarCircleProps) {
    if (!address) {
        return (
            <div
                onClick={onClick}
                className={cn(
                    'flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[#E0E0E0] bg-gray-50 transition-colors hover:bg-gray-100',
                    isMiniPay ? 'bg-gray-50' : 'border-blue-200 bg-blue-50',
                    className,
                )}>
                {isMiniPay ? (
                    <svg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
                        <path
                            d='M8 8C9.65685 8 11 6.65685 11 5C11 3.34315 9.65685 2 8 2C6.34315 2 5 3.34315 5 5C5 6.65685 6.34315 8 8 8Z'
                            fill='#A0A0A0'
                        />
                        <path
                            d='M8 9C5.67 9 1 10.17 1 12.5V13C1 13.55 1.45 14 2 14H14C14.55 14 15 13.55 15 13V12.5C15 10.17 10.33 9 8 9Z'
                            fill='#A0A0A0'
                        />
                    </svg>
                ) : (
                    <svg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
                        <path
                            d='M14 4H12V3C12 2.45 11.55 2 11 2H2C1.45 2 1 2.45 1 3V11C1 11.55 1.45 12 2 12H4V13C4 13.55 4.45 14 5 14H14C14.55 14 15 13.55 15 13V5C15 4.45 14.55 4 14 4ZM2 11V3H11V11H2ZM14 13H5V12H11C11.55 12 12 11.55 12 11V4H14V13Z'
                            fill='#2563EB'
                        />
                        <path
                            d='M6.5 4.75C5.675 4.75 5 5.425 5 6.25C5 7.075 5.675 7.75 6.5 7.75C7.325 7.75 8 7.075 8 6.25C8 5.425 7.325 4.75 6.5 4.75Z'
                            fill='#2563EB'
                        />
                        <path
                            d='M3.5 9.5H9.5V8.5C9.5 7.675 7.825 7.25 6.5 7.25C5.175 7.25 3.5 7.675 3.5 8.5V9.5Z'
                            fill='#2563EB'
                        />
                    </svg>
                )}
            </div>
        )
    }

    return (
        <Image
            src={blo(address)}
            alt={`Address ${address}`}
            onClick={onClick}
            width={32}
            height={32}
            className={cn('h-8 w-8 cursor-pointer rounded-full border border-[#E0E0E0]', className)}
        />
    )
}
