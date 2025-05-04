"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useOnboardingCheck } from "@/hooks/use-onboarding"
// import { useAppStore } from "@/store/app-store"

export default function HomePage() {
  const router = useRouter()
  const { isOnboarded, hydrated } = useOnboardingCheck()

  useEffect(() => {
    if (!hydrated) return

    if (isOnboarded) {
      router.push('/home')
    } else {
      router.push('/onboarding')
    }
  }, [router, isOnboarded, hydrated])

  // Mostrar un estado de carga mientras se hidrata
  if (!hydrated) {
    return null // O un componente de loading
  }

  return null
}
