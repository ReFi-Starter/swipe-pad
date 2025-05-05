"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { SwipeCard } from "@/components/swipe-card"
import { Button } from "@/components/ui/button"
import type { Project } from "@/components/swipe-card"

interface SwipeCardStackProps {
  onDonate: () => void
  onSuperLike?: () => void
  onBoost?: () => void
  onShowDetails?: (project: Project) => void
  onAddNote?: (projectId: string, content: string) => Promise<void>
  onVoteNote?: (projectId: string, noteId: string, vote: 'up' | 'down') => Promise<void>
  onFlagNote?: (projectId: string, noteId: string) => Promise<void>
  userReputation?: number
  topUserThreshold?: number
  filteredProjects: Project[]
}

export function SwipeCardStack({
  onDonate,
  onSuperLike,
  onBoost,
  onShowDetails,
  onAddNote,
  onVoteNote,
  onFlagNote,
  userReputation = 0,
  topUserThreshold = 100,
  filteredProjects
}: SwipeCardStackProps) {
  // State for managing current card and animations
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [comboCount, setComboCount] = useState(0)
  const [questTokens, setQuestTokens] = useState(3)
  const [availableBoosts, setAvailableBoosts] = useState(3) // 3 boosts per week

  const handleSwipeLeft = useCallback(() => {
    if (isAnimating || currentIndex >= filteredProjects.length - 1) return;
    
    setIsAnimating(true);
    setComboCount(0); // Reset combo on reject
    
    setTimeout(() => {
      setCurrentIndex(currentIndex + 1);
      setIsAnimating(false);
    }, 500);
  }, [currentIndex, filteredProjects.length, isAnimating]);

  const handleSwipeRight = useCallback(() => {
    if (isAnimating || currentIndex >= filteredProjects.length - 1) return;
    
    setIsAnimating(true);
    setComboCount(prev => prev + 1); // Increment combo on donate
    onDonate();
    
    setTimeout(() => {
      setCurrentIndex(currentIndex + 1);
      setIsAnimating(false);
    }, 500);
  }, [currentIndex, filteredProjects.length, isAnimating, onDonate]);

  const handleSuperLike = useCallback(() => {
    if (questTokens > 0 && onSuperLike) {
      setQuestTokens(prev => prev - 1);
      onSuperLike();
    }
  }, [questTokens, onSuperLike]);

  const handleBoost = useCallback(() => {
    if (availableBoosts > 0 && userReputation > topUserThreshold && onBoost) {
      setAvailableBoosts(prev => prev - 1);
      onBoost();
    }
  }, [availableBoosts, userReputation, topUserThreshold, onBoost]);

  const handleShowDetails = useCallback((project: Project) => {
    onShowDetails?.(project);
  }, [onShowDetails]);

  const handleAddNote = useCallback((projectId: string) => async (content: string) => {
    await onAddNote?.(projectId, content);
  }, [onAddNote]);

  const handleVoteNote = useCallback((projectId: string) => async (noteId: string, vote: 'up' | 'down') => {
    await onVoteNote?.(projectId, noteId, vote);
  }, [onVoteNote]);

  const handleFlagNote = useCallback((projectId: string) => async (noteId: string) => {
    await onFlagNote?.(projectId, noteId);
  }, [onFlagNote]);

  return (
    <div className="flex flex-col h-[calc(100dvh-18rem)]">
      <div className="flex-1 flex items-center justify-center">
        {currentIndex < filteredProjects.length ? (
          <div className="relative w-full max-w-[320px] h-[calc(100dvh-18rem)] mx-auto">
            {/* Stack of cards */}
            {filteredProjects
              .slice(currentIndex, currentIndex + 3)
              .map((project, index) => (
                <SwipeCard
                  key={project.id}
                  project={project}
                  onSwipe={direction => direction === 'right' ? handleSwipeRight() : handleSwipeLeft()}
                  onSuperLike={handleSuperLike}
                  onBoost={handleBoost}
                  onShowDetails={() => handleShowDetails(project)}
                  cardIndex={index}
                  active={index === 0}
                  comboCount={index === 0 ? comboCount : 0}
                  questTokens={index === 0 ? questTokens : 0}
                  userReputation={userReputation}
                  topUserThreshold={topUserThreshold}
                  availableBoosts={index === 0 ? availableBoosts : 0}
                  onAddNote={handleAddNote(project.id)}
                  onVoteNote={handleVoteNote(project.id)}
                  onFlagNote={handleFlagNote(project.id)}
                />
              ))}
          </div>
        ) : (
          <div className="text-center p-8">
            <h3 className="text-lg font-semibold mb-2">No more projects</h3>
            <p className="text-sm text-muted-foreground mb-4">
              You&apos;ve seen all the projects in this category.
            </p>
            <Button onClick={() => setCurrentIndex(0)}>Start Over</Button>
          </div>
        )}
      </div>
    </div>
  )
}
