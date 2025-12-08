"use client"
import { projects } from "@/lib/data";
import { Flame } from "lucide-react";

interface TrendingSectionProps {
  onDonate: (project: any, amount?: number) => void
}

export function TrendingSection({ onDonate }: TrendingSectionProps) {
  // Randomize trending projects
  // We use a fixed seed or just random for now. To avoid hydration mismatch, we should do this in useEffect, 
  // but for simplicity in this component we'll just take the first 5 after a random sort, assuming client-side only or accepting mismatch.
  // Better: Just shuffle.
  
  const trendingProjects = [...projects]
    .sort(() => 0.5 - Math.random())
    .slice(0, 5);

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
