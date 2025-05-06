import { cn } from '@/lib/utils'
import { RotateCcw, X, Star, Heart, Flame } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { CardActionsProps } from '@/components/types'

interface ActionButtonProps {
  icon: typeof RotateCcw | typeof X | typeof Star | typeof Heart | typeof Flame;
  size?: 'small' | 'large';
  onClick: () => void;
  disabled?: boolean;
  title?: string;
  variant?: 'undo' | 'nope' | 'star' | 'like' | 'boost';
  className?: string;
  strokeWidth?: number;
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
    large: 'h-14 w-14',
  };

  const colors = {
    undo: 'text-amber-500',
    nope: 'text-pink-500',
    star: 'text-blue-500',
    like: 'text-green-500',
    boost: 'text-purple-500',
  };

  const iconSizes = {
    small: '[&>svg]:!w-5 [&>svg]:!h-5',  // 24px
    large: '[&>svg]:!w-8 [&>svg]:!h-8', // 96px - ajustado para el botón grande
  };

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      title={title}
      variant="outline"
      size="icon"
      className={cn(
        'rounded-full transition-all duration-200',
        'hover:scale-110 active:scale-95',
        'shadow-lg border-gray-100',
        'bg-white hover:bg-white',
        'flex items-center justify-center',
        buttonSizes[size],
        colors[variant],
        iconSizes[size],
        disabled && 'opacity-50 cursor-not-allowed hover:scale-100 hover:bg-white',
        className
      )}
    >
      <Icon 
        strokeWidth={strokeWidth}
        fill={variant === 'undo' ? 'none' : 'currentColor'}
      />
    </Button>
  );
};

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
  active
}: CardActionsProps) {
  if (!isFront || !active) return null;

  return (
    <div className="absolute inset-x-0 -bottom-8 z-30">
      <div className="relative w-full">
        {/* Semi-transparent gradient overlay to ensure button visibility */}
        {/* <div className="absolute inset-x-0 bottom-0 h-32 pointer-events-none" /> */}
        
        {/* Action buttons container */}
        <div className="relative flex items-center justify-center">
          <div className="flex items-center gap-2.5">
            <ActionButton
              icon={RotateCcw}
              onClick={() => {}}
              size="small"
              title="Undo last action"
              variant="undo"
              strokeWidth={3}
            />
            <ActionButton
              icon={X}
              onClick={onSwipeLeft}
              size="large"
              title="Pass"
              variant="nope"
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
              size="small"
              title={questTokens > 0 ? `Super-Donate (10x donation amount)` : `No Super-Donate tokens available`}
              variant="star"
            />
            <ActionButton
              icon={Heart}
              onClick={onSwipeRight}
              size="large"
              title="Donate"
              variant="like"
            />
            <ActionButton
              icon={Flame}
              onClick={() => {
                if (userReputation > topUserThreshold && availableBoosts > 0) {
                  onBoost()
                }
              }}
              disabled={!(userReputation > topUserThreshold && availableBoosts > 0)}
              size="small"
              title={
                userReputation > topUserThreshold 
                  ? availableBoosts > 0 
                    ? `Boost this project (${availableBoosts} left)` 
                    : `No boosts left`
                  : `Need to be in top 0.1% users to boost`
              }
              variant="boost"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 