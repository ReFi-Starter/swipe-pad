import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/store/use-app-store'

export function useOnboardingCheck() {
    const router = useRouter()
    const isOnboarded = useAppStore(state => state.onboarding.isOnboarded)
    const hydrated = useAppStore(state => state.onboarding.hydrated)

    useEffect(() => {
        // Solo ejecutar la lógica cuando el store esté hidratado
        if (!hydrated) return

        if (!isOnboarded) {
            router.push('/onboarding')
        }
    }, [isOnboarded, hydrated, router])

    return { isOnboarded, hydrated }
}
