'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export type TabId = string
export type TabItem = {
  id: TabId
  label: string
}

interface FloatingTabSwitcherProps<T extends TabId> {
  tabs: readonly TabItem[]
  activeTab: T
  onChange: (tabId: T) => void
  className?: string
}

export function FloatingTabSwitcher<T extends TabId>({
  tabs,
  activeTab,
  onChange,
  className,
}: FloatingTabSwitcherProps<T>) {
  return (
    <div className={cn(
      'shadow-[0_1px_2px_rgba(0,0,0,0.1)]',
      'rounded-full',
      'bg-white/95',
      'backdrop-blur-sm',
      className
    )}>
      <Tabs value={activeTab} onValueChange={(value) => onChange(value as T)}>
        <TabsList
          className={cn(
            'h-8 p-[3px]',
            'rounded-full',
            'shadow-[inset_0_1px_1px_rgba(0,0,0,0.04)]',
            'grid grid-cols-2 gap-0',
            'w-[240px] relative'
          )}
        >
          <motion.div
            className={cn(
              'absolute rounded-full',
              'bg-[#22CC88]',
              'shadow-[0_1px_2px_rgba(0,0,0,0.1)]',
              'w-[117px] h-[26px]'
            )}
            initial={false}
            animate={{
              x: activeTab === tabs[0].id ? 3 : 120
            }}
            transition={{
              type: 'spring',
              bounce: 0.2,
              duration: 0.6
            }}
            style={{
              top: '3px'
            }}
          />

          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className={cn(
                'relative h-full rounded-full',
                'data-[state=active]:text-white',
                'data-[state=active]:shadow-none',
                'data-[state=active]:bg-transparent',
                'focus-visible:ring-[#22CC88]',
                'transition-colors duration-200',
                'text-[#333333]'
              )}
            >
              <span className={cn(
                'relative z-10',
                'text-sm font-medium',
                activeTab === tab.id ? 'text-white' : 'text-[#333333]'
              )}>
                {tab.label}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  )
} 