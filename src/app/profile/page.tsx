'use client'

import { AchievementBadge } from '@/components/achievement-badge'
import { FriendCard } from '@/components/friend-card'
import { Header } from '@/components/header'
import { ImpactShareCard } from '@/components/impact-share-card'
import { PrivacyToggle } from '@/components/privacy-toggle'
import { StreakBadge } from '@/components/streak-badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { UserStatsCard } from '@/components/user-stats-card'
import { getUserStats } from '@/features/settings/user-settings'
import { achievements, friendsData } from '@/lib/data/sample-data.json'
import { Eye, Settings, Share2 } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function ProfilePage() {
    const router = useRouter()
    const [isPublic, setIsPublic] = useState(true)
    const stats = getUserStats()

    return (
        <div className='min-h-screen pb-16'>
            <Header title='Profile' showBack backUrl='/' />

            <div className='p-4'>
                <Card className='bento-bevel overflow-hidden'>
                    <div className='relative h-24 bg-gradient-to-r from-[#22CC88]/20 to-[#22CC88]/10'>
                        <div className='absolute -bottom-10 left-4'>
                            <div className='relative h-20 w-20 overflow-hidden rounded-full border-4 border-white'>
                                <Image
                                    src='https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop'
                                    alt='Profile'
                                    fill
                                    sizes='80px'
                                    className='object-cover'
                                />
                            </div>
                        </div>
                    </div>
                    <CardContent className='pt-12 pb-4'>
                        <div className='flex items-start justify-between'>
                            <div>
                                <h2 className='text-xl font-semibold'>Hi, Alex!</h2>
                                <div className='mt-1 flex items-center gap-2'>
                                    <StreakBadge streak={stats.streak} />
                                    <span className='text-sm text-slate-500'>Level: {stats.level}</span>
                                </div>
                            </div>
                            <Button variant='ghost' size='icon' onClick={() => router.push('/profile/settings')}>
                                <Settings className='h-5 w-5' />
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <UserStatsCard />

                <Tabs defaultValue='achievements' className='mt-4'>
                    <TabsList className='grid w-full grid-cols-3'>
                        <TabsTrigger value='achievements'>Badges</TabsTrigger>
                        <TabsTrigger value='friends'>Friends</TabsTrigger>
                        <TabsTrigger value='impact'>Impact</TabsTrigger>
                    </TabsList>

                    <TabsContent value='achievements' className='mt-4 space-y-4'>
                        <div className='flex items-center justify-between'>
                            <h3 className='font-medium'>Your Achievements</h3>
                            <PrivacyToggle
                                icon={Eye}
                                label='Visibility'
                                description='Make your achievements visible to others'
                                checked={isPublic}
                                onCheckedChange={setIsPublic}
                            />
                        </div>

                        <div className='grid grid-cols-3 gap-3'>
                            {achievements.map(achievement => (
                                <AchievementBadge key={achievement.id} achievement={achievement} />
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value='friends' className='mt-4 space-y-4'>
                        <div className='flex items-center justify-between'>
                            <h3 className='font-medium'>Friends</h3>
                            <Button variant='outline' size='sm' className='flex items-center gap-1'>
                                <Share2 className='h-4 w-4' />
                                <span>Invite</span>
                            </Button>
                        </div>

                        <div className='space-y-3'>
                            {friendsData.map(friend => (
                                <FriendCard key={friend.id} friend={friend} />
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value='impact' className='mt-4 space-y-4'>
                        <div className='flex items-center justify-between'>
                            <h3 className='font-medium'>Your Impact</h3>
                            <Button variant='outline' size='sm' className='flex items-center gap-1'>
                                <Share2 className='h-4 w-4' />
                                <span>Share</span>
                            </Button>
                        </div>

                        <ImpactShareCard
                            totalDonated={stats.totalDonated}
                            projectsSupported={stats.projectsSupported}
                            categoriesSupported={stats.categoriesSupported}
                            totalPoints={stats.nextLevel?.currentPoints || 0}
                            onShare={() => {}}
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
