'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ContentViewProps {
  children: React.ReactNode
  className?: string
}

export function ContentView({ children, className }: ContentViewProps) {

  return (
    <div className={cn('relative size-full', className)}>    
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{
            duration: 0.2,
            ease: 'easeInOut',
          }}
          className="size-full bg-gradient-to-br from-purple-50 via-blue-50 to-red-50"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  )
} 