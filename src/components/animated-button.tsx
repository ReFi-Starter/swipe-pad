"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { ButtonProps } from "@/components/ui/button"

interface AnimatedButtonProps extends ButtonProps {
  animateOnClick?: boolean
}

export function AnimatedButton({ children, className, animateOnClick = true, onClick, ...props }: AnimatedButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) onClick(e)
  }

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={animateOnClick ? { scale: 0.95 } : undefined} className="w-full">
      <Button className={cn("relative overflow-hidden", className)} onClick={handleClick} {...props}>
        {children}
      </Button>
    </motion.div>
  )
}
