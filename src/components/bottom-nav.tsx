"use client"

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Pointer, Users, PlusCircle, User } from 'lucide-react'
import { motion } from 'framer-motion'

interface NavItem {
  path: string
  label: string
  icon: React.ReactNode
}

export function BottomNav() {
  const pathname = usePathname()
  
  // Don't show bottom navigation on onboarding screens
  if (pathname.startsWith("/onboarding")) {
    return null
  }
  
  // Function to determine if an item is active by comparing with current route
  const isItemActive = (itemPath: string) => {
    // Home page (/) should be active when we're on the main page or /home
    if (itemPath === '/' && (pathname === '/' || pathname === '/home')) {
      return true;
    }
    
    // For other pages, check if the route starts with the item path
    return pathname.startsWith(itemPath) && itemPath !== '/';
  }
  
  const navItems: NavItem[] = [
    {
      path: '/',
      label: 'Swipe',
      icon: <Pointer size={24} />
    },
    {
      path: '/social',
      label: 'Social',
      icon: <Users size={24} />
    },
    {
      path: '/create',
      label: 'Create',
      icon: <PlusCircle size={24} />
    },
    {
      path: '/profile',
      label: 'Profile',
      icon: <User size={24} />
    }
  ]
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex items-center justify-around px-4">
      {navItems.map((item) => {
        const active = isItemActive(item.path)
        
        return (
          <Link 
            href={item.path} 
            key={item.path}
            className="relative flex flex-col items-center justify-center w-16 h-16"
          >
            <motion.div
              className={`relative ${active ? 'text-blue-600' : 'text-gray-600'}`}
              initial={false}
              animate={active ? {
                y: [0, -8, 0],
                scale: [1, 1.2, 1],
                rotate: [0, -10, 10, 0],
              } : {
                y: 0,
                scale: 1,
                rotate: 0
              }}
              transition={active ? {
                duration: 0.6,
                times: [0, 0.2, 0.5, 1],
                ease: "easeOut",
              } : {
                duration: 0.3
              }}
              whileTap={{ 
                scale: 0.85,
                rotate: [-5, 5],
                transition: { duration: 0.2 }
              }}
            >
              {item.icon}
              {active && (
                <motion.div
                  className="absolute inset-0 bg-blue-400 rounded-full mix-blend-soft-light"
                  initial={{ opacity: 0, scale: 1 }}
                  animate={{
                    opacity: [0, 0.5, 0],
                    scale: [0.8, 1.4, 1.8],
                  }}
                  transition={{
                    duration: 0.8,
                    ease: "easeOut",
                    times: [0, 0.3, 1],
                    repeat: Infinity,
                    repeatDelay: 1
                  }}
                />
              )}
            </motion.div>
            <motion.span 
              className={`mt-1 text-xs ${active ? 'text-blue-600 font-medium' : 'text-gray-600'}`}
              animate={active ? {
                scale: [1, 1.1, 1],
                y: [0, -2, 0]
              } : {}}
              transition={active ? {
                duration: 0.4,
                delay: 0.1,
                ease: "easeOut"
              } : {}}
            >
              {item.label}
            </motion.span>
          </Link>
        )
      })}
    </nav>
  )
}
