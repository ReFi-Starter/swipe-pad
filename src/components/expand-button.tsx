"use client"

import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

interface ExpandButtonProps {
  onClick?: () => void
}

export function ExpandButton({ onClick }: ExpandButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 rounded-full hover:bg-slate-100"
      onClick={onClick}
      title="View more details"
    >
      <ChevronDown className="h-4 w-4 text-slate-500" />
    </Button>
  )
} 