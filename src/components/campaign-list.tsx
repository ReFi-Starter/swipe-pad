'use client'

import { Progress } from '@/components/ui/progress'
import { useDonationPool } from '@/hooks/use-donation-pool'
import { useWallet } from '@/hooks/use-wallet'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
// Type for formatted campaigns for UI
interface CampaignUI {
    id: string
    title: string
    description: string
    raised: string
    goal: string
    imageUrl: string
    progress: number
}

interface CampaignListProps {
    limit?: number
}

export function CampaignList({ limit }: CampaignListProps) {
    const [loading, setLoading] = useState(true)
    const [campaigns, setCampaigns] = useState<CampaignUI[]>([])
    const [mounted, setMounted] = useState(false)

    const { address } = useWallet()
    const { useCampaignsCreatedBy, mounted: hookMounted } = useDonationPool()

    // Ensure the component is mounted (client)
    useEffect(() => {
        setMounted(true)
    }, [])

    // Get the IDs of the created campaigns
    const {
        data: campaignIds,
        isLoading: isLoadingCampaigns,
        isError: isErrorCampaigns,
    } = useCampaignsCreatedBy(address as `0x${string}`)

    // Load details of the campaigns
    useEffect(() => {
        const fetchCampaignDetails = async () => {
            if (!mounted || !hookMounted) return

            if (!campaignIds || campaignIds.length === 0) {
                // If there are no campaigns or we are loading, use example data
                const mockCampaigns = [
                    {
                        id: '1',
                        title: 'Example Campaign 1',
                        description: 'This is a placeholder for a donation campaign.',
                        raised: '0.5',
                        goal: '5',
                        imageUrl: '',
                        progress: 10,
                    },
                    {
                        id: '2',
                        title: 'Example Campaign 2',
                        description: 'This is a placeholder for a donation campaign.',
                        raised: '1.2',
                        goal: '3',
                        imageUrl: '',
                        progress: 40,
                    },
                    {
                        id: '3',
                        title: 'Example Campaign 3',
                        description: 'This is a placeholder for a donation campaign.',
                        raised: '4.8',
                        goal: '5',
                        imageUrl: '',
                        progress: 96,
                    },
                ]
                setCampaigns(mockCampaigns)
                setLoading(false)
                return
            }

            // TODO: Implement the real loading of the campaigns when we have blockchain connection
            // This function would be where we would load the details of each campaign
            // using the useCampaignDetails hook for each ID

            setLoading(false)
        }

        if (!isLoadingCampaigns && mounted && hookMounted) {
            fetchCampaignDetails()
        }
    }, [campaignIds, isLoadingCampaigns, mounted, hookMounted])

    // Render a loading state or placeholder during SSR
    if (!mounted || !hookMounted) {
        return (
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                {[1, 2, 3].map(id => (
                    <div key={id} className='animate-pulse overflow-hidden rounded-lg bg-white shadow-md'>
                        <div className='h-48 bg-gray-200'></div>
                        <div className='p-6'>
                            <div className='mb-2 h-6 w-3/4 rounded bg-gray-200'></div>
                            <div className='mb-4 h-4 w-full rounded bg-gray-200'></div>
                            <div className='mb-2 flex justify-between'>
                                <div className='h-4 w-1/3 rounded bg-gray-200'></div>
                                <div className='h-4 w-1/3 rounded bg-gray-200'></div>
                            </div>
                            <div className='h-2 w-full rounded-full bg-gray-200'></div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    if (loading || isLoadingCampaigns) {
        return (
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                {[1, 2, 3].map(id => (
                    <div key={id} className='animate-pulse overflow-hidden rounded-lg bg-white shadow-md'>
                        <div className='h-48 bg-gray-200'></div>
                        <div className='p-6'>
                            <div className='mb-2 h-6 w-3/4 rounded bg-gray-200'></div>
                            <div className='mb-4 h-4 w-full rounded bg-gray-200'></div>
                            <div className='mb-2 flex justify-between'>
                                <div className='h-4 w-1/3 rounded bg-gray-200'></div>
                                <div className='h-4 w-1/3 rounded bg-gray-200'></div>
                            </div>
                            <div className='h-2 w-full rounded-full bg-gray-200'></div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    if (isErrorCampaigns) {
        return (
            <div className='p-8 text-center'>
                <p className='text-red-500'>Error loading campaigns. Please try again later.</p>
            </div>
        )
    }

    // If there are no campaigns, show message
    if (campaigns.length === 0) {
        return (
            <div className='p-8 text-center'>
                <p className='text-gray-500'>No campaigns found. Create your first campaign!</p>
                <Link
                    href='/create'
                    className='mt-4 inline-block rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600'>
                    Create Campaign
                </Link>
            </div>
        )
    }

    // Apply limit if specified
    const displayedCampaigns = limit ? campaigns.slice(0, limit) : campaigns

    return (
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {displayedCampaigns.map(campaign => (
                <Link href={`/campaign/${campaign.id}`} key={campaign.id} className='block'>
                    <div className='overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg'>
                        {campaign.imageUrl ? (
                            <Image
                                src={campaign.imageUrl}
                                alt={campaign.title}
                                className='h-48 w-full object-cover'
                                width={1920}
                                height={1080}
                            />
                        ) : (
                            <div className='h-48 bg-gray-200'></div>
                        )}
                        <div className='p-6'>
                            <h3 className='mb-2 text-xl font-bold'>{campaign.title}</h3>
                            <p className='mb-4 text-gray-500'>{campaign.description}</p>
                            <div className='mb-2 flex justify-between text-sm'>
                                <span>{campaign.raised} CELO raised</span>
                                <span>Goal: {campaign.goal} CELO</span>
                            </div>
                            <Progress value={campaign.progress} className='h-2 w-full' />
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    )
}
