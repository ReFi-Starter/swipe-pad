import { StreakBadge } from '@/components/streak-badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { getUserStats } from '@/features/settings/user-settings'

export function UserStatsCard() {
    const stats = getUserStats()

    return (
        <Card className='bento-bevel mb-4 w-full overflow-hidden'>
            <CardHeader className='pb-2'>
                <CardTitle className='flex items-center justify-between text-lg'>
                    <span>Your Stats</span>
                    <StreakBadge streak={stats.streak} />
                </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
                <div className='grid grid-cols-2 gap-3'>
                    <div className='rounded-lg bg-slate-50 p-2'>
                        <div className='text-sm text-slate-500'>Total Donated</div>
                        <div className='text-lg font-semibold'>${stats.totalDonated.toFixed(2)}</div>
                    </div>
                    <div className='rounded-lg bg-slate-50 p-2'>
                        <div className='text-sm text-slate-500'>Projects</div>
                        <div className='text-lg font-semibold'>{stats.projectsSupported}</div>
                    </div>
                    <div className='rounded-lg bg-slate-50 p-2'>
                        <div className='text-sm text-slate-500'>Categories</div>
                        <div className='text-lg font-semibold'>
                            {stats.categoriesSupported}/{5}
                        </div>
                    </div>
                    <div className='rounded-lg bg-slate-50 p-2'>
                        <div className='text-sm text-slate-500'>Reputation</div>
                        <div className='text-lg font-semibold'>{stats.reputation}</div>
                    </div>
                </div>

                <div className='space-y-1'>
                    <div className='flex justify-between text-sm'>
                        <span>Level: {stats.level}</span>
                        <span>Next: {stats.nextLevel.name}</span>
                    </div>
                    <Progress
                        value={stats.nextLevel.currentPoints}
                        max={stats.nextLevel.pointsNeeded}
                        className='h-2'
                    />
                    <div className='text-right text-xs text-slate-500'>
                        {stats.nextLevel.currentPoints}/{stats.nextLevel.pointsNeeded} points
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
