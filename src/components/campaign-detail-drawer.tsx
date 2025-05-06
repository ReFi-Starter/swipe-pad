import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { getTagColor } from '@/features/campaigns/trust'
import { Campaign } from '@/types/campaign'
import { AnimatePresence, motion } from 'framer-motion'
import { ExternalLink, Flame, MessageSquare, Share2, X } from 'lucide-react'
import Image from 'next/image'
import type React from 'react'

interface CampaignDetailDrawerProps {
    isOpen: boolean
    onClose: () => void
    campaign: Campaign
    onShowCommunityNotes: (campaign: Campaign) => void // Handler still expects base type
}

export function CampaignDetailDrawer({ isOpen, onClose, campaign, onShowCommunityNotes }: CampaignDetailDrawerProps) {
    if (!campaign) return null

    // Use optional chaining and nullish coalescing
    const websiteUrl = campaign.websiteUrl
    const isSponsored = campaign.sponsorBoosted

    const handleShare = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (navigator.share) {
            navigator
                .share({
                    title: campaign.title,
                    text: campaign.description,
                    url: websiteUrl || window.location.href,
                })
                .catch(err => console.error('Error sharing:', err))
        } else {
            navigator.clipboard.writeText(websiteUrl || window.location.href)
            alert('Link copied to clipboard!')
        }
    }

    const handleShowNotes = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (campaign) {
            // Pass the original base campaign type to the handler if needed
            // Although `campaign` here is DisplayCampaignType, it satisfies BaseCampaignType
            onShowCommunityNotes(campaign)
        }
        onClose()
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className='fixed inset-0 z-40 bg-black/30'
                        onClick={onClose}
                    />

                    {/* Drawer Panel */}
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className='swipe-pad-modal fixed right-0 bottom-0 left-0 z-50 flex max-h-[85vh] flex-col rounded-t-2xl bg-white shadow-lg'>
                        {/* Header */}
                        <div className='flex flex-shrink-0 items-center justify-between border-b border-slate-200 p-4'>
                            <h2 className='text-lg font-semibold'>Campaign Details</h2>
                            <Button variant='ghost' size='sm' onClick={onClose} className='h-auto p-1'>
                                <X className='h-5 w-5' />
                            </Button>
                        </div>

                        {/* Scrollable Content */}
                        <div className='flex-grow overflow-y-auto p-4'>
                            {/* Banner Image */}
                            <div className='relative mb-4 h-40 w-full overflow-hidden rounded-lg'>
                                <Image
                                    src={campaign.imageUrl || '/placeholder.svg'}
                                    alt={`${campaign.title} banner`}
                                    fill
                                    className='pointer-events-none object-cover object-center'
                                />
                            </div>

                            {/* Title */}
                            <h3 className='mb-2 flex items-center gap-1.5 text-xl font-semibold'>
                                {campaign.title}
                                {websiteUrl && (
                                    <a
                                        href={websiteUrl}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='text-blue-500 transition-colors hover:text-blue-700'
                                        onClick={e => e.stopPropagation()}
                                        aria-label='Visit campaign website'>
                                        <ExternalLink className='h-4 w-4' />
                                    </a>
                                )}
                            </h3>

                            {/* Tags */}
                            <div className='mb-3 flex flex-wrap gap-2'>
                                <span className='rounded-full bg-[#22CC88] px-2 py-1 text-xs text-white'>
                                    {campaign.category}
                                </span>
                                {isSponsored && (
                                    <span className='flex items-center rounded-full bg-amber-500 px-2 py-1 text-xs text-white'>
                                        <Flame className='mr-1 h-3 w-3' /> Boosted
                                    </span>
                                )}
                                {campaign.communityTags?.map(tag => (
                                    <span
                                        key={tag.id}
                                        className={`rounded-full px-2 py-0.5 text-xs ${getTagColor(tag.text)}`}>
                                        {tag.text} ({tag.count})
                                    </span>
                                ))}
                            </div>

                            {/* Description */}
                            <p className='mb-4 text-sm text-slate-600'>{campaign.description}</p>

                            {/* Funding Progress */}
                            <div className='mb-4 space-y-2'>
                                <div className='flex justify-between text-sm'>
                                    <span>Funding goal</span>
                                    <span>${campaign.fundingGoal}</span>
                                </div>
                                <Progress value={campaign.currentFunding} max={campaign.fundingGoal} />
                            </div>
                        </div>

                        {/* Actions Footer */}
                        <div className='flex flex-shrink-0 items-center justify-between gap-2 border-t border-slate-100 p-4'>
                            <Button variant='outline' size='sm' onClick={handleShowNotes} className='flex-1 text-xs'>
                                <MessageSquare className='mr-1 h-3 w-3' /> Community Notes
                            </Button>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button
                                            onClick={handleShare}
                                            className='rounded-md p-2 text-slate-500 hover:bg-slate-100'
                                            aria-label='Share campaign'>
                                            <Share2 className='h-4 w-4' />
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Share Campaign</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
