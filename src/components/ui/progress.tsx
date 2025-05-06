'use client'

import * as React from 'react'

import { cn } from '@/lib/styles/tailwind'

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
    value?: number
    max?: number
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
    ({ className, value = 0, max = 100, ...props }, ref) => {
        const percentage = (Math.min(Math.max(value, 0), max) / max) * 100

        return (
            <div
                ref={ref}
                role='progressbar'
                aria-valuemin={0}
                aria-valuemax={max}
                aria-valuenow={value}
                className={cn('bg-secondary relative h-2 w-full overflow-hidden rounded-full', className)}
                {...props}>
                <div
                    className='bg-primary h-full w-full flex-1 transition-all'
                    style={{ transform: `translateX(-${100 - percentage}%)` }}
                />
            </div>
        )
    },
)
Progress.displayName = 'Progress'

export { Progress }
