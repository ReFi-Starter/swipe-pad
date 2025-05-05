import { useMotionValue, useTransform, MotionValue } from 'framer-motion'
import { useState, useEffect } from 'react'
import type { SwipeDirection, SwipeAnimationState } from '@/components/types'

interface SwipeAnimationResult {
  x: MotionValue<number>
  rotate: MotionValue<string>
  rightSwipeOpacity: MotionValue<number>
  leftSwipeOpacity: MotionValue<number>
  shineOpacity: MotionValue<number>
  animationState: SwipeAnimationState
  handleSwipeComplete: (direction: SwipeDirection) => void
  handleSuperLike: () => void
  resetAnimationState: () => void
}

// Increased rotation for more dynamic movement
const ROTATION_FACTOR = 25
// Sharper opacity transition for clearer feedback
const FEEDBACK_THRESHOLD = 60
// Exit animation distance
const EXIT_DISTANCE = 200

export function useSwipeAnimation(cardIndex: number = 0): SwipeAnimationResult {
  // Motion values
  const x = useMotionValue(0)
  
  // Improved rotation physics - more pronounced rotation that increases with swipe distance
  // Using a custom curve for more natural rotation
  const rotateRaw = useTransform(
    x, 
    [-EXIT_DISTANCE, -EXIT_DISTANCE/2, 0, EXIT_DISTANCE/2, EXIT_DISTANCE], 
    [-ROTATION_FACTOR * 1.2, -ROTATION_FACTOR/2, 0, ROTATION_FACTOR/2, ROTATION_FACTOR * 1.2],
    {
      clamp: false // Allow rotation to continue beyond thresholds
    }
  )
  
  // Enhanced visual feedback with quicker fade-in and smoother transitions
  const rightSwipeOpacity = useTransform(
    x, 
    [0, FEEDBACK_THRESHOLD/2, FEEDBACK_THRESHOLD], 
    [0, 0.3, 1]
  )
  
  const leftSwipeOpacity = useTransform(
    x, 
    [-FEEDBACK_THRESHOLD, -FEEDBACK_THRESHOLD/2, 0], 
    [1, 0.3, 0]
  )
  
  // More pronounced shine effect during swipe with smoother transitions
  const shineOpacity = useTransform(
    x, 
    [-EXIT_DISTANCE, -EXIT_DISTANCE/2, 0, EXIT_DISTANCE/2, EXIT_DISTANCE], 
    [0.9, 0.5, 0, 0.5, 0.9]
  )

  // Animation states
  const [animationState, setAnimationState] = useState<SwipeAnimationState>({
    showRightEmoji: false,
    showLeftEmoji: false,
    showSuperLikeEmoji: false
  })

  // Calculate rotation with offset for back cards
  // Add subtle variation to stacked cards' rotation
  const rotate = useTransform(() => {
    // Different offset for each card in stack for a more natural look
    let offset = 0;
    if (cardIndex > 0) {
      // Alternate the rotation direction and increase with depth
      offset = cardIndex % 2 === 0 ? -1.5 - cardIndex : 1.5 + cardIndex;
    }
    return `${rotateRaw.get() + offset}deg`
  })

  // Reset animation states after delay
  useEffect(() => {
    if (animationState.showRightEmoji || animationState.showLeftEmoji || animationState.showSuperLikeEmoji) {
      const timer = setTimeout(() => {
        resetAnimationState()
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [animationState])

  const handleSwipeComplete = (direction: SwipeDirection) => {
    // Animate the card off screen with physics
    x.set(direction === 'right' ? EXIT_DISTANCE * 1.5 : -EXIT_DISTANCE * 1.5)
    
    setAnimationState(prev => ({
      ...prev,
      showRightEmoji: direction === 'right',
      showLeftEmoji: direction === 'left'
    }))
  }

  const handleSuperLike = () => {
    setAnimationState(prev => ({
      ...prev,
      showSuperLikeEmoji: true
    }))
  }

  const resetAnimationState = () => {
    setAnimationState({
      showRightEmoji: false,
      showLeftEmoji: false,
      showSuperLikeEmoji: false
    })
  }

  return {
    x,
    rotate,
    rightSwipeOpacity,
    leftSwipeOpacity,
    shineOpacity,
    animationState,
    handleSwipeComplete,
    handleSuperLike,
    resetAnimationState
  }
} 