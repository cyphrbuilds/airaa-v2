'use client'

import { useState } from 'react'
import { ChevronDown, Check, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { GuildCategory, GUILD_CATEGORY_COLORS } from '@/types'
import { cn } from '@/lib/utils'

const categories: (GuildCategory | 'All')[] = [
  'All',
  'DeFi',
  'Gaming',
  'NFTs',
  'DAOs',
  'Infrastructure',
  'Social',
  'Entertainment',
  'Education'
]

export type SortOption = 'rewards' | 'members' | 'campaigns' | 'newest'

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'rewards', label: 'Most Rewards' },
  { value: 'members', label: 'Most Members' },
  { value: 'campaigns', label: 'Most Campaigns' },
  { value: 'newest', label: 'Newest' },
]

interface FilterBarProps {
  selectedCategory: GuildCategory | 'All'
  onCategoryChange: (category: GuildCategory | 'All') => void
  sortBy: SortOption
  onSortChange: (sort: SortOption) => void
  verifiedOnly: boolean
  onVerifiedOnlyChange: (value: boolean) => void
  hasActiveCampaigns: boolean
  onHasActiveCampaignsChange: (value: boolean) => void
  resultCount: number
}

export function FilterBar({
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  verifiedOnly,
  onVerifiedOnlyChange,
  hasActiveCampaigns,
  onHasActiveCampaignsChange,
  resultCount,
}: FilterBarProps) {
  const selectedSortLabel = sortOptions.find(o => o.value === sortBy)?.label || 'Sort'

  return (
    <div className="space-y-4">
      {/* Category Pills */}
      <div className="flex items-center gap-2 flex-wrap">
        {categories.map((category) => {
          const isSelected = selectedCategory === category
          const color = category === 'All' ? '#22c55e' : GUILD_CATEGORY_COLORS[category]
          
          return (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium transition-all",
                isSelected
                  ? "text-white"
                  : "text-zinc-400 hover:text-zinc-200 bg-zinc-800/50 hover:bg-zinc-800"
              )}
              style={isSelected ? { 
                backgroundColor: `${color}20`,
                color: color,
                boxShadow: `0 0 0 1px ${color}40`
              } : undefined}
            >
              {category}
            </button>
          )
        })}
      </div>

      {/* Filters Row */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="h-9 gap-2 border-zinc-700 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300"
              >
                <SlidersHorizontal className="h-4 w-4" />
                {selectedSortLabel}
                <ChevronDown className="h-3.5 w-3.5 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="bg-zinc-900 border-zinc-800">
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => onSortChange(option.value)}
                  className={cn(
                    "flex items-center gap-2 cursor-pointer",
                    sortBy === option.value && "text-green-500"
                  )}
                >
                  {sortBy === option.value && <Check className="h-4 w-4" />}
                  <span className={sortBy === option.value ? "" : "pl-6"}>{option.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Toggle Filters */}
          <button
            onClick={() => onVerifiedOnlyChange(!verifiedOnly)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all",
              verifiedOnly 
                ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" 
                : "bg-zinc-800/50 text-zinc-400 hover:text-zinc-200 border border-transparent"
            )}
          >
            <div className={cn(
              "h-4 w-4 rounded border-2 flex items-center justify-center transition-colors",
              verifiedOnly ? "border-blue-500 bg-blue-500" : "border-zinc-600"
            )}>
              {verifiedOnly && <Check className="h-3 w-3 text-white" />}
            </div>
            Verified only
          </button>

          <button
            onClick={() => onHasActiveCampaignsChange(!hasActiveCampaigns)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all",
              hasActiveCampaigns 
                ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                : "bg-zinc-800/50 text-zinc-400 hover:text-zinc-200 border border-transparent"
            )}
          >
            <div className={cn(
              "h-4 w-4 rounded border-2 flex items-center justify-center transition-colors",
              hasActiveCampaigns ? "border-green-500 bg-green-500" : "border-zinc-600"
            )}>
              {hasActiveCampaigns && <Check className="h-3 w-3 text-white" />}
            </div>
            Has active campaigns
          </button>
        </div>

        {/* Results Count */}
        <p className="text-sm text-zinc-500">
          {resultCount} communit{resultCount !== 1 ? 'ies' : 'y'} found
        </p>
      </div>
    </div>
  )
}
