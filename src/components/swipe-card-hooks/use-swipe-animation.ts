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

export function useSwipeAnimation(cardIndex: number = 0): SwipeAnimationResult {
  // Motion values
  const x = useMotionValue(0)
  const rotateRaw = useTransform(x, [-150, 150], [-18, 18])
  const rightSwipeOpacity = useTransform(x, [0, 100], [0, 1])
  const leftSwipeOpacity = useTransform(x, [-100, 0], [1, 0])
  const shineOpacity = useTransform(x, [-200, -100, 0, 100, 200], [0.6, 0.3, 0, 0.3, 0.6])

  // Animation states
  const [animationState, setAnimationState] = useState<SwipeAnimationState>({
    showRightEmoji: false,
    showLeftEmoji: false,
    showSuperLikeEmoji: false
  })

  // Calculate rotation with offset for back cards
  const rotate = useTransform(() => {
    const offset = cardIndex === 0 ? 0 : (cardIndex % 2 ? 3 : -3)
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