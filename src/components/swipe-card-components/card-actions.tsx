import { Button } from '@/components/ui/button'
import { ThumbsDown, ThumbsUp, Sparkles } from 'lucide-react'
import type { CardActionsProps } from '@/components/types'

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
  if (!isFront || !active) return null

  return (
    <div className="absolute top-98 left-0 right-0 flex items-center justify-center gap-4 z-[40] px-4">
      <Button
        variant="outline"
        size="icon"
        className="h-14 w-14 rounded-full bg-white/95 backdrop-blur-sm border-2 border-red-400 text-red-500 shadow-lg hover:bg-red-50 hover:scale-110 transition-all duration-200"
        onClick={onSwipeLeft}
      >
        <ThumbsDown className="h-6 w-6" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        className="h-14 w-14 rounded-full bg-white/95 backdrop-blur-sm border-2 border-blue-400 text-blue-500 shadow-lg hover:bg-blue-50 hover:scale-110 transition-all duration-200"
        onClick={() => {
          if (questTokens > 0) {
            onSuperLike()
          }
        }}
        disabled={questTokens <= 0}
        title={questTokens > 0 ? `Super Like (10x donation amount)` : `No Super Likes available`}
      >
        <Sparkles className="h-6 w-6" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        className="h-14 w-14 rounded-full bg-white/95 backdrop-blur-sm border-2 border-purple-400 text-purple-500 shadow-lg hover:bg-purple-50 hover:scale-110 transition-all duration-200"
        onClick={() => {
          if (userReputation > topUserThreshold && availableBoosts > 0) {
            onBoost()
          }
        }}
        disabled={!(userReputation > topUserThreshold && availableBoosts > 0)}
        title={
          userReputation > topUserThreshold 
            ? availableBoosts > 0 
              ? `Boost this project (${availableBoosts} left this week)` 
              : `No boosts left this week`
            : `Need to be in top 0.1% users to boost`
        }
      >
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          className="h-6 w-6"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M12 4L14.5 9.5L20 10.5L16 14.5L17 20L12 17.5L7 20L8 14.5L4 10.5L9.5 9.5L12 4Z" 
            fill="currentColor" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        className="h-14 w-14 rounded-full bg-white/95 backdrop-blur-sm border-2 border-green-400 text-green-500 shadow-lg hover:bg-green-50 hover:scale-110 transition-all duration-200"
        onClick={onSwipeRight}
      >
        <ThumbsUp className="h-6 w-6" />
      </Button>
    </div>
  )
} 