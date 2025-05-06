import { SwipeCard } from '@/components/swipe-card'
import { RefreshButton } from '@/components/swipe-card-components/refresh-button'
import type { Campaign } from '@/types/campaign'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface SwipeCardStackProps {
    campaigns: Campaign[]
    onSwipe: (campaignId: string, direction: 'left' | 'right' | 'up' | 'down') => void
    className?: string
}

export function SwipeCardStack({ campaigns = [], onSwipe, className = '' }: SwipeCardStackProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isRefreshing, setIsRefreshing] = useState(false)

    // Debug log for component state
    useEffect(() => {
        console.log('SwipeCardStack State:', {
            campaignsLength: campaigns.length,
            currentIndex,
            isRefreshing,
            hasCurrentCampaign: campaigns.length > 0 && currentIndex < campaigns.length,
        })
    }, [campaigns, currentIndex, isRefreshing])

    const handleSwipe = (direction: 'left' | 'right' | 'up' | 'down') => {
        if (currentIndex < campaigns.length) {
            console.log('Handling swipe:', { direction, currentIndex, campaignId: campaigns[currentIndex].id })
            onSwipe(campaigns[currentIndex].id, direction)
            setCurrentIndex(prev => prev + 1)
        }
    }

    const handleRefresh = () => {
        console.log('Handling refresh, current state:', { currentIndex, campaignsLength: campaigns.length })
        setIsRefreshing(true)
        setTimeout(() => {
            setCurrentIndex(0)
            setIsRefreshing(false)
            console.log('Refresh complete, new state:', { currentIndex: 0, campaignsLength: campaigns.length })
        }, 300)
    }

    // Only get current campaign if we have campaigns and index is valid
    const currentCampaign = campaigns.length > 0 && currentIndex < campaigns.length ? campaigns[currentIndex] : null

    return (
        <div className={`relative h-full w-full ${className}`}>
            <AnimatePresence>
                {currentCampaign && (
                    <motion.div
                        key={currentCampaign.id}
                        className='absolute inset-0'
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}>
                        <SwipeCard campaign={currentCampaign} onSwipe={handleSwipe} />
                    </motion.div>
                )}
            </AnimatePresence>

            {!currentCampaign && !isRefreshing && (
                <div className='absolute inset-0 flex items-center justify-center'>
                    <RefreshButton onClick={handleRefresh} />
                </div>
            )}
        </div>
    )
}
