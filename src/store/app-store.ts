import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface AppState {
  isOnboarded: boolean
  setOnboarded: (value: boolean) => void
  resetOnboarding: () => void
  hydrated: boolean
  setHydrated: (state: boolean) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isOnboarded: false,
      hydrated: false,
      setOnboarded: (value) => set({ isOnboarded: value }),
      resetOnboarding: () => set({ isOnboarded: false }),
      setHydrated: (state) => set({ hydrated: state }),
    }),
    {
      name: 'swipepad-storage',
      storage: createJSONStorage(() => localStorage), // Usar localStorage como fallback
      onRehydrateStorage: () => (state) => {
        // Cuando la hidratación se complete
        state?.setHydrated(true)
      },
    }
  )
) 