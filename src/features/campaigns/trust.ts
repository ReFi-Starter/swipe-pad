import { Campaign } from '@/types/campaign'
import { CommunityTagDisplay } from '@/types/community'

export function getTagColor(tag: string): string {
    if (tag.includes('Fake') || tag.includes('Spam')) {
        return 'bg-red-100 text-red-700'
    } else if (tag.includes('Unverified') || tag.includes('Needs Review')) {
        return 'bg-orange-100 text-orange-700'
    } else if (tag.includes('Verified') || tag.includes('Recommended')) {
        return 'bg-green-100 text-green-700'
    }
    return 'bg-blue-100 text-blue-700'
}

export function getTrustLevel(campaign: Campaign): { level: 'high' | 'medium' | 'low'; className: string } {
    const positiveTags =
        campaign.communityTags?.filter(
            (tag: CommunityTagDisplay) => tag.text.includes('Verified') || tag.text.includes('Recommended'),
        ) || []

    const negativeTags =
        campaign.communityTags?.filter(
            (tag: CommunityTagDisplay) => tag.text.includes('Fake') || tag.text.includes('Spam'),
        ) || []

    const positiveCount = positiveTags.reduce((sum: number, tag: CommunityTagDisplay) => sum + tag.count, 0)
    const negativeCount = negativeTags.reduce((sum: number, tag: CommunityTagDisplay) => sum + tag.count, 0)

    if (negativeCount > 5) {
        return { level: 'low', className: 'opacity-70 border-red-300' }
    } else if (positiveCount > 10) {
        return { level: 'high', className: 'border-green-300' }
    } else {
        return { level: 'medium', className: '' }
    }
}
