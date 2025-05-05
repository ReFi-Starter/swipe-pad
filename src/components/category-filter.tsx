"use client"

interface CategoryFilterProps {
  onChange: (category: string) => void
  selectedCategory: string
  categories: string[]
}

export function CategoryFilter({ onChange, selectedCategory, categories }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-none py-2 px-1">
      {categories.map((category) => (
        <button
          key={category}
          className={`
            h-8 px-3 rounded-full text-sm whitespace-nowrap
            transition-all duration-200
            ${selectedCategory === category 
              ? "bg-[#22CC88] text-white shadow-[0_1px_2px_rgba(0,0,0,0.1)]" 
              : "bg-[#F0F2F5] text-[#333333] hover:bg-[#E4E6E9]"
            }
          `}
          onClick={() => onChange(category)}
        >
          {category}
        </button>
      ))}
    </div>
  )
}
