"use client"

interface CategoryFilterProps {
  onChange: (category: string) => void
  selectedCategory: string
  categories: string[]
}

export function CategoryFilter({ onChange, selectedCategory, categories }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto py-2 no-scrollbar">
      {categories.map((category) => (
        <button
          key={category}
          className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
            selectedCategory === category ? "bg-[#22CC88] text-white" : "bg-[#F0F2F5] text-slate-700"
          }`}
          onClick={() => onChange(category)}
        >
          {category}
        </button>
      ))}
    </div>
  )
}
