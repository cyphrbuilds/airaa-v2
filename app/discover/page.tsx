'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { Search, ChevronLeft, ChevronRight, Users, Trophy, BadgeCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RewardTicker } from '@/components/dashboard/reward-ticker'
import { FeaturedCommunityCard } from '@/components/cards/featured-community-card'
import { TopEarnersList } from '@/components/cards/top-earner-card'
import { SearchModal } from '@/components/search-modal'
import { guilds, recentPayouts, leaderboardUsers } from '@/lib/mock-data'
import { GuildCategory, GUILD_CATEGORY_COLORS } from '@/types'
import { cn } from '@/lib/utils'
import Link from 'next/link'

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

export default function DiscoverPage() {
  const [selectedCategory, setSelectedCategory] = useState<GuildCategory | 'All'>('All')
  const [searchModalOpen, setSearchModalOpen] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)

  // Keyboard shortcut for Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchModalOpen(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Featured guilds (those with active campaigns, sorted by rewards)
  const featuredGuilds = useMemo(() => {
    return [...guilds]
      .filter(g => g.activeCampaigns > 0)
      .sort((a, b) => b.totalRewardsDistributed - a.totalRewardsDistributed)
      .slice(0, 6)
  }, [])

  // Filtered guilds for the category grid
  const filteredGuilds = useMemo(() => {
    let result = [...guilds]

    // Filter by category
    if (selectedCategory !== 'All') {
      result = result.filter(g => g.category === selectedCategory)
    }

    // Sort by active campaigns
    result.sort((a, b) => b.activeCampaigns - a.activeCampaigns)

    return result
  }, [selectedCategory])

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 340
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="pb-8">
      {/* Reward Activity Ticker */}
      <RewardTicker payouts={recentPayouts} />

      {/* Search Bar - Clickable to open modal */}
      <div className="border-b border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <button
            onClick={() => setSearchModalOpen(true)}
            className="relative max-w-2xl mx-auto w-full flex items-center"
          >
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
              <div className="pl-12 pr-20 h-12 bg-zinc-900/80 border border-zinc-700 rounded-md text-zinc-500 flex items-center hover:border-zinc-600 transition-colors cursor-text">
                Search communities, campaigns, creators...
              </div>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-1 rounded bg-zinc-800 border border-zinc-700">
                <span className="text-xs text-zinc-500">⌘</span>
                <span className="text-xs text-zinc-500">K</span>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Search Modal */}
      <SearchModal open={searchModalOpen} onOpenChange={setSearchModalOpen} />

      {/* Main Content with Sidebar */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Featured Communities Carousel */}
            <section className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-zinc-100">Featured Communities</h2>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800"
                    onClick={() => scrollCarousel('left')}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800"
                    onClick={() => scrollCarousel('right')}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div
                ref={carouselRef}
                className="flex gap-4 overflow-x-auto scrollbar-thin pb-2 -mx-2 px-2"
                style={{ scrollSnapType: 'x mandatory' }}
              >
                {featuredGuilds.map((guild) => (
                  <FeaturedCommunityCard
                    key={guild.id}
                    guild={guild}
                    className="scroll-snap-align-start flex-shrink-0"
                  />
                ))}
              </div>
            </section>

            {/* Category Tabs */}
            <section>
              <h2 className="text-xl font-semibold text-zinc-100 mb-4">Browse Communities</h2>
              
              {/* Category Pills */}
              <div className="flex items-center gap-2 flex-wrap mb-6">
                {categories.map((category) => {
                  const isSelected = selectedCategory === category
                  const color = category === 'All' ? '#22c55e' : GUILD_CATEGORY_COLORS[category]
                  
                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
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

              {/* Results count */}
              <p className="text-sm text-zinc-500 mb-4">
                {filteredGuilds.length} communit{filteredGuilds.length !== 1 ? 'ies' : 'y'} found
              </p>

              {/* Community Grid */}
              {filteredGuilds.length > 0 ? (
                <div className="space-y-3">
                  {filteredGuilds.map((guild) => (
                    <CommunityRow key={guild.id} guild={guild} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800 mb-4">
                    <Search className="h-8 w-8 text-zinc-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-200 mb-2">No communities found</h3>
                  <p className="text-zinc-500 max-w-sm">
                    Try adjusting your filters or search query to find what you're looking for.
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* Right Sidebar */}
          <aside className="w-80 flex-shrink-0 hidden lg:block">
            <div className="sticky top-4">
              <div className="rounded-xl border border-zinc-800 p-4">
                <h3 className="text-lg font-semibold text-zinc-100 mb-4">Top Earners This Week</h3>
                <TopEarnersList users={leaderboardUsers} maxDisplay={5} />
                <Link href="/leaderboard">
                  <Button variant="outline" className="w-full mt-4 border-zinc-700 hover:bg-zinc-800">
                    View Full Leaderboard
                  </Button>
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

// Community Row Component for the category grid
function CommunityRow({ guild }: { guild: typeof guilds[0] }) {
  const categoryColor = GUILD_CATEGORY_COLORS[guild.category]

  return (
    <Link
      href={`/guild/${guild.id}`}
      className="group flex items-center gap-4 p-4 rounded-xl border border-zinc-800 hover:bg-zinc-800/30 hover:border-zinc-700 transition-all"
    >
      {/* Guild Icon */}
      <div 
        className="h-14 w-14 rounded-xl overflow-hidden flex-shrink-0 border-2 border-zinc-800"
      >
        <img
          src={guild.icon}
          alt={guild.name}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-zinc-100 truncate group-hover:text-white transition-colors">
            {guild.name}
          </h3>
          {guild.verified && (
            <BadgeCheck className="h-4 w-4 text-blue-500 flex-shrink-0" />
          )}
          <Badge 
            variant="secondary" 
            className="text-xs"
            style={{ 
              backgroundColor: `${categoryColor}20`,
              color: categoryColor,
            }}
          >
            {guild.category}
          </Badge>
        </div>
        <p className="text-sm text-zinc-400 line-clamp-1">{guild.description}</p>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-6 flex-shrink-0">
        <div className="text-center">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <Users className="h-4 w-4" />
            <span className="text-sm font-medium">{guild.totalMembers.toLocaleString()}</span>
          </div>
          <p className="text-xs text-zinc-500">members</p>
        </div>

        {guild.activeCampaigns > 0 && (
          <div className="text-center">
            <div className="flex items-center gap-1.5 text-green-500">
              <Trophy className="h-4 w-4" />
              <span className="text-sm font-medium">{guild.activeCampaigns}</span>
            </div>
            <p className="text-xs text-zinc-500">campaigns</p>
          </div>
        )}

        <div className="text-center">
          <p className="text-sm font-bold text-zinc-200">
            ${(guild.totalRewardsDistributed / 1000).toFixed(0)}K
          </p>
          <p className="text-xs text-zinc-500">distributed</p>
        </div>
      </div>

      {/* Online indicator */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <div className="h-2 w-2 rounded-full bg-green-500 pulse-dot" />
        <span className="text-xs text-zinc-500">
          {guild.onlineMembers.toLocaleString()}
        </span>
      </div>
    </Link>
  )
}
