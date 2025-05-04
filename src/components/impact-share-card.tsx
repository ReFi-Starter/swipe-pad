"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "./ui/button"
import { formatCurrency } from "@/lib/utils"
import { Medal, Share2 } from "lucide-react"

interface ImpactShareCardProps {
  totalDonated?: number
  projectsSupported?: number
  totalPoints?: number
  categoriesSupported?: number
  onShare: () => void
}

export function ImpactShareCard({
  totalDonated = 8.15,
  projectsSupported = 12,
  totalPoints = 82,
  categoriesSupported = 3,
  onShare,
}: ImpactShareCardProps) {
  return (
    <Card className="border-2 border-green-200 bg-gradient-to-br from-white to-green-50 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-16 h-16 bg-green-100 rounded-bl-full opacity-70"></div>

      <CardContent className="pt-6 pb-4 px-4">
        <h3 className="text-center font-semibold text-lg mb-4">Your Donation Impact</h3>

        <div className="grid grid-cols-3 gap-1 mb-6">
          <div className="text-center">
            <div className="font-bold text-xl">{formatCurrency(totalDonated, "CENTS")}</div>
            <div className="text-xs text-gray-500">Total Donated</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-xl">{projectsSupported}</div>
            <div className="text-xs text-gray-500">Projects</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-xl">{categoriesSupported}</div>
            <div className="text-xs text-gray-500">Categories</div>
          </div>
        </div>

        <div className="flex space-x-2 items-center justify-center mb-4">
          <Medal className="h-4 w-4 text-amber-500" />
          <div className="text-xs text-amber-600 font-medium">{totalPoints} Impact Points</div>
        </div>

        <div className="bg-green-50 rounded-xl p-4 mb-4">
          <p className="text-sm text-center">
            You&apos;re in the top 15% of donors this month! Share your impact to inspire others.
          </p>

          <p className="text-gray-500 text-center mt-1 mb-4">
            Let&apos;s show the world your impact!
          </p>
        </div>

        <Button
          className="w-full flex items-center justify-center gap-2"
          onClick={onShare}
          variant="outline"
        >
          <Share2 className="h-4 w-4" />
          Share My Impact
        </Button>
      </CardContent>
    </Card>
  )
}
