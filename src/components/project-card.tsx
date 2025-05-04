"use client"

import type React from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { X, Heart, MessageSquare, Flame, ExternalLink, ChevronDown } from "lucide-react"
import { getTagColor, getTrustLevel, projects } from "@/lib/utils"

type BaseProjectType = (typeof projects)[0];

interface ProjectCardProps {
  project: BaseProjectType & {
    website?: string
    sponsored?: boolean
  }
  mode?: "swipe" | "list"
  onDonate?: () => void
  onShowCommunityNotes?: () => void
  showOverlay?: boolean
  overlayDirection?: "left" | "right" | null
  isNext?: boolean
  donationAmount?: number
  onToggleExpand?: () => void
}

export function ProjectCard({
  project,
  mode = "swipe",
  onDonate,
  onShowCommunityNotes,
  showOverlay = false,
  overlayDirection = null,
  isNext = false,
  donationAmount = 0.01,
  onToggleExpand,
}: ProjectCardProps) {
  const trustLevel = getTrustLevel(project)
  const websiteUrl = project.websiteUrl ?? project.website ?? undefined;

  const preventDrag = (e: React.DragEvent) => {
    e.preventDefault()
    return false
  }

  const handleButtonClick = (e: React.MouseEvent, callback?: () => void) => {
    e.stopPropagation()
    if (callback) callback()
  }

  const descriptionExcerpt = project.description.length > 100 ? `${project.description.substring(0, 97)}...` : project.description;

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
            {(project.sponsored) && (
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

  let cardClasses = `w-full h-full overflow-hidden bento-bevel ${trustLevel.className} select-none flex flex-col`
  if (isNext) cardClasses += " opacity-50 pointer-events-none"

  if (trustLevel.level === "low" && !isNext) {
    return (
      <div className={`relative w-full h-full ${isNext ? "z-0" : "z-10"}`}>
        <Card className={cardClasses}>
          <div className="flex-1 flex flex-col items-center justify-center bg-slate-100 p-6 text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold mb-2">Insufficient Trust</h3>
            <p className="text-sm text-slate-600 mb-4">
              This project has flagged community concerns.
            </p>
            <Button
              variant="outline"
              onClick={(e) => handleButtonClick(e, onShowCommunityNotes)}
            >
              View Community Notes
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className={`relative w-full h-full ${isNext ? "z-0" : "z-10"}`}>
      <Card className={cardClasses}>
        <div className="relative w-full h-[20%] flex-shrink-0 overflow-hidden rounded-t-lg">
          <Image
            src={project.image || "/placeholder.svg"}
            alt={`${project.title} banner`}
            fill
            className="object-cover object-center pointer-events-none"
            draggable={false}
            onDragStart={preventDrag}
            priority={!isNext}
          />
        </div>
        <CardContent className={`p-4 pt-2 flex-grow flex flex-col overflow-hidden`}>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-lg font-semibold line-clamp-2 flex-grow">
              {project.title}
            </h3>
            {websiteUrl && (
              <a
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700 transition-colors flex-shrink-0 p-1 -mr-1"
                onClick={(e) => e.stopPropagation()}
                aria-label="Visit project website"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
          <p className="text-sm text-slate-600 line-clamp-2 mb-2">{descriptionExcerpt}</p>
          <div className="flex flex-wrap gap-1 mb-2">
            {project.communityTags?.filter(t => t.text.includes('Verified')).slice(0, 1).map((tag) => (
              <span key={tag.id} className={`text-xs px-2 py-0.5 rounded-full ${getTagColor(tag.text)}`}>
                {tag.text} ({tag.count})
              </span>
            ))}
          </div>
          <div className="space-y-1 mt-auto pt-2">
            <div className="flex justify-between text-xs text-slate-500">
              <span>Funded</span>
              <span>${project.currentFunding} / ${project.fundingGoal}</span>
            </div>
            <Progress value={project.currentFunding} max={project.fundingGoal} className="h-1.5"/>
          </div>
          {!isNext && mode === 'swipe' && (
            <div className="flex justify-center mt-2 flex-shrink-0">
              <button
                onClick={(e) => handleButtonClick(e, onToggleExpand)}
                className={`p-1 rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600`}
                aria-label={"Expand card details"}
              >
                <ChevronDown className="h-5 w-5" />
              </button>
            </div>
          )}
        </CardContent>
        {showOverlay && overlayDirection === "left" && (
          <div className="absolute inset-0 bg-red-500/20 rounded-2xl flex items-center justify-center pointer-events-none">
            <div className="bg-red-500/80 w-20 h-20 rounded-full flex items-center justify-center">
              <X className="text-white h-10 w-10" />
            </div>
          </div>
        )}
        {showOverlay && overlayDirection === "right" && (
          <div className="absolute inset-0 bg-[#22CC88]/20 rounded-2xl flex items-center justify-center pointer-events-none">
            <div className="bg-[#22CC88]/80 w-20 h-20 rounded-full flex items-center justify-center">
              <Heart className="text-white h-10 w-10" />
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
