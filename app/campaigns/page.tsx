'use client'

import { useState, useMemo } from 'react'
import { Search, ChevronDown, Check, ArrowRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CampaignCardNew } from '@/components/cards/campaign-card-new'
import { campaigns, getActiveCampaigns, getTotalRewardsDistributed, formatRewardsShort } from '@/lib/mock-data'
import { CampaignType, CampaignCategory } from '@/types'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const campaignTypes: (CampaignType | 'All')[] = ['All', 'InfoFi', 'Mini', 'UGC', 'Clipping']
const campaignCategories: (CampaignCategory | 'All')[] = ['All', 'Marketplace', 'Gaming', 'DeFi', 'NFT', 'Social', 'Education']
const statusOptions = [
  { value: 'all', label: 'All campaigns' },
  { value: 'active', label: 'Live campaigns' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'past', label: 'Ended' },
]
const sortOptions = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'reward', label: 'Highest Reward' },
  { value: 'recent', label: 'Recently Added' },
  { value: 'ending', label: 'Ending Soon' },
]

export default function CampaignsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<CampaignType | 'All'>('All')
  const [selectedCategory, setSelectedCategory] = useState<CampaignCategory | 'All'>('All')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [sortBy, setSortBy] = useState('popular')

  const totalRewards = getTotalRewardsDistributed()
  const allCampaigns = getActiveCampaigns()

  const filteredCampaigns = useMemo(() => {
    let result = [...allCampaigns]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(c => 
        c.name.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query) ||
        c.guildName.toLowerCase().includes(query)
      )
    }

    // Type filter
    if (selectedType !== 'All') {
      result = result.filter(c => c.type === selectedType)
    }

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter(c => c.category === selectedCategory)
    }

    // Status filter
    if (selectedStatus !== 'all') {
      result = result.filter(c => c.status === selectedStatus)
    }

    // Sort
    switch (sortBy) {
      case 'reward':
        result.sort((a, b) => b.totalReward - a.totalReward)
        break
      case 'recent':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'ending':
        result.sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())
        break
      case 'popular':
      default:
        result.sort((a, b) => b.participantsCount - a.participantsCount)
    }

    return result
  }, [searchQuery, selectedType, selectedCategory, selectedStatus, sortBy, allCampaigns])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background gradient effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
          <div className="absolute top-20 right-1/4 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl" />
        </div>
        
        <div className="relative px-6 py-16 max-w-7xl mx-auto text-center">
          {/* Stats badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium text-green-400">
              {formatRewardsShort(totalRewards)} USD Distributed in Rewards
            </span>
          </div>
          
          {/* Title */}
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            Explore Campaigns
          </h1>
          
          {/* Subtitle */}
          <p className="text-zinc-400 text-lg mb-10 max-w-2xl mx-auto">
            Participate in campaigns based on your content,<br />
            engagement, and onchain activity.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
            <Input
              type="text"
              placeholder="Search campaigns"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 bg-zinc-900/80 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus:border-green-500 focus:ring-green-500/20 rounded-xl"
            />
          </div>
          
          {/* CTA Link */}
          <a 
            href="#" 
            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors group"
          >
            List your campaign on Airaa
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>

      {/* Campaign Grid */}
      <div className="px-6 py-8 max-w-7xl mx-auto">
        {/* Filters Row */}
        <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
          {/* Left side filters */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Categories dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-9 px-3 text-zinc-400 hover:text-white hover:bg-zinc-800">
                  {selectedType === 'All' ? 'Type' : selectedType}
                  <ChevronDown className="h-4 w-4 ml-1.5 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-zinc-900 border-zinc-700">
                {campaignTypes.map((type) => (
                  <DropdownMenuItem
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={cn(
                      "cursor-pointer",
                      selectedType === type && "text-green-500"
                    )}
                  >
                    {type === 'All' ? 'All Types' : type}
                    {selectedType === type && <Check className="h-4 w-4 ml-auto" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Status dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-9 px-3 text-zinc-400 hover:text-white hover:bg-zinc-800">
                  {statusOptions.find(s => s.value === selectedStatus)?.label}
                  <ChevronDown className="h-4 w-4 ml-1.5 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-zinc-900 border-zinc-700">
                {statusOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => setSelectedStatus(option.value)}
                    className={cn(
                      "cursor-pointer",
                      selectedStatus === option.value && "text-green-500"
                    )}
                  >
                    {option.label}
                    {selectedStatus === option.value && <Check className="h-4 w-4 ml-auto" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Category dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-9 px-3 text-zinc-400 hover:text-white hover:bg-zinc-800">
                  {selectedCategory === 'All' ? 'Category' : selectedCategory}
                  <ChevronDown className="h-4 w-4 ml-1.5 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-zinc-900 border-zinc-700">
                {campaignCategories.map((category) => (
                  <DropdownMenuItem
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={cn(
                      "cursor-pointer",
                      selectedCategory === category && "text-green-500"
                    )}
                  >
                    {category === 'All' ? 'All Categories' : category}
                    {selectedCategory === category && <Check className="h-4 w-4 ml-auto" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Right side - Sort */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-9 px-3 text-zinc-400 hover:text-white hover:bg-zinc-800">
                {sortOptions.find(s => s.value === sortBy)?.label || 'Sort by'}
                <ChevronDown className="h-4 w-4 ml-1.5 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-700">
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                  className={cn(
                    "cursor-pointer",
                    sortBy === option.value && "text-green-500"
                  )}
                >
                  {option.label}
                  {sortBy === option.value && <Check className="h-4 w-4 ml-auto" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {filteredCampaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCampaigns.map((campaign) => (
              <CampaignCardNew key={campaign.id} campaign={campaign} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-800/50 mb-4">
              <Search className="h-10 w-10 text-zinc-600" />
            </div>
            <h3 className="text-xl font-semibold text-zinc-200 mb-2">No campaigns found</h3>
            <p className="text-zinc-500 max-w-sm">
              Try adjusting your filters or search query to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
