"use client"

import { SwipeCardStack } from "@/components/swipe-card-stack"
import type { Project } from "@/components/swipe-card"

interface ProjectSwipeViewProps {
  projects: Project[]
  userStats: {
    reputation: number
  }
  topUserThreshold: number
  onDonate: () => void
  onSuperLike: () => void
  onBoost: () => void
  onShowDetails: () => void
  onAddNote: (projectId: string, content: string) => Promise<void>
  onVoteNote: (projectId: string, noteId: string, vote: 'up' | 'down') => Promise<void>
  onFlagNote: (projectId: string, noteId: string) => Promise<void>
}

export function ProjectSwipeView({
  projects,
  userStats,
  topUserThreshold,
  onDonate,
  onSuperLike,
  onBoost,
  onShowDetails,
  onAddNote,
  onVoteNote,
  onFlagNote
}: ProjectSwipeViewProps) {
  return (
    <div className="h-full">
      <SwipeCardStack
        onDonate={onDonate}
        onSuperLike={onSuperLike}
        onBoost={onBoost}
        onShowDetails={onShowDetails}
        onAddNote={onAddNote}
        onVoteNote={onVoteNote}
        onFlagNote={onFlagNote}
        userReputation={userStats.reputation}
        topUserThreshold={topUserThreshold}
        filteredProjects={projects}
      />
    </div>
  )
} 