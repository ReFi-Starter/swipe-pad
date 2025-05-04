import { Card, CardContent } from "@/components/ui/card"

interface Achievement {
  id: number
  icon: string
  title: string
  description: string
  unlocked: boolean
}

interface AchievementBadgeProps {
  achievement: Achievement
}

export function AchievementBadge({ achievement }: AchievementBadgeProps) {
  const { icon, title, description, unlocked } = achievement

  return (
    <Card className={`overflow-hidden ${!unlocked ? "opacity-50" : ""}`}>
      <CardContent className="p-3 flex flex-col items-center text-center">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
            unlocked ? "bg-[#22CC88]/10" : "bg-slate-200"
          }`}
        >
          <div className={`text-xl ${unlocked ? "text-[#22CC88]" : "text-slate-400"}`}>{icon}</div>
        </div>
        <h3 className="font-medium text-sm">{title}</h3>
        <p className="text-xs text-slate-500 mt-1">{description}</p>
      </CardContent>
    </Card>
  )
}
