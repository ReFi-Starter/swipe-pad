import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { StreakBadge } from "@/components/streak-badge"
import { getUserStats } from "@/lib/utils"

export function UserStatsCard() {
  const stats = getUserStats()

  return (
    <Card className="w-full mb-4 overflow-hidden bento-bevel">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Your Stats</span>
          <StreakBadge streak={stats.streak} />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50 p-2 rounded-lg">
            <div className="text-sm text-slate-500">Total Donated</div>
            <div className="text-lg font-semibold">${stats.totalDonated.toFixed(2)}</div>
          </div>
          <div className="bg-slate-50 p-2 rounded-lg">
            <div className="text-sm text-slate-500">Projects</div>
            <div className="text-lg font-semibold">{stats.projectsSupported}</div>
          </div>
          <div className="bg-slate-50 p-2 rounded-lg">
            <div className="text-sm text-slate-500">Categories</div>
            <div className="text-lg font-semibold">
              {stats.categoriesSupported}/{5}
            </div>
          </div>
          <div className="bg-slate-50 p-2 rounded-lg">
            <div className="text-sm text-slate-500">Reputation</div>
            <div className="text-lg font-semibold">{stats.reputation}</div>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>Level: {stats.level}</span>
            <span>Next: {stats.nextLevel.name}</span>
          </div>
          <Progress value={stats.nextLevel.currentPoints} max={stats.nextLevel.pointsNeeded} className="h-2" />
          <div className="text-xs text-right text-slate-500">
            {stats.nextLevel.currentPoints}/{stats.nextLevel.pointsNeeded} points
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
