import { formatCurrency } from '@/lib/utils'
import type { CardProgressProps } from '@/components/types'

export function CardProgress({ current, target }: CardProgressProps) {
  const progress = (current / target) * 100

  return (
    <div className="px-4 py-3">
      <div className="flex items-center justify-between text-sm mb-2">
        <span className="font-medium">
          {formatCurrency(current)}
        </span>
        <span className="text-muted-foreground">
          of {formatCurrency(target)}
        </span>
      </div>
      <div className="relative h-1 bg-muted rounded-full overflow-hidden">
        <div 
          className="absolute left-0 top-0 h-full bg-primary rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
} 