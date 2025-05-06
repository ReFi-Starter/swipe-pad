'use client'

import { cn } from '@/lib/styles/tailwind'
import { Flame, Heart, LucideProps, Sparkles, Undo2, X } from 'lucide-react'

interface ActionButtonProps {
    icon: React.ComponentType<LucideProps>
    size?: 'small' | 'large'
    onClick: () => void
    disabled?: boolean
    active?: boolean
}

const ActionButton = ({ icon: Icon, size = 'small', onClick, disabled = false, active = false }: ActionButtonProps) => {
    const sizeClasses = {
        small: 'w-12 h-12',
        large: 'w-16 h-16',
    }

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={cn(
                'flex items-center justify-center rounded-full transition-all',
                'border border-[#F0F2F5] bg-white',
                'hover:bg-gray-50',
                sizeClasses[size],
                active && 'bg-[#22CC88]',
                disabled && 'cursor-not-allowed opacity-50',
            )}>
            <Icon
                size={24}
                className={cn('transition-colors', disabled ? 'text-[#CCC]' : 'text-gray-700', active && 'text-white')}
                fill={active ? 'currentColor' : disabled ? '#CCC' : 'none'}
            />
        </button>
    )
}

export function ActionBar() {
    return (
        <div className='absolute right-4 bottom-[72px] left-4 flex h-14 items-center justify-between'>
            <ActionButton icon={Undo2} onClick={() => {}} size='small' />
            <ActionButton icon={X} onClick={() => {}} size='large' />
            <ActionButton icon={Sparkles} onClick={() => {}} size='small' />
            <ActionButton icon={Heart} onClick={() => {}} size='large' />
            <ActionButton icon={Flame} onClick={() => {}} size='small' />
        </div>
    )
}
