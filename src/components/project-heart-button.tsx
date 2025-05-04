"use client"

import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface ProjectHeartButtonProps {
  onClick?: () => void
  amount: number
  currency: string
}

export function ProjectHeartButton({ onClick, amount, currency }: ProjectHeartButtonProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      className="bg-white/90 hover:bg-white/95 border-0 shadow-md rounded-full h-10 w-10 text-[#22CC88] hover:text-[#1eb77a]"
      onClick={onClick}
      title={`Donate ${formatCurrency(amount, currency)}`}
    >
      <Heart className="h-5 w-5" />
    </Button>
  )
} 