import { StateCreator } from 'zustand'

type ViewType = 'swipe' | 'list'

export interface SwipeSlice {
    swipe: {
        activeTab: ViewType
        selectedCategory: string
    }
    setActiveTab: (tab: ViewType) => void
    setSelectedCategory: (category: string) => void
}

// Circular reference fixed by using type params
export const createSwipeSlice: StateCreator<SwipeSlice, [], [], SwipeSlice> = set => ({
    swipe: {
        activeTab: 'swipe',
        selectedCategory: '',
    },
    setActiveTab: tab =>
        set((state: SwipeSlice) => ({
            swipe: {
                ...state.swipe,
                activeTab: tab,
            },
        })),
    setSelectedCategory: category =>
        set((state: SwipeSlice) => ({
            swipe: {
                ...state.swipe,
                selectedCategory: category,
            },
        })),
})
