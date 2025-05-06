'use client'

import { CampaignImage } from '@/components/campaign-image'
import type { Campaign } from '@/types/campaign'
import type { SwipeDirection } from '@/types/swipe'

interface SwipeCardProps {
    campaign: Campaign
    onSwipe?: (direction: SwipeDirection) => void
    onSuperLike?: () => void
    onBoost?: () => void
    onShowDetails?: () => void
    active?: boolean
    className?: string
    cardIndex?: number
    mode?: 'swipe' | 'list'
    comboCount?: number
    questTokens?: number
    userReputation?: number
    topUserThreshold?: number
    availableBoosts?: number
    onAddNote?: (content: string) => Promise<void>
    onVoteNote?: (noteId: string, vote: 'up' | 'down') => Promise<void>
    onFlagNote?: (noteId: string) => Promise<void>
}

export function SwipeCard({ campaign }: SwipeCardProps) {
    return (
        <div className='relative h-full w-full'>
            <div className='absolute inset-0 overflow-hidden rounded-2xl'>
                <CampaignImage src={campaign.imageUrl} alt={campaign.title} className='h-full w-full object-cover' />
            </div>
            <div className='absolute inset-0 rounded-2xl bg-gradient-to-t from-black/60 to-transparent'>
                <div className='absolute bottom-0 left-0 p-6 text-white'>
                    <h2 className='mb-2 text-2xl font-bold'>{campaign.title}</h2>
                    <p className='mb-4 text-sm opacity-90'>{campaign.description}</p>
                    <div className='flex items-center gap-4'>
                        <div className='flex items-center gap-2'>
                            <span className='text-sm opacity-80'>Goal:</span>
                            <span className='font-semibold'>${campaign.fundingGoal}</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <span className='text-sm opacity-80'>Raised:</span>
                            <span className='font-semibold'>${campaign.currentFunding}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
