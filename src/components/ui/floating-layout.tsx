'use client'

import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface FloatingLayoutProps {
  children: ReactNode
  className?: string
}

export function FloatingLayout({ children, className }: FloatingLayoutProps) {
  return (
    <div className={cn(
      'fixed left-0 right-0',
      'top-16', // Space for header
      'z-[5]',
      'flex flex-col items-center',
      'w-full max-w-2xl mx-auto', // Center content with max width
      'px-4 py-2',
      'backdrop-blur-[2px]', // Subtle blur effect
      className
    )}>
      {children}
    </div>
  )
} 