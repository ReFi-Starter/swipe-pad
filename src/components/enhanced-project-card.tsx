"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { X, Heart, MessageSquare, RotateCcw, Flame, AlertTriangle } from "lucide-react"
import { CommunityNotesPanel } from "@/components/community-notes-panel"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"

interface EnhancedProjectCardProps {
  project: {
    id: number
    title: string
    category: string
    description: string
    image: string
    fundingGoal: number
    currentFunding: number
    communityTags?: Array<{
      id: number
      text: string
      color: string
      count: number
    }>
    communityNotes?: Array<{
      id: number
      author: string
      reputation: number
      text: string
      tags: string[]
      upvotes: number
    }>
  }
  mode?: "swipe" | "list"
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onDonate?: () => void
  onUndo?: () => void
  showOverlay?: boolean
  overlayDirection?: "left" | "right" | null
  style?: React.CSSProperties
  isActive?: boolean
  zIndex?: number
}

export function EnhancedProjectCard({
  project,
  mode = "swipe",
  onSwipeLeft,
  onSwipeRight,
  onDonate,
  onUndo,
  showOverlay = false,
  overlayDirection = null,
  style,
  isActive = true,
  zIndex = 10,
}: EnhancedProjectCardProps) {
  const [showCommunityNotes, setShowCommunityNotes] = useState(false)
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 })
  const [dragStartX, setDragStartX] = useState<number | null>(null)

  // Check if project has fake tags
  const hasFakeTags =
    project.communityTags?.some((tag) => tag.text.includes("Fake") || tag.text.includes("Spam")) || false

  // Check if project has sponsor boost (for demo, we'll say project ID 5 has it)
  const hasSponsorBoost = project.id === 5

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragStartX(e.clientX)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragStartX === null) return

    const deltaX = e.clientX - dragStartX
    setDragPosition({ x: deltaX, y: 0 })

    // Determine swipe direction for visual feedback
    if (deltaX > 50) {
      if (overlayDirection !== "right") onSwipeRight && onSwipeRight()
    } else if (deltaX < -50) {
      if (overlayDirection !== "left") onSwipeLeft && onSwipeLeft()
    }
  }

  const handleMouseUp = () => {
    if (dragStartX === null) return

    const threshold = 100
    if (dragPosition.x > threshold) {
      onSwipeRight && onSwipeRight()
    } else if (dragPosition.x < -threshold) {
      onSwipeLeft && onSwipeLeft()
    }

    // Reset position
    setDragPosition({ x: 0, y: 0 })
    setDragStartX(null)
  }

  const handleAddTag = (tag: string) => {
    // In a real app, this would add the tag to the project
    console.log(`Added tag: ${tag} to project ${project.id}`)
    setShowCommunityNotes(false)
  }

  const cardStyle = {
    ...style,
    transform: `translateX(${dragPosition.x}px) rotate(${dragPosition.x * 0.05}deg)`,
    transition: dragStartX === null ? "transform 0.3s ease" : "none",
    zIndex,
    ...(hasFakeTags ? { opacity: 0.8, border: "1px solid rgba(239, 68, 68, 0.3)" } : {}),
  }

  if (mode === "list") {
    return (
      <Card className={`w-full mb-4 overflow-hidden ${hasFakeTags ? "opacity-80 border-red-300" : ""}`}>
        <div className="flex">
          <div className="relative h-24 w-24 flex-shrink-0">
            <Image src={project.image || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
            {hasSponsorBoost && (
              <div className="absolute top-1 left-1 bg-orange-500 text-white p-1 rounded-full">
                <Flame className="h-3 w-3" />
              </div>
            )}
          </div>
          <CardContent className="p-4 flex-1">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-1">
                  <h3 className="font-semibold">{project.title}</h3>
                  {hasFakeTags && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Community flagged concerns</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
                <div className="flex flex-wrap gap-1 mt-1 mb-1">
                  {project.communityTags?.slice(0, 2).map((tag) => (
                    <span
                      key={tag.id}
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        tag.text.includes("Fake") || tag.text.includes("Spam")
                          ? "bg-red-100 text-red-700"
                          : tag.text.includes("Unverified") || tag.text.includes("Needs Review")
                            ? "bg-orange-100 text-orange-700"
                            : "bg-green-100 text-green-700"
                      }`}
                    >
                      {tag.text}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-slate-600 line-clamp-2">{project.description}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Button variant="default" size="sm" className="text-xs px-3 py-1 h-auto" onClick={onDonate}>
                  Donate $0.01
                </Button>
                <button
                  className="text-xs text-blue-500 font-medium flex items-center"
                  onClick={() => setShowCommunityNotes(true)}
                >
                  <MessageSquare className="h-3 w-3 mr-1" />
                  Notes
                </button>
              </div>
            </div>
          </CardContent>
        </div>

        <CommunityNotesPanel
          isOpen={showCommunityNotes}
          onClose={() => setShowCommunityNotes(false)}
          project={project}
          onAddTag={handleAddTag}
        />
      </Card>
    )
  }

  return (
    <>
      <div
        className="relative w-full max-w-sm mx-auto"
        style={cardStyle}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <Card className="w-full overflow-hidden">
          <div className="relative h-64 w-full">
            <Image src={project.image || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
            <div className="absolute top-2 right-2 bg-[#22CC88] text-white px-2 py-1 rounded-full text-xs">
              {project.category}
            </div>
            {hasSponsorBoost && (
              <div className="absolute top-2 left-2 bg-orange-500 text-white p-1 rounded-full">
                <Flame className="h-4 w-4" />
              </div>
            )}
            <button
              className="absolute bottom-2 right-2 bg-white/80 text-slate-700 p-1 rounded-full"
              onClick={() => setShowCommunityNotes(true)}
            >
              <MessageSquare className="h-5 w-5" />
            </button>
          </div>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-xl font-semibold">{project.title}</h3>
              {hasFakeTags && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Community flagged concerns</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>

            <div className="flex flex-wrap gap-1 mb-3">
              {project.communityTags?.map((tag) => (
                <span
                  key={tag.id}
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    tag.text.includes("Fake") || tag.text.includes("Spam")
                      ? "bg-red-100 text-red-700"
                      : tag.text.includes("Unverified") || tag.text.includes("Needs Review")
                        ? "bg-orange-100 text-orange-700"
                        : "bg-green-100 text-green-700"
                  }`}
                >
                  {tag.text} ({tag.count})
                </span>
              ))}
            </div>

            <p className="text-sm text-slate-600 mb-4">{project.description}</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Funding goal</span>
                <span>${project.fundingGoal}</span>
              </div>
              <Progress value={project.currentFunding} max={project.fundingGoal} />
            </div>

            <div className="flex justify-between items-center mt-6 text-sm text-slate-500">
              <span>← Skip</span>
              <p className="text-xs text-center">
                Give your spare-change round-ups, daily ticket leftovers, or monthly pot
              </p>
              <span>Donate →</span>
            </div>
          </CardContent>
        </Card>

        {showOverlay && overlayDirection === "left" && (
          <div className="absolute inset-0 bg-red-500/20 rounded-2xl flex items-center justify-center">
            <div className="bg-red-500/80 w-20 h-20 rounded-full flex items-center justify-center">
              <X className="text-white h-10 w-10" />
            </div>
          </div>
        )}

        {showOverlay && overlayDirection === "right" && (
          <div className="absolute inset-0 bg-[#22CC88]/20 rounded-2xl flex items-center justify-center">
            <div className="bg-[#22CC88]/80 w-20 h-20 rounded-full flex items-center justify-center">
              <Heart className="text-white h-10 w-10" />
            </div>
          </div>
        )}
      </div>

      {onUndo && (
        <button
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/80 text-slate-700 p-2 rounded-full shadow-md z-20"
          onClick={onUndo}
        >
          <RotateCcw className="h-5 w-5" />
        </button>
      )}

      <CommunityNotesPanel
        isOpen={showCommunityNotes}
        onClose={() => setShowCommunityNotes(false)}
        project={project}
        onAddTag={handleAddTag}
      />
    </>
  )
}
