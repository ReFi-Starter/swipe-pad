import { campaigns } from '@/lib/data/sample-data.json'
import { useCallback, useRef, useState } from 'react'
import { ANIMATION_DURATION } from '../animations'
import { Card } from '../types'
import { useEventListener } from './use-event-listener'
import useSwipeIndicators from './use-swipe-indicators'

interface UseCampaignSwiperReturn {
    cards: Card[]
    showLeftIndicator: boolean
    showRightIndicator: boolean
    showEmptyState: boolean
    currentIndex: number
    cardRef: React.RefObject<HTMLDivElement | null>
    isAnimating: React.RefObject<boolean>
    handleDislikeClick: () => void
    handleLikeClick: () => void
}

const SWIPE_THRESHOLD = 100
const ROTATION_FACTOR = 0.1
const OPACITY_FACTOR = 500
const SWIPE_OUT_DISTANCE = 200
const SWIPE_OUT_ROTATION = 30

type DragState = {
    isDragging: boolean
    startX: number
    startY: number
    moveX: number
    moveY: number
}

const sampleCampaigns = campaigns.map(campaign => ({
    name: campaign.title,
    image: campaign.imageUrl,
}))

export default function useCampaignSwiper(): UseCampaignSwiperReturn {
    const [cards, setCards] = useState(sampleCampaigns)
    const [showEmptyState, setShowEmptyState] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0)

    const cardRef = useRef<HTMLDivElement>(null)
    const isAnimating = useRef(false)
    const dragState = useRef<DragState>({
        isDragging: false,
        startX: 0,
        startY: 0,
        moveX: 0,
        moveY: 0,
    })

    const {
        showLeftIndicator,
        showRightIndicator,
        setShowLeftIndicator,
        setShowRightIndicator,
        updateSwipeIndicators,
        resetSwipeIndicators,
    } = useSwipeIndicators()

    const animateSwipe = useCallback((direction: 'left' | 'right') => {
        const card = cardRef.current
        if (!card) return

        const isLeft = direction === 'left'
        card.style.transition = `transform ${ANIMATION_DURATION}ms ease-out, opacity ${ANIMATION_DURATION}ms ease-out`
        card.style.transform = `translate(${isLeft ? -SWIPE_OUT_DISTANCE : SWIPE_OUT_DISTANCE}px, 0) rotate(${isLeft ? -SWIPE_OUT_ROTATION : SWIPE_OUT_ROTATION}deg)`
        card.style.opacity = '0'
    }, [])

    const handleCardSwipe = useCallback(
        (direction: 'left' | 'right') => {
            if (isAnimating.current || cards.length === 0) return

            isAnimating.current = true
            const isLeft = direction === 'left'

            if (isLeft) {
                setShowLeftIndicator(true)
            } else {
                setShowRightIndicator(true)
            }

            animateSwipe(direction)

            setTimeout(() => {
                resetSwipeIndicators()
                const newCards = [...cards.slice(1)]
                setCards(newCards)
                setCurrentIndex(prev => prev + 1)

                if (newCards.length === 0) {
                    setShowEmptyState(true)
                }

                const card = cardRef.current
                if (card) {
                    card.style.transition = ''
                    card.style.transform = ''
                    card.style.opacity = '1'
                }

                isAnimating.current = false
            }, ANIMATION_DURATION)
        },
        [cards, resetSwipeIndicators, setShowLeftIndicator, setShowRightIndicator, animateSwipe],
    )

    const swipeLeft = useCallback(() => handleCardSwipe('left'), [handleCardSwipe])
    const swipeRight = useCallback(() => handleCardSwipe('right'), [handleCardSwipe])

    const handleDislikeClick = useCallback(() => {
        if (isAnimating.current) return
        setShowLeftIndicator(true)
        swipeLeft()
    }, [swipeLeft, setShowLeftIndicator])

    const handleLikeClick = useCallback(() => {
        if (isAnimating.current) return
        setShowRightIndicator(true)
        swipeRight()
    }, [swipeRight, setShowRightIndicator])

    // Handle keyboard events
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (isAnimating.current) return

            if (e.key === 'ArrowRight') {
                handleLikeClick()
            } else if (e.key === 'ArrowLeft') {
                handleDislikeClick()
            }
        },
        [handleLikeClick, handleDislikeClick],
    )

    useEventListener('keydown', handleKeyDown)

    // Handle drag start
    const handleDragStart = useCallback((e: TouchEvent | MouseEvent) => {
        if (isAnimating.current) return
        e.preventDefault()

        const point = 'touches' in e ? e.touches[0] : e
        dragState.current = {
            isDragging: true,
            startX: point.clientX,
            startY: point.clientY,
            moveX: 0,
            moveY: 0,
        }

        const card = cardRef.current
        if (card) {
            card.style.transition = 'none'
            card.style.cursor = 'grabbing'
        }
    }, [])

    // Handle drag move
    const handleDrag = useCallback(
        (e: TouchEvent | MouseEvent) => {
            if (!dragState.current.isDragging) return
            e.preventDefault()

            const point = 'touches' in e ? e.touches[0] : e
            const moveX = point.clientX - dragState.current.startX
            const moveY = point.clientY - dragState.current.startY

            dragState.current.moveX = moveX
            dragState.current.moveY = moveY

            const card = cardRef.current
            if (card) {
                const rotate = moveX * ROTATION_FACTOR
                const opacity = Math.max(1 - Math.abs(moveX) / OPACITY_FACTOR, 0.5)

                card.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${rotate}deg)`
                card.style.opacity = opacity.toString()
            }

            updateSwipeIndicators(moveX)
        },
        [updateSwipeIndicators],
    )

    // Handle drag end
    const handleDragEnd = useCallback(() => {
        if (!dragState.current.isDragging) return

        dragState.current.isDragging = false
        const card = cardRef.current
        if (card) {
            card.style.cursor = 'grab'
        }

        resetSwipeIndicators()

        const { moveX } = dragState.current
        if (moveX > SWIPE_THRESHOLD) {
            swipeRight()
        } else if (moveX < -SWIPE_THRESHOLD) {
            swipeLeft()
        } else {
            if (card) {
                card.style.transition = `transform ${ANIMATION_DURATION}ms ease-out, opacity ${ANIMATION_DURATION}ms ease-out`
                card.style.transform = 'translate(0px, 0px) rotate(0deg)'
                card.style.opacity = '1'

                setTimeout(() => {
                    if (card) {
                        card.style.transition = ''
                    }
                }, ANIMATION_DURATION)
            }
        }

        dragState.current = {
            isDragging: false,
            startX: 0,
            startY: 0,
            moveX: 0,
            moveY: 0,
        }
    }, [resetSwipeIndicators, swipeLeft, swipeRight])

    // Set up touch events
    useEventListener<HTMLDivElement, 'touchstart'>('touchstart', handleDragStart, cardRef)
    useEventListener<HTMLDivElement, 'touchmove'>('touchmove', handleDrag, cardRef, { passive: false })
    useEventListener<HTMLDivElement, 'touchend'>('touchend', handleDragEnd)
    useEventListener<HTMLDivElement, 'touchcancel'>('touchcancel', handleDragEnd)

    // Set up mouse events
    useEventListener<HTMLDivElement, 'mousedown'>('mousedown', handleDragStart, cardRef)
    useEventListener<HTMLDivElement, 'mousemove'>('mousemove', handleDrag)
    useEventListener<HTMLDivElement, 'mouseup'>('mouseup', handleDragEnd)

    return {
        cards,
        showLeftIndicator,
        showRightIndicator,
        showEmptyState,
        currentIndex,
        cardRef,
        isAnimating,
        handleDislikeClick,
        handleLikeClick,
    }
}
