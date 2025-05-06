'use client'

import { getUserStats } from '@/features/settings/user-settings'
import sampleData from '@/lib/data/sample-data.json'
import { useEffect, useState } from 'react'

interface UserStats {
    reputation: number
    voteCount: number
    streak: number
    totalDonated: number
    campaignsSupported: number
    categoriesSupported: number
    level: string
    nextLevel: {
        name: string
        pointsNeeded: number
        currentPoints: number
    }
}

export function useCampaigns() {
    const [selectedCategory, setSelectedCategory] = useState<string>('All')
    const [userStats, setUserStats] = useState<UserStats>({
        reputation: 0,
        voteCount: 0,
        streak: 0,
        totalDonated: 0,
        campaignsSupported: 0,
        categoriesSupported: 0,
        level: 'Beginner',
        nextLevel: {
            name: 'Intermediate',
            pointsNeeded: 100,
            currentPoints: 0,
        },
    })

    useEffect(() => {
        const stats = getUserStats()
        setUserStats(prev => ({
            ...prev,
            ...stats,
        }))
    }, [])

    const filteredCampaigns =
        selectedCategory === 'All'
            ? sampleData.campaigns
            : sampleData.campaigns.filter(campaign => campaign.category === selectedCategory)

    const handleDonate = () => {
        console.log('Donate to campaign')
    }

    const handleSuperLike = () => {
        console.log('Super like campaign')
    }

    const handleBoost = () => {
        console.log('Boost campaign')
    }

    const handleShowDetails = () => {
        console.log('Show details for campaign')
    }

    const handleAddNote = async (campaignId: string, content: string) => {
        console.log('Add note to campaign:', campaignId, content)
    }

    const handleVoteNote = async (campaignId: string, noteId: string, vote: 'up' | 'down') => {
        console.log('Vote on note:', noteId, vote)
    }

    const handleFlagNote = async (campaignId: string, noteId: string) => {
        console.log('Flag note:', noteId)
    }

    return {
        selectedCategory,
        setSelectedCategory,
        userStats,
        filteredCampaigns,
        campaigns: sampleData.campaigns,
        isLoading: false,
        error: null,
        handlers: {
            handleDonate,
            handleSuperLike,
            handleBoost,
            handleShowDetails,
            handleAddNote,
            handleVoteNote,
            handleFlagNote,
        },
    }
}
