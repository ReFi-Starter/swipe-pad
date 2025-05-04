import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/store/app-store'

export function useOnboardingCheck() {
  const router = useRouter()
  const { isOnboarded, hydrated } = useAppStore()

  useEffect(() => {
    // Solo ejecutar la lógica cuando el store esté hidratado
    if (!hydrated) return

    if (!isOnboarded) {
      router.push('/onboarding')
    }
  }, [isOnboarded, hydrated, router])

  return { isOnboarded, hydrated }
} 