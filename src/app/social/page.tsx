'use client'

import { FriendCard } from '@/components/friend-card'
import { Header } from '@/components/header'
import { ImpactShareCard } from '@/components/impact-share-card'
import { LeaderboardCard } from '@/components/leaderboard-card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { friendsData, leaderboardData } from '@/lib/data/sample-data.json'
import { useState } from 'react'

export default function Social() {
    const [friends, setFriends] = useState(friendsData)

    const handleToggleFollow = (id: string) => {
        setFriends(friends.map(friend => (friend.id === id ? { ...friend, isFollowing: !friend.isFollowing } : friend)))
    }

    const handleShare = () => {
        alert('Sharing your impact! (This would open a share dialog in a real app)')
    }

    return (
        <div className='min-h-screen pb-16'>
            <Header title='Social' />

            <div className='p-4'>
                <ImpactShareCard onShare={handleShare} />
            </div>

            <Tabs defaultValue='donors' className='w-full'>
                <div className='px-4'>
                    <TabsList className='grid w-full grid-cols-3'>
                        <TabsTrigger value='donors'>Top Donors</TabsTrigger>
                        <TabsTrigger value='taggers'>Top Taggers</TabsTrigger>
                        <TabsTrigger value='friends'>Friends</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value='donors' className='p-4'>
                    <h2 className='mb-3 font-semibold'>Monthly Donation Rankings</h2>
                    {leaderboardData.map((user, index) => (
                        <LeaderboardCard
                            key={user.id}
                            rank={index + 1}
                            name={user.name}
                            avatar={user.avatar}
                            amount={user.amount}
                            points={user.points}
                            isCurrentUser={user.isCurrentUser}
                            type='donors'
                        />
                    ))}
                </TabsContent>

                <TabsContent value='taggers' className='p-4'>
                    <h2 className='mb-3 font-semibold'>Top Community Taggers</h2>
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
                                type='taggers'
                            />
                        ))}
                </TabsContent>

                <TabsContent value='friends' className='p-4'>
                    <h2 className='mb-3 font-semibold'>Friends & Connections</h2>
                    {friends.map(friend => (
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
        </div>
    )
}
