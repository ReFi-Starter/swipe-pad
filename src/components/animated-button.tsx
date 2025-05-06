'use client'

import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/styles/tailwind'
import type { VariantProps } from 'class-variance-authority'
import { motion } from 'framer-motion'
import type React from 'react'

interface AnimatedButtonProps extends React.ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
    animateOnClick?: boolean
    asChild?: boolean
}

export function AnimatedButton({ children, className, animateOnClick = true, onClick, ...props }: AnimatedButtonProps) {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (onClick) onClick(e)
    }

    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={animateOnClick ? { scale: 0.95 } : undefined}
            className='w-full'>
            <Button className={cn('relative overflow-hidden', className)} onClick={handleClick} {...props}>
                {children}
            </Button>
        </motion.div>
    )
}
