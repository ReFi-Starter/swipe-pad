import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency } from '@/features/currencies/formatter'
import { Medal, Share2 } from 'lucide-react'
import { Button } from './ui/button'

interface ImpactShareCardProps {
    totalDonated?: number
    projectsSupported?: number
    totalPoints?: number
    categoriesSupported?: number
    onShare: () => void
}

export function ImpactShareCard({
    totalDonated = 8.15,
    projectsSupported = 12,
    totalPoints = 82,
    categoriesSupported = 3,
    onShare,
}: ImpactShareCardProps) {
    return (
        <Card className='relative overflow-hidden border-2 border-green-200 bg-gradient-to-br from-white to-green-50'>
            <div className='absolute top-0 right-0 h-16 w-16 rounded-bl-full bg-green-100 opacity-70'></div>

            <CardContent className='px-4 pt-6 pb-4'>
                <h3 className='mb-4 text-center text-lg font-semibold'>Your Donation Impact</h3>

                <div className='mb-6 grid grid-cols-3 gap-1'>
                    <div className='text-center'>
                        <div className='text-xl font-bold'>{formatCurrency(totalDonated, 'CENTS')}</div>
                        <div className='text-xs text-gray-500'>Total Donated</div>
                    </div>
                    <div className='text-center'>
                        <div className='text-xl font-bold'>{projectsSupported}</div>
                        <div className='text-xs text-gray-500'>Projects</div>
                    </div>
                    <div className='text-center'>
                        <div className='text-xl font-bold'>{categoriesSupported}</div>
                        <div className='text-xs text-gray-500'>Categories</div>
                    </div>
                </div>

                <div className='mb-4 flex items-center justify-center space-x-2'>
                    <Medal className='h-4 w-4 text-amber-500' />
                    <div className='text-xs font-medium text-amber-600'>{totalPoints} Impact Points</div>
                </div>

                <div className='mb-4 rounded-xl bg-green-50 p-4'>
                    <p className='text-center text-sm'>
                        You&apos;re in the top 15% of donors this month! Share your impact to inspire others.
                    </p>

                    <p className='mt-1 mb-4 text-center text-gray-500'>Let&apos;s show the world your impact!</p>
                </div>

                <Button className='flex w-full items-center justify-center gap-2' onClick={onShare} variant='outline'>
                    <Share2 className='h-4 w-4' />
                    Share My Impact
                </Button>
            </CardContent>
        </Card>
    )
}
