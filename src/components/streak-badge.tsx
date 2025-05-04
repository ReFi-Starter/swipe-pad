import { getStreakEmoji, formatStreak } from "@/lib/utils"

interface StreakBadgeProps {
  streak: number
  size?: "sm" | "md" | "lg"
  showText?: boolean
}

export function StreakBadge({ streak, size = "md", showText = true }: StreakBadgeProps) {
  const sizeClasses = {
    sm: "text-xs px-1.5 py-0.5",
    md: "text-sm px-2 py-1",
    lg: "text-base px-3 py-1.5",
  }

  if (streak === 0 && !showText) return null

  return (
    <div className={`flex items-center gap-1 bg-amber-100 text-amber-800 rounded-full ${sizeClasses[size]}`}>
      <span>{getStreakEmoji(streak)}</span>
      {showText && <span className="font-medium">{formatStreak(streak)}</span>}
    </div>
  )
}
