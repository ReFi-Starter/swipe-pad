import { useState, useEffect } from 'react'
import { useAnimation, type PanInfo } from 'framer-motion'
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
  handleDragEnd: (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => Promise<void>
  handleTap: () => void
}

const SWIPE_THRESHOLD = 100
const SWIPE_VELOCITY_THRESHOLD = 50
const DOUBLE_TAP_THRESHOLD = 300
const SCREEN_WIDTH = typeof window !== 'undefined' ? window.innerWidth : 500

export function useSwipeGestures({
  x,
  onSwipe,
  onSuperLike,
  onShowDetails,
  active = true
}: SwipeGesturesConfig): SwipeGesturesResult {
  const [isDraggable, setIsDraggable] = useState(false)
  const [lastTapTime, setLastTapTime] = useState(0)
  const controls = useAnimation()

  useEffect(() => {
    setIsDraggable(active)
  }, [active])

  const handleDragEnd = async (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!active) return

    const offset = info.offset.x
    const velocity = info.velocity.x

    // Calculate swipe direction and force
    const swipe = Math.abs(offset) * Math.sign(offset)
    const swipeVelocity = Math.abs(velocity) * Math.sign(velocity)

    // Determine if swipe should trigger
    const isSwipeValid = 
      Math.abs(swipe) > SWIPE_THRESHOLD || 
      Math.abs(swipeVelocity) > SWIPE_VELOCITY_THRESHOLD

    if (isSwipeValid) {
      // Determine direction
      const direction: SwipeDirection = swipe > 0 ? 'right' : 'left'
      
      // Calculate final position based on direction and screen width
      const finalPosition = direction === 'right' ? SCREEN_WIDTH + 200 : -SCREEN_WIDTH - 200
      
      // Animate card off screen with physics
      await controls.start({
        x: finalPosition,
        opacity: 0,
        transition: {
          type: "spring",
          duration: 0.5,
          bounce: 0,
          velocity: swipeVelocity
        }
      })

      // Notify parent of swipe
      onSwipe?.(direction)
    } else {
      // Return to center with spring animation
      await controls.start({
        x: 0,
        transition: {
          type: "spring",
          duration: 0.5,
          bounce: 0.5,
          velocity
        }
      })
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
    isDraggable,
    handleDragEnd,
    handleTap
  }
} 