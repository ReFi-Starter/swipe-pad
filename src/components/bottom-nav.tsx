"use client"

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Users, User, HandHeart, CircleHelp, List } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from "@/lib/utils"
import React from "react"

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
  
  const navItems: NavItem[] = [
    {
      path: '/home',
      label: 'Swipe',
      icon: <HandHeart size={20} />
    },
    {
      path: '/list',
      label: 'List',
      icon: <List size={20} />
    },
    {
      path: '/community',
      label: 'Community',
      icon: <Users size={20} />
    },
    {
      path: '/profile',
      label: 'Profile',
      icon: <User size={20} />
    },
    {
      path: '/help',
      label: 'Help',
      icon: <CircleHelp size={20} />
    }
  ]
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around bg-white p-2 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => {
        const active = pathname === item.path
        return (
          <Link 
            href={item.path} 
            key={item.path}
            className={cn(
              "flex flex-col items-center",
              active ? "text-primary" : "text-gray-400"
            )}
          >
            <motion.div 
              whileHover={{ scale: 1.1 }} 
              whileTap={{ scale: 0.9 }}
              className="relative"
            >
              {item.icon}
              {active && (
                <motion.div
                  className="absolute -bottom-1 left-1/2 h-[4px] w-4 -translate-x-1/2 rounded-full bg-primary"
                  layoutId="underline"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.div>
            <span className="mt-1 text-[10px]">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
