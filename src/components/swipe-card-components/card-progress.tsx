import { formatCurrency } from '@/features/currencies/formatter'
import { CardProgressProps } from '@/types/card'
import { useState } from 'react'

export function CardProgress({ current, target }: CardProgressProps) {
    const progress = Math.min(Math.max((current / target) * 100, 0), 100) // Clamp progress 0-100

    // Currency toggle state
    const [showUSD, setShowUSD] = useState(false)

    // Toggle currency display when amounts are clicked
    const handleCurrencyToggle = (e: React.MouseEvent) => {
        e.preventDefault() // Prevent default behavior
        e.stopPropagation() // Prevent event bubbling
        setShowUSD(prev => !prev) // Toggle currency display
    }

    // Format amount based on current currency setting
    const formatAmount = (amount: number) => {
        if (showUSD) {
            return `$${amount.toFixed(2)} USD` // USD format with indicator
        } else {
            return formatCurrency(amount) // Local currency format (e.g., ¢)
        }
    }

    // Determine color based on progress
    let progressColorClass = 'bg-primary' // Default color (e.g., blue or brand color)
    if (progress < 33) {
        progressColorClass = 'bg-red-500' // Low progress
    } else if (progress < 66) {
        progressColorClass = 'bg-yellow-500' // Medium progress
    } else {
        progressColorClass = 'bg-green-500' // High progress / Goal reached
    }

    return (
        // Removed outer px-4 py-3 as it's now handled in CardSwipeView
        <>
            <div className='mb-1 flex items-center justify-between font-mono text-sm'>
                <span
                    className='text-foreground hover:text-foreground/80 hover:bg-muted cursor-pointer rounded px-1 font-medium transition-colors'
                    onClick={handleCurrencyToggle}>
                    {formatAmount(current)}
                </span>
                <span
                    className='text-muted-foreground/80 hover:text-muted-foreground hover:bg-muted cursor-pointer rounded px-1 transition-colors'
                    onClick={handleCurrencyToggle}>
                    Goal: {formatAmount(target)}
                </span>
            </div>
            <div className='bg-muted relative h-1 overflow-hidden rounded-full'>
                <div
                    className={`absolute top-0 left-0 h-full ${progressColorClass} rounded-full transition-all duration-500 ease-out`}
                    style={{ width: `${progress}%` }}
                />
            </div>
        </>
    )
}
