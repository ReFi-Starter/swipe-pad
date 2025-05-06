'use client'

import Link from 'next/link'
// import { ConnectButton } from "@/components/connect-button";
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/styles/tailwind'
// import { useWallet } from "@/hooks/useWallet";

export function Navbar() {
    const pathname = usePathname()
    // const { isMiniPay } = useWallet();

    // Don't show on onboarding screens
    if (pathname.startsWith('/onboarding')) {
        return null
    }

    const navItems = [
        { name: 'Home', href: '/' },
        { name: 'Create Project', href: '/create' },
        { name: 'My Projects', href: '/my-projects' },
        { name: 'My Donations', href: '/my-donations' },
    ]

    return (
        <header className='border-b border-gray-200 bg-white'>
            <div className='container flex h-16 items-center justify-between'>
                <div className='flex items-center px-4'>
                    <Link href='/' className='text-2xl font-bold text-blue-600'>
                        SwipePad
                    </Link>

                    <nav className='ml-8 hidden space-x-6 md:flex'>
                        {navItems.map(item => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'text-gray-600 transition-colors hover:text-gray-900',
                                    pathname === item.href && 'font-medium text-blue-600',
                                )}>
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>
                {/* {!isMiniPay && (
          <div className="flex items-center space-x-4 px-4">
            <ConnectButton />
          </div>
        )} */}
            </div>
        </header>
    )
}
