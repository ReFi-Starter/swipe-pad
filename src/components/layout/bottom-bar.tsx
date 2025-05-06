'use client'

import { cn } from '@/lib/styles/tailwind'
import { HandHeart, PlusCircle, User, Users } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavItem {
    path: string
    icon: typeof HandHeart | typeof Users | typeof PlusCircle | typeof User
    title: string
}

export default function BottomBar() {
    const pathname = usePathname()

    // Don't show bottom navigation on onboarding screens
    if (pathname.startsWith('/onboarding')) {
        return null
    }

    const navItems: NavItem[] = [
        {
            path: '/swipe',
            title: 'Donate',
            icon: HandHeart,
        },
        {
            path: '/social',
            title: 'Community',
            icon: Users,
        },
        {
            path: '/create',
            title: 'Create Campaign',
            icon: PlusCircle,
        },
        {
            path: '/profile',
            title: 'Profile',
            icon: User,
        },
    ]

    return (
        <nav className={'bg-background fixed right-0 bottom-0 left-0 z-30 flex h-14 items-center justify-around'}>
            {navItems.map(item => {
                const isActive = pathname === item.path
                return (
                    <Link
                        href={item.path}
                        key={item.path}
                        className={cn('flex size-12 items-center justify-center', 'transition-colors duration-200')}
                        title={item.title}>
                        <item.icon
                            size={24}
                            className={cn(
                                'transition-colors duration-200',
                                isActive ? 'text-[#22CC88]' : 'text-[#7C8591]',
                            )}
                            strokeWidth={2}
                        />
                    </Link>
                )
            })}
        </nav>
    )
}
