'use client'

import { CampaignDetails } from '@/components/campaign-details'
import { ConnectButton } from '@/components/connect-button'
import { useParams } from 'next/navigation'

export default function CampaignPage() {
    const params = useParams()
    const campaignId = BigInt(params.id as string)

    return (
        <main className='container py-10'>
            <div className='mb-6 flex flex-col items-start justify-between gap-6 md:flex-row'>
                <div>
                    <h1 className='mb-2 text-3xl font-bold'>Campaign Details</h1>
                    <p className='text-gray-500'>View and support this campaign</p>
                </div>
                <ConnectButton />
            </div>

            <CampaignDetails campaignId={campaignId} />
        </main>
    )
}
