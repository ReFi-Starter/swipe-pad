export interface CardLayoutProps {
    children: React.ReactNode
    className?: string
    onClick?: () => void
    isFront?: boolean
    cardIndex?: number
}

export interface CardProgressProps {
    current: number
    target: number
}

export interface CardActionsProps {
    onSwipeLeft: () => void
    onSwipeRight: () => void
    onSuperLike: () => void
    onBoost: () => void
    questTokens: number
    userReputation: number
    topUserThreshold: number
    availableBoosts: number
    isFront: boolean
    active: boolean
}
