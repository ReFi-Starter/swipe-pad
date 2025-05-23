import { SwipeAnimationState, SwipeDirection } from '@/types/swipe'
import { MotionValue, useMotionValue, useTransform } from 'framer-motion'
import { useEffect, useState } from 'react'

interface SwipeAnimationResult {
    x: MotionValue<number>
    y: MotionValue<number>
    rotate: MotionValue<string>
    rightSwipeOpacity: MotionValue<number>
    leftSwipeOpacity: MotionValue<number>
    upSwipeOpacity: MotionValue<number>
    downSwipeOpacity: MotionValue<number>
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
    const y = useMotionValue(0)

    // Improved rotation physics - more pronounced rotation that increases with swipe distance
    // Using a custom curve for more natural rotation
    const rotateRaw = useTransform([x, y], (latest: number[]) => {
        const [latestX, latestY] = latest
        const angle = Math.atan2(latestY, latestX) * (180 / Math.PI)
        const distance = Math.sqrt(latestX * latestX + latestY * latestY)
        const normalizedDistance = Math.min(distance / EXIT_DISTANCE, 1)
        return ROTATION_FACTOR * normalizedDistance * Math.sign(angle)
    })

    // Enhanced visual feedback with quicker fade-in and smoother transitions
    const rightSwipeOpacity = useTransform(x, [0, FEEDBACK_THRESHOLD / 2, FEEDBACK_THRESHOLD], [0, 0.3, 1])

    const leftSwipeOpacity = useTransform(x, [-FEEDBACK_THRESHOLD, -FEEDBACK_THRESHOLD / 2, 0], [1, 0.3, 0])

    const upSwipeOpacity = useTransform(y, [-FEEDBACK_THRESHOLD, -FEEDBACK_THRESHOLD / 2, 0], [1, 0.3, 0])

    const downSwipeOpacity = useTransform(y, [0, FEEDBACK_THRESHOLD / 2, FEEDBACK_THRESHOLD], [0, 0.3, 1])

    // More pronounced shine effect during swipe with smoother transitions
    const shineOpacity = useTransform([x, y], (latest: number[]) => {
        const [latestX, latestY] = latest
        const distance = Math.sqrt(latestX * latestX + latestY * latestY)
        return Math.min(distance / EXIT_DISTANCE, 0.9)
    })

    // Animation states
    const [animationState, setAnimationState] = useState<SwipeAnimationState>({
        showRightEmoji: false,
        showLeftEmoji: false,
        showUpEmoji: false,
        showDownEmoji: false,
        showSuperLikeEmoji: false,
    })

    // Calculate rotation with offset for back cards
    // Add subtle variation to stacked cards' rotation
    const rotate = useTransform(() => {
        // Different offset for each card in stack for a more natural look
        let offset = 0
        if (cardIndex > 0) {
            // Alternate the rotation direction and increase with depth
            offset = cardIndex % 2 === 0 ? -1.5 - cardIndex : 1.5 + cardIndex
        }
        return `${rotateRaw.get() + offset}deg`
    })

    // Reset animation states after delay
    useEffect(() => {
        if (
            animationState.showRightEmoji ||
            animationState.showLeftEmoji ||
            animationState.showUpEmoji ||
            animationState.showDownEmoji ||
            animationState.showSuperLikeEmoji
        ) {
            const timer = setTimeout(() => {
                resetAnimationState()
            }, 1000)
            return () => clearTimeout(timer)
        }
    }, [animationState])

    const handleSwipeComplete = (direction: SwipeDirection) => {
        // Animate the card off screen with physics
        const angle =
            direction === 'right' ? 0 : direction === 'left' ? Math.PI : direction === 'up' ? -Math.PI / 2 : Math.PI / 2

        const finalX = Math.cos(angle) * EXIT_DISTANCE * 1.5
        const finalY = Math.sin(angle) * EXIT_DISTANCE * 1.5

        x.set(finalX)
        y.set(finalY)

        setAnimationState(prev => ({
            ...prev,
            showRightEmoji: direction === 'right',
            showLeftEmoji: direction === 'left',
            showUpEmoji: direction === 'up',
            showDownEmoji: direction === 'down',
        }))
    }

    const handleSuperLike = () => {
        setAnimationState(prev => ({
            ...prev,
            showSuperLikeEmoji: true,
        }))
    }

    const resetAnimationState = () => {
        setAnimationState({
            showRightEmoji: false,
            showLeftEmoji: false,
            showUpEmoji: false,
            showDownEmoji: false,
            showSuperLikeEmoji: false,
        })
    }

    return {
        x,
        y,
        rotate,
        rightSwipeOpacity,
        leftSwipeOpacity,
        upSwipeOpacity,
        downSwipeOpacity,
        shineOpacity,
        animationState,
        handleSwipeComplete,
        handleSuperLike,
        resetAnimationState,
    }
}
