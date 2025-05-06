'use client';

import { LucideProps } from 'lucide-react';
import { Undo2, X, Sparkles, Heart, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActionButtonProps {
  icon: React.ComponentType<LucideProps>;
  size?: 'small' | 'large';
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
}

const ActionButton = ({
  icon: Icon,
  size = 'small',
  onClick,
  disabled = false,
  active = false,
}: ActionButtonProps) => {
  const sizeClasses = {
    small: 'w-12 h-12',
    large: 'w-16 h-16',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'rounded-full flex items-center justify-center transition-all',
        'bg-white border border-[#F0F2F5]',
        'hover:bg-gray-50',
        sizeClasses[size],
        active && 'bg-[#22CC88]',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      <Icon
        size={24}
        className={cn(
          'transition-colors',
          disabled ? 'text-[#CCC]' : 'text-gray-700',
          active && 'text-white'
        )}
        fill={active ? 'currentColor' : disabled ? '#CCC' : 'none'}
      />
    </button>
  );
};

export function ActionBar() {
  return (
    <div className="absolute bottom-[72px] left-4 right-4 h-14 flex items-center justify-between">
      <ActionButton
        icon={Undo2}
        onClick={() => {}}
        size="small"
      />
      <ActionButton
        icon={X}
        onClick={() => {}}
        size="large"
      />
      <ActionButton
        icon={Sparkles}
        onClick={() => {}}
        size="small"
      />
      <ActionButton
        icon={Heart}
        onClick={() => {}}
        size="large"
      />
      <ActionButton
        icon={Flame}
        onClick={() => {}}
        size="small"
      />
    </div>
  );
} 