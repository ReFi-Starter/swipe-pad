"use client"

import { BadgeCheck } from "lucide-react"
import { cn } from "@/lib/utils"

interface VerifiedBadgeProps {
  isVerified: boolean
  size?: "sm" | "md" | "lg"
}

export function VerifiedBadge({ isVerified, size = "md" }: VerifiedBadgeProps) {
  if (!isVerified) return null
  
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4", 
    lg: "h-5 w-5"
  }
  
  return (
    <BadgeCheck 
      className={cn(
        "text-blue-500 inline-block", 
        sizeClasses[size]
      )} 
    />
  )
} 