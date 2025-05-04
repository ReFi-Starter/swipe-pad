import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Trophy, Medal } from "lucide-react"

interface LeaderboardCardProps {
  rank: number
  name: string
  avatar: string
  amount?: number
  points?: number
  tags?: number
  reputation?: number
  isCurrentUser?: boolean
  type: "donors" | "taggers"
}

export function LeaderboardCard({
  rank,
  name,
  avatar,
  amount,
  points,
  tags,
  reputation,
  isCurrentUser = false,
  type,
}: LeaderboardCardProps) {
  return (
    <Card className={`mb-3 overflow-hidden bento-bevel ${isCurrentUser ? "border-[#22CC88] border-2" : ""}`}>
      <CardContent className="p-3">
        <div className="flex items-center">
          <div className="flex items-center justify-center w-8 h-8 mr-3">
            {rank === 1 ? (
              <Trophy className="h-6 w-6 text-yellow-500" />
            ) : rank === 2 ? (
              <Medal className="h-6 w-6 text-gray-400" />
            ) : rank === 3 ? (
              <Medal className="h-6 w-6 text-amber-700" />
            ) : (
              <span className="font-bold text-slate-500">{rank}</span>
            )}
          </div>

          <div className="relative h-10 w-10 rounded-full overflow-hidden mr-3">
            <Image src={avatar || "/placeholder.svg"} alt={name} fill className="object-cover" />
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-center">
              <p className="font-medium">
                {name} {isCurrentUser && <span className="text-xs text-slate-500">(You)</span>}
              </p>
              {type === "donors" && amount !== undefined && (
                <p className="text-[#22CC88] font-medium">${amount.toFixed(2)}</p>
              )}
              {type === "taggers" && tags !== undefined && <p className="text-blue-500 font-medium">{tags} tags</p>}
            </div>
            <div className="flex justify-between items-center">
              <p className="text-xs text-slate-500">This month</p>
              {type === "donors" && points !== undefined && <p className="text-xs text-blue-500">{points} pts</p>}
              {type === "taggers" && reputation !== undefined && (
                <p className="text-xs text-purple-500">{reputation} rep</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
