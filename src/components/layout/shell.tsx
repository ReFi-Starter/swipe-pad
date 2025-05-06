import { cn } from '@/lib/styles/tailwind'
import { ReactNode } from 'react'

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
                className,
            )}>
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
            <div className='pointer-events-none fixed right-0 bottom-0 left-0 z-[9] h-24' />

            <footer className={cn('fixed right-0 bottom-0 left-0 z-10 h-14 w-full', className)}>{children}</footer>
        </>
    )
}
