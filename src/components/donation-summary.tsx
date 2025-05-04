"use client"

import { Trophy, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface DonationSummaryProps {
  isOpen: boolean
  onClose: () => void
  amount: number
  points: number
}

export function DonationSummary({ isOpen, onClose, amount, points }: DonationSummaryProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center p-6">
      <div className="bg-[#22CC88]/10 p-6 rounded-full mb-6">
        <Trophy className="h-16 w-16 text-[#22CC88]" />
      </div>
      <h1 className="text-2xl font-bold mb-2">Well done!</h1>
      <p className="text-xl mb-1">You donated ${amount.toFixed(2)}</p>
      <p className="text-blue-500 font-medium mb-8">You earned {points} pts</p>

      <div className="w-full max-w-xs mb-2">
        <Progress value={30} max={50} />
      </div>
      <p className="text-sm text-slate-600 mb-8">Next bonus at 50 pts</p>

      <div className="space-y-4 w-full max-w-xs">
        <Button className="w-full">
          <Share2 className="mr-2 h-4 w-4" />
          Share your impact
        </Button>
        <Button variant="secondary" className="w-full" onClick={onClose}>
          Continue swiping
        </Button>
      </div>
    </div>
  )
}
