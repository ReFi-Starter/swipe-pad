"use client"

import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import type { TabItem } from '@/components/ui/floating-tab-switcher'
import { AnimatedView } from '@/components/ui/animated-view'
import { ProjectHeader } from '@/components/project-header'
import { ProjectListView } from '@/components/project-list-view'
import { ProjectSwipeView } from '@/components/project-swipe-view'
import { useProjects } from '@/hooks/use-projects'

const TABS: TabItem[] = [
  { id: 'swipe', label: 'Swipe' },
  { id: 'list', label: 'List' }
]

type ViewType = 'swipe' | 'list'

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<ViewType>("swipe")
  const {
    selectedCategory,
    setSelectedCategory,
    userStats,
    filteredProjects,
    handlers
  } = useProjects()

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId as ViewType)
  }

  return (
      <div 
        className="flex-1 min-h-full relative overflow-hidden pb-[72px] pt-24 px-4"
        style={{
          backgroundSize: "24px 24px",
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke-width='1.5' stroke='%23e5e5e5'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
        }}
      >
        <div className="flex flex-col relative">
              <ProjectHeader
        tabs={TABS}
        activeTab={activeTab}
        selectedCategory={selectedCategory}
        onTabChange={handleTabChange}
        onCategoryChange={setSelectedCategory}
        />
        <AnimatePresence mode="wait">
          <AnimatedView key={activeTab} className="h-full">
            {activeTab === "swipe" ? (
              <ProjectSwipeView
              projects={filteredProjects}
              userStats={userStats}
              topUserThreshold={50}
                onDonate={handlers.handleDonate}
                onSuperLike={handlers.handleSuperLike}
                onBoost={handlers.handleBoost}
                onShowDetails={handlers.handleShowDetails}
                onAddNote={handlers.handleAddNote}
                onVoteNote={handlers.handleVoteNote}
                onFlagNote={handlers.handleFlagNote}
              />
            ) : (
              <ProjectListView
                projects={filteredProjects}
                onShowDetails={handlers.handleShowDetails}
              />
            )}
          </AnimatedView>
        </AnimatePresence>
            </div>
      </div>
  )
}
