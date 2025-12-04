"use client"

import { cn } from "@/lib/utils"

interface ToggleMenuProps {
  viewMode: "swipe" | "list"
  setViewMode: (mode: "swipe" | "list") => void
  large?: boolean
}

export function ToggleMenu({ viewMode, setViewMode, large = false }: ToggleMenuProps) {
  return (
    <div className={`flex justify-center w-full ${large ? "mb-6" : "mb-1"}`}>
      <div className={`flex p-1 bg-gray-700/30 rounded-full ${large ? "scale-110" : ""}`}>
        <button
          className={cn(
            "rounded-full font-medium transition-colors",
            large ? "px-4 py-2 text-sm" : "px-2.5 py-1 text-xs",
            viewMode === "swipe" ? "bg-gray-800 text-white font-bold" : "bg-transparent text-gray-400",
          )}
          onClick={() => setViewMode("swipe")}
        >
          Swipe
        </button>
        <button
          className={cn(
            "rounded-full font-medium transition-colors",
            large ? "px-4 py-2 text-sm" : "px-2.5 py-1 text-xs",
            viewMode === "list" ? "bg-gray-800 text-white font-bold" : "bg-transparent text-gray-400",
          )}
          onClick={() => setViewMode("list")}
        >
          View All
        </button>
      </div>
    </div>
  )
}
