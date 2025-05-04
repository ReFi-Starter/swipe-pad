"use client"

import { useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ThumbsDown, ThumbsUp, List } from 'lucide-react'
import { SwipeCard, Project } from '@/components/swipe-card'
import { mockProjects } from '@/lib/mock-data'

export default function HomePage() {
  const [initialProjects] = useState<Project[]>(mockProjects)
  const [cards, setCards] = useState<Project[]>(initialProjects)
  const [activeTab, setActiveTab] = useState("swipe")
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  
  // Handle client-side mounting
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleSwipe = useCallback((direction: 'left' | 'right') => {
    if (cards.length > 0 && !isTransitioning && isMounted) {
      console.log(`Swiped ${direction} on:`, cards[cards.length - 1].title)
      
      setIsTransitioning(true)
      setTimeout(() => {
        setCards(prev => prev.slice(0, -1))
        setIsTransitioning(false)
      }, 250)
    } else {
      console.log("Attempted to swipe with no cards left or during transition.")
    }
  }, [cards, isTransitioning, isMounted])

  return (
    <main className="h-[100dvh] flex flex-col">
      {/* Navigation */}
      <div className="flex-shrink-0 sticky top-0 bg-background z-50">
        <div className="nav-container p-4 border-b">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <button
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "swipe" 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
                onClick={() => setActiveTab("swipe")}
              >
                Swipe
              </button>
              <button
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "list" 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
                onClick={() => setActiveTab("list")}
              >
                List
              </button>
            </div>
            {/* Placeholder for Wallet connection or other actions */}
            <div>{/* <WalletConnectButton /> */}</div>
          </div>
        </div>

        {/* Filters only shown in Swipe mode for now */}
        {activeTab === 'swipe' && (
          <div className="filter-container px-4 pt-2 border-b">
            <div className="category-filter flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {/* Example filter buttons - add functionality later */}
              <Button variant="outline" size="sm" className="h-7 px-2 text-xs">Environment</Button>
              <Button variant="outline" size="sm" className="h-7 px-2 text-xs">Education</Button>
              <Button variant="outline" size="sm" className="h-7 px-2 text-xs">Health</Button>
              <Button variant="outline" size="sm" className="h-7 px-2 text-xs">Technology</Button>
              <Button variant="outline" size="sm" className="h-7 px-2 text-xs">Community</Button>
            </div>
          </div>
        )}
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 min-h-0 relative overflow-hidden pb-[72px]">
        {activeTab === "swipe" ? (
          <>
            {/* Show message when no cards are left */}
            {cards.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center h-full text-center px-4"
              >
                <h3 className="text-xl font-semibold mb-4">No more projects</h3>
                <p className="text-muted-foreground mb-6">
                  You&apos;ve viewed all available projects in this category.
                </p>
                {/* Button to switch to List view */}
                <Button onClick={() => setActiveTab('list')}>
                  <List className="mr-2 h-4 w-4" /> View as List
                </Button>
              </motion.div>
            ) : (
              /* Render card stack if cards exist */
              <div 
                className="h-full grid place-items-center"
                style={{
                  backgroundSize: "32px 32px",
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke-width='1.5' stroke='%23e5e5e5'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`, // Lighter grid color, thinner lines
                }}
              >
                {/* Card Stack */}
                <div className="relative grid place-items-center isolate w-[280px] h-[400px]"> 
                  {cards.map((project, index) => (
                    <SwipeCard
                      key={project.id} // Use stable project ID if possible, fallback to index if needed for unique keys during potential future updates
                      project={project}
                      onSwipe={handleSwipe} // Pass handleSwipe directly
                      // Only the top card should react to onSwipe
                      // Let SwipeCard manage its own swipe logic internally based on isFront
                      cardIndex={cards.length - 1 - index}
                      active={index === cards.length - 1} // Only top card is active
                      className="col-start-1 row-start-1"
                    />
                  ))}
                </div>
                
                {/* Action Buttons */}
                {/* Show buttons only if there are cards */}
                {cards.length > 0 && (
                  <div className="absolute bottom-4 flex gap-4">
                    <Button 
                      size="icon" 
                      variant="outline"
                      className="h-10 w-10 rounded-full bg-red-50 border-red-200 text-red-500 hover:bg-red-100 hover:text-red-600 shadow-md transition-transform active:scale-95"
                      onClick={() => isMounted && !isTransitioning && handleSwipe("left")} 
                      disabled={isTransitioning || !isMounted}
                    >
                      <ThumbsDown className="h-5 w-5" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="outline"
                      className="h-10 w-10 rounded-full bg-green-50 border-green-200 text-green-500 hover:bg-green-100 hover:text-green-600 shadow-md transition-transform active:scale-95"
                      onClick={() => isMounted && !isTransitioning && handleSwipe("right")}
                      disabled={isTransitioning || !isMounted}
                    >
                      <ThumbsUp className="h-5 w-5" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          /* List View */
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 w-full h-full overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
          >
            {/* Display the original full list here */}
            {initialProjects.map((project: Project) => (
              <SwipeCard 
                key={project.id} 
                project={project}
                mode="list" 
              />
            ))}
          </motion.div>
        )}
      </div>
    </main>
  )
}
