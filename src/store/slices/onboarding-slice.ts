import { StateCreator } from 'zustand'

export interface OnboardingSlice {
    onboarding: {
        isOnboarded: boolean
        hydrated: boolean
    }
    setOnboarded: (value: boolean) => void
    resetOnboarding: () => void
    setHydrated: (state: boolean) => void
}

export const createOnboardingSlice: StateCreator<OnboardingSlice, [], [], OnboardingSlice> = set => ({
    onboarding: {
        isOnboarded: false,
        hydrated: false,
    },
    setOnboarded: value =>
        set(state => ({
            onboarding: {
                ...state.onboarding,
                isOnboarded: value,
            },
        })),
    resetOnboarding: () =>
        set(state => ({
            onboarding: {
                ...state.onboarding,
                isOnboarded: false,
            },
        })),
    setHydrated: state =>
        set(prevState => ({
            onboarding: {
                ...prevState.onboarding,
                hydrated: state,
            },
        })),
})
