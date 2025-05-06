import { Button } from '@/components/ui/button'
import { PawPrint } from 'lucide-react'

export default function ActionButtons({
    onDislike,
    onLike,
    isDisabled,
}: {
    onDislike: () => void
    onLike: () => void
    isDisabled: boolean
}) {
    return (
        <div className='flex justify-center gap-4'>
            <Button
                type='button'
                className='group/dislike grid h-[48px] w-[48px] cursor-pointer place-items-center rounded-full bg-white p-2 text-[#ff4757] shadow-[0_4px_10px_rgba(0,0,0,0.2)] transition-all duration-200 hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50'
                onClick={onDislike}
                disabled={isDisabled}
                id='dislike-btn'>
                <PawPrint className='rotate-[-45deg] transition-transform group-hover/dislike:scale-110' />
            </Button>
            <Button
                type='button'
                className='group/like grid h-[48px] w-[48px] cursor-pointer place-items-center rounded-full bg-white p-2 text-[#1dd1a1] shadow-[0_4px_10px_rgba(0,0,0,0.2)] transition-all duration-200 hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50'
                onClick={onLike}
                disabled={isDisabled}
                id='like-btn'>
                <PawPrint className='rotate-45 transition-transform group-hover/like:scale-110' />
            </Button>
        </div>
    )
}
