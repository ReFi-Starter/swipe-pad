"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useOnboarding } from "@/providers/onboarding-provider"

export default function HomePage() {
  const router = useRouter()
  const { isOnboarded } = useOnboarding()

  useEffect(() => {
    if (isOnboarded) {
      router.push('/home')
    } else {
      router.push('/onboarding/1')
    }
  }, [router, isOnboarded])

  return null
}
