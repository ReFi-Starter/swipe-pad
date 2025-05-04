"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Share2 } from "lucide-react"

interface ImpactShareCardProps {
  totalDonated?: number
  projectsSupported?: number
  categoriesSupported?: number
  totalPoints?: number
  stats?: {
    totalDonated?: number
    projectsSupported?: number
    totalPoints?: number
  }
  onShare?: () => void
}

export function ImpactShareCard({
  totalDonated: propTotalDonated,
  projectsSupported: propProjectsSupported,
  categoriesSupported: propCategoriesSupported,
  totalPoints: propTotalPoints,
  stats,
  onShare,
}: ImpactShareCardProps) {
  // Usar valores de stats si están disponibles, de lo contrario usar props directos
  const totalDonated = stats?.totalDonated || propTotalDonated || 0
  const projectsSupported = stats?.projectsSupported || propProjectsSupported || 0
  const categoriesSupported = stats?.categoriesSupported || propCategoriesSupported || 0
  const totalPoints = stats?.totalPoints || propTotalPoints || 0

  const handleShare = () => {
    if (onShare) {
      onShare()
    } else {
      alert("Sharing your impact! (This would open a share dialog in a real app)")
    }
  }

  return (
    <Card className="mb-4 overflow-hidden border-[#22CC88] border">
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-3">Your Impact</h3>

        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="bg-[#22CC88]/10 p-3 rounded-lg text-center">
            <p className="text-lg font-bold text-[#22CC88]">${totalDonated.toFixed(2)}</p>
            <p className="text-xs text-slate-600">Donated</p>
          </div>

          <div className="bg-[#22CC88]/10 p-3 rounded-lg text-center">
            <p className="text-lg font-bold text-[#22CC88]">{projectsSupported}</p>
            <p className="text-xs text-slate-600">Projects</p>
          </div>

          <div className="bg-[#22CC88]/10 p-3 rounded-lg text-center">
            <p className="text-lg font-bold text-[#22CC88]">{categoriesSupported || totalPoints}</p>
            <p className="text-xs text-slate-600">{categoriesSupported ? "Categories" : "Points"}</p>
          </div>
        </div>

        <p className="text-sm text-slate-600">
          You're in the top 15% of donors this month! Share your impact to inspire others.
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button className="w-full" onClick={handleShare}>
          <Share2 className="h-4 w-4 mr-2" />
          Share Your Impact
        </Button>
      </CardFooter>
    </Card>
  )
}
