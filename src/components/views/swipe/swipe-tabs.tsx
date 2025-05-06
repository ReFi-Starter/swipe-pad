'use client'

import { CampaignListView } from '@/components/campaign-list-view'
// import { SwipeCardStack } from '@/components/swipe-card-stack'
import { AnimatedView } from '@/components/ui/animated-view'
import CampaignSwiper from '@/features/campaigns/components/campaign-swiper'
import { useCampaigns } from '@/hooks/use-campaigns'
import { useAppStore } from '@/store/use-app-store'
import { Campaign } from '@/types/campaign'
import { AnimatePresence } from 'framer-motion'

export default function SwipeTabs() {
    const activeTab = useAppStore(state => state.swipe.activeTab)
    const { filteredCampaigns, handlers } = useCampaigns()

    // const handleSwipe = (campaignId: string, direction: 'left' | 'right' | 'up' | 'down') => {
    //     console.log('Swipe direction:', direction, 'for campaign:', campaignId)
    // }

    return (
        <AnimatePresence mode='wait'>
            <AnimatedView key={activeTab} className='flex h-full flex-col pt-28'>
                <div className='flex-1'>
                    {activeTab === 'swipe' ? (
                        // <SwipeCardStack
                        //     campaigns={filteredCampaigns}
                        //     onSwipe={handleSwipe}
                        //     className='size-full bg-amber-500 p-4'
                        // />
                        <CampaignSwiper />
                    ) : (
                        <CampaignListView
                            campaigns={filteredCampaigns as Campaign[]}
                            onShowDetails={handlers.handleShowDetails}
                        />
                    )}
                </div>
            </AnimatedView>
        </AnimatePresence>
    )
}
