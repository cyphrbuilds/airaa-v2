'use client'

import { useState, useMemo, useRef } from 'react'
import Link from 'next/link'
import { Search, Users, Trophy, BadgeCheck, Star, TrendingUp, Sparkles, ChevronLeft, ChevronRight, SlidersHorizontal, ChevronDown, Check } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CommunityCard } from '@/components/cards/community-card'
import { guilds, currentUser } from '@/lib/mock-data'
import { GuildCategory, GUILD_CATEGORY_COLORS } from '@/types'
import { cn } from '@/lib/utils'

type SortOption = 'rewards' | 'members' | 'campaigns' | 'newest'

export default function CommunitiesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<GuildCategory | 'All'>('All')
  const [sortBy, setSortBy] = useState<SortOption>('rewards')
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [hasActiveCampaigns, setHasActiveCampaigns] = useState(false)
  const [showRecommended, setShowRecommended] = useState(false)
  const [displayCount, setDisplayCount] = useState(10)

  const trendingRef = useRef<HTMLDivElement>(null)
  const newRef = useRef<HTMLDivElement>(null)

  // Get user's joined guilds categories for recommendations
  const userCategories = useMemo(() => {
    const joinedGuildIds = currentUser.joinedGuilds
    const categories = new Set<GuildCategory>()
    guilds.forEach(g => {
      if (joinedGuildIds.includes(g.id)) {
        categories.add(g.category)
      }
    })
    return Array.from(categories)
  }, [])

  // Recommended communities (same categories as user's guilds, not joined)
  const recommendedGuilds = useMemo(() => {
    return guilds
      .filter(g => 
        userCategories.includes(g.category) && 
        !currentUser.joinedGuilds.includes(g.id)
      )
      .sort((a, b) => b.totalRewardsDistributed - a.totalRewardsDistributed)
      .slice(0, 8)
  }, [userCategories])

  // Trending communities (most active campaigns + rewards)
  const trendingGuilds = useMemo(() => {
    return [...guilds]
      .filter(g => g.activeCampaigns > 0)
      .sort((a, b) => (b.activeCampaigns * 1000000 + b.totalRewardsDistributed) - (a.activeCampaigns * 1000000 + a.totalRewardsDistributed))
      .slice(0, 6)
  }, [])

  // New communities (mock: just take some guilds, in real app would sort by createdAt)
  const newGuilds = useMemo(() => {
    return [...guilds]
      .reverse()
      .slice(0, 6)
  }, [])

  // Filtered and sorted guilds for browse section
  const filteredGuilds = useMemo(() => {
    let result = [...guilds]

    // If showing recommended, filter to recommended only
    if (showRecommended) {
      result = recommendedGuilds
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(g => 
        g.name.toLowerCase().includes(query) ||
        g.description.toLowerCase().includes(query) ||
        g.category.toLowerCase().includes(query)
      )
    }

    // Category filter (only if not showing recommended)
    if (selectedCategory !== 'All' && !showRecommended) {
      result = result.filter(g => g.category === selectedCategory)
    }

    // Verified filter
    if (verifiedOnly) {
      result = result.filter(g => g.verified)
    }

    // Active campaigns filter
    if (hasActiveCampaigns) {
      result = result.filter(g => g.activeCampaigns > 0)
    }

    // Sort
    switch (sortBy) {
      case 'rewards':
        result.sort((a, b) => b.totalRewardsDistributed - a.totalRewardsDistributed)
        break
      case 'members':
        result.sort((a, b) => b.totalMembers - a.totalMembers)
        break
      case 'campaigns':
        result.sort((a, b) => b.activeCampaigns - a.activeCampaigns)
        break
      case 'newest':
        result.reverse() // Mock: just reverse order
        break
    }

    return result
  }, [searchQuery, selectedCategory, sortBy, verifiedOnly, hasActiveCampaigns, showRecommended, recommendedGuilds])

  const displayedGuilds = filteredGuilds.slice(0, displayCount)
  const hasMore = displayCount < filteredGuilds.length

  const scrollCarousel = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = 240
      ref.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero Search Section */}
      <div className="border-b border-zinc-800/50 bg-gradient-to-b from-zinc-900/50 to-transparent">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">
              Discover Communities
            </h1>
            <p className="text-zinc-400 text-sm max-w-lg mx-auto">
              Find your next community and start earning rewards
            </p>
          </div>

          {/* Search Input */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search communities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 h-11 bg-zinc-900/80 border border-zinc-700 rounded-lg text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Show sections only if no search query */}
        {!searchQuery && (
          <>
            {/* Two Column Grid for Trending & New */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Trending This Week */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-orange-500" />
                    <h2 className="text-sm font-semibold text-zinc-100">Trending This Week</h2>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-zinc-500 hover:text-zinc-300"
                      onClick={() => scrollCarousel(trendingRef, 'left')}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-zinc-500 hover:text-zinc-300"
                      onClick={() => scrollCarousel(trendingRef, 'right')}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div 
                  ref={trendingRef}
                  className="flex gap-3 overflow-x-auto scrollbar-none pb-1"
                  style={{ scrollSnapType: 'x mandatory' }}
                >
                  {trendingGuilds.map((guild) => (
                    <CommunityCard
                      key={guild.id}
                      guild={guild}
                      className="scroll-snap-align-start flex-shrink-0"
                    />
                  ))}
                </div>
              </div>

              {/* New Communities */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-500" />
                    <h2 className="text-sm font-semibold text-zinc-100">New Communities</h2>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-zinc-500 hover:text-zinc-300"
                      onClick={() => scrollCarousel(newRef, 'left')}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-zinc-500 hover:text-zinc-300"
                      onClick={() => scrollCarousel(newRef, 'right')}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div 
                  ref={newRef}
                  className="flex gap-3 overflow-x-auto scrollbar-none pb-1"
                  style={{ scrollSnapType: 'x mandatory' }}
                >
                  {newGuilds.map((guild) => (
                    <CommunityCard
                      key={guild.id}
                      guild={guild}
                      className="scroll-snap-align-start flex-shrink-0"
                    />
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Browse All Section */}
        <section>
          <h2 className="text-lg font-semibold text-zinc-100 mb-4">
            {searchQuery ? 'Search Results' : showRecommended ? 'Personalized For You' : 'Browse All Communities'}
          </h2>

          {/* Category Pills Row - with Recommended button */}
          <div className="flex items-center gap-2 flex-wrap mb-4">
            {/* Personalized For You Button */}
            <button
              onClick={() => {
                setShowRecommended(!showRecommended)
                if (!showRecommended) {
                  setSelectedCategory('All')
                }
              }}
              className={cn(
                "flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all",
                showRecommended
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.3)]"
                  : "bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-[0_0_8px_rgba(245,158,11,0.15)]"
              )}
            >
              <Star className={cn("h-4 w-4", showRecommended ? "fill-amber-400" : "fill-amber-400/50")} />
              Personalized For You
            </button>

            <div className="w-px h-5 bg-zinc-700 mx-1" />

            {/* Category Pills */}
            {(['All', 'DeFi', 'Gaming', 'NFTs', 'DAOs', 'Infrastructure', 'Social', 'Entertainment', 'Education'] as const).map((category) => {
              const isSelected = !showRecommended && selectedCategory === category
              const color = category === 'All' ? '#22c55e' : GUILD_CATEGORY_COLORS[category]
              
              return (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category)
                    setShowRecommended(false)
                  }}
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

          {/* Sort and Filter Row */}
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <div className="flex items-center gap-3">
              {/* Sort Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="h-8 gap-2 border-zinc-700 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 text-sm"
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                    {sortBy === 'rewards' ? 'Most Rewards' : sortBy === 'members' ? 'Most Members' : sortBy === 'campaigns' ? 'Most Campaigns' : 'Newest'}
                    <ChevronDown className="h-3 w-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="bg-zinc-900 border-zinc-800">
                  {[
                    { value: 'rewards', label: 'Most Rewards' },
                    { value: 'members', label: 'Most Members' },
                    { value: 'campaigns', label: 'Most Campaigns' },
                    { value: 'newest', label: 'Newest' },
                  ].map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => setSortBy(option.value as SortOption)}
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
                onClick={() => setVerifiedOnly(!verifiedOnly)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all",
                  verifiedOnly 
                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" 
                    : "bg-zinc-800/50 text-zinc-400 hover:text-zinc-200 border border-transparent"
                )}
              >
                <div className={cn(
                  "h-3.5 w-3.5 rounded border-2 flex items-center justify-center transition-colors",
                  verifiedOnly ? "border-blue-500 bg-blue-500" : "border-zinc-600"
                )}>
                  {verifiedOnly && <Check className="h-2.5 w-2.5 text-white" />}
                </div>
                Verified
              </button>

              <button
                onClick={() => setHasActiveCampaigns(!hasActiveCampaigns)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all",
                  hasActiveCampaigns 
                    ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                    : "bg-zinc-800/50 text-zinc-400 hover:text-zinc-200 border border-transparent"
                )}
              >
                <div className={cn(
                  "h-3.5 w-3.5 rounded border-2 flex items-center justify-center transition-colors",
                  hasActiveCampaigns ? "border-green-500 bg-green-500" : "border-zinc-600"
                )}>
                  {hasActiveCampaigns && <Check className="h-2.5 w-2.5 text-white" />}
                </div>
                Active campaigns
              </button>
            </div>

            {/* Results Count */}
            <p className="text-xs text-zinc-500">
              {filteredGuilds.length} communit{filteredGuilds.length !== 1 ? 'ies' : 'y'} found
            </p>
          </div>

          {/* Community List */}
          <div className="mt-4 space-y-3">
            {displayedGuilds.length > 0 ? (
              displayedGuilds.map((guild) => (
                <CommunityRow key={guild.id} guild={guild} />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-800 mb-4">
                  <Search className="h-6 w-6 text-zinc-600" />
                </div>
                <h3 className="text-base font-semibold text-zinc-200 mb-2">No communities found</h3>
                <p className="text-zinc-500 text-sm max-w-sm">
                  Try adjusting your filters or search query.
                </p>
              </div>
            )}
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="flex justify-center mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDisplayCount(prev => prev + 10)}
                className="border-zinc-700 hover:bg-zinc-800"
              >
                Load More ({filteredGuilds.length - displayCount} remaining)
              </Button>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

// Community Row Component
function CommunityRow({ guild }: { guild: typeof guilds[0] }) {
  const categoryColor = GUILD_CATEGORY_COLORS[guild.category]

  return (
    <Link
      href={`/guild/${guild.id}`}
      className="group flex items-center gap-4 p-3 rounded-xl border border-zinc-800 bg-zinc-900/30 hover:bg-zinc-800/30 hover:border-zinc-700 transition-all"
    >
      {/* Guild Icon */}
      <div 
        className="h-12 w-12 rounded-xl overflow-hidden flex-shrink-0 border border-zinc-700"
      >
        <img
          src={guild.icon}
          alt={guild.name}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <h3 className="font-semibold text-sm text-zinc-100 truncate group-hover:text-white transition-colors">
            {guild.name}
          </h3>
          {guild.verified && (
            <BadgeCheck className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
          )}
          <Badge 
            variant="secondary" 
            className="text-[10px] px-1.5 h-4"
            style={{ 
              backgroundColor: `${categoryColor}20`,
              color: categoryColor,
            }}
          >
            {guild.category}
          </Badge>
        </div>
        <p className="text-xs text-zinc-500 line-clamp-1">{guild.description}</p>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 flex-shrink-0 text-xs">
        <div className="text-center">
          <div className="flex items-center gap-1 text-zinc-400">
            <Users className="h-3.5 w-3.5" />
            <span className="font-medium">{(guild.totalMembers / 1000).toFixed(0)}K</span>
          </div>
        </div>

        {guild.activeCampaigns > 0 && (
          <div className="text-center">
            <div className="flex items-center gap-1 text-green-500">
              <Trophy className="h-3.5 w-3.5" />
              <span className="font-medium">{guild.activeCampaigns}</span>
            </div>
          </div>
        )}

        <div className="text-center">
          <span className="font-bold text-zinc-200">
            ${(guild.totalRewardsDistributed / 1000).toFixed(0)}K
          </span>
        </div>
      </div>
    </Link>
  )
}
