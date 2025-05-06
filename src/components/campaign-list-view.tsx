import { SwipeCard } from '@/components/swipe-card'
import { Campaign } from '@/types/campaign'

interface CampaignListViewProps {
    campaigns: Campaign[]
    onShowDetails: () => void
}

export function CampaignListView({ campaigns, onShowDetails }: CampaignListViewProps) {
    return (
        <div className='mb-[var(--height-bottombar)] flex flex-col gap-4 p-4'>
            {campaigns.map(campaign => (
                <SwipeCard key={campaign.id} campaign={campaign} mode='list' onShowDetails={onShowDetails} />
            ))}
        </div>
    )
}
