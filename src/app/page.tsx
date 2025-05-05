"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useOnboardingCheck } from "@/hooks/use-onboarding"
import { ProjectCard } from "@/components/project-card"
// import { useAppStore } from "@/store/app-store"

const MOCK_PROJECTS = [
  {
    id: "1",
    title: "Eco-friendly Water Purifier",
    description: "A sustainable water purification system that uses solar power and natural filtration methods to provide clean drinking water to communities.",
    imageUrl: "/images/project1.jpg",
    address: "0x1234567890123456789012345678901234567890" as `0x${string}`,
    verified: true,
    categories: ["Environment", "Water"],
    goal: 5000,
    raised: 2500
  },
  // Add more mock projects as needed
]

export default function Home() {
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

  return (
    <main className="main-content">
      <div className="space-y-4">
        {MOCK_PROJECTS.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </main>
  )
}
