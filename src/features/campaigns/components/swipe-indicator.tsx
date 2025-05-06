import { HeartCrack, HeartHandshake } from 'lucide-react'

export default function SwipeIndicator({
    show,
    position,
    color,
}: {
    show: boolean
    position: 'left' | 'right'
    color: string
}) {
    return (
        <div
            className={`pointer-events-none absolute top-[30%] ${position}-2 z-10 text-[100px] text-[${color}] opacity-0 transition-all duration-500 select-none ${
                show ? 'scale-110 opacity-70' : ''
            }`}
            aria-hidden='true'>
            {position === 'left' ? (
                <HeartCrack className='h-[100px] w-[100px] rotate-9' />
            ) : (
                <HeartHandshake className='h-[100px] w-[100px] -rotate-9' />
            )}
        </div>
    )
}
