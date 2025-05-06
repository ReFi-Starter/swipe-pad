'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { useDonationPool } from '@/hooks/use-donation-pool'
import { useWallet } from '@/hooks/use-wallet'
import { formatDistanceToNow } from 'date-fns'
import Image from 'next/image'
import { useState } from 'react'
import { toast } from 'sonner'
import { formatEther } from 'viem'

interface CampaignDetailsProps {
    campaignId: bigint
}

export function CampaignDetails({ campaignId }: CampaignDetailsProps) {
    const { useCampaignDetails, useCampaignBalance, donate, isPending } = useDonationPool()
    const { isConnected, isOnCorrectNetwork } = useWallet()
    const [donationAmount, setDonationAmount] = useState('')
    const [submitting, setSubmitting] = useState(false)

    // Fetch campaign details
    const {
        data: campaignDetails,
        isLoading: isLoadingDetails,
        isError: isErrorDetails,
    } = useCampaignDetails(campaignId)

    // Fetch campaign balance
    const {
        data: campaignBalance,
        isLoading: isLoadingBalance,
        isError: isErrorBalance,
    } = useCampaignBalance(campaignId)

    // Handle donation submission
    const handleDonate = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!isConnected) {
            toast.error('Please connect your wallet first')
            return
        }

        if (!isOnCorrectNetwork) {
            toast.error('Please switch to Celo Alfajores network')
            return
        }

        try {
            setSubmitting(true)

            await donate(campaignId, donationAmount)

            toast.success('Donation initiated. Please wait for confirmation.')
            setDonationAmount('')
        } catch (error) {
            console.error('Failed to donate:', error)
            toast.error('Failed to donate. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    // Format dates for display
    const formatDate = (timestamp: bigint) => {
        try {
            return formatDistanceToNow(new Date(Number(timestamp) * 1000), { addSuffix: true })
        } catch {
            return 'Invalid date'
        }
    }

    // Calculate funding progress
    const calculateProgress = () => {
        if (!campaignDetails || !campaignBalance) return 0

        const fundingGoal = campaignDetails.fundingGoal
        if (fundingGoal === BigInt(0)) return 0

        return Number((campaignBalance * BigInt(100)) / fundingGoal)
    }

    // Calculate time left
    const calculateTimeLeft = () => {
        if (!campaignDetails) return ''

        const endTime = campaignDetails.endTime
        const now = BigInt(Math.floor(Date.now() / 1000))

        if (endTime < now) {
            return 'Funding ended'
        }

        return `Ends ${formatDate(endTime)}`
    }

    // Determine funding model text
    const getFundingModelText = () => {
        if (!campaignDetails) return ''

        return campaignDetails.fundingModel === BigInt(0) ? 'All or Nothing' : 'Keep What You Raise'
    }

    if (isLoadingDetails || isLoadingBalance) {
        return (
            <Card>
                <CardContent className='pt-6'>
                    <div className='flex min-h-48 flex-col items-center justify-center'>
                        <p>Loading campaign details...</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (isErrorDetails || isErrorBalance || !campaignDetails) {
        return (
            <Card>
                <CardContent className='pt-6'>
                    <div className='flex min-h-48 flex-col items-center justify-center'>
                        <p className='text-red-500'>Error loading campaign details</p>
                        <Button onClick={() => window.location.reload()} className='mt-4'>
                            Retry
                        </Button>
                    </div>
                </CardContent>
            </Card>
        )
    }

    const progress = calculateProgress()

    return (
        <Card>
            <CardHeader>
                <CardTitle>{campaignDetails.campaignName}</CardTitle>
                <CardDescription>
                    {campaignDetails.imageUrl && (
                        <div className='mb-4'>
                            <Image
                                src={campaignDetails.imageUrl}
                                alt={campaignDetails.campaignName}
                                className='h-48 w-full rounded-md object-cover'
                            />
                        </div>
                    )}
                    <p className='mt-2'>{campaignDetails.campaignDescription}</p>
                    {campaignDetails.campaignUrl && (
                        <a
                            href={campaignDetails.campaignUrl}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='mt-2 inline-block text-blue-500 hover:underline'>
                            Campaign Website
                        </a>
                    )}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className='mb-6'>
                    <div className='mb-2 flex justify-between'>
                        <span>{campaignBalance ? formatEther(campaignBalance) : '0'} CELO raised</span>
                        <span>
                            Goal: {campaignDetails.fundingGoal ? formatEther(campaignDetails.fundingGoal) : '0'} CELO
                        </span>
                    </div>
                    <Progress value={progress} className='h-2 w-full' />
                    <div className='mt-2 flex justify-between text-sm text-gray-500'>
                        <span>{getFundingModelText()}</span>
                        <span>{calculateTimeLeft()}</span>
                    </div>
                </div>

                <form onSubmit={handleDonate} className='space-y-4'>
                    <div>
                        <label htmlFor='donationAmount' className='mb-1 block text-sm font-medium'>
                            Donation Amount (CELO)
                        </label>
                        <Input
                            id='donationAmount'
                            type='number'
                            step='0.01'
                            min='0.01'
                            value={donationAmount}
                            onChange={e => setDonationAmount(e.target.value)}
                            placeholder='Enter amount to donate'
                            required
                            disabled={!isConnected || !isOnCorrectNetwork || submitting || isPending}
                        />
                    </div>

                    <Button
                        type='submit'
                        className='w-full'
                        disabled={!isConnected || !isOnCorrectNetwork || submitting || isPending}>
                        {submitting || isPending ? 'Processing...' : 'Donate Now'}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className='flex justify-between text-sm text-gray-500'>
                <span>Started {formatDate(campaignDetails.startTime)}</span>
                <span>Campaign ID: {campaignId.toString()}</span>
            </CardFooter>
        </Card>
    )
}
