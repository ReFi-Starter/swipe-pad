import { Button } from '@/components/ui/button'
import { cn } from '@/lib/styles/tailwind'
import type { CardActionsProps } from '@/types/card'
import { Flame, Heart, RotateCcw, Star, X } from 'lucide-react'

interface ActionButtonProps {
    icon: typeof RotateCcw | typeof X | typeof Star | typeof Heart | typeof Flame
    size?: 'small' | 'large'
    onClick: () => void
    disabled?: boolean
    title?: string
    variant?: 'undo' | 'nope' | 'star' | 'like' | 'boost'
    className?: string
    strokeWidth?: number
}

const ActionButton = ({
    icon: Icon,
    size = 'small',
    onClick,
    disabled = false,
    title,
    variant = 'like',
    className,
    strokeWidth = 2.5,
}: ActionButtonProps) => {
    const buttonSizes = {
        small: 'h-12 w-12',
        large: 'h-16 w-16',
    }

    const colors = {
        undo: 'text-amber-500 hover:bg-amber-50',
        nope: 'text-pink-500 hover:bg-pink-50',
        star: 'text-blue-500 hover:bg-blue-50',
        like: 'text-green-500 hover:bg-green-50',
        boost: 'text-purple-500 hover:bg-purple-50',
    }

    const iconSizes = {
        small: '[&>svg]:!w-5 [&>svg]:!h-5',
        large: '[&>svg]:!w-8 [&>svg]:!h-8',
    }

    return (
        <Button
            onClick={onClick}
            disabled={disabled}
            title={title}
            variant='outline'
            size='icon'
            className={cn(
                'rounded-full transition-all duration-200',
                'hover:scale-110 active:scale-95',
                'border-2 shadow-lg',
                'bg-white hover:bg-white',
                'flex items-center justify-center',
                buttonSizes[size],
                colors[variant],
                iconSizes[size],
                disabled && 'cursor-not-allowed opacity-50 hover:scale-100 hover:bg-white',
                className,
            )}>
            <Icon
                strokeWidth={strokeWidth}
                className='transition-transform duration-200'
                fill={variant === 'undo' ? 'none' : 'currentColor'}
            />
        </Button>
    )
}

export function CardActions({
    onSwipeLeft,
    onSwipeRight,
    onSuperLike,
    onBoost,
    questTokens,
    userReputation,
    topUserThreshold,
    availableBoosts,
    isFront,
    active,
}: CardActionsProps) {
    if (!isFront || !active) return null

    return (
        <div className='absolute inset-x-0 bottom-5 z-40'>
            <div className='relative mx-auto w-full max-w-md px-4'>
                {/* Action buttons container */}
                <div className='flex items-center justify-center gap-3'>
                    <ActionButton
                        icon={RotateCcw}
                        onClick={() => {}}
                        size='small'
                        title='Undo last action'
                        variant='undo'
                        strokeWidth={3}
                    />
                    <ActionButton
                        icon={X}
                        onClick={onSwipeLeft}
                        size='large'
                        title='Pass'
                        variant='nope'
                        strokeWidth={3.5}
                    />
                    <ActionButton
                        icon={Star}
                        onClick={() => {
                            if (questTokens > 0) {
                                onSuperLike()
                            }
                        }}
                        disabled={questTokens <= 0}
                        size='small'
                        title={
                            questTokens > 0 ? `Super-Donate (10x donation amount)` : `No Super-Donate tokens available`
                        }
                        variant='star'
                    />
                    <ActionButton icon={Heart} onClick={onSwipeRight} size='large' title='Donate' variant='like' />
                    <ActionButton
                        icon={Flame}
                        onClick={() => {
                            if (userReputation > topUserThreshold && availableBoosts > 0) {
                                onBoost()
                            }
                        }}
                        disabled={!(userReputation > topUserThreshold && availableBoosts > 0)}
                        size='small'
                        title={
                            userReputation > topUserThreshold
                                ? availableBoosts > 0
                                    ? `Boost this project (${availableBoosts} left)`
                                    : `No boosts left`
                                : `Need to be in top 0.1% users to boost`
                        }
                        variant='boost'
                    />
                </div>
            </div>
        </div>
    )
}
