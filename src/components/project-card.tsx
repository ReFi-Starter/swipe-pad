"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { X, Heart, MessageSquare, Flame, ExternalLink, Copy, Share2, ChevronDown, ChevronUp } from "lucide-react"
import { getTagColor, getTrustLevel } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ProjectCardProps {
  project: {
    id: number
    title: string
    category: string
    description: string
    image: string
    website?: string
    websiteUrl?: string
    fundingGoal: number
    currentFunding: number
    sponsored?: boolean
    sponsorBoosted?: boolean
    trustScore?: number
    communityTags?: Array<{
      id: number
      text: string
      color: string
      count: number
    }>
  }
  mode?: "swipe" | "list"
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onDonate?: () => void
  onShowCommunityNotes?: () => void
  showOverlay?: boolean
  overlayDirection?: "left" | "right" | null
  isNext?: boolean
  donationAmount?: number
  isExpanded?: boolean
  onToggleExpand?: () => void
}

export function ProjectCard({
  project,
  mode = "swipe",
  onSwipeLeft,
  onSwipeRight,
  onDonate,
  onShowCommunityNotes,
  showOverlay = false,
  overlayDirection = null,
  isNext = false,
  donationAmount = 0.01,
  isExpanded = false,
  onToggleExpand,
}: ProjectCardProps) {
  const trustLevel = getTrustLevel(project)
  const websiteUrl = project.websiteUrl || project.website
  const [showCopyTooltip, setShowCopyTooltip] = useState(false)
  const descriptionRef = useRef<HTMLParagraphElement>(null)

  const handleCopyDescription = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(project.description)
    setShowCopyTooltip(true)
    setTimeout(() => setShowCopyTooltip(false), 2000)
  }

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (navigator.share) {
      navigator
        .share({
          title: project.title,
          text: project.description,
          url: websiteUrl || window.location.href,
        })
        .catch((err) => console.error("Error sharing:", err))
    } else {
      alert("Web Share API not supported in your browser")
    }
  }

  // Prevent image dragging
  const preventDrag = (e: React.DragEvent) => {
    e.preventDefault()
    return false
  }

  // Prevent event propagation for buttons
  const handleButtonClick = (e: React.MouseEvent, callback?: () => void) => {
    e.stopPropagation()
    if (callback) callback()
  }

  if (mode === "list") {
    return (
      <Card className={`w-full mb-4 overflow-hidden bento-bevel ${trustLevel.className}`}>
        <div className="flex">
          <div className="relative h-24 w-24 flex-shrink-0">
            <Image
              src={project.image || "/placeholder.svg"}
              alt={project.title}
              fill
              className="object-cover pointer-events-none"
              draggable={false}
              onDragStart={preventDrag}
            />
            {(project.sponsored || project.sponsorBoosted) && (
              <div className="absolute top-1 left-1 bg-amber-500 text-white p-1 rounded-full">
                <Flame className="h-3 w-3" />
              </div>
            )}
          </div>
          <CardContent className="p-4 flex-1">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-1">
                  <h3 className="font-semibold">{project.title}</h3>
                  {websiteUrl && (
                    <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
                {project.communityTags && project.communityTags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {project.communityTags.slice(0, 1).map((tag) => (
                      <span key={tag.id} className={`text-xs px-2 py-0.5 rounded-full ${getTagColor(tag.text)}`}>
                        {tag.text}
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-xs text-slate-600 line-clamp-2 mt-1">{project.description}</p>
              </div>
              <div className="flex flex-col items-end gap-1 ml-2">
                <Button
                  variant="default"
                  size="sm"
                  className="text-xs px-3 py-1 h-auto"
                  onClick={(e) => handleButtonClick(e, onDonate)}
                >
                  Donate ¢{(donationAmount * 100).toFixed(0)}
                </Button>
                <span className="text-xs text-blue-500 font-medium">+5 pts</span>
              </div>
            </div>
            <button
              onClick={(e) => handleButtonClick(e, onShowCommunityNotes)}
              className="flex items-center mt-2 text-xs text-slate-500"
            >
              <MessageSquare className="h-3 w-3 mr-1" />
              Community Notes
            </button>
          </CardContent>
        </div>
      </Card>
    )
  }

  let cardClasses = `w-full overflow-hidden bento-bevel ${trustLevel.className} select-none card-fullscreen`
  if (isNext) cardClasses += " next"
  if (isExpanded) cardClasses += " expanded"

  // If trust level is low, show warning
  if (trustLevel.level === "low") {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={`relative ${isNext ? "z-0" : "z-10"}`}>
              <Card className={cardClasses}>
                <div className="relative h-64 w-full flex items-center justify-center bg-slate-100">
                  <div className="text-center p-6">
                    <div className="text-4xl mb-4">⚠️</div>
                    <h3 className="text-xl font-semibold mb-2">Insufficient Trust</h3>
                    <p className="text-sm text-slate-600">
                      This project has been flagged by the community for potential concerns.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={(e) => handleButtonClick(e, onShowCommunityNotes)}
                    >
                      View Community Notes
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Community flagged concerns</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <div className={`relative ${isNext ? "z-0" : "z-10"}`}>
      <Card className={cardClasses}>
        <div 
          className={`relative w-full transition-height duration-300`} 
          style={{ 
            aspectRatio: isExpanded ? 'auto' : '3/4',
            maxHeight: isExpanded ? '40vh' : 'none'
          }}
        >
          <Image
            src={project.image || "/placeholder.svg"}
            alt={project.title}
            fill
            className="object-cover pointer-events-none"
            draggable={false}
            onDragStart={preventDrag}
          />
          <div className="absolute top-2 right-2 bg-[#22CC88] text-white px-2 py-1 rounded-full text-xs">
            {project.category}
          </div>
          {(project.sponsored || project.sponsorBoosted) && (
            <div className="absolute top-2 left-2 bg-amber-500 text-white p-1 rounded-full">
              <Flame className="h-3 w-3" />
            </div>
          )}
          <button
            onClick={(e) => handleButtonClick(e, onShowCommunityNotes)}
            className="absolute bottom-2 right-2 bg-white/90 text-slate-700 px-2 py-1 rounded-full text-xs flex items-center"
          >
            <MessageSquare className="h-3 w-3 mr-1" />
            Community Notes
          </button>
        </div>
        <CardContent className={`p-4 ${isExpanded ? "pb-16" : ""} flex-1 flex flex-col`}>
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="flex items-center gap-1">
                <h3 className="text-lg font-semibold">{project.title}</h3>
                {websiteUrl && (
                  <a
                    href={websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>

            {isExpanded && (
              <div className="flex gap-2 action-buttons">
                <TooltipProvider>
                  <Tooltip open={showCopyTooltip} onOpenChange={setShowCopyTooltip}>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" onClick={handleCopyDescription} className="h-8 w-8 p-0">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{showCopyTooltip ? "Copied!" : "Copy description"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <Button variant="ghost" size="sm" onClick={handleShare} className="h-8 w-8 p-0">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {project.communityTags && project.communityTags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {project.communityTags.map((tag) => (
                <span key={tag.id} className={`text-xs px-2 py-0.5 rounded-full ${getTagColor(tag.text)}`}>
                  {tag.text} ({tag.count})
                </span>
              ))}
            </div>
          )}

          <div className={`description-container ${isExpanded ? "expanded" : ""}`}>
            <p ref={descriptionRef} className={`text-sm text-slate-600 mb-3 ${isExpanded ? "" : "line-clamp-2"}`}>
              {project.description}
            </p>
          </div>

          <div className="space-y-2 mb-3">
            <div className="flex justify-between text-sm">
              <span>Funding goal</span>
              <span>${project.fundingGoal}</span>
            </div>
            <Progress value={project.currentFunding} max={project.fundingGoal} />
          </div>

          <div className="flex flex-col mt-auto">
            <div className="flex justify-between items-center text-sm text-slate-500">
              <button
                onClick={(e) => handleButtonClick(e, onSwipeLeft)}
                className="flex items-center gap-1 px-2 py-1 hover:bg-slate-100 rounded-md transition-colors"
              >
                <X className="h-4 w-4" /> Skip
              </button>
              <button
                onClick={(e) => handleButtonClick(e, onToggleExpand)}
                className="flex items-center gap-1 px-2 py-1 hover:bg-slate-100 rounded-md transition-colors"
              >
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              <button
                onClick={(e) => handleButtonClick(e, onSwipeRight)}
                className="flex items-center gap-1 px-2 py-1 hover:bg-slate-100 rounded-md transition-colors"
              >
                Donate <Heart className="h-4 w-4" />
              </button>
            </div>
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
  )
}
