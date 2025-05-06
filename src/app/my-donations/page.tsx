'use client'

import { useDonationPool } from '@/hooks/use-donation-pool'
import { useWallet } from '@/hooks/use-wallet'
import Link from 'next/link'
import { useEffect, useState } from 'react'

// Interface for donation objects
interface Donation {
    id: string
    title: string
    amount: string
    date: string
}

export default function MyDonationsPage() {
    const [mounted, setMounted] = useState(false)
    const { isConnected, address } = useWallet()
    const { useCampaignsDonatedTo } = useDonationPool()

    // State for donations
    const [loading, setLoading] = useState(true)
    const [donations, setDonations] = useState<Donation[]>([])

    // Ensure the component is mounted (client)
    useEffect(() => {
        setMounted(true)
    }, [])

    // Get projects the user has donated to
    const {
        data: projectIds,
        isLoading: isLoadingProjects,
        isError: isErrorProjects,
    } = useCampaignsDonatedTo(isConnected ? (address as `0x${string}`) : undefined)

    // Load details of the projects
    useEffect(() => {
        const fetchDonationDetails = async () => {
            if (!mounted) return

            if (!projectIds || projectIds.length === 0) {
                setLoading(false)
                return
            }

            // TODO: Implement the real loading of the projects when we have blockchain connection
            const mockDonations: Donation[] = [
                { id: '1', title: 'Clean Water Initiative', amount: '0.5', date: '2023-08-15' },
                { id: '2', title: 'Education for All', amount: '1.2', date: '2023-09-01' },
            ]

            setDonations(mockDonations)
            setLoading(false)
        }

        if (!isLoadingProjects && mounted) {
            fetchDonationDetails()
        }
    }, [projectIds, isLoadingProjects, mounted])

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
                    <h1 className='mb-4 text-2xl font-bold'>My Donations</h1>
                    <p className='mb-4'>Please connect your wallet to see your donations.</p>
                    <Link href='/' className='text-blue-500 hover:underline'>
                        Return to Home
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className='container mx-auto py-10'>
            <h1 className='mb-8 text-2xl font-bold'>My Donations</h1>

            {loading || isLoadingProjects ? (
                <div className='rounded-lg bg-white p-6 shadow-md'>
                    <div className='animate-pulse space-y-4'>
                        {[1, 2, 3].map(id => (
                            <div key={id} className='flex justify-between border-b pb-4'>
                                <div>
                                    <div className='mb-2 h-5 w-32 rounded bg-gray-200'></div>
                                    <div className='h-4 w-24 rounded bg-gray-200'></div>
                                </div>
                                <div>
                                    <div className='h-5 w-20 rounded bg-gray-200'></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : isErrorProjects ? (
                <div className='rounded-lg bg-white p-6 text-center shadow-md'>
                    <p className='text-red-500'>Error loading your donations. Please try again later.</p>
                </div>
            ) : donations.length === 0 ? (
                <div className='rounded-lg bg-white p-6 text-center shadow-md'>
                    <p className='mb-4'>You haven&apos;t made any donations yet.</p>
                    <Link href='/' className='text-blue-500 hover:underline'>
                        Browse Projects
                    </Link>
                </div>
            ) : (
                <div className='rounded-lg bg-white p-6 shadow-md'>
                    {donations.map(donation => (
                        <div key={donation.id} className='flex justify-between border-b py-4 last:border-0'>
                            <div>
                                <h3 className='font-medium'>{donation.title}</h3>
                                <p className='text-sm text-gray-500'>{donation.date}</p>
                            </div>
                            <div>
                                <span className='font-medium'>{donation.amount} CELO</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
