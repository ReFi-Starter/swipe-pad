"use client"

import React, { useState } from 'react'
import { CommunityNotesDrawer } from '@/components/community-notes-drawer'
import { CardListView } from './swipe-card-components/card-list-view'
import { CardSwipeView } from './swipe-card-components/card-swipe-view'
import { CardActions } from './swipe-card-components/card-actions'
import { useSwipeAnimation } from './swipe-card-hooks/use-swipe-animation'
import { useSwipeGestures } from './swipe-card-hooks/use-swipe-gestures'
import { swipeLeft as swipeLeftHelper, swipeRight as swipeRightHelper } from './utils'
import type { SwipeCardProps } from './types'

// Re-export helper functions for external use
export const swipeLeft = swipeLeftHelper;
export const swipeRight = swipeRightHelper;

// Re-export types
export * from './types';

export function SwipeCard({
  project,
  onSwipe,
  onSuperLike,
  onBoost,
  onShowDetails,
  active = true,
  className = "",
  cardIndex = 0,
  mode = 'swipe',
  comboCount = 0,
  questTokens = 0,
  userReputation = 0,
  topUserThreshold = 100,
  availableBoosts = 0,
  onAddNote,
  onVoteNote,
  onFlagNote
}: SwipeCardProps) {
  const [isNotesOpen, setIsNotesOpen] = useState(false)
  const isFront = cardIndex === 0

  // Animation and gesture hooks
  const {
    x,
    rotate,
    rightSwipeOpacity,
    leftSwipeOpacity,
    shineOpacity,
    animationState,
    handleSwipeComplete,
    handleSuperLike
  } = useSwipeAnimation(cardIndex)

  const {
    isDraggable,
    handleDragEnd,
    handleTap
  } = useSwipeGestures({
    x,
    onSwipe: (direction) => {
      handleSwipeComplete(direction)
      onSwipe?.(direction)
    },
    onSuperLike: () => {
      handleSuperLike()
      onSuperLike?.()
    },
    onShowDetails: onShowDetails || (() => {}),
    active
  })

  // List mode render
  if (mode === 'list') {
    return (
      <CardListView
        project={project}
        onShowDetails={onShowDetails}
        onOpenNotes={() => setIsNotesOpen(true)}
        className={className}
      />
    )
  }

  // Swipe mode render
  return (
    <div className="relative w-full h-full">
      <div className="relative w-full pb-[140%]"> {/* 1.4:1 aspect ratio container */}
        <div className="absolute inset-0">
          <CardSwipeView
            project={project}
            x={x}
            rotate={rotate}
            rightSwipeOpacity={rightSwipeOpacity}
            leftSwipeOpacity={leftSwipeOpacity}
            shineOpacity={shineOpacity}
            animationState={animationState}
            isDraggable={isDraggable}
            handleDragEnd={handleDragEnd}
            handleTap={handleTap}
            onOpenNotes={() => setIsNotesOpen(true)}
            className={className}
            isFront={isFront}
            cardIndex={cardIndex}
            comboCount={comboCount}
          />

          {isFront && active && (
            <CardActions
              onSwipeLeft={() => onSwipe?.('left')}
              onSwipeRight={() => onSwipe?.('right')}
              onSuperLike={onSuperLike || (() => {})}
              onBoost={onBoost || (() => {})}
              questTokens={questTokens}
              userReputation={userReputation}
              topUserThreshold={topUserThreshold}
              availableBoosts={availableBoosts}
              isFront={isFront}
              active={active}
            />
          )}
        </div>
      </div>

      <CommunityNotesDrawer
        isOpen={isNotesOpen}
        onClose={() => setIsNotesOpen(false)}
        notes={project.notes || []}
        onAddNote={onAddNote}
        onVote={onVoteNote}
        onFlag={onFlagNote}
      />
    </div>
  )
} 