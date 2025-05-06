'use client'

import { CategoryFilter } from '@/components/category-filter'
import type { TabItem } from '@/components/ui/floating-tab-switcher'
import { FloatingTabSwitcher } from '@/components/ui/floating-tab-switcher'
import { useAppStore } from '@/store/use-app-store'

const TABS: TabItem[] = [
    { id: 'swipe', label: 'Swipe' },
    { id: 'list', label: 'List' },
]

export default function SwipeHeader() {
    const activeTab = useAppStore(state => state.swipe.activeTab)
    const selectedCategory = useAppStore(state => state.swipe.selectedCategory)
    const setActiveTab = useAppStore(state => state.setActiveTab)
    const setSelectedCategory = useAppStore(state => state.setSelectedCategory)

    return (
        <nav className='fixed z-10 flex w-full flex-col items-center gap-4 p-4'>
            <FloatingTabSwitcher tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />
            <CategoryFilter
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                className='w-full max-w-md'
            />
        </nav>
    )
}
