export type SwipeDirection = 'left' | 'right' | 'up' | 'down'

export type SwipeCardRef = {
    swipe: (dir: 'left' | 'right') => void
}

export interface SwipeAnimationState {
    showRightEmoji: boolean
    showLeftEmoji: boolean
    showUpEmoji: boolean
    showDownEmoji: boolean
    showSuperLikeEmoji: boolean
}
