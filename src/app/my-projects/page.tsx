'use client'

import { CampaignList } from '@/components/campaign-list'
import { useWallet } from '@/hooks/use-wallet'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function MycampaignsPage() {
    const [mounted, setMounted] = useState(false)
    const { isConnected } = useWallet()

    // Ensure the component is mounted (client)
    useEffect(() => {
        setMounted(true)
    }, [])

    // During SSR or when not mounted, show a loading state
    if (!mounted) {
        return (
            <div className='container mx-auto py-10'>
                <div className='animate-pulse rounded-lg bg-white p-8 shadow-md'>
                    <div className='mb-6 h-8 w-1/3 rounded bg-gray-200'></div>
                    <div className='mb-4 h-4 w-full rounded bg-gray-200'></div>
                    <div className='mb-4 h-4 w-full rounded bg-gray-200'></div>
                    <div className='h-4 w-3/4 rounded bg-gray-200'></div>
                </div>
            </div>
        )
    }

    // If not connected, show message to connect the wallet
    if (!isConnected) {
        return (
            <div className='container mx-auto py-10'>
                <div className='rounded-lg bg-white p-8 text-center shadow-md'>
                    <h1 className='mb-4 text-2xl font-bold'>My Campaigns</h1>
                    <p className='mb-4'>Please connect your wallet to see your campaigns.</p>
                    <Link href='/' className='text-blue-500 hover:underline'>
                        Return to Home
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className='container mx-auto py-10'>
            <div className='mb-8 flex items-center justify-between'>
                <h1 className='text-2xl font-bold'>My Campaigns</h1>
                <Link
                    href='/create'
                    className='rounded-md bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600'>
                    Create New Campaign
                </Link>
            </div>

            <CampaignList />
        </div>
    )
}
