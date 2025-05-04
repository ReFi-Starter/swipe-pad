"use client"

import { useEffect } from "react"

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Add a class to the body to disable scrolling during onboarding
  useEffect(() => {
    document.body.classList.add('onboarding-active')
    
    return () => {
      document.body.classList.remove('onboarding-active')
    }
  }, [])
  
  return (
    <main className="fixed inset-0 z-50 min-h-screen w-full bg-white overflow-hidden">
      {children}
    </main>
  )
} 