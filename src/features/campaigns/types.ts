import type { Note } from '@/components/community-notes-drawer'
import type { CommunityTagDisplay } from '@/types/community'

export interface Campaign {
    id: number
    title: string
    description: string
    image: string
    category: string
    fundingGoal: number
    currentFunding: number
    websiteUrl: string
    sponsorBoosted: boolean
    communityTags?: CommunityTagDisplay[]
    communityNotes?: Note[]
}

export interface Card {
    name: string
    image: string
}
