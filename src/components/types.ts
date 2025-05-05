import type { Note } from '@/components/community-notes-drawer'

export interface Project {
  id: string
  title: string
  description: string
  imageUrl: string
  donationAmount: number
  category: string
  trustStatus: 'verified' | 'warning'
  progress: {
    current: number
    target: number
  }
  creator: {
    name: string
    avatar?: string
    verified?: boolean
  }
  createdAt?: Date
  notesCount?: number
  notes?: Note[]
}

// External reference types
export type SwipeCardRef = {
  swipe: (dir: 'left' | 'right') => void
}

export type SwipeDirection = 'left' | 'right'

export interface SwipeCardProps {
  project: Project
  onSwipe?: (direction: SwipeDirection) => void
  onSuperLike?: () => void
  onBoost?: () => void
  onShowDetails?: () => void
  active?: boolean
  className?: string
  cardIndex?: number
  mode?: 'swipe' | 'list'
  comboCount?: number
  questTokens?: number
  userReputation?: number
  topUserThreshold?: number
  availableBoosts?: number
  onAddNote?: (content: string) => Promise<void>
  onVoteNote?: (noteId: string, vote: 'up' | 'down') => Promise<void>
  onFlagNote?: (noteId: string) => Promise<void>
}

export interface CardLayoutProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  isFront?: boolean
  cardIndex?: number
}

export interface CardHeaderProps {
  project: Project
  onOpenNotes: () => void
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

export interface SwipeAnimationState {
  showRightEmoji: boolean
  showLeftEmoji: boolean
  showSuperLikeEmoji: boolean
} 