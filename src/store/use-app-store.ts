import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { createSwipeSlice, SwipeSlice } from './slices/swipe-slice'
import { createOnboardingSlice, OnboardingSlice } from './slices/onboarding-slice'

// Define the full app state type by combining all slice interfaces
export type AppState = SwipeSlice & OnboardingSlice
// Add more slices as needed: & OtherSlice & AnotherSlice

// Create the combined store with all slices and persistence
export const useAppStore = create<AppState>()(
    persist(
        (...a) => ({
            ...createSwipeSlice(...a),
            ...createOnboardingSlice(...a),
        }),
        {
            name: 'swipepad-storage',
            storage: createJSONStorage(() => localStorage),
            // Only persist certain parts of the state
            partialize: state => ({
                onboarding: state.onboarding,
            }),
            // When hydration completes
            onRehydrateStorage: () => state => {
                state?.setHydrated(true)
            },
        },
    ),
)
