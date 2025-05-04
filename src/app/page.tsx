"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { isOnboardingCompleted } from "@/lib/onboarding"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Check if onboarding is completed
    if (isOnboardingCompleted()) {
      router.push('/home')
    } else {
      router.push('/onboarding/1')
    }
  }, [router])

  return null
}
