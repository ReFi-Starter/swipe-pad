import { Card, CardContent } from '@/components/ui/card'

interface Achievement {
    id: string
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
        <Card className={`overflow-hidden ${!unlocked ? 'opacity-50' : ''}`}>
            <CardContent className='flex flex-col items-center p-3 text-center'>
                <div
                    className={`mb-2 flex h-12 w-12 items-center justify-center rounded-full ${
                        unlocked ? 'bg-[#22CC88]/10' : 'bg-slate-200'
                    }`}>
                    <div className={`text-xl ${unlocked ? 'text-[#22CC88]' : 'text-slate-400'}`}>{icon}</div>
                </div>
                <h3 className='text-sm font-medium'>{title}</h3>
                <p className='mt-1 text-xs text-slate-500'>{description}</p>
            </CardContent>
        </Card>
    )
}
