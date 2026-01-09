'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import { guilds } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

interface SearchModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')

  // Reset query when modal closes
  useEffect(() => {
    if (!open) {
      setQuery('')
    }
  }, [open])

  // Sort guilds by member count for "trending"
  const trendingGuilds = useMemo(() => {
    let results = [...guilds].sort((a, b) => b.totalMembers - a.totalMembers)
    
    // Filter by search query if present
    if (query.trim()) {
      const searchQuery = query.toLowerCase()
      results = results.filter(g => 
        g.name.toLowerCase().includes(searchQuery) ||
        g.description.toLowerCase().includes(searchQuery)
      )
    }
    
    return results
  }, [query])

  const handleGuildClick = (guildId: string) => {
    onOpenChange(false)
    router.push(`/guild/${guildId}`)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-2xl p-0 overflow-hidden bg-[#111111] border-zinc-800/80" 
        aria-describedby={undefined}
      >
        <VisuallyHidden.Root>
          <DialogTitle>Search Projects</DialogTitle>
        </VisuallyHidden.Root>

        {/* Search Input Section */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800/80">
          <Search className="h-5 w-5 text-zinc-500 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search projects"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-zinc-100 placeholder:text-zinc-500 text-base outline-none"
            autoFocus
          />
        </div>

        {/* Trending Projects Section */}
        <div className="flex flex-col">
          <h3 className="px-4 py-3 text-sm font-medium text-zinc-400">
            {query.trim() ? 'Search Results' : 'Trending Projects'}
          </h3>
          
          <div className="max-h-[400px] overflow-y-auto scrollbar-thin">
            {trendingGuilds.length > 0 ? (
              trendingGuilds.map((guild) => (
                <button
                  key={guild.id}
                  onClick={() => handleGuildClick(guild.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3",
                    "hover:bg-zinc-800/50 transition-colors",
                    "focus:outline-none focus:bg-zinc-800/50"
                  )}
                >
                  {/* Avatar */}
                  <div className="h-11 w-11 rounded-lg overflow-hidden flex-shrink-0 border border-zinc-700/50">
                    <img
                      src={guild.icon}
                      alt={guild.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 text-left">
                    <h4 className="font-semibold text-zinc-100 truncate text-[15px]">
                      {guild.name}
                    </h4>
                    <p className="text-sm text-zinc-500 truncate">
                      {guild.description}
                    </p>
                  </div>
                </button>
              ))
            ) : (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-zinc-500">No projects found</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
