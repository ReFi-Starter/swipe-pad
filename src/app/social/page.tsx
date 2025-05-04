"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { BottomNav } from "@/components/bottom-nav"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { LeaderboardCard } from "@/components/leaderboard-card"
import { FriendCard } from "@/components/friend-card"
import { ImpactShareCard } from "@/components/impact-share-card"
import { leaderboardData, friendsData } from "@/lib/utils"

export default function Social() {
  const [friends, setFriends] = useState(friendsData)
  const [activeTab, setActiveTab] = useState("donors")

  const handleToggleFollow = (id: number) => {
    setFriends(friends.map((friend) => (friend.id === id ? { ...friend, isFollowing: !friend.isFollowing } : friend)))
  }

  const handleShare = () => {
    alert("Sharing your impact! (This would open a share dialog in a real app)")
  }

  return (
    <div className="min-h-screen pb-16">
      <Header title="Social" />

      <div className="p-4">
        <ImpactShareCard totalDonations={8.15} projectsSupported={12} totalPoints={82} onShare={handleShare} />
      </div>

      <Tabs defaultValue="donors" className="w-full" onValueChange={setActiveTab}>
        <div className="px-4">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="donors">Top Donors</TabsTrigger>
            <TabsTrigger value="taggers">Top Taggers</TabsTrigger>
            <TabsTrigger value="friends">Friends</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="donors" className="p-4">
          <h2 className="font-semibold mb-3">Monthly Donation Rankings</h2>
          {leaderboardData.map((user, index) => (
            <LeaderboardCard
              key={user.id}
              rank={index + 1}
              name={user.name}
              avatar={user.avatar}
              amount={user.amount}
              points={user.points}
              isCurrentUser={user.isCurrentUser}
              type="donors"
            />
          ))}
        </TabsContent>

        <TabsContent value="taggers" className="p-4">
          <h2 className="font-semibold mb-3">Top Community Taggers</h2>
          {leaderboardData
            .sort((a, b) => b.reputation - a.reputation)
            .map((user, index) => (
              <LeaderboardCard
                key={user.id}
                rank={index + 1}
                name={user.name}
                avatar={user.avatar}
                tags={user.tags}
                reputation={user.reputation}
                isCurrentUser={user.isCurrentUser}
                type="taggers"
              />
            ))}
        </TabsContent>

        <TabsContent value="friends" className="p-4">
          <h2 className="font-semibold mb-3">Friends & Connections</h2>
          {friends.map((friend) => (
            <FriendCard
              key={friend.id}
              name={friend.name}
              avatar={friend.avatar}
              points={friend.points}
              maxPoints={friend.maxPoints}
              donations={friend.donations}
              isFollowing={friend.isFollowing}
              onToggleFollow={() => handleToggleFollow(friend.id)}
            />
          ))}
        </TabsContent>
      </Tabs>

      <BottomNav />
    </div>
  )
}
