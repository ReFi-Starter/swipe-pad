import { Button } from '@/components/ui/button'
import { PawPrint } from 'lucide-react'

export default function EmptyState() {
    return (
        <div className='mx-auto max-w-[400px] rounded-[20px] bg-white p-[40px] text-center shadow-[0_4px_15px_rgba(0,0,0,0.1)]'>
            <PawPrint className='mb-5 h-[60px] w-[60px] text-[#ff9ff3]' />
            <h3 className='mb-2 text-xl font-semibold'>No more adorable cats!</h3>
            <p className='mb-4 text-gray-600'>You&apos;ve swiped through all our lovely cats.</p>
            <Button className='rounded-full bg-pink-500 px-6 py-2 font-bold text-white transition hover:bg-pink-600'>
                Find more
            </Button>
        </div>
    )
}
