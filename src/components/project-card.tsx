"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProjectHeartButton } from "@/components/project-heart-button"
import { CommunityNotesButton } from "@/components/community-notes-button"
import { VerifiedBadge } from "@/components/verified-badge"
import { ExpandButton } from "@/components/expand-button"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"
import { formatCurrency, getUserSettings } from "@/lib/utils"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { InfoIcon } from "lucide-react"
import { ProjectUI } from "@/hooks/useDonationPool"

interface ProjectCardProps {
  project: ProjectUI
  onDonate?: () => void
  onShowCommunityNotes?: () => void
  onToggleExpand?: () => void
  showOverlay?: boolean
  overlayDirection?: "left" | "right" | null
  donationAmount?: number
  mode?: "card" | "list"
  isNext?: boolean
}

export function ProjectCard({
  project,
  onDonate,
  onShowCommunityNotes,
  onToggleExpand,
  showOverlay = false,
  overlayDirection = null,
  donationAmount = 0.01,
  mode = "card",
  isNext = false,
}: ProjectCardProps) {
  const [userSettings, setUserSettings] = useState({ currency: "CENTS" })

  useEffect(() => {
    setUserSettings(getUserSettings())
  }, [])

  const cardVariants = {
    default: {
      rotate: 0,
      opacity: 1,
    },
    left: {
      rotate: -5,
      opacity: 0.9,
    },
    right: {
      rotate: 5,
      opacity: 0.9,
    },
  }

  // For the fade overlay when swiping
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 0.8 },
  }

  const isListMode = mode === "list"

  // Ensure all properties exist
  const safeProject = {
    ...project,
    imageUrl: project.imageUrl || '',
    category: project.category || 'General',
    title: project.title || 'Untitled Project',
    description: project.description || 'No description available',
    creator: project.creator || { name: 'Anonymous', address: '' },
    funding: project.funding || { raised: '0', goal: '0', progress: 0 },
    dates: project.dates || { start: '', end: '' }
  }

  // In list mode, create a separate card
  if (isListMode) {
    return (
      <Card className="overflow-hidden">
        <div className="relative">
          {safeProject.imageUrl ? (
            <div
              className="h-36 bg-cover bg-center"
              style={{ backgroundImage: `url(${safeProject.imageUrl})` }}
            />
          ) : (
            <div className="h-36 bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center">
              <InfoIcon className="h-10 w-10 text-gray-400" />
            </div>
          )}
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="bg-white/90 hover:bg-white/95">
              {safeProject.category}
            </Badge>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-semibold text-lg">{safeProject.title}</h3>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <span>{safeProject.creator.name}</span>
                <VerifiedBadge isVerified={true} size="sm" />
              </div>
            </div>
            {onDonate && (
              <Button
                variant="default"
                className="bg-[#22CC88] hover:bg-[#1eb77a] text-white"
                size="sm"
                onClick={onDonate}
              >
                Donate
              </Button>
            )}
          </div>
          
          <div className="relative h-2 bg-gray-100 rounded-full mb-2 overflow-hidden">
            <div
              className="absolute h-full bg-[#22CC88]"
              style={{ width: `${safeProject.funding.progress}%` }}
            />
          </div>
          <div className="flex justify-between text-sm">
            <span>
              {formatCurrency(parseFloat(safeProject.funding.raised), userSettings.currency)} raised
            </span>
            <span>{safeProject.funding.progress}%</span>
          </div>
          <div className="mt-3 flex justify-between">
            <div className="text-xs text-gray-500">
              {safeProject.dates.end 
                ? `Ends ${formatDistanceToNow(new Date(safeProject.dates.end), { addSuffix: true })}`
                : "Ends soon"
              }
            </div>
            <div className="flex gap-2">
              {onShowCommunityNotes && <CommunityNotesButton onClick={onShowCommunityNotes} />}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Default swipe card mode
  return (
    <motion.div
      className={`w-full h-full max-w-md mx-auto relative ${isNext ? "pointer-events-none" : ""}`}
      animate={overlayDirection ? overlayDirection : "default"}
      variants={cardVariants}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card
        className={`overflow-hidden h-full flex flex-col ${
          isNext ? "opacity-60 shadow-sm" : "shadow-md"
        }`}
      >
        <div className="relative flex-shrink-0" style={{ height: "40%" }}>
          {/* Overlay for swipe feedback */}
          {showOverlay && overlayDirection && (
            <motion.div
              className={`absolute inset-0 z-10 ${
                overlayDirection === "left" ? "bg-red-500" : "bg-green-500"
              }`}
              initial="hidden"
              animate="visible"
              variants={overlayVariants}
            >
              <div className="flex items-center justify-center h-full">
                <span className="text-white text-2xl font-bold">
                  {overlayDirection === "left" ? "SKIP" : "DONATE"}
                </span>
              </div>
            </motion.div>
          )}

          {safeProject.imageUrl ? (
            <div
              className="h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${safeProject.imageUrl})` }}
            />
          ) : (
            <div className="h-full bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center">
              <InfoIcon className="h-16 w-16 text-gray-400" />
            </div>
          )}

          <div className="absolute top-3 left-3 flex flex-col gap-2">
            <Badge variant="secondary" className="bg-white/90 hover:bg-white/95">
              {safeProject.category}
            </Badge>
          </div>

          {onDonate && (
            <div className="absolute bottom-3 right-3">
              <ProjectHeartButton amount={donationAmount} currency={userSettings.currency} onClick={onDonate} />
            </div>
          )}

          {onShowCommunityNotes && (
            <div className="absolute bottom-3 left-3">
              <CommunityNotesButton onClick={onShowCommunityNotes} />
            </div>
          )}
        </div>

        <CardContent className="p-4 flex-grow flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-xl mb-1">{safeProject.title}</h3>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-gray-600">{safeProject.creator.name}</span>
                  <VerifiedBadge isVerified={true} size="sm" />
                </div>
              </div>
              {onToggleExpand && <ExpandButton onClick={onToggleExpand} />}
            </div>

            <p className="text-gray-600 text-sm line-clamp-2 mb-4">
              {safeProject.description}
            </p>
          </div>

          <div>
            <div className="relative h-2 bg-gray-100 rounded-full mb-2 overflow-hidden">
              <div
                className="absolute h-full bg-[#22CC88]"
                style={{ width: `${safeProject.funding.progress}%` }}
              />
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span>
                {formatCurrency(parseFloat(safeProject.funding.raised), userSettings.currency)} raised
              </span>
              <span>Goal: {formatCurrency(parseFloat(safeProject.funding.goal), userSettings.currency)}</span>
            </div>
            <div className="text-xs text-gray-500">
              {safeProject.dates.end
                ? `Ends ${formatDistanceToNow(new Date(safeProject.dates.end), { addSuffix: true })}`
                : "Ends soon"
              }
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
