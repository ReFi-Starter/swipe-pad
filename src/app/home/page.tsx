"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Header } from "@/components/header"
import { BottomNav } from "@/components/bottom-nav"
import { CategoryFilter } from "@/components/category-filter"
import { ProjectCard } from "@/components/project-card"
import { CommunityNotesPanel } from "@/components/community-notes-panel"
import { TopUpModal } from "@/components/top-up-modal"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { projects, simulateHapticFeedback, formatCurrency, getUserSettings } from "@/lib/utils"
import { X, Heart, RotateCcw } from "lucide-react"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { StreakBadge } from "@/components/streak-badge"
import { EmojiAnimation } from "@/components/emoji-animation"
import { ComboIndicator } from "@/components/combo-indicator"
import { motion, AnimatePresence } from "framer-motion"
import { useBatchTransactions } from "@/components/batch-transaction-provider"
import { toast } from "sonner"
import { BatchStatusIndicator } from "@/components/batch-status-indicator"
import { ProjectDetailDrawer } from "@/components/project-detail-drawer"
import { ProjectUI } from "@/hooks/useDonationPool"

// Function to convert the project from utils.ts to the ProjectUI format
function convertToProjectUI(project: any): ProjectUI {
  return {
    id: project.id.toString(),
    title: project.title,
    description: project.description,
    imageUrl: project.image,
    category: project.category,
    funding: {
      goal: project.fundingGoal.toString(),
      raised: project.currentFunding.toString(),
      progress: Math.floor((project.currentFunding / project.fundingGoal) * 100)
    },
    creator: {
      name: "Project Creator", // We don't have this data in the example projects
      address: "0x0" // We don't have this data in the example projects
    },
    dates: {
      start: "",
      end: "" // We don't have dates in the example projects
    }
  };
}

export default function Home() {
  const { addTransaction, cancelTransaction } = useBatchTransactions()
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [activeTab, setActiveTab] = useState("swipe")
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0)
  const [previousProjectIndex, setPreviousProjectIndex] = useState<number | null>(null)
  const [showTopUpModal, setShowTopUpModal] = useState(false)
  const [balance, setBalance] = useState(0.25)
  const [isDragging, setIsDragging] = useState(false)
  const [dragDirection, setDragDirection] = useState<"left" | "right" | null>(null)
  const [showCommunityNotes, setShowCommunityNotes] = useState(false)
  const [selectedProject, setSelectedProject] = useState<(typeof projects)[0] | null>(null)
  const [canUndo, setCanUndo] = useState(false)
  const [streak, setStreak] = useState(7)
  const [defaultDonationAmount] = useState(0.01)
  const [showSuccessEmoji, setShowSuccessEmoji] = useState(false)
  const [showSkipEmoji, setShowSkipEmoji] = useState(false)
  const [userSettings, setUserSettings] = useState({ currency: "CENTS", language: "en", region: "US" })
  const [comboCount, setComboCount] = useState(0)
  const [showCombo, setShowCombo] = useState(false)
  const [lastTransactionId, setLastTransactionId] = useState<string | null>(null)
  const [showProjectDetailDrawer, setShowProjectDetailDrawer] = useState(false)

  const touchStartX = useRef<number | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setUserSettings(getUserSettings())
  }, [])

  const rawFilteredProjects =
    selectedCategory === "All"
      ? [...projects].sort((a, b) => (b.sponsorBoosted ? 1 : 0) - (a.sponsorBoosted ? 1 : 0))
      : [...projects]
          .filter((project) => project.category === selectedCategory)
          .sort((a, b) => (b.sponsorBoosted ? 1 : 0) - (a.sponsorBoosted ? 1 : 0))
  
  // Convert the projects to the ProjectUI format
  const filteredProjects = rawFilteredProjects.map(convertToProjectUI)

  const currentProject = filteredProjects[currentProjectIndex % filteredProjects.length]
  const nextProject = filteredProjects[(currentProjectIndex + 1) % filteredProjects.length]

  useEffect(() => {
    if (balance <= 0.05 && !showTopUpModal) {
      setShowTopUpModal(true)
    }
  }, [balance, showTopUpModal])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartX.current || !cardRef.current) return;

    const touchX = e.touches[0].clientX
    const diff = touchX - touchStartX.current

    // Apply visual feedback during drag
    const rotation = diff * 0.05; // Adjust rotation sensitivity
    cardRef.current.style.transform = `translateX(${diff}px) rotate(${rotation}deg)`;
    cardRef.current.style.transition = 'none'; // Disable transition during drag

    if (Math.abs(diff) > 20) { // Threshold to determine direction
      setDragDirection(diff > 0 ? "right" : "left")
    } else {
      setDragDirection(null)
    }
  }

  const handleTouchEnd = () => {
    if (!touchStartX.current || !cardRef.current) return;

    const touchEndX = cardRef.current.getBoundingClientRect().x;
    const diff = touchEndX - touchStartX.current;
    const threshold = window.innerWidth * 0.3;

    if (Math.abs(diff) > threshold) { 
      const direction = diff > 0 ? "right" : "left";
      // Directly apply animation style without setting swipeAnimation state
      cardRef.current.style.transition = 'transform 0.3s ease-out';
      const targetX = direction === 'right' ? '120%' : '-120%';
      const targetRotate = direction === 'right' ? '15deg' : '-15deg';
      cardRef.current.style.transform = `translateX(${targetX}) rotate(${targetRotate}deg)`;

      setTimeout(() => {
        if (direction === 'right') {
          handleDonate();
        } else {
          handleSkip();
        }
        resetCardPosition();
      }, 300);
    } else { 
      resetCardPosition(true);
    }

    touchStartX.current = null;
    setIsDragging(false);
    setDragDirection(null);
  }

  const resetCardPosition = (animate = false) => {
    if (!cardRef.current) return;
    if (animate) {
      cardRef.current.style.transition = 'transform 0.3s ease-out';
    } else {
      cardRef.current.style.transition = 'none';
    }
    cardRef.current.style.transform = 'translateX(0px) rotate(0deg)';
    // No need to reset swipeAnimation state anymore
  };

  const handleSkip = () => {
    if (isDragging) return; // Prevent action if still dragging (e.g., during animation back)
    simulateHapticFeedback()
    setPreviousProjectIndex(currentProjectIndex)
    setCurrentProjectIndex((prevIndex) => (prevIndex + 1) % filteredProjects.length)
    setCanUndo(true)
    setComboCount(0)
    setShowSkipEmoji(true)
    // Card position reset is handled in handleTouchEnd or button click animation
  }

  const handleDonate = () => {
     if (isDragging) return; // Prevent action if still dragging
    simulateHapticFeedback()
    if (balance <= 0) {
      setShowTopUpModal(true)
      resetCardPosition(true); // Animate back if donation fails
    } else {
      processDonation()
      // Card position reset is handled in handleTouchEnd or button click animation
    }
  }

 const triggerSwipeAnimation = (direction: 'left' | 'right') => {
    if (!cardRef.current) return;
    // No need to set state
    cardRef.current.style.transition = 'transform 0.3s ease-out';
    const targetX = direction === 'right' ? '120%' : '-120%';
    const targetRotate = direction === 'right' ? '15deg' : '-15deg';
    cardRef.current.style.transform = `translateX(${targetX}) rotate(${targetRotate}deg)`;

    setTimeout(() => {
        if (direction === 'right') {
            handleDonate();
        } else {
            handleSkip();
        }
        resetCardPosition(); // Reset for next card
    }, 300); // Match animation duration
};


  const processDonation = () => {
    const txId = addTransaction(defaultDonationAmount, parseInt(currentProject.id), currentProject.title)
    setLastTransactionId(txId)
    setBalance((prev) => prev - defaultDonationAmount)
    setStreak((prev) => prev + 1)
    setComboCount((prev) => prev + 1)
    setShowSuccessEmoji(true)
    if (comboCount + 1 >= 3) {
      setShowCombo(true)
    }
    setPreviousProjectIndex(currentProjectIndex)
    setCurrentProjectIndex((prevIndex) => (prevIndex + 1) % filteredProjects.length)
    setCanUndo(true)
  }

  const handleTopUp = (amount: number) => {
    setBalance((prev) => prev + amount)
    setShowTopUpModal(false)
    toast.success(`Saldo recargado: ${formatCurrency(amount, userSettings.currency)}`, {
      description: `Tu nuevo saldo es ${formatCurrency(balance + amount, userSettings.currency)}`,
    })
  }

  const handleUndo = () => {
    if (previousProjectIndex !== null) {
      if (lastTransactionId) {
        cancelTransaction(lastTransactionId)
        setLastTransactionId(null)
      }
      setCurrentProjectIndex(previousProjectIndex)
      setPreviousProjectIndex(null)
      setCanUndo(false)
      if (comboCount > 0) {
        setComboCount((prev) => prev - 1)
      }
      // Assume undo always reverts a donation for simplicity here
      setBalance((prev) => prev + defaultDonationAmount)
    }
     resetCardPosition(); // Ensure card is reset visually
  }

  const handleShowCommunityNotesFromDrawer = (project: (typeof projects)[0] | null) => {
    if (!project) return; // Guard against null project
    setSelectedProject(project);
    setShowCommunityNotes(true);
    // Note: ProjectDetailDrawer onClose handles closing itself
  };

  const handleShowCommunityNotes = (project: any) => {
    // Find the original project for community data
    const originalProject = projects.find(p => p.id.toString() === project.id);
    setSelectedProject(originalProject || null)
    setShowCommunityNotes(true)
  }

  const handleAddTag = (tag: string) => {
    console.log(`Added tag: ${tag}`)
    setShowCommunityNotes(false)
    toast.success(`Tag added: ${tag}`, {
      description: "Thank you for contributing to the community",
    })
  }

   const handleToggleExpand = () => {
      // Find the original project for the drawer
      const originalProject = projects.find(p => p.id.toString() === currentProject.id);
      setSelectedProject(originalProject || null);
      setShowProjectDetailDrawer(true);
   };

  return (
    <div className="flex flex-col h-full">
      {/* Minimal Header */}
      <Header title="SwipePad" />

      {/* Balance Row */}
      <div className="px-4 pt-2 flex justify-between items-center flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Balance: {formatCurrency(balance, userSettings.currency)}</span>
          <button
            className="text-xs h-7 px-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            onClick={() => setShowTopUpModal(true)}
          >
            Top up
          </button>
        </div>
        <StreakBadge streak={streak} size="sm" />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-grow min-h-0">
         {/* Tab Switcher Row */}
         <div className="flex justify-center items-center pt-2 flex-shrink-0">
            <TabsList>
                <TabsTrigger value="swipe">Swipe</TabsTrigger>
                <TabsTrigger value="discover">Discover</TabsTrigger>
            </TabsList>
         </div>

         {/* Category Filter Row */}
         <div className="flex justify-center items-center py-2 px-4 overflow-x-auto no-scrollbar flex-shrink-0">
            <CategoryFilter
              categories={["All", "Education", "Climate", "Health", "Wildlife"]}
              selectedCategory={selectedCategory}
              onChange={setSelectedCategory}
            />
         </div>

         {/* Main Content Area (Takes remaining space) */}
         <main className="flex-grow flex flex-col min-h-0 overflow-hidden">
            <TabsContent value="swipe" className="flex-grow flex flex-col items-center justify-center p-4 mt-0 relative">
                {/* Card Stack Area */}
                <div className="relative w-full h-full flex items-center justify-center">
                    {/* Next Project Card (Background) */}
                    <div className="absolute w-full h-full flex items-center justify-center pointer-events-none z-0" style={{transform: 'scale(0.95) translateY(10px)'}}>
                         {filteredProjects.length > 1 && (
                              <ProjectCard
                                project={nextProject}
                                key={`next-card-${currentProjectIndex + 1}`}
                                isNext
                                donationAmount={defaultDonationAmount}
                              />
                         )}
                    </div>

                    {/* Current Project Card (Foreground) */}
                    <div
                        ref={cardRef}
                        className={`absolute w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing z-10 card-swipe`}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        style={{ touchAction: 'none' }} // Disable scroll interaction on the card itself
                    >
                         <ProjectCard
                            project={currentProject}
                            onDonate={handleDonate}
                            onShowCommunityNotes={() => handleShowCommunityNotes(currentProject)}
                            showOverlay={dragDirection !== null}
                            overlayDirection={dragDirection}
                            donationAmount={defaultDonationAmount}
                            onToggleExpand={handleToggleExpand} // This prop now triggers the drawer
                        />
                    </div>
                 </div>

                 {/* Action buttons below the card stack area */}
                 <div className={`flex justify-center items-center gap-6 mt-4 pb-2 flex-shrink-0 opacity-100`}>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                           <button onClick={() => triggerSwipeAnimation('left')} className="rounded-full bg-gray-100 p-4 active:scale-95 transition-transform flex items-center justify-center shadow-md">
                              <X className="h-6 w-6 text-red-500" />
                           </button>
                        </TooltipTrigger>
                        <TooltipContent><p>Skip</p></TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    {canUndo && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                              <button onClick={handleUndo} className="rounded-full bg-gray-100 p-3 active:scale-95 transition-transform flex items-center justify-center shadow-sm">
                                <RotateCcw className="h-5 w-5 text-gray-600" />
                              </button>
                          </TooltipTrigger>
                          <TooltipContent><p>Undo</p></TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                           <button onClick={() => triggerSwipeAnimation('right')} className="rounded-full bg-[#22CC88] p-4 active:scale-95 transition-transform flex items-center justify-center shadow-md">
                              <Heart className="h-6 w-6 text-white" />
                           </button>
                        </TooltipTrigger>
                        <TooltipContent><p>Donate {formatCurrency(defaultDonationAmount, userSettings.currency)}</p></TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                 </div>
            </TabsContent>

            <TabsContent value="discover" className="flex-grow overflow-y-auto p-4 mt-0 tab-discover-content">
              {/* Ensure padding-bottom in CSS (.tab-discover-content) avoids BottomNav */}
              <AnimatePresence>
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="mb-4" // Add margin between list items
                  >
                    <ProjectCard
                      project={project}
                      mode="list"
                      onDonate={() => {
                        // Need to advance index if donating from list? Maybe not.
                        setSelectedProject(projects.find(p => p.id.toString() === project.id) || null)
                        processDonation() // Use processDonation directly for list mode
                        // Note: List mode donation doesn't affect swipe stack index directly
                      }}
                      onShowCommunityNotes={() => handleShowCommunityNotes(project)}
                      donationAmount={defaultDonationAmount}
                      // Remove isExpanded/onToggleExpand from list mode
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </TabsContent>
         </main>
      </Tabs>


      {/* Modals and Animations */}
      <EmojiAnimation type="success" show={showSuccessEmoji} onComplete={() => setShowSuccessEmoji(false)} />
      <EmojiAnimation type="skip" show={showSkipEmoji} onComplete={() => setShowSkipEmoji(false)} />
      <ComboIndicator combo={comboCount} show={showCombo} onComplete={() => setShowCombo(false)} />
      <TopUpModal isOpen={showTopUpModal} onClose={() => setShowTopUpModal(false)} onTopUp={handleTopUp} />
      {selectedProject && (
        <CommunityNotesPanel
          isOpen={showCommunityNotes}
          onClose={() => setShowCommunityNotes(false)}
          project={selectedProject}
          onAddTag={handleAddTag}
        />
      )}
      <BatchStatusIndicator />

      {/* Add the new Project Detail Drawer */}
      <ProjectDetailDrawer
        isOpen={showProjectDetailDrawer}
        onClose={() => setShowProjectDetailDrawer(false)}
        project={selectedProject} // Pass the selected project
        onShowCommunityNotes={handleShowCommunityNotesFromDrawer} // Pass handler to open notes from drawer
      />

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  )
}
