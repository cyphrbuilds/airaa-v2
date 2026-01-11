'use client'

import { useState, useMemo, useSyncExternalStore } from 'react'
import { Search, ChevronDown, Check, ArrowRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  UnifiedTabs,
  SocialTaskCard,
  BundleTaskCard,
  SocialCampaignCard,
  UnifiedCampaignCard,
  EarningsSummary,
  EmptyState,
  type UnifiedTab,
} from '@/components/campaigns'
import { 
  getActiveCampaigns,
  subscribeToCampaignStore,
  getCampaignStoreSnapshot,
  getCampaignStoreServerSnapshot,
  getTotalRewardsInCampaigns
} from '@/lib/campaign-store'
import { 
  getTotalRewardsDistributed, 
  formatRewardsShort,
  getSocialTasks,
  getBundleTasks,
  getUserEarnings,
  initializeSeedCampaigns,
} from '@/lib/mock-data'
import { SocialTask, BundleTask, UnifiedCampaign } from '@/types'
import { cn } from '@/lib/utils'

type SortOption = 'recommended' | 'highest' | 'ending'

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'highest', label: 'Highest Payout' },
  { value: 'ending', label: 'Ending Soon' },
]

export default function CampaignsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTab, setSelectedTab] = useState<UnifiedTab>('instant')
  const [sortBy, setSortBy] = useState<SortOption>('recommended')

  // Subscribe to campaign store changes
  useSyncExternalStore(
    subscribeToCampaignStore,
    getCampaignStoreSnapshot,
    getCampaignStoreServerSnapshot
  )

  // Initialize seed campaigns (happens once)
  if (typeof window !== 'undefined') {
    initializeSeedCampaigns()
  }

  // Get data from unified store and mock-data
  const totalGuildRewards = getTotalRewardsDistributed()
  const totalCampaignRewards = getTotalRewardsInCampaigns()
  const totalRewards = totalGuildRewards + totalCampaignRewards
  
  // Get all active campaigns from unified store
  const allUnifiedCampaigns = getActiveCampaigns()
  
  // Legacy data for instant tasks (social tasks and bundle tasks)
  const allTasks = getSocialTasks()
  const allBundleTasks = getBundleTasks()
  const userEarnings = getUserEarnings()

  // Local state for bundle task actions (simulating verification)
  const [bundleTaskState, setBundleTaskState] = useState<Record<string, BundleTask>>(() => {
    const state: Record<string, BundleTask> = {}
    allBundleTasks.forEach(t => { state[t.id] = { ...t } })
    return state
  })

  // Determine if we're showing instant tasks or campaigns
  const isInstantMode = selectedTab === 'instant'

  // Filter and sort social tasks (legacy instant tasks)
  const filteredTasks = useMemo(() => {
    let tasks = [...allTasks]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      tasks = tasks.filter(t => 
        t.brandName.toLowerCase().includes(query) ||
        t.target.toLowerCase().includes(query)
      )
    }

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
        // Mix of high payout and urgency
        available.sort((a, b) => {
          const scoreA = a.earnAmount * (1 / (new Date(a.endTime).getTime() - Date.now()))
          const scoreB = b.earnAmount * (1 / (new Date(b.endTime).getTime() - Date.now()))
          return scoreB - scoreA
        })
    }

    return { available, pending, completed }
  }, [allTasks, searchQuery, sortBy])

  // Filter and sort bundle tasks
  const filteredBundleTasks = useMemo(() => {
    let bundles = Object.values(bundleTaskState)

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      bundles = bundles.filter(t => 
        t.brandName.toLowerCase().includes(query)
      )
    }

    // Separate by status
    const available = bundles.filter(t => t.status === 'available')
    const completed = bundles.filter(t => t.status === 'completed' || t.status === 'rewarded')

    // Sort available bundles
    switch (sortBy) {
      case 'highest':
        available.sort((a, b) => b.earnAmount - a.earnAmount)
        break
      case 'ending':
        available.sort((a, b) => new Date(a.endTime).getTime() - new Date(b.endTime).getTime())
        break
      case 'recommended':
      default:
        // Mix of high payout and urgency
        available.sort((a, b) => {
          const scoreA = a.earnAmount * (1 / (new Date(a.endTime).getTime() - Date.now()))
          const scoreB = b.earnAmount * (1 / (new Date(b.endTime).getTime() - Date.now()))
          return scoreB - scoreA
        })
    }

    return { available, completed }
  }, [bundleTaskState, searchQuery, sortBy])

  // Filter and sort unified campaigns (from all guilds)
  const filteredCampaigns = useMemo(() => {
    let campaigns = [...allUnifiedCampaigns]

    // Filter by tab/app type
    // Map tab to app type
    const tabToAppType: Record<UnifiedTab, string> = {
      'instant': 'social-tasks',
      'infofi': 'infofi',
      'ugc': 'ugc',
      'clipping': 'clipping',
    }
    const appType = tabToAppType[selectedTab]
    if (appType) {
      campaigns = campaigns.filter(c => c.appType === appType)
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      campaigns = campaigns.filter(c => 
        c.name.toLowerCase().includes(query) ||
        c.guildName.toLowerCase().includes(query)
      )
    }

    // Sort
    switch (sortBy) {
      case 'highest':
        campaigns.sort((a, b) => b.rewardPool - a.rewardPool)
        break
      case 'ending':
        campaigns.sort((a, b) => {
          const aEnd = a.endDate?.getTime() || Infinity
          const bEnd = b.endDate?.getTime() || Infinity
          return aEnd - bEnd
        })
        break
      case 'recommended':
      default:
        // By reward pool descending
        campaigns.sort((a, b) => b.rewardPool - a.rewardPool)
    }

    return campaigns
  }, [allUnifiedCampaigns, selectedTab, searchQuery, sortBy])

  // Filter social-tasks campaigns for instant tab display
  const instantCampaigns = useMemo(() => {
    return allUnifiedCampaigns.filter(c => c.appType === 'social-tasks')
  }, [allUnifiedCampaigns])

  // Tab counts
  const tabCounts = useMemo(() => ({
    instant: filteredTasks.available.length + filteredBundleTasks.available.length + instantCampaigns.length,
    infofi: allUnifiedCampaigns.filter(c => c.appType === 'infofi').length,
    ugc: allUnifiedCampaigns.filter(c => c.appType === 'ugc').length,
    clipping: allUnifiedCampaigns.filter(c => c.appType === 'clipping').length,
  }), [filteredTasks.available.length, filteredBundleTasks.available.length, instantCampaigns.length, allUnifiedCampaigns])

  const handleTaskComplete = (taskId: string) => {
    // In a real app, this would call an API
    console.log('Completing task:', taskId)
  }

  // Handle verifying a sub-action within a bundle task
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

  // Handle claiming reward for completed bundle task
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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background gradient effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
          <div className="absolute top-20 right-1/4 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl" />
        </div>
        
        <div className="relative px-6 py-12 max-w-5xl mx-auto text-center">
          {/* Stats badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium text-green-400">
              {formatRewardsShort(totalRewards)} USD Distributed in Rewards
            </span>
          </div>
          
          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
            Campaigns
          </h1>
          
          {/* Subtitle */}
          <p className="text-zinc-400 text-base mb-8 max-w-xl mx-auto">
            Earn rewards through social tasks, content creation, and more from all communities.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-md mx-auto mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
            <Input
              type="text"
              placeholder="Search tasks or campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-11 bg-zinc-900/80 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus:border-green-500 focus:ring-green-500/20 rounded-xl"
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

      {/* Main Content */}
      <div className="px-6 py-6 max-w-5xl mx-auto space-y-6">
        {/* Earnings Summary */}
        <EarningsSummary earnings={userEarnings} />

        {/* Unified Tabs + Sort */}
        <div className="flex items-center justify-between gap-4">
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

        {/* Task/Campaign List */}
        <div className="space-y-3">
          {isInstantMode ? (
            // Instant Tasks (Social + Bundle + Social-Tasks Campaigns)
            <>
              {filteredTasks.available.length > 0 || filteredTasks.pending.length > 0 || filteredBundleTasks.available.length > 0 || instantCampaigns.length > 0 ? (
                <>
                  {/* Pending single tasks */}
                  {filteredTasks.pending.map((task) => (
                    <SocialTaskCard 
                      key={task.id} 
                      task={task}
                      onComplete={handleTaskComplete}
                    />
                  ))}

                  {/* Social-Tasks Campaigns from unified store (newly created) */}
                  {instantCampaigns.map((campaign) => (
                    <SocialCampaignCard
                      key={campaign.id}
                      campaign={campaign}
                    />
                  ))}

                  {/* Bundle tasks (shown first for higher rewards) */}
                  {filteredBundleTasks.available.map((task) => (
                    <BundleTaskCard 
                      key={task.id} 
                      task={task}
                      onVerifyAction={handleVerifyAction}
                      onClaimReward={handleClaimReward}
                    />
                  ))}

                  {/* Available single tasks */}
                  {filteredTasks.available.map((task) => (
                    <SocialTaskCard 
                      key={task.id} 
                      task={task}
                      onComplete={handleTaskComplete}
                    />
                  ))}

                  {/* Completed section */}
                  {(filteredTasks.completed.length > 0 || filteredBundleTasks.completed.length > 0) && (
                    <div className="pt-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="h-px flex-1 bg-zinc-800" />
                        <span className="text-xs text-zinc-500 uppercase tracking-wider">
                          Completed ({filteredTasks.completed.length + filteredBundleTasks.completed.length})
                        </span>
                        <div className="h-px flex-1 bg-zinc-800" />
                      </div>
                      {filteredBundleTasks.completed.map((task) => (
                        <BundleTaskCard 
                          key={task.id} 
                          task={task}
                        />
                      ))}
                      {filteredTasks.completed.map((task) => (
                        <SocialTaskCard 
                          key={task.id} 
                          task={task}
                        />
                      ))}
                    </div>
                  )}
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
            // Campaign Rewards (InfoFi, UGC, Clipping from unified store)
            <>
              {filteredCampaigns.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredCampaigns.map((campaign) => (
                    <UnifiedCampaignCard 
                      key={campaign.id} 
                      campaign={campaign}
                      showGuild={true}
                    />
                  ))}
                </div>
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
      </div>
    </div>
  )
}
