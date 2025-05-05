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
      'shadow-[0_4px_12px_rgba(0,0,0,0.03)]',
      'rounded-[999px]',
      'bg-white/95',
      'backdrop-blur-sm',
      className
    )}>
      <Tabs value={activeTab} onValueChange={(value) => onChange(value as T)}>
        <TabsList
          className={cn(
            'h-8 p-[3px] rounded-[999px]',
            'shadow-[inset_0_1px_1px_rgba(0,0,0,0.04)]',
            'grid grid-cols-2 gap-0',
            'w-[240px] relative'
          )}
        >
          <motion.div
            className={cn(
              'absolute rounded-[999px]',
              'bg-[#22CC88]',
              'shadow-[0_2px_4px_rgba(34,204,136,0.2)]',
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
                'relative h-full rounded-[999px]',
                'data-[state=active]:text-white',
                'data-[state=active]:shadow-none',
                'data-[state=active]:bg-transparent',
                'focus-visible:ring-[#22CC88]',
                'transition-colors duration-200'
              )}
            >
              <span className={cn(
                'relative z-10',
                'data-[state=active]:text-shadow-sm',
                activeTab === tab.id ? 'text-white' : 'text-gray-600'
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