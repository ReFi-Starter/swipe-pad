"use client"

import Link from "next/link"
import { Home, User, Plus, Users } from "lucide-react"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { AnimatedIcon } from "@/components/animated-icon"

export function BottomNav() {
  const pathname = usePathname()

  // Don't show on onboarding screens
  if (pathname.startsWith("/onboarding")) {
    return null
  }

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        delay: 0.2
      }}
      className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex justify-around items-center w-full z-50 shadow-lg"
      style={{ willChange: "transform" }}
    >
      <Link href="/home" className="flex flex-col items-center">
        <AnimatedIcon icon={Home} isActive={pathname.startsWith("/home")} activeColor="#22CC88" />
        <span className={`text-xs mt-1 ${pathname.startsWith("/home") ? "text-[#22CC88]" : "text-slate-500"}`}>
          Home
        </span>
      </Link>

      <Link href="/social" className="flex flex-col items-center">
        <AnimatedIcon icon={Users} isActive={pathname.startsWith("/social")} activeColor="#22CC88" />
        <span className={`text-xs mt-1 ${pathname.startsWith("/social") ? "text-[#22CC88]" : "text-slate-500"}`}>
          Social
        </span>
      </Link>

      <Link href="/create" className="flex flex-col items-center">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          className={`flex items-center justify-center w-12 h-12 rounded-full ${
            pathname === "/create" ? "bg-[#22CC88]" : "bg-slate-100"
          }`}
        >
          <Plus className={`h-6 w-6 ${pathname === "/create" ? "text-white" : "text-slate-500"}`} />
        </motion.div>
      </Link>

      <Link href="/profile" className="flex flex-col items-center">
        <AnimatedIcon icon={User} isActive={pathname.startsWith("/profile")} activeColor="#22CC88" />
        <span className={`text-xs mt-1 ${pathname.startsWith("/profile") ? "text-[#22CC88]" : "text-slate-500"}`}>
          Profile
        </span>
      </Link>
    </motion.div>
  )
}
