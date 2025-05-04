"use client"

import type React from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { X, MessageSquare, Flame, ExternalLink, Share2 } from "lucide-react"
import { getTagColor, projects } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Base type from utils
type BaseProjectType = (typeof projects)[0];

// Local type accommodating potential variations
interface DisplayProjectType extends BaseProjectType {
  website?: string; // Make website explicitly optional
  sponsored?: boolean; // Make sponsored explicitly optional
}

interface ProjectDetailDrawerProps {
  isOpen: boolean
  onClose: () => void
  project: DisplayProjectType | null // Use the local, more permissive type
  onShowCommunityNotes: (project: BaseProjectType) => void // Handler still expects base type
}

export function ProjectDetailDrawer({
  isOpen,
  onClose,
  project,
  onShowCommunityNotes,
}: ProjectDetailDrawerProps) {
  if (!project) return null

  // Use optional chaining and nullish coalescing
  const websiteUrl = project.websiteUrl ?? project.website ?? undefined;
  const isSponsored = project.sponsored ?? project.sponsorBoosted;

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
      navigator.clipboard.writeText(websiteUrl || window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  const handleShowNotes = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (project) {
      // Pass the original base project type to the handler if needed
      // Although `project` here is DisplayProjectType, it satisfies BaseProjectType
      onShowCommunityNotes(project);
    }
    onClose();
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-40"
            onClick={onClose}
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 max-h-[85vh] bg-white rounded-t-2xl shadow-lg z-50 flex flex-col swipe-pad-modal"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-slate-200 flex-shrink-0">
              <h2 className="text-lg font-semibold">Project Details</h2>
              <Button variant="ghost" size="sm" onClick={onClose} className="p-1 h-auto">
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-grow overflow-y-auto p-4">
              {/* Banner Image */}
               <div className="relative w-full h-40 mb-4 rounded-lg overflow-hidden">
                 <Image
                   src={project.image || "/placeholder.svg"}
                   alt={`${project.title} banner`}
                   fill
                   className="object-cover object-center pointer-events-none"
                 />
               </div>

              {/* Title */}
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-1.5">
                {project.title}
                {websiteUrl && (
                  <a
                      href={websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-700 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                      aria-label="Visit project website"
                  >
                      <ExternalLink className="h-4 w-4" />
                  </a>
                 )}
              </h3>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="bg-[#22CC88] text-white px-2 py-1 rounded-full text-xs">
                  {project.category}
                </span>
                {isSponsored && (
                  <span className="bg-amber-500 text-white px-2 py-1 rounded-full text-xs flex items-center">
                    <Flame className="h-3 w-3 mr-1" /> Boosted
                  </span>
                )}
                {project.communityTags?.map((tag) => (
                  <span key={tag.id} className={`text-xs px-2 py-0.5 rounded-full ${getTagColor(tag.text)}`}>
                    {tag.text} ({tag.count})
                  </span>
                ))}
              </div>

              {/* Description */}
              <p className="text-sm text-slate-600 mb-4">{project.description}</p>

              {/* Funding Progress */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Funding goal</span>
                  <span>${project.fundingGoal}</span>
                </div>
                <Progress value={project.currentFunding} max={project.fundingGoal} />
              </div>
            </div>

             {/* Actions Footer */}
             <div className="p-4 border-t border-slate-100 flex justify-between items-center gap-2 flex-shrink-0">
                 <Button
                      variant="outline"
                      size="sm"
                      onClick={handleShowNotes}
                      className="text-xs flex-1"
                    >
                      <MessageSquare className="h-3 w-3 mr-1" /> Community Notes
                 </Button>
                 <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                           <button onClick={handleShare} className="text-slate-500 p-2 rounded-md hover:bg-slate-100" aria-label="Share project">
                              <Share2 className="h-4 w-4" />
                           </button>
                        </TooltipTrigger>
                        <TooltipContent><p>Share Project</p></TooltipContent>
                    </Tooltip>
                 </TooltipProvider>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
} 