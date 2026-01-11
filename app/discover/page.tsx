'use client'

import { useState, useMemo, useRef, useEffect, useSyncExternalStore } from 'react'
import { Search, ChevronLeft, ChevronRight, ChevronDown, Check, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { FeaturedCommunityCard } from '@/components/cards/featured-community-card'
import { TopEarnersList } from '@/components/cards/top-earner-card'
import { SearchModal } from '@/components/search-modal'
import {
  UnifiedTabs,
  SocialTaskCard,
  BundleTaskCard,
  SocialCampaignCard,
  CampaignRewardCard,
  EmptyState,
  type UnifiedTab,
} from '@/components/campaigns'
import { 
  guilds, 
  leaderboardUsers,
  getActiveCampaigns,
  getSocialTasks,
  getBundleTasks,
} from '@/lib/mock-data'
import {
  getActiveCampaigns as getStoreCampaigns,
  subscribeToCampaignStore,
  getCampaignStoreSnapshot,
  getCampaignStoreServerSnapshot,
} from '@/lib/campaign-store'
import { BundleTask, UnifiedCampaign } from '@/types'
import { cn } from '@/lib/utils'
import Link from 'next/link'

type SortOption = 'recommended' | 'highest' | 'ending'

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'highest', label: 'Highest Payout' },
  { value: 'ending', label: 'Ending Soon' },
]

export default function DiscoverPage() {
  const [searchModalOpen, setSearchModalOpen] = useState(false)
  const [selectedTab, setSelectedTab] = useState<UnifiedTab>('instant')
  const [sortBy, setSortBy] = useState<SortOption>('recommended')
  const carouselRef = useRef<HTMLDivElement>(null)

  // Subscribe to campaign store for reactivity
  useSyncExternalStore(
    subscribeToCampaignStore,
    getCampaignStoreSnapshot,
    getCampaignStoreServerSnapshot
  )

  // Data from mock + store
  const allCampaigns = getActiveCampaigns()
  const allTasks = getSocialTasks()
  const allBundleTasks = getBundleTasks()
  
  // Get newly created social-tasks campaigns from unified store
  const storeCampaigns = getStoreCampaigns().filter(c => c.appType === 'social-tasks')

  // Local state for bundle task actions (simulating verification)
  const [bundleTaskState, setBundleTaskState] = useState<Record<string, BundleTask>>(() => {
    const state: Record<string, BundleTask> = {}
    allBundleTasks.forEach(t => { state[t.id] = { ...t } })
    return state
  })

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

  // Determine if we're showing instant tasks or campaigns
  const isInstantMode = selectedTab === 'instant'

  // Filter and sort social tasks
  const filteredTasks = useMemo(() => {
    let tasks = [...allTasks]

    // Separate by status
    const available = tasks.filter(t => t.status === 'available')
    const pending = tasks.filter(t => t.status === 'pending')
    const completed = tasks.filter(t => t.status === 'completed' || t.status === 'rewarded')

    // Sort available tasks
    switch (sortBy) {
      case 'highest':
        available.sort((a, b) => b.earnAmount - a.earnAmount)
        break
      case 'ending':
        available.sort((a, b) => new Date(a.endTime).getTime() - new Date(b.endTime).getTime())
        break
      case 'recommended':
      default:
        available.sort((a, b) => {
          const scoreA = a.earnAmount * (1 / (new Date(a.endTime).getTime() - Date.now()))
          const scoreB = b.earnAmount * (1 / (new Date(b.endTime).getTime() - Date.now()))
          return scoreB - scoreA
        })
    }

    return { available, pending, completed }
  }, [allTasks, sortBy])

  // Filter and sort bundle tasks
  const filteredBundleTasks = useMemo(() => {
    let bundles = Object.values(bundleTaskState)

    const available = bundles.filter(t => t.status === 'available')
    const completed = bundles.filter(t => t.status === 'completed' || t.status === 'rewarded')

    switch (sortBy) {
      case 'highest':
        available.sort((a, b) => b.earnAmount - a.earnAmount)
        break
      case 'ending':
        available.sort((a, b) => new Date(a.endTime).getTime() - new Date(b.endTime).getTime())
        break
      case 'recommended':
      default:
        available.sort((a, b) => {
          const scoreA = a.earnAmount * (1 / (new Date(a.endTime).getTime() - Date.now()))
          const scoreB = b.earnAmount * (1 / (new Date(b.endTime).getTime() - Date.now()))
          return scoreB - scoreA
        })
    }

    return { available, completed }
  }, [bundleTaskState, sortBy])

  // Filter and sort campaigns
  const filteredCampaigns = useMemo(() => {
    let campaigns = [...allCampaigns]

    if (selectedTab !== 'instant') {
      const typeMap: Record<string, string> = {
        'infofi': 'InfoFi',
        'ugc': 'UGC',
        'clipping': 'Clipping',
      }
      campaigns = campaigns.filter(c => c.type === typeMap[selectedTab])
    }

    switch (sortBy) {
      case 'highest':
        campaigns.sort((a, b) => b.totalReward - a.totalReward)
        break
      case 'ending':
        campaigns.sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())
        break
      case 'recommended':
      default:
        campaigns.sort((a, b) => {
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          return b.totalReward - a.totalReward
        })
    }

    return campaigns
  }, [allCampaigns, selectedTab, sortBy])

  // Tab counts (include store campaigns in instant count)
  const tabCounts = useMemo(() => ({
    instant: filteredTasks.available.length + filteredBundleTasks.available.length + storeCampaigns.length,
    infofi: allCampaigns.filter(c => c.type === 'InfoFi').length,
    ugc: allCampaigns.filter(c => c.type === 'UGC').length,
    clipping: allCampaigns.filter(c => c.type === 'Clipping').length,
  }), [filteredTasks.available.length, filteredBundleTasks.available.length, storeCampaigns.length, allCampaigns])

  const handleTaskComplete = (taskId: string) => {
    console.log('Completing task:', taskId)
  }

  const handleVerifyAction = (taskId: string, actionId: string) => {
    setBundleTaskState(prev => {
      const task = prev[taskId]
      if (!task) return prev
      
      const updatedActions = task.actions.map(a => 
        a.id === actionId ? { ...a, status: 'verified' as const } : a
      )
      
      return {
        ...prev,
        [taskId]: { ...task, actions: updatedActions }
      }
    })
  }

  const handleClaimReward = (taskId: string) => {
    setBundleTaskState(prev => {
      const task = prev[taskId]
      if (!task) return prev
      
      return {
        ...prev,
        [taskId]: { ...task, status: 'rewarded' as const }
      }
    })
  }

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

            {/* Active Campaigns Section */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-zinc-100">Active Campaigns</h2>
                <Link 
                  href="/campaigns"
                  className="flex items-center gap-1.5 text-sm font-medium text-green-500 hover:text-green-400 transition-colors"
                >
                  View All Campaigns
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Unified Tabs + Sort */}
              <div className="flex items-center justify-between gap-4 mb-4">
                <UnifiedTabs 
                  selected={selectedTab}
                  onChange={setSelectedTab}
                  counts={tabCounts}
                />

                {/* Sort dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-9 px-3 text-zinc-400 hover:text-white hover:bg-zinc-800">
                      {sortOptions.find(s => s.value === sortBy)?.label || 'Sort'}
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

              {/* Task/Campaign List (limited to first 10) */}
              <div className="space-y-3">
                {isInstantMode ? (
                  // Instant Tasks (Social + Bundle + Store Campaigns) - limited to 10
                  <>
                    {filteredTasks.available.length > 0 || filteredTasks.pending.length > 0 || filteredBundleTasks.available.length > 0 || storeCampaigns.length > 0 ? (
                      <>
                        {/* Combined tasks: store campaigns first, then pending, then bundles, then available - limited to 10 total */}
                        {(() => {
                          const allInstantTasks: Array<{ type: 'social' | 'bundle' | 'store'; task: any }> = [
                            ...storeCampaigns.map(c => ({ type: 'store' as const, task: c })),
                            ...filteredTasks.pending.map(t => ({ type: 'social' as const, task: t })),
                            ...filteredBundleTasks.available.map(t => ({ type: 'bundle' as const, task: t })),
                            ...filteredTasks.available.map(t => ({ type: 'social' as const, task: t })),
                          ]
                          return allInstantTasks.slice(0, 10).map((item) => 
                            item.type === 'store' ? (
                              <SocialCampaignCard
                                key={item.task.id}
                                campaign={item.task as UnifiedCampaign}
                              />
                            ) : item.type === 'bundle' ? (
                              <BundleTaskCard 
                                key={item.task.id} 
                                task={item.task}
                                onVerifyAction={handleVerifyAction}
                                onClaimReward={handleClaimReward}
                              />
                            ) : (
                              <SocialTaskCard 
                                key={item.task.id} 
                                task={item.task}
                                onComplete={handleTaskComplete}
                              />
                            )
                          )
                        })()}
                      </>
                    ) : (
                      <EmptyState 
                        type="no-tasks" 
                        rewardSpeed="instant"
                        onSwitchMode={() => setSelectedTab('infofi')}
                      />
                    )}
                  </>
                ) : (
                  // Campaign Rewards (limited to first 10)
                  <>
                    {filteredCampaigns.length > 0 ? (
                      filteredCampaigns.slice(0, 10).map((campaign) => (
                        <CampaignRewardCard 
                          key={campaign.id} 
                          campaign={campaign}
                          isEligible={Math.random() > 0.2}
                          ineligibleReason={Math.random() > 0.5 ? 'Connect wallet' : 'Requirements not met'}
                        />
                      ))
                    ) : (
                      <EmptyState 
                        type="no-campaigns" 
                        rewardSpeed="campaign"
                        onSwitchMode={() => setSelectedTab('instant')}
                      />
                    )}
                  </>
                )}
              </div>
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
