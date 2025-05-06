"use client"

import { SwipeCard } from "@/components/swipe-card"
import type { Project } from "@/components/swipe-card"

interface ProjectListViewProps {
  projects: Project[]
  onShowDetails: () => void
}

export function ProjectListView({ projects, onShowDetails }: ProjectListViewProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 w-full h-full overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
      {projects.map((project) => (
        <SwipeCard 
          key={project.id} 
          project={project}
          mode="list" 
          onShowDetails={onShowDetails}
        />
      ))}
    </div>
  )
} 