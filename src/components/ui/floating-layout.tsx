'use client'

import { cn } from '@/lib/styles/tailwind'
import { ReactNode } from 'react'

interface FloatingLayoutProps {
    children: ReactNode
    className?: string
}

export function FloatingLayout({ children, className }: FloatingLayoutProps) {
    return (
        <div
            className={cn(
                'fixed right-0 left-0',
                'top-16', // Space for header
                'z-[5]',
                'flex flex-col items-center',
                'mx-auto w-full max-w-2xl', // Center content with max width
                'px-4 py-2',
                'backdrop-blur-[2px]', // Subtle blur effect
                className,
            )}>
            {children}
        </div>
    )
}
