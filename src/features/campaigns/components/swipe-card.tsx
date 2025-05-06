import { Card } from '../types'

export default function SwipeCard({
    card,
    index,
    currentIndex,
    cardRef,
}: {
    card: Card
    index: number
    currentIndex: number
    cardRef: ((instance: HTMLDivElement | null) => void) | null
}) {
    const cardStyles: Record<number, string> = {
        0: 'z-[3] translate-y-0 rotate-0',
        1: 'z-[2] translate-y-[10px] -rotate-2',
        2: 'z-[1] translate-y-[10px] rotate-2',
    }

    return (
        <div
            key={`${card.name}-${currentIndex + index}`}
            ref={cardRef || undefined}
            className={`absolute top-4 flex h-10/12 w-3/4 max-w-[400px] cursor-grab touch-none flex-col justify-between overflow-hidden rounded-[20px] bg-cover bg-center shadow-[0_12px_30px_rgba(0,0,0,0.2)] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] will-change-transform select-none ${
                cardStyles[index] || 'translate-y-[20px] scale-[0.85]'
            }`}
            style={{
                backgroundImage: `url(${card.image})`,
                touchAction: 'none',
                transformOrigin: 'bottom center',
            }}>
            {/* Card Header */}
            <div className='flex items-center justify-between p-4'>
                <span></span>
                <p className='text-sm opacity-80'>{currentIndex + index + 1}</p>
            </div>
            <div className='rounded-b-2xl bg-gradient-to-t from-black/80 to-transparent p-6 text-white'>
                {/* <p className='mb-2 text-xl font-semibold'>{card.name}</p> */}
                {/* <p className='text-sm opacity-80'>{currentIndex + index + 1}</p> */}
            </div>
        </div>
    )
}
