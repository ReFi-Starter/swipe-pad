"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function OnboardingStep1() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col gradient-green">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <h1 className="text-3xl font-bold text-white text-center mb-8">Welcome to PennySwipe</h1>

          <div className="relative w-full h-64 mb-8">
            {/* Bento-style stacked cards illustration */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-64 h-40 bg-white/20 rounded-2xl rotate-[-8deg] backdrop-blur-sm"></div>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-64 h-40 bg-white/40 rounded-2xl rotate-[-4deg] backdrop-blur-sm"></div>
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-64 h-40 bg-white/60 rounded-2xl backdrop-blur-sm">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-[#22CC88] text-4xl">♥</div>
              </div>
            </div>
          </div>

          <div className="bg-white/20 rounded-2xl p-6 backdrop-blur-sm">
            <p className="text-white text-center text-lg">
              Micro-donations, macro impact. Swipe to donate ¢1 at a time to causes you care about.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Button
          className="w-full bg-white text-[#22CC88] hover:bg-white/90"
          onClick={() => router.push("/onboarding/2")}
        >
          Let's Swipe!
        </Button>
      </div>
    </div>
  )
}
