import { CampaignImage } from '@/components/campaign-image'
import { TrustVerificationDrawer, VerificationDetail } from '@/components/trust-verification-drawer'
import type { Campaign } from '@/types/campaign'
import { BadgeCheck, Flame } from 'lucide-react'
import { useState } from 'react'

export interface CardHeaderProps {
    campaign: Campaign
    onOpenNotes: () => void
}

export function CardHeader({ campaign }: CardHeaderProps) {
    const [isTrustDrawerOpen, setIsTrustDrawerOpen] = useState(false)

    // Sample verification details - in a real app, this would come from the campaign data
    const verificationDetails: VerificationDetail[] = [
        {
            id: '1',
            name: 'Environmental Impact Assessment',
            type: 'audit',
            description:
                'This campaign has undergone a thorough environmental impact assessment by certified auditors.',
            verifiedDate: new Date(2023, 5, 15),
            link: 'https://example.com/verification/123',
        },
        {
            id: '2',
            name: 'NGO Registration',
            type: 'document',
            description: 'Officially registered as a non-profit organization with proper documentation.',
            verifiedDate: new Date(2023, 3, 10),
        },
        {
            id: '3',
            name: 'United Nations Recognition',
            type: 'authority',
            description: 'This campaign is recognized by the UN as contributing to sustainable development goals.',
            verifiedDate: new Date(2023, 8, 22),
            link: 'https://example.com/un-recognition',
        },
    ]

    // Placeholder for trusted badge click handler
    const handleTrustedBadgeClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        setIsTrustDrawerOpen(true)
    }

    return (
        <>
            <div className='relative aspect-[16/9] max-h-[180px] w-full'>
                <CampaignImage
                    src={campaign.imageUrl}
                    alt={campaign.title}
                    fill
                    sizes='(max-width: 768px) 100vw, 50vw'
                    className='object-cover'
                    priority
                />
                <div className='absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60' />

                {/* Boost Badge (Conditional) */}
                {campaign.sponsorBoosted && (
                    <div
                        className='absolute top-4 left-4 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-red-500 shadow-md'
                        aria-label='Boosted campaign'>
                        <Flame className='h-4 w-4 text-white drop-shadow-sm' />
                    </div>
                )}

                {/* Title with Verification Badge */}
                <div className='absolute right-4 bottom-4 left-4'>
                    <div className='flex items-center gap-1.5'>
                        <h3 className='line-clamp-2 text-xl font-semibold text-white'>{campaign.title}</h3>
                        {campaign.trustStatus === 'verified' && (
                            <button
                                onClick={handleTrustedBadgeClick}
                                className='focus-visible:ring-ring inline-flex cursor-pointer appearance-none items-center rounded-full border-none bg-transparent p-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2'
                                aria-label='View trust verification details'>
                                <BadgeCheck
                                    className='h-5 w-5 shrink-0 fill-[#1d9bf0] text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.4)]'
                                    strokeWidth={2.5}
                                />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Trust Verification Drawer */}
            <TrustVerificationDrawer
                isOpen={isTrustDrawerOpen}
                onClose={() => setIsTrustDrawerOpen(false)}
                campaignName={campaign.title}
                verificationDetails={verificationDetails}
            />
        </>
    )
}
