"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { BottomNav } from "@/components/bottom-nav"
import { CategoryFilter } from "@/components/category-filter"
import { ProjectCard } from "@/components/project-card"
import { CommunityNotesPanel } from "@/components/community-notes-panel"
import { TopUpModal } from "@/components/top-up-modal"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { projects, simulateHapticFeedback, formatCurrency, getUserSettings } from "@/lib/utils"
import { X, Heart, RotateCcw } from "lucide-react"
import { AnimatedButton } from "@/components/animated-button"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { StreakBadge } from "@/components/streak-badge"
import { EmojiAnimation } from "@/components/emoji-animation"
import { ComboIndicator } from "@/components/combo-indicator"
import { motion, AnimatePresence } from "framer-motion"
import { useBatchTransactions } from "@/components/batch-transaction-provider"
import { toast } from "sonner"

// Añadir el BatchStatusIndicator al componente Home
import { BatchStatusIndicator } from "@/components/batch-status-indicator"

export default function Home() {
  const { addTransaction, cancelTransaction } = useBatchTransactions()
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [activeTab, setActiveTab] = useState("swipe")
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0)
  const [previousProjectIndex, setPreviousProjectIndex] = useState<number | null>(null)
  const [showTopUpModal, setShowTopUpModal] = useState(false)
  const [donationAmount, setDonationAmount] = useState(0)
  const [balance, setBalance] = useState(0.25)
  const [points, setPoints] = useState(0)
  const [swipeAnimation, setSwipeAnimation] = useState<"left" | "right" | null>(null)
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

  const touchStartX = useRef<number | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setUserSettings(getUserSettings())
  }, [])

  // Filter projects and prioritize sponsor boosted ones
  const filteredProjects =
    selectedCategory === "All"
      ? [...projects].sort((a, b) => (b.sponsorBoosted ? 1 : 0) - (a.sponsorBoosted ? 1 : 0))
      : [...projects]
          .filter((project) => project.category === selectedCategory)
          .sort((a, b) => (b.sponsorBoosted ? 1 : 0) - (a.sponsorBoosted ? 1 : 0))

  const currentProject = filteredProjects[currentProjectIndex % filteredProjects.length]
  const nextProject = filteredProjects[(currentProjectIndex + 1) % filteredProjects.length]

  // Check if balance is too low after each donation
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
    if (!touchStartX.current || !cardRef.current) return

    const touchX = e.touches[0].clientX
    const diff = touchX - touchStartX.current

    if (Math.abs(diff) > 20) {
      if (diff > 0) {
        setDragDirection("right")
      } else {
        setDragDirection("left")
      }
    } else {
      setDragDirection(null)
    }
  }

  const handleTouchEnd = () => {
    if (!touchStartX.current || !cardRef.current) return

    if (dragDirection === "right") {
      handleDonate()
    } else if (dragDirection === "left") {
      handleSkip()
    }

    touchStartX.current = null
    setIsDragging(false)
    setDragDirection(null)
  }

  const handleSkip = () => {
    simulateHapticFeedback()
    setPreviousProjectIndex(currentProjectIndex)
    setCurrentProjectIndex((prevIndex) => (prevIndex + 1) % filteredProjects.length)
    setCanUndo(true)

    // Reset combo count on skip
    setComboCount(0)

    // Mostrar solo animación de emoji (el toast se maneja en el batch provider)
    setShowSkipEmoji(true)
  }

  const handleDonate = () => {
    simulateHapticFeedback()
    if (balance <= 0) {
      setShowTopUpModal(true)
    } else {
      // Procesar la donación directamente
      processDonation()
    }
  }

  const processDonation = () => {
    // Añadir la transacción al batch
    const txId = addTransaction(defaultDonationAmount, currentProject.id, currentProject.title)
    setLastTransactionId(txId)

    setDonationAmount((prev) => prev + defaultDonationAmount)
    setPoints((prev) => prev + 5)
    setBalance((prev) => prev - defaultDonationAmount)

    // Incrementar streak y combo
    setStreak((prev) => prev + 1)
    setComboCount((prev) => prev + 1)

    // Mostrar solo animación de emoji (el toast se maneja en el batch provider)
    setShowSuccessEmoji(true)

    // Mostrar indicador de combo si es necesario (3, 5, o más)
    if (comboCount + 1 >= 3) {
      setShowCombo(true)
    }

    // Avanzar al siguiente proyecto
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
      // Cancelar la última transacción si existe
      if (lastTransactionId) {
        cancelTransaction(lastTransactionId)
        setLastTransactionId(null)
      }

      setCurrentProjectIndex(previousProjectIndex)
      setPreviousProjectIndex(null)
      setCanUndo(false)

      // Reducir el combo si se deshace una donación
      if (comboCount > 0) {
        setComboCount((prev) => prev - 1)
      }

      // Devolver el balance
      setBalance((prev) => prev + defaultDonationAmount)
      setDonationAmount((prev) => prev - defaultDonationAmount)
    }
  }

  const handleShowCommunityNotes = (project: (typeof projects)[0]) => {
    setSelectedProject(project)
    setShowCommunityNotes(true)
  }

  const handleAddTag = (tag: string) => {
    // En una app real, esto añadiría la etiqueta al proyecto
    console.log(`Added tag: ${tag}`)
    setShowCommunityNotes(false)

    toast.success(`Etiqueta añadida: ${tag}`, {
      description: "Gracias por contribuir a la comunidad",
    })
  }

  // Function to determine if a project should be faded due to low trust
  const shouldFadeProject = (project: typeof currentProject) => {
    const fakeTags =
      project.communityTags?.filter((tag) => tag.text.includes("Fake") || tag.text.includes("Spam")) || []

    return fakeTags.length > 0 && fakeTags.reduce((sum, tag) => sum + tag.count, 0) > 5
  }

  return (
    <div className="flex flex-col h-full">
      <Header title="SwipePad" />
      
      <div className="px-4 pt-2 flex justify-between items-center">
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
      
      <main className="swipe-content px-4 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between mb-2">
            <TabsList>
              <TabsTrigger value="swipe">Swipe</TabsTrigger>
              <TabsTrigger value="discover">Discover</TabsTrigger>
            </TabsList>
            
            <CategoryFilter
              categories={["All", "Education", "Climate", "Health", "Wildlife"]}
              selectedCategory={selectedCategory}
              onChange={setSelectedCategory}
            />
          </div>

          <TabsContent value="swipe" className="mt-0 h-full">
            <div className="relative flex-1 flex items-center justify-center responsive-card-height">
              {/* Current Project Card */}
              <div
                ref={cardRef}
                className={`w-full card-swipe ${swipeAnimation ? `swiping-${swipeAnimation}` : ""} ${
                  isDragging ? "transition-none" : ""
                }`}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <ProjectCard
                  project={currentProject}
                  onSwipeLeft={handleSkip}
                  onSwipeRight={handleDonate}
                  onDonate={handleDonate}
                  onShowCommunityNotes={() => handleShowCommunityNotes(currentProject)}
                  showOverlay={dragDirection !== null}
                  overlayDirection={dragDirection}
                  donationAmount={defaultDonationAmount}
                  isExpanded={false}
                />
              </div>

              {/* Next Project Card (underneath) */}
              <div className="absolute inset-0 z-0">
                <ProjectCard
                  project={nextProject}
                  isNext
                  donationAmount={defaultDonationAmount}
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-center items-center gap-4 mt-auto pb-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div onClick={handleSkip} className="rounded-full bg-gray-100 p-3 cursor-pointer active:scale-95 transition-transform">
                      <X className="h-6 w-6 text-red-500" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Skip this project</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {canUndo && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div onClick={handleUndo} className="rounded-full bg-gray-100 p-3 cursor-pointer active:scale-95 transition-transform">
                        <RotateCcw className="h-5 w-5 text-gray-600" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Undo last action</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div onClick={handleDonate} className="rounded-full bg-[#22CC88] p-3 cursor-pointer active:scale-95 transition-transform">
                      <Heart className="h-6 w-6 text-white" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Donate {formatCurrency(defaultDonationAmount, userSettings.currency)}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </TabsContent>

          <TabsContent value="discover" className="mt-0 overflow-y-auto max-h-[calc(100vh-180px)]">
            <AnimatePresence>
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ProjectCard
                    project={project}
                    mode="list"
                    onDonate={() => {
                      setSelectedProject(project)
                      handleDonate()
                    }}
                    onShowCommunityNotes={() => handleShowCommunityNotes(project)}
                    donationAmount={defaultDonationAmount}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </TabsContent>
        </Tabs>
      </main>

      {/* Animaciones de emoji */}
      <EmojiAnimation type="success" show={showSuccessEmoji} onComplete={() => setShowSuccessEmoji(false)} />
      <EmojiAnimation type="skip" show={showSkipEmoji} onComplete={() => setShowSkipEmoji(false)} />

      {/* Indicador de combo */}
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
      <BottomNav />
    </div>
  )
}
