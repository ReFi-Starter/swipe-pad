"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { StreakBadge } from "@/components/streak-badge"

interface FriendCardProps {
  friend?: {
    id: number
    name: string
    avatar: string
    points: number
    maxPoints: number
    donations: number
    isFollowing?: boolean
    streak?: number
  }
  // Props directos para compatibilidad
  id?: number
  name?: string
  avatar?: string
  points?: number
  maxPoints?: number
  donations?: number
  isFollowing?: boolean
  streak?: number
  onToggleFollow?: () => void
}

export function FriendCard({
  friend,
  id,
  name: propName,
  avatar: propAvatar,
  points: propPoints,
  maxPoints: propMaxPoints,
  donations: propDonations,
  isFollowing: propIsFollowing,
  streak: propStreak,
  onToggleFollow,
}: FriendCardProps) {
  // Usar valores del objeto friend si está disponible, de lo contrario usar props directos
  const name = friend?.name || propName || "Unknown"
  const avatar = friend?.avatar || propAvatar || "/placeholder.svg"
  const points = friend?.points || propPoints || 0
  const maxPoints = friend?.maxPoints || propMaxPoints || 100
  const donations = friend?.donations || propDonations || 0
  const isFollowing = friend?.isFollowing !== undefined ? friend.isFollowing : propIsFollowing || false
  const streak = friend?.streak || propStreak || 0

  const handleToggleFollow = () => {
    if (onToggleFollow) {
      onToggleFollow()
    }
  }

  return (
    <Card className="mb-3 overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center">
          <div className="relative h-12 w-12 rounded-full overflow-hidden mr-3">
            <Image src={avatar || "/placeholder.svg"} alt={name} fill className="object-cover" />
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <p className="font-medium">{name}</p>
                {streak > 0 && <StreakBadge streak={streak} size="sm" showText={false} />}
              </div>
              <Button
                variant={isFollowing ? "secondary" : "default"}
                size="sm"
                className="text-xs h-8"
                onClick={handleToggleFollow}
              >
                {isFollowing ? "Following" : "Follow"}
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">
                  {points} / {maxPoints} points
                </span>
                <span className="text-[#22CC88]">${donations.toFixed(2)} donated</span>
              </div>
              <Progress value={points} max={maxPoints} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
