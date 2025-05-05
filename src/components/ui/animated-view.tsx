"use client"

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface AnimatedViewProps {
  children: ReactNode
  className?: string
}

export function AnimatedView({ children, className = "" }: AnimatedViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      {children}
    </motion.div>
  )
} 