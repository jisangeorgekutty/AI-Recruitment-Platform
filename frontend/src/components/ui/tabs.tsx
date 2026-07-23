import { type ReactNode, useState } from 'react'
import { cn } from '@/lib/utils'

interface TabsProps {
  tabs: { value: string; label: string; count?: number }[]
  activeTab: string
  onTabChange: (value: string) => void
  className?: string
}

export function Tabs({ tabs, activeTab, onTabChange, className }: TabsProps) {
  return (
    <div className={cn('flex border-b border-border', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onTabChange(tab.value)}
          className={cn(
            'relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors',
            activeTab === tab.value
              ? 'text-foreground'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className={cn(
              'inline-flex items-center rounded-full px-2 py-0.5 text-xs',
              activeTab === tab.value
                ? 'bg-primary/10 text-primary'
                : 'bg-muted text-muted-foreground',
            )}>
              {tab.count}
            </span>
          )}
          {activeTab === tab.value && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>
      ))}
    </div>
  )
}

interface TabPanelProps {
  value: string
  activeTab: string
  children: ReactNode
  className?: string
}

export function TabPanel({ value, activeTab, children, className }: TabPanelProps) {
  if (value !== activeTab) return null
  return <div className={cn('pt-4', className)}>{children}</div>
}
