"use client"

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Users, PlusCircle, User, HandHeart } from 'lucide-react'
import { cn } from "@/lib/utils"

interface NavItem {
  path: string
  icon: typeof HandHeart | typeof Users | typeof PlusCircle | typeof User
  title: string
}

export function BottomNav() {
  const pathname = usePathname()
  
  // Don't show bottom navigation on onboarding screens
  if (pathname.startsWith("/onboarding")) {
    return null
  }
  
  const navItems: NavItem[] = [
    {
      path: '/home',
      title: 'Donate',
      icon: HandHeart
    },
    {
      path: '/social',
      title: 'Community',
      icon: Users
    },
    {
      path: '/create',
      title: 'Create Campaign',
      icon: PlusCircle
    },
    {
      path: '/profile',
      title: 'Profile',
      icon: User
    }
  ]
  
  return (
    <>
      {/* Gradient overlay for bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 h-24 pointer-events-none z-40" />
      
      <nav className="fixed bottom-0 left-0 right-0 z-50 h-14 flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.path
          return (
            <Link 
              href={item.path} 
              key={item.path}
              className={cn(
                "w-12 h-12 flex items-center justify-center",
                "transition-colors duration-200"
              )}
              title={item.title}
            >
              <item.icon 
                size={24}
                className={cn(
                  "transition-colors duration-200",
                  isActive ? "text-[#22CC88]" : "text-[#7C8591]"
                )}
                strokeWidth={2}
              />
            </Link>
          )
        })}
      </nav>
    </>
  )
}
