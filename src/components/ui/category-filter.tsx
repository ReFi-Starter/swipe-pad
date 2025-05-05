'use client'

import { Button } from "@/components/ui/button"
import { categories } from "@/lib/utils"

interface CategoryFilterProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
  className?: string
}

export function CategoryFilter({
  selectedCategory,
  onCategoryChange,
  className = ""
}: CategoryFilterProps) {
  return (
    <div className={`flex gap-2 overflow-x-auto scrollbar-none ${className}`}>
      {categories.map(category => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(category)}
          className="whitespace-nowrap"
        >
          {category}
        </Button>
      ))}
    </div>
  )
} 