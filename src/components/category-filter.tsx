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
          className={`relative border border-black/10 text-gray-800
            ${selectedCategory === category 
              ? 'bg-primary/60 text-primary-foreground' 
              : 'bg-white/20'
            }`}
        >
          {category}
        </Button>
      ))}
    </div>
  )
} 