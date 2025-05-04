"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { ProjectCard } from "@/components/project-card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react"
import { projects as allProjects, categories } from "@/lib/utils"

interface SwipeCardStackProps {
  onDonate: () => void
}

export function SwipeCardStack({ onDonate }: SwipeCardStackProps) {
  // State for managing current card and animations
  const [currentIndex, setCurrentIndex] = useState(0)
  const [previousIndex, setPreviousIndex] = useState(-1)
  const [isAnimating, setIsAnimating] = useState(false)
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [isExpanded, setIsExpanded] = useState(false)

  // Refs for tracking drag state
  const cardRef = useRef<HTMLDivElement>(null)

  // Filter projects based on selected category
  const filteredProjects = selectedCategory === "All"
    ? allProjects
    : allProjects.filter(project => project.category === selectedCategory)
  
  const handleSwipeLeft = useCallback(() => {
    if (isAnimating || currentIndex >= filteredProjects.length - 1) return;
    
    // Mark as animating
    setIsAnimating(true);
    
    // Simulate rejection delay
    setTimeout(() => {
      // Move to next card
      setCurrentIndex(currentIndex + 1);
      setSwipeDirection(null);
      setIsAnimating(false);
    }, 500);
  }, [currentIndex, filteredProjects.length, isAnimating]);

  const handleSwipeRight = useCallback(() => {
    if (isAnimating || currentIndex >= filteredProjects.length - 1) return;
    
    // Mark as animating
    setIsAnimating(true);
    
    // Call donated callback
    onDonate();
    
    // Show donation summary after animation
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  }, [currentIndex, filteredProjects.length, isAnimating, onDonate]);

  const handleUndo = () => {
    if (isAnimating || currentIndex === 0 || previousIndex === -1) return
    setCurrentIndex(previousIndex)
    setPreviousIndex(-1)
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnimating || isExpanded) return
      
      if (e.key === "ArrowLeft") {
        handleSwipeLeft()
      } else if (e.key === "ArrowRight") {
        handleSwipeRight()
      }
    }
    
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleSwipeLeft, handleSwipeRight, isAnimating, isExpanded])

  // Toggle expand/collapse
  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  // Render different categories
  const renderCategorySelector = () => {
    return (
      <div className="flex gap-2 overflow-x-auto pb-2 px-4 mt-2 mb-4 scrollbar-hide">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            className="rounded-full whitespace-nowrap"
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {renderCategorySelector()}
      
      <div className="flex-1 flex flex-col items-center justify-center relative">
        {currentIndex < filteredProjects.length ? (
          <>
            <div
              ref={cardRef}
              className="w-full max-w-sm mx-auto"
            >
              <ProjectCard
                project={filteredProjects[currentIndex]}
                onDonate={handleSwipeRight}
                onShowCommunityNotes={() => {}}
                showOverlay={!!swipeDirection}
                overlayDirection={swipeDirection}
                onToggleExpand={handleToggleExpand}
              />
            </div>
            
            <div className="flex gap-4 mt-6">
              <Button
                variant="outline"
                size="icon"
                onClick={handleSwipeLeft}
                disabled={isAnimating}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                onClick={handleUndo}
                disabled={isAnimating || previousIndex === -1}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                onClick={handleSwipeRight}
                disabled={isAnimating}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center p-8">
            <h3 className="text-lg font-semibold mb-2">No more projects</h3>
            <p className="text-sm text-slate-500 mb-4">You&apos;ve seen all the projects in this category.</p>
            <Button onClick={() => setCurrentIndex(0)}>Start Over</Button>
          </div>
        )}
      </div>
    </div>
  )
}
