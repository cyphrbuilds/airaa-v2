'use client'

import { Search, ChevronDown } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { STORE_APP_CATEGORIES, StoreAppCategory } from '@/types'
import { cn } from '@/lib/utils'

/** Sort options for the app store list */
export type SortOption = 'weekly_installs' | 'reviews' | 'newest'

/**
 * Props for the AppStoreHeader component
 */
export interface AppStoreHeaderProps {
  /** Current search query value */
  searchQuery: string
  /** Callback when search query changes */
  onSearchChange: (query: string) => void
  /** Currently selected category filter */
  selectedCategory: StoreAppCategory | 'All'
  /** Callback when category filter changes */
  onCategoryChange: (category: StoreAppCategory | 'All') => void
  /** Current sort option */
  sortBy: SortOption
  /** Callback when sort option changes */
  onSortChange: (sort: SortOption) => void
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'weekly_installs', label: 'Most weekly installs' },
  { value: 'reviews', label: 'Most reviews' },
  { value: 'newest', label: 'Newest' },
]

const ALL_CATEGORIES: (StoreAppCategory | 'All')[] = ['All', ...STORE_APP_CATEGORIES]

export function AppStoreHeader({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
}: AppStoreHeaderProps) {
  const currentSortLabel = SORT_OPTIONS.find(opt => opt.value === sortBy)?.label || 'Sort by'

  return (
    <div className="space-y-4">
      {/* Title and Search Row */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">App store</h1>
        
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input
              type="text"
              placeholder="Search apps..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 bg-zinc-900/50 border-zinc-800 focus:border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
            />
          </div>

          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="gap-2 border-zinc-800 bg-zinc-900/50 text-zinc-300 hover:bg-zinc-800 hover:text-white whitespace-nowrap"
              >
                {currentSortLabel}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-zinc-900 border-zinc-800">
              {SORT_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => onSortChange(option.value)}
                  className={cn(
                    "cursor-pointer",
                    sortBy === option.value 
                      ? "text-white bg-zinc-800" 
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                  )}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-hide">
        {ALL_CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap",
              selectedCategory === category
                ? "bg-zinc-800 text-white"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
            )}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  )
}
