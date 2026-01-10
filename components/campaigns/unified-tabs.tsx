'use client'

import { cn } from '@/lib/utils'

export type UnifiedTab = 'instant' | 'infofi' | 'ugc' | 'clipping'

interface TabConfig {
  id: UnifiedTab
  label: string
}

const tabs: TabConfig[] = [
  { id: 'instant', label: 'Instant Tasks' },
  { id: 'infofi', label: 'InfoFi' },
  { id: 'ugc', label: 'UGC' },
  { id: 'clipping', label: 'Clipping' },
]

interface UnifiedTabsProps {
  selected: UnifiedTab
  onChange: (tab: UnifiedTab) => void
  counts?: Partial<Record<UnifiedTab, number>>
  className?: string
}

export function UnifiedTabs({ selected, onChange, counts, className }: UnifiedTabsProps) {
  return (
    <div className={cn("flex items-center gap-1 p-1 rounded-lg bg-zinc-900/60 border border-zinc-800", className)}>
      {tabs.map((tab) => {
        const count = counts?.[tab.id]
        const isActive = selected === tab.id
        
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
              isActive
                ? "bg-green-500/15 text-green-400 shadow-sm"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
            )}
          >
            {tab.label}
            {count !== undefined && count > 0 && (
              <span className={cn(
                "min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full text-xs font-semibold",
                isActive
                  ? "bg-green-500/20 text-green-400"
                  : "bg-zinc-800 text-zinc-500"
              )}>
                {count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
