"use client"

import { ProjectCard } from "@/components/project-card"
import type { Project } from "@/lib/data"

interface CategorySectionProps {
  category: string
  projects: Project[]
  onDonate: (project: Project, amount?: number) => void
  onBoost?: (project: Project, amount: number) => void
}

export function CategorySection({ category, projects, onDonate, onBoost }: CategorySectionProps) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <span className="mr-2">{category}</span>
        <span className="text-sm text-gray-400 font-normal">({projects.length})</span>
      </h2>

      <div
        className="overflow-x-auto pb-4"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#FFD600 #1F2937",
        }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            height: 12px;
          }
          div::-webkit-scrollbar-track {
            background: #1f2937;
            border-radius: 4px;
          }
          div::-webkit-scrollbar-thumb {
            background-color: #ffd600;
            border-radius: 4px;
          }
        `}</style>
        <div className="flex space-x-4">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              viewMode="category"
              onDonate={(amount) => onDonate(project, amount)}
              onBoost={onBoost ? (amount) => onBoost(project, amount) : undefined}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
