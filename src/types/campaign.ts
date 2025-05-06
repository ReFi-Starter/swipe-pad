import type { CommunityNoteDisplay, CommunityTagDisplay } from './community'

export interface Campaign {
    id: string
    title: string
    category: string
    description: string
    imageUrl: string
    donationAmount: number
    trustStatus: 'verified' | 'warning'
    creator: {
        name: string
        avatar?: string
        verified?: boolean
    }
    fundingGoal: number
    currentFunding: number
    websiteUrl: string
    sponsorBoosted?: boolean
    communityTags?: CommunityTagDisplay[]
    communityNotes?: CommunityNoteDisplay[]
    createdAt?: Date
}
