import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { formatCurrency } from '@/features/currencies/formatter'
import type { Campaign } from '@/types/campaign'
import { Info } from 'lucide-react'
import { CardHeader } from './card-header'

interface CardListViewProps {
    campaign: Campaign
    onShowDetails?: () => void
    onOpenNotes: () => void
    className?: string
}

export function CardListView({ campaign, onShowDetails, onOpenNotes, className = '' }: CardListViewProps) {
    return (
        <Card className={`w-full overflow-hidden border shadow-sm ${className}`} onClick={onShowDetails}>
            <div className='relative aspect-[4/3.2] w-full'>
                <CardHeader campaign={campaign} onOpenNotes={onOpenNotes} />
            </div>

            <div className='p-4'>
                <div className='mb-2 flex items-start justify-between'>
                    <div className='flex-1'>
                        <h3 className='line-clamp-1 text-lg font-semibold'>{campaign.title}</h3>
                        <div className='text-muted-foreground flex items-center gap-1 text-sm'>
                            <span>by {campaign.creator.name}</span>
                        </div>
                    </div>
                    <Badge variant='outline' className='ml-2 shrink-0'>
                        {formatCurrency(campaign.donationAmount)}
                    </Badge>
                </div>

                <p className='text-muted-foreground mb-3 line-clamp-2 text-sm'>{campaign.description}</p>

                <Button size='sm' variant='default' className='h-8 w-full'>
                    <Info className='mr-1 h-4 w-4' />
                    <span className='text-xs'>View Details</span>
                </Button>
            </div>
        </Card>
    )
}
