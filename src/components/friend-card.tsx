'use client'

import { StreakBadge } from '@/components/streak-badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import Image from 'next/image'

interface FriendCardProps {
    friend?: {
        id: string
        name: string
        avatar: string
        points: number
        maxPoints: number
        donations: number
        isFollowing?: boolean
        streak?: number
    }
    // Props directos para compatibilidad
    id?: string
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
    const name = friend?.name || propName || 'Unknown'
    const avatar = friend?.avatar || propAvatar || '/placeholder.svg'
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
        <Card className='mb-3 overflow-hidden'>
            <CardContent className='p-4'>
                <div className='flex items-center'>
                    <div className='relative mr-3 h-12 w-12 overflow-hidden rounded-full'>
                        <Image src={avatar || '/placeholder.svg'} alt={name} fill className='object-cover' />
                    </div>

                    <div className='flex-1'>
                        <div className='mb-1 flex items-center justify-between'>
                            <div className='flex items-center gap-2'>
                                <p className='font-medium'>{name}</p>
                                {streak > 0 && <StreakBadge streak={streak} size='sm' showText={false} />}
                            </div>
                            <Button
                                variant={isFollowing ? 'secondary' : 'default'}
                                size='sm'
                                className='h-8 text-xs'
                                onClick={handleToggleFollow}>
                                {isFollowing ? 'Following' : 'Follow'}
                            </Button>
                        </div>

                        <div className='space-y-2'>
                            <div className='flex justify-between text-xs'>
                                <span className='text-slate-500'>
                                    {points} / {maxPoints} points
                                </span>
                                <span className='text-[#22CC88]'>${donations.toFixed(2)} donated</span>
                            </div>
                            <Progress value={points} max={maxPoints} />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
