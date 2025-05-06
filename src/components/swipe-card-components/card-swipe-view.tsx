import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { Campaign } from '@/types/campaign'
import { SwipeAnimationState } from '@/types/swipe'
import type { MotionValue, PanInfo } from 'framer-motion'
import { motion } from 'framer-motion'
import { Flame, MessageCircle } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { CardEmojis } from './card-emojis'
import { CardHeader } from './card-header'
import { CardProgress } from './card-progress'

interface CardSwipeViewProps {
    campaign: Campaign
    isDraggable: boolean
    handleDragEnd: (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void
    handleTap: () => void
    onOpenNotes: () => void
    className?: string
    isFront: boolean
    cardIndex: number
    comboCount?: number
    animationState: SwipeAnimationState
    rotate: MotionValue<number>
    opacity: MotionValue<number>
}

export function CardSwipeView({
    campaign,
    isDraggable,
    handleDragEnd,
    handleTap,
    onOpenNotes,
    className = '',
    isFront,
    cardIndex,
    comboCount = 0,
    animationState,
    rotate,
    opacity,
}: CardSwipeViewProps) {
    const [isExpanded, setIsExpanded] = useState(false)

    const communityNotesCount = campaign.communityNotes?.length || 0

    const toggleExpanded = (e: React.MouseEvent) => {
        e.stopPropagation() // Prevent triggering parent click handler
        setIsExpanded(prev => !prev)
    }

    // Enhanced stacking system with more subtle transitions
    const stackStyles = {
        0: {
            scale: 1,
            y: 0,
            rotate: 0,
            opacity: 1,
            zIndex: 30,
            filter: 'brightness(1)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        },
        1: {
            scale: 0.98,
            y: -8,
            rotate: -1,
            opacity: 0.9,
            zIndex: 20,
            filter: 'brightness(0.95)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
        },
        2: {
            scale: 0.96,
            y: -16,
            rotate: 1,
            opacity: 0.8,
            zIndex: 10,
            filter: 'brightness(0.9)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        },
    }[Math.min(cardIndex, 2)] || {
        scale: 0.94,
        y: -24,
        rotate: -1,
        opacity: 0.7,
        zIndex: 0,
        filter: 'brightness(0.85)',
        boxShadow: 'none',
    }

    return (
        <>
            <motion.div
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    zIndex: stackStyles.zIndex,
                    filter: stackStyles.filter,
                    rotate: cardIndex === 0 ? rotate : stackStyles.rotate,
                    opacity: cardIndex === 0 ? opacity : stackStyles.opacity,
                }}
                initial={false}
                animate={{
                    scale: stackStyles.scale,
                    y: stackStyles.y,
                }}
                transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 20,
                    mass: 0.5,
                }}
                drag={isDraggable}
                dragElastic={0.7}
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                onDragEnd={handleDragEnd}
                onClick={e => {
                    // Prevent default behavior
                    if (e.defaultPrevented) return
                    e.preventDefault()
                    handleTap()
                }}
                className={className}
                whileDrag={{
                    scale: 1.02,
                    cursor: 'grabbing',
                }}>
                <Card
                    className='overflow-hidden rounded-2xl border-none bg-white pt-0'
                    style={{
                        boxShadow: stackStyles.boxShadow,
                        willChange: 'transform',
                        transformStyle: 'preserve-3d',
                        backfaceVisibility: 'hidden',
                    }}>
                    <div className='flex h-full flex-col'>
                        <CardHeader campaign={campaign} onOpenNotes={onOpenNotes} />

                        {/* Category Badges and Community Notes */}
                        <div className='flex items-center justify-between px-4 pt-3'>
                            <div className='flex flex-wrap gap-1.5'>
                                <Badge variant='outline'>{campaign.category}</Badge>
                                {/* Add more badges if needed, e.g., campaign.tags?.map(...) */}
                            </div>

                            {/* Community Notes Button */}
                            {communityNotesCount > 0 && (
                                <Button
                                    variant='ghost'
                                    size='icon'
                                    className='text-muted-foreground hover:text-foreground hover:bg-muted/50 h-8 w-8'
                                    onClick={e => {
                                        e.stopPropagation()
                                        onOpenNotes()
                                    }}
                                    aria-label={`View ${communityNotesCount} community notes`}>
                                    <MessageCircle className='h-4 w-4' />
                                </Button>
                            )}
                        </div>

                        {/* Progress Bar */}
                        <div className='px-4 pt-2 pb-3'>
                            <CardProgress current={campaign.currentFunding} target={campaign.fundingGoal} />
                        </div>

                        {/* Description Excerpt */}
                        <div
                            className='relative flex-grow cursor-pointer overflow-hidden px-4 pb-4'
                            onClick={e => {
                                e.preventDefault()
                                e.stopPropagation()
                                toggleExpanded(e)
                            }}>
                            <p className='text-muted-foreground hover:text-foreground line-clamp-3 text-sm transition-colors'>
                                {campaign.description}
                            </p>
                            {/* Fade-out effect with "Read more" hint */}
                            <div className='absolute inset-x-0 bottom-0 flex h-8 items-end justify-center bg-gradient-to-t from-white via-white/80 to-transparent'>
                                <span className='text-muted-foreground mb-1 rounded-md bg-white/80 px-2 py-1 text-xs'>
                                    Tap to read more
                                </span>
                            </div>
                        </div>

                        {/* Bottom Action Area */}
                        <div className='mt-auto flex items-center justify-between p-4 pt-0'>
                            <div className='w-8'>{/* Spacer to balance layout */}</div>
                            <div className='flex items-center gap-2'>
                                {/* Combo Counter - Keep if still relevant */}
                                {comboCount > 1 && (
                                    <Badge variant='secondary' className='animate-pulse'>
                                        🔥 x{comboCount}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Shine Effect */}
                    <motion.div
                        className='pointer-events-none absolute inset-0'
                        style={{
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                            opacity: 0,
                        }}
                        animate={{
                            opacity: [0, 0.3, 0],
                            x: [-200, 200],
                        }}
                        transition={{
                            duration: 1.8,
                            repeat: Infinity,
                            repeatDelay: 1.5,
                        }}
                    />
                </Card>

                <CardEmojis animationState={animationState} isFront={isFront} />
            </motion.div>

            {/* Full Screen Expanded View */}
            {isExpanded && (
                <div className='bg-background fixed inset-0 z-50 overflow-auto'>
                    <div className='container mx-auto max-w-md px-4 py-12'>
                        {/* Header with Close Button */}
                        <div className='mb-6 flex items-center justify-between'>
                            <h2 className='text-xl font-bold'>{campaign.title}</h2>
                            <Button variant='ghost' size='sm' onClick={toggleExpanded}>
                                Close
                            </Button>
                        </div>

                        {/* Campaign Image */}
                        <div className='relative mb-6 aspect-video w-full overflow-hidden rounded-lg'>
                            <Image
                                src={campaign.imageUrl}
                                alt={campaign.title}
                                fill
                                className='h-full w-full object-cover'
                            />
                        </div>

                        {/* Campaign Details */}
                        <div className='space-y-6'>
                            {/* Category & Trust Info */}
                            <div className='flex flex-wrap gap-2'>
                                <Badge variant='outline'>{campaign.category}</Badge>
                                {campaign.sponsorBoosted && (
                                    <Badge variant='destructive' className='flex items-center gap-1'>
                                        <Flame className='h-3 w-3' />
                                        <span>Boost</span>
                                    </Badge>
                                )}
                                {campaign.trustStatus === 'verified' && (
                                    <Badge variant='outline' className='border-blue-200 bg-blue-50 text-blue-700'>
                                        Verified
                                    </Badge>
                                )}
                            </div>

                            {/* Progress */}
                            <div className='bg-muted/30 rounded-lg p-4'>
                                <CardProgress current={campaign.currentFunding} target={campaign.fundingGoal} />
                            </div>

                            {/* Full Description */}
                            <div className='space-y-4'>
                                <h3 className='text-lg font-medium'>About this campaign</h3>
                                <p className='text-muted-foreground'>{campaign.description}</p>
                                <p className='text-muted-foreground'>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Maecenas
                                    vel nunc vel libero feugiat eleifend. Vivamus eget condimentum velit, nec finibus
                                    urna. In hac habitasse platea dictumst.
                                </p>
                            </div>

                            {/* Creator Info */}
                            <div className='bg-muted/30 flex items-center gap-3 rounded-lg p-4'>
                                <div className='bg-primary/20 relative flex h-10 w-10 items-center justify-center rounded-full'>
                                    {campaign.creator.avatar ? (
                                        <Image
                                            src={campaign.creator.avatar}
                                            alt={campaign.creator.name}
                                            fill
                                            className='h-full w-full rounded-full object-cover'
                                        />
                                    ) : (
                                        <span className='text-primary font-medium'>
                                            {campaign.creator.name.charAt(0).toUpperCase()}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <div className='flex items-center gap-1'>
                                        <p className='font-medium'>{campaign.creator.name}</p>
                                        {campaign.creator.verified && (
                                            <Badge variant='outline' className='px-1.5 py-0 text-xs'>
                                                Verified
                                            </Badge>
                                        )}
                                    </div>
                                    <p className='text-muted-foreground text-xs'>Campaign Creator</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
