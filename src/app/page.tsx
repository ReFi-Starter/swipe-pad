'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useOnboardingCheck } from '@/hooks/use-onboarding'

export default function RootPage() {
    const router = useRouter()
    const { isOnboarded, hydrated } = useOnboardingCheck()

    useEffect(() => {
        if (!hydrated) return

        if (isOnboarded) {
            router.push('/swipe')
        } else {
            router.push('/onboarding')
        }
    }, [router, isOnboarded, hydrated])

    if (!hydrated) {
        return null
    }
}
