"use client"

import { useRef } from "react"
import { cn } from "@/lib/utils"
import { categories } from "@/lib/data"

interface CategoryMenuProps {
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  setCurrentProjectIndex: () => void
}

export function CategoryMenu({ selectedCategory, setSelectedCategory, setCurrentProjectIndex }: CategoryMenuProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category)
    setCurrentProjectIndex()
  }

  if (categories.length === 0) {
    return null
  }

  const visibleCategories = categories

  return (
    <div className="relative w-full mb-1">
      <div
        ref={scrollRef}
        className="overflow-x-auto pb-1 px-6 scrollbar-hide w-full"
        style={{
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <div className="inline-flex relative flex-col min-w-full">
          <div className="flex space-x-3 relative z-10">
            {visibleCategories.map((category) => (
              <button
                key={category}
                className={cn(
                  "px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors flex-shrink-0 font-medium relative",
                  selectedCategory === category
                    ? "bg-[#FFD600] text-black"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600",
                )}
                onClick={() => handleCategoryClick(category)}
              >
                {category}
                {selectedCategory === category && (
                  <div className="absolute -bottom-3 left-0 w-full h-1 bg-[#FFD600] rounded-full" />
                )}
              </button>
            ))}
          </div>
          {/* Gray Track */}
          <div className="absolute -bottom-1 left-0 w-full h-1 bg-gray-800 rounded-full" />
        </div>
      </div>
    </div>
  )
}
