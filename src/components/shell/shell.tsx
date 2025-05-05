import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ShellProps {
  children: ReactNode
  className?: string
}

export function Shell({ children, className }: ShellProps) {
  return (
    <div className={cn('relative min-h-screen w-full bg-background', className)}>
      {children}
    </div>
  )
}

interface TopBarProps {
  children: ReactNode
  className?: string
}

export function TopBar({ children, className }: TopBarProps) {
  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 h-14 w-full bg-white z-10 border-b',
        className
      )}
    >
      {children}
    </header>
  )
}

interface ContentProps {
  children: ReactNode
  className?: string
  isOnboarding?: boolean
}

export function Content({ children, className, isOnboarding = false }: ContentProps) {
  return (
    <main
      className={cn(
        'absolute size-full overflow-hidden',
        isOnboarding ? 'min-h-screen' : 'top-14 bottom-14',
        className
      )}
    >
      {children}
    </main>
  )
}

interface BottomBarProps {
  children: ReactNode
  className?: string
}

export function BottomBar({ children, className }: BottomBarProps) {
  return (
    <footer
      className={cn(
        'fixed bottom-0 left-0 right-0 h-14 w-full bg-white z-10 border-t shadow-[0_-1px_2px_rgba(0,0,0,0.1)]',
        className
      )}
    >
      {children}
    </footer>
  )
} 