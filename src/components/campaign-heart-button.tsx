'use client'

import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/features/currencies/formatter'
import { Heart } from 'lucide-react'

interface ProjectHeartButtonProps {
    onClick?: () => void
    amount: number
    currency: string
}

export function ProjectHeartButton({ onClick, amount, currency }: ProjectHeartButtonProps) {
    return (
        <Button
            variant='outline'
            size='icon'
            className='h-10 w-10 rounded-full border-0 bg-white/90 text-[#22CC88] shadow-md hover:bg-white/95 hover:text-[#1eb77a]'
            onClick={onClick}
            title={`Donate ${formatCurrency(amount, currency)}`}>
            <Heart className='h-5 w-5' />
        </Button>
    )
}
