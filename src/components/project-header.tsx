"use client"

import { FloatingLayout } from "@/components/ui/floating-layout"
import { FloatingTabSwitcher } from "@/components/ui/floating-tab-switcher"
import { CategoryFilter } from "@/components/ui/category-filter"
import type { TabItem } from "@/components/ui/floating-tab-switcher"

interface ProjectHeaderProps {
  tabs: TabItem[]
  activeTab: string
  selectedCategory: string
  onTabChange: (tabId: string) => void
  onCategoryChange: (category: string) => void
}

export function ProjectHeader({
  tabs,
  activeTab,
  selectedCategory,
  onTabChange,
  onCategoryChange
}: ProjectHeaderProps) {
  return (
    <FloatingLayout>
      <div className="flex flex-col items-center gap-2">
        <FloatingTabSwitcher
          tabs={tabs}
          activeTab={activeTab}
          onChange={onTabChange}
          />
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={onCategoryChange}
          className="px-4"
        />
      </div>
    </FloatingLayout>
  )
} 