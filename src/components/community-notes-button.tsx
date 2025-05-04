"use client"

import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"

interface CommunityNotesButtonProps {
  onClick?: () => void
}

export function CommunityNotesButton({ onClick }: CommunityNotesButtonProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      className="bg-white/90 hover:bg-white/95 border-0 shadow-md rounded-full h-10 w-10 text-slate-600 hover:text-slate-800"
      onClick={onClick}
      title="Community Notes"
    >
      <MessageSquare className="h-4 w-4" />
    </Button>
  )
} 