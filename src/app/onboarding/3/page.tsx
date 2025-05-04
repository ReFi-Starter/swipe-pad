"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function OnboardingStep3() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Let&apos;s get donating!</h1>
        <p className="text-center text-slate-600 mb-8">Your micro-donations make a macro difference. Ready to start?</p>

        <div className="mt-16 flex justify-center">
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-slate-200"></div>
            <div className="w-2 h-2 rounded-full bg-slate-200"></div>
            <div className="w-2 h-2 rounded-full bg-[#22CC88]"></div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Button className="w-full" onClick={() => router.push("/home")}>
          Start Swiping
        </Button>
      </div>
    </div>
  )
}
