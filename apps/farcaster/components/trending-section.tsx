"use client"
import { Flame } from "lucide-react"
import { projects } from "@/lib/data"

interface TrendingSectionProps {
  onDonate: (project: any, amount?: number) => void
}

export function TrendingSection({ onDonate }: TrendingSectionProps) {
  // Get specific projects for trending list
  const soko = projects.find((p) => p.name === "Soko")
  const regenEliza = projects.find((p) => p.name === "Regen Eliza")
  const jacob = projects.find((p) => p.name === "Jacob Homanics")

  // Get random Eco Projects
  const ecoProjects = projects.filter(
    (p) =>
      p.category === "Eco Projects" &&
      p.name !== "Soko" &&
      p.name !== "Regen Eliza" &&
      p.name !== "Jacob Homanics",
  )
  const shuffledEco = [...ecoProjects].sort(() => 0.5 - Math.random())
  const randomEco1 = shuffledEco[0]
  const randomEco2 = shuffledEco[1]

  // Construct the list with specific order, filtering out any missing projects
  const trendingProjects = [soko, regenEliza, randomEco1, randomEco2, jacob].filter(Boolean)

  // Fallback if we don't have enough projects (shouldn't happen with full data)
  if (trendingProjects.length < 5) {
    const remaining = projects
      .filter((p) => !trendingProjects.includes(p))
      .sort((a, b) => (b.likes || 0) - (a.likes || 0))
      .slice(0, 5 - trendingProjects.length)
    trendingProjects.push(...remaining)
  }

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold flex items-center">
          <Flame className="w-5 h-5 text-[#FFD600] mr-2" /> Trending This Week
        </h2>
      </div>

      <div className="space-y-3">
        {trendingProjects.map((project) => (
          project && (
            <div key={project.id} className="bg-gray-900 p-3 rounded-lg flex items-center">
              <img
                src={project.imageUrl || "/placeholder.svg"}
                alt={project.name}
                className="w-12 h-12 object-cover rounded-md mr-3"
              />
              <div className="flex-1">
                <p className="font-medium">{project.name}</p>
                <div className="flex items-center text-xs text-gray-400">
                  <span className="bg-gray-800 px-2 py-0.5 rounded-full mr-2">{project.category}</span>
                  <span>{project.likes} likes</span>
                </div>
              </div>
              <button
                onClick={() => onDonate(project)}
                className="bg-[#677FEB] hover:bg-[#5A6FD3] text-white text-sm py-1 px-3 rounded-lg"
              >
                Donate
              </button>
            </div>
          )
        ))}
      </div>
    </div>
  )
}
