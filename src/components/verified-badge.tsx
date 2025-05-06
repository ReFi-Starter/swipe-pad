'use client'

import { cn } from '@/lib/styles/tailwind'
import { BadgeCheck } from 'lucide-react'

interface VerifiedBadgeProps {
    isVerified: boolean
    size?: 'sm' | 'md' | 'lg'
}

export function VerifiedBadge({ isVerified, size = 'md' }: VerifiedBadgeProps) {
    if (!isVerified) return null

    const sizeClasses = {
        sm: 'h-3 w-3',
        md: 'h-4 w-4',
        lg: 'h-5 w-5',
    }

    return <BadgeCheck className={cn('inline-block text-blue-500', sizeClasses[size])} />
}
