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
      'top-16', // Espacio para el header
      'z-[5]',
      'flex flex-col items-center gap-3',
      'px-4 py-2',
      className
    )}>
      {children}
    </div>
  )
} 