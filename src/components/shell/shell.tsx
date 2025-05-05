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
    <>
      {/* Top gradient overlay */}
      <div className="fixed top-0 left-0 right-0 h-24 pointer-events-none z-[9]" />
      
      <header
        className={cn(
          'fixed top-0 left-0 right-0 h-14 w-full z-10',
          className
        )}
      >
        {children}
      </header>
    </>
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
    <>
      {/* Bottom gradient overlay */}
      <div className="fixed bottom-0 left-0 right-0 h-24 pointer-events-none z-[9]" />
      
      <footer
        className={cn(
          'fixed bottom-0 left-0 right-0 h-14 w-full z-10',
          className
        )}
      >
        {children}
      </footer>
    </>
  )
} 