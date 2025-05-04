"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { X, Heart } from "lucide-react"

export default function OnboardingStep2() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col gradient-green">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="flex justify-between items-center mb-12">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-2">
                <X className="h-8 w-8 text-white" />
              </div>
              <p className="text-white font-medium">Skip</p>
            </div>

            <div className="w-16 h-1 bg-white/30 rounded-full"></div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-2">
                <Heart className="h-8 w-8 text-[#22CC88]" />
              </div>
              <p className="text-white font-medium">Donate</p>
            </div>
          </div>

          <div className="bg-white/20 rounded-2xl p-6 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-white text-center mb-4">Swipe to give or skip</h2>
            <p className="text-white text-center">
              Swipe left to skip a project, or right to donate. Every swipe right donates your chosen amount to a worthy
              cause.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Button className="w-full bg-white text-[#22CC88] hover:bg-white/90" onClick={() => router.push("/home")}>
          Start Now
        </Button>
      </div>
    </div>
  )
}
