import { useState, useEffect } from 'react'
import type { MotionValue } from 'framer-motion'
import type { SwipeDirection } from '@/components/types'

interface SwipeGesturesConfig {
  x: MotionValue<number>
  onSwipe?: (direction: SwipeDirection) => void
  onSuperLike?: () => void
  onShowDetails?: () => void
  active?: boolean
}

interface SwipeGesturesResult {
  isDraggable: boolean
  handleDragEnd: () => void
  handleTap: () => void
}

const SWIPE_THRESHOLD = 100
const DOUBLE_TAP_THRESHOLD = 300

export function useSwipeGestures({
  x,
  onSwipe,
  onSuperLike,
  onShowDetails,
  active = true
}: SwipeGesturesConfig): SwipeGesturesResult {
  const [isDraggable, setIsDraggable] = useState(false)
  const [lastTapTime, setLastTapTime] = useState(0)

  // Initialize drag after mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDraggable(true)
    }, 100)
    
    return () => {
      clearTimeout(timer)
      setIsDraggable(false)
    }
  }, [])

  const handleDragEnd = () => {
    const xValue = x.get()
    if (active && Math.abs(xValue) > SWIPE_THRESHOLD) {
      const direction: SwipeDirection = xValue > 0 ? 'right' : 'left'
      onSwipe?.(direction)
    }
  }

  const handleTap = () => {
    const now = Date.now()
    if (now - lastTapTime < DOUBLE_TAP_THRESHOLD) {
      onSuperLike?.()
    } else if (onShowDetails) {
      onShowDetails()
    }
    setLastTapTime(now)
  }

  return {
    isDraggable: isDraggable && active,
    handleDragEnd,
    handleTap
  }
} 