import { useWallet } from '@/hooks/use-wallet'
import { donationPoolAbi } from '@/lib/wagmi/contracts'
import { useEffect, useState } from 'react'
import { parseUnits } from 'viem'
import { useReadContract, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { celoAlfajores } from 'wagmi/chains'

// TODO: Update with actual deployment address when deployed
const DONATION_POOL_ADDRESS = '0x0000000000000000000000000000000000000000'

// Define a proper interface for campaign details
export interface CampaignDetail {
    startTime: bigint
    endTime: bigint
    campaignName: string
    campaignDescription: string
    campaignUrl: string
    imageUrl: string
    fundingGoal: bigint
    fundingModel: bigint
}

// Define interface for campaign UI
export interface CampaignUI {
    id: string
    title: string
    description: string
    imageUrl: string
    category: string
    funding: {
        goal: string
        raised: string
        progress: number
    }
    creator: {
        name: string
        address: string
    }
    dates: {
        start: string
        end: string
    }
}

/**
 * Hook for interacting with the DonationPool contract
 */
export function useDonationPool() {
    // State to control if the component is mounted (client vs server)
    const [mounted, setMounted] = useState(false)

    // When the component mounts, update the state
    useEffect(() => {
        setMounted(true)
    }, [])

    const { isConnected, isOnCorrectNetwork } = useWallet()
    const [lastTxHash, setLastTxHash] = useState<string | null>(null)

    // Write operations
    const { writeContract, isPending: isWritePending, data: txHash } = useWriteContract()

    // Transaction receipt
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash: txHash,
        confirmations: 1,
    })

    // Set lastTxHash when a transaction is submitted
    useEffect(() => {
        if (txHash) {
            setLastTxHash(txHash)
        }
    }, [txHash])

    /**
     * Create a new donation campaign
     */
    const createCampaign = async (
        campaignName: string,
        campaignDescription: string,
        campaignUrl: string,
        imageUrl: string,
        fundingGoal: string,
        fundingModel: 0 | 1, // 0 = ALL_OR_NOTHING, 1 = KEEP_WHAT_YOU_RAISE
        tokenAddress: `0x${string}`,
    ) => {
        // Verify that we are in the client and the wallet is connected
        if (!mounted || !isConnected || !isOnCorrectNetwork) {
            throw new Error('Wallet not connected or on wrong network')
        }

        // Calculate start and end times - use Date only in the client
        const now = Math.floor(Date.now() / 1000)
        const startTime = BigInt(now + 60 * 60) // Start in 1 hour
        const endTime = BigInt(now + 30 * 24 * 60 * 60) // End in 30 days

        // Convert funding goal to wei
        const fundingGoalWei = parseUnits(fundingGoal, 18)

        return writeContract({
            address: DONATION_POOL_ADDRESS as `0x${string}`,
            abi: donationPoolAbi,
            functionName: 'createCampaign',
            args: [
                Number(startTime),
                Number(endTime),
                campaignName,
                campaignDescription,
                campaignUrl,
                imageUrl,
                fundingGoalWei,
                fundingModel,
                tokenAddress,
            ],
            chainId: celoAlfajores.id,
        })
    }

    /**
     * Donate to a campaign
     */
    const donate = async (campaignId: bigint, amount: string, tokenDecimals = 18) => {
        // Verify that we are in the client and the wallet is connected
        if (!mounted || !isConnected || !isOnCorrectNetwork) {
            throw new Error('Wallet not connected or on wrong network')
        }

        // Convert amount to wei
        const amountWei = parseUnits(amount, tokenDecimals)

        return writeContract({
            address: DONATION_POOL_ADDRESS as `0x${string}`,
            abi: donationPoolAbi,
            functionName: 'donate',
            args: [campaignId, amountWei],
            chainId: celoAlfajores.id,
        })
    }

    // Custom hook for reading campaign details
    function useCampaignDetails(campaignId: bigint | undefined) {
        return useReadContract({
            address: DONATION_POOL_ADDRESS as `0x${string}`,
            abi: donationPoolAbi,
            functionName: 'getCampaignDetails',
            args: campaignId ? [campaignId] : undefined,
            chainId: celoAlfajores.id,
            query: {
                enabled: !!campaignId && mounted, // Only enable the query when we are in the client
            },
        }) as unknown as { data: CampaignDetail | undefined; isLoading: boolean; isError: boolean }
    }

    // Custom hook for reading campaign balance
    function useCampaignBalance(campaignId: bigint | undefined) {
        return useReadContract({
            address: DONATION_POOL_ADDRESS as `0x${string}`,
            abi: donationPoolAbi,
            functionName: 'getCampaignBalance',
            args: campaignId ? [campaignId] : undefined,
            chainId: celoAlfajores.id,
            query: {
                enabled: !!campaignId && mounted, // Only enable the query when we are in the client
            },
        })
    }

    // Custom hook to get campaigns created by an address
    function useCampaignsCreatedBy(creatorAddress: `0x${string}` | undefined) {
        return useReadContract({
            address: DONATION_POOL_ADDRESS as `0x${string}`,
            abi: donationPoolAbi,
            functionName: 'getCampaignsCreatedBy',
            args: creatorAddress ? [creatorAddress] : undefined,
            chainId: celoAlfajores.id,
            query: {
                enabled: !!creatorAddress && mounted, // Only enable the query when we are in the client
            },
        })
    }

    // Custom hook to get campaigns donated to by an address
    function useCampaignsDonatedTo(donorAddress: `0x${string}` | undefined) {
        return useReadContract({
            address: DONATION_POOL_ADDRESS as `0x${string}`,
            abi: donationPoolAbi,
            functionName: 'getCampaignsDonatedToBy',
            args: donorAddress ? [donorAddress] : undefined,
            chainId: celoAlfajores.id,
            query: {
                enabled: !!donorAddress && mounted, // Only enable the query when we are in the client
            },
        })
    }

    // Custom hook to claim refund for failed ALL_OR_NOTHING campaign
    const claimRefund = async (campaignId: bigint) => {
        // Verify that we are in the client and the wallet is connected
        if (!mounted || !isConnected || !isOnCorrectNetwork) {
            throw new Error('Wallet not connected or on wrong network')
        }

        return writeContract({
            address: DONATION_POOL_ADDRESS as `0x${string}`,
            abi: donationPoolAbi,
            functionName: 'claimRefund',
            args: [campaignId],
            chainId: celoAlfajores.id,
        })
    }

    // Custom hook for campaign creators to withdraw funds
    const withdrawFunds = async (campaignId: bigint) => {
        // Verify that we are in the client and the wallet is connected
        if (!mounted || !isConnected || !isOnCorrectNetwork) {
            throw new Error('Wallet not connected or on wrong network')
        }

        return writeContract({
            address: DONATION_POOL_ADDRESS as `0x${string}`,
            abi: donationPoolAbi,
            functionName: 'withdrawFunds',
            args: [campaignId],
            chainId: celoAlfajores.id,
        })
    }

    // Function to convert contract details to UI format
    const convertToUICampaign = (campaignId: string, campaignDetail: CampaignDetail): CampaignUI => {
        return {
            id: campaignId,
            title: campaignDetail.campaignName,
            description: campaignDetail.campaignDescription,
            imageUrl: campaignDetail.imageUrl,
            category: 'General', // No category in the contract, could be added
            funding: {
                goal: (Number(campaignDetail.fundingGoal) / 1e18).toString(),
                raised: '0', // We would need to get this from somewhere else
                progress: 0, // We would need to calculate this
            },
            creator: {
                name: 'Campaign Creator', // We don't have this data in the contract
                address: '0x', // We would need to get this
            },
            dates: {
                start: new Date(Number(campaignDetail.startTime) * 1000).toLocaleDateString(),
                end: new Date(Number(campaignDetail.endTime) * 1000).toLocaleDateString(),
            },
        }
    }

    return {
        createCampaign,
        donate,
        useCampaignDetails,
        useCampaignBalance,
        useCampaignsCreatedBy,
        useCampaignsDonatedTo,
        claimRefund,
        withdrawFunds,
        convertToUICampaign,
        isPending: isWritePending || isConfirming,
        isConfirmed,
        lastTxHash,
        mounted, // Export the mounted state so components can know if they are in the client
    }
}
