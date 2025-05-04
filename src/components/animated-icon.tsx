"use client"

import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"

interface AnimatedIconProps {
  icon: LucideIcon
  isActive?: boolean
  onClick?: () => void
  className?: string
  size?: number
  activeColor?: string
  inactiveColor?: string
}

export function AnimatedIcon({
  icon: Icon,
  isActive = false,
  onClick,
  className = "",
  size = 24,
  activeColor = "#22CC88",
  inactiveColor = "#94A3B8",
}: AnimatedIconProps) {
  return (
    <motion.div
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.1 }}
      onClick={onClick}
      className={`cursor-pointer ${className}`}
    >
      <motion.div animate={isActive ? { scale: [1, 1.2, 1] } : {}} transition={{ duration: 0.3 }}>
        <Icon size={size} color={isActive ? activeColor : inactiveColor} className="transition-colors duration-300" />
      </motion.div>
    </motion.div>
  )
}
