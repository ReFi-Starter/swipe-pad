import { useState, useEffect } from 'react'
import { type PanInfo, type MotionValue, useTransform, useMotionValue } from 'framer-motion'
import type { SwipeDirection } from '@/components/types'

interface SwipeGesturesConfig {
  onSwipe?: (direction: SwipeDirection) => void
  onSuperLike?: () => void
  onShowDetails?: () => void
  active?: boolean
  x: MotionValue<number>
}

interface SwipeGesturesResult {
  isDraggable: boolean
  handleDragEnd: (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => Promise<void>
  handleTap: () => void
  rotate: MotionValue<number>
  opacity: MotionValue<number>
  y: MotionValue<number>
}

// Enhanced swipe parameters for smoother interaction
const SWIPE_THRESHOLD = 120 // Increased threshold for more intentional swipes
const ROTATION_RANGE = [-12, 0, 12] // Enhanced rotation range
const SCREEN_WIDTH = typeof window !== 'undefined' ? window.innerWidth : 500
const SCREEN_HEIGHT = typeof window !== 'undefined' ? window.innerHeight : 800
const EXIT_DISTANCE = Math.max(SCREEN_WIDTH, SCREEN_HEIGHT) * 1.2
const DOUBLE_TAP_THRESHOLD = 300

export function useSwipeGestures({
  onSwipe,
  onSuperLike,
  onShowDetails,
  active = true,
  x
}: SwipeGesturesConfig): SwipeGesturesResult {
  const [isDraggable, setIsDraggable] = useState(false)
  const [lastTapTime, setLastTapTime] = useState(0)
  
  // Add vertical motion value
  const y = useMotionValue(0)
  
  // Dynamic rotation based on combined horizontal and vertical movement
  const rotate = useTransform(
    [x, y],
    (latest: number[]) => {
      const [latestX, latestY] = latest
      const angle = Math.atan2(latestY, latestX) * (180 / Math.PI)
      const distance = Math.sqrt(latestX * latestX + latestY * latestY)
      const normalizedDistance = Math.min(distance / EXIT_DISTANCE, 1)
      return ROTATION_RANGE[1] + (angle * normalizedDistance * 0.2)
    }
  )

  // Enhanced opacity based on distance from center
  const opacity = useTransform(
    [x, y],
    (latest: number[]) => {
      const [latestX, latestY] = latest
      const distance = Math.sqrt(latestX * latestX + latestY * latestY)
      return Math.max(1 - distance / EXIT_DISTANCE, 0.5)
    }
  )

  useEffect(() => {
    setIsDraggable(active)
  }, [active])

  const handleDragEnd = async (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!active) return

    const offsetX = info.offset.x
    const offsetY = info.offset.y
    const velocityX = info.velocity.x
    const velocityY = info.velocity.y

    // Calculate total offset and velocity
    const totalOffset = Math.sqrt(offsetX * offsetX + offsetY * offsetY)
    const totalVelocity = Math.sqrt(velocityX * velocityX + velocityY * velocityY)

    // Determine if swipe should trigger based on offset or velocity
    const isSwipeValid = totalOffset > SWIPE_THRESHOLD || totalVelocity > 800

    if (isSwipeValid) {
      // Determine direction based on dominant axis
      const direction: SwipeDirection = Math.abs(offsetX) > Math.abs(offsetY)
        ? offsetX > 0 ? 'right' : 'left'
        : offsetY > 0 ? 'down' : 'up'
      
      // Calculate final position with velocity influence
      const angle = Math.atan2(offsetY, offsetX)
      const velocityFactor = Math.min(totalVelocity / 1000, 1)
      const duration = 0.3 - (velocityFactor * 0.2) // Faster animation for stronger swipes
      
      // Animate to final position with spring physics
      const finalX = Math.cos(angle) * EXIT_DISTANCE
      const finalY = Math.sin(angle) * EXIT_DISTANCE
      
      // Use requestAnimationFrame for smoother animation
      requestAnimationFrame(() => {
        x.set(finalX)
        y.set(finalY)
      })

      // Notify parent of swipe after animation
      setTimeout(() => {
        onSwipe?.(direction)
      }, duration * 1000)
    } else {
      // Return to center with spring physics
      requestAnimationFrame(() => {
        x.set(0)
        y.set(0)
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
    handleTap,
    rotate,
    opacity,
    y
  }
} 