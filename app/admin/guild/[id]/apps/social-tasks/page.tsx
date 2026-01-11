'use client'

import { useSyncExternalStore } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Plus, Users, Trophy, TrendingUp, Megaphone, Trash2, MoreVertical } from 'lucide-react'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { AppContainer } from '@/components/app-container'
import { useGuild } from '@/lib/guild-context'
import { 
  getCampaignsByGuildAndApp,
  deleteCampaign,
  subscribeToCampaignStore,
  getCampaignStoreSnapshot,
  getCampaignStoreServerSnapshot,
} from '@/lib/campaign-store'
import { 
  UnifiedCampaign, 
  SocialCampaignTask,
  SocialDistributionMethod,
  SOCIAL_TASK_TYPE_LABELS,
  DISTRIBUTION_METHOD_LABELS 
} from '@/types'
import { formatCurrency } from '@/lib/utils'

const SOCIAL_TASKS_APP_INFO = {
  name: 'Social Tasks',
  icon: '📱',
  color: '#3b82f6',
  description: 'Create and manage social media campaigns'
}

export default function AdminSocialTasksPage() {
  const params = useParams()
  const guildId = params.id as string
  const { guild } = useGuild()
  
  // Subscribe to campaign store changes
  useSyncExternalStore(
    subscribeToCampaignStore,
    getCampaignStoreSnapshot,
    getCampaignStoreServerSnapshot
  )
  
  const campaigns = getCampaignsByGuildAndApp(guildId, 'social-tasks')
  const activeCampaigns = campaigns.filter(c => c.status === 'active')
  
  // Calculate analytics from campaigns
  const analytics = {
    totalCampaigns: campaigns.length,
    activeCampaigns: activeCampaigns.length,
    totalRewardsDistributed: campaigns
      .filter(c => c.status === 'completed')
      .reduce((sum, c) => sum + ((c.completedCount || 0) * c.perWinnerReward), 0),
    totalParticipants: campaigns.reduce((sum, c) => sum + (c.participantsCount || 0), 0)
  }

  // Handle delete campaign
  const handleDeleteCampaign = (campaignId: string, campaignName: string) => {
    if (window.confirm(`Are you sure you want to delete "${campaignName}"? This action cannot be undone.`)) {
      deleteCampaign(campaignId)
    }
  }

  // Campaign Card Component
  const CampaignCard = ({ campaign }: { campaign: UnifiedCampaign }) => {
    const isLive = campaign.status === 'active'
    const tasks = (campaign.config?.tasks as SocialCampaignTask[]) || []
    const distributionMethod = (campaign.config?.distributionMethod as SocialDistributionMethod) || 'fcfs'
    const taskSummary = tasks.map(t => SOCIAL_TASK_TYPE_LABELS[t.type]).join(' + ') || campaign.name
    const endDateStr = campaign.endDate ? format(campaign.endDate, 'd MMM yyyy') : 'Ongoing'

    return (
      <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/50 p-5 hover:border-zinc-700 transition-all">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-1">{campaign.name}</h3>
            <p className="text-sm text-zinc-500">{taskSummary}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline"
              className={`text-xs ${
                isLive 
                  ? 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10' 
                  : 'border-zinc-600 text-zinc-400'
              }`}
            >
              {isLive ? 'Live' : campaign.status}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-zinc-400 hover:text-white">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800">
                <DropdownMenuItem 
                  onClick={() => handleDeleteCampaign(campaign.id, campaign.name)}
                  className="text-red-400 focus:text-red-300 focus:bg-zinc-800 cursor-pointer"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete campaign
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-3">
          <div>
            <p className="text-xs text-zinc-500">Pool</p>
            <p className="text-lg font-bold text-emerald-400">${campaign.rewardPool.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500">Winners</p>
            <p className="text-lg font-bold text-white">{campaign.totalWinners}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500">Per Winner</p>
            <p className="text-lg font-bold text-white">${campaign.perWinnerReward}</p>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-zinc-500 mb-3">
          <span>{DISTRIBUTION_METHOD_LABELS[distributionMethod] || distributionMethod}</span>
          <span>Ends {endDateStr}</span>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-zinc-500 mb-1">
            <span>{campaign.completedCount || 0} completed</span>
            <span>{campaign.participantsCount || 0} participants</span>
          </div>
          <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${campaign.totalWinners > 0 ? ((campaign.completedCount || 0) / campaign.totalWinners) * 100 : 0}%` }}
            />
          </div>
        </div>

        <Link href={`/admin/guild/${guildId}/apps/social-tasks/${campaign.id}`}>
          <Button className="w-full" variant="outline">
            View Details
          </Button>
        </Link>
      </div>
    )
  }

  // Empty State
  const EmptyState = () => (
    <div className="rounded-xl border border-dashed border-zinc-700 bg-zinc-900/30 p-12 text-center">
      <div className="h-14 w-14 rounded-xl bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
        <Megaphone className="h-7 w-7 text-blue-400" />
      </div>
      <h3 className="text-lg font-semibold text-zinc-200 mb-2">Create Your First Campaign</h3>
      <p className="text-zinc-500 text-sm max-w-md mx-auto mb-6">
        Launch social task campaigns to engage your community with rewards.
      </p>
      <Link href={`/admin/guild/${guildId}/apps/social-tasks/create`}>
        <Button className="gap-2" style={{ backgroundColor: guild.accentColor }}>
          <Plus className="h-4 w-4" />
          Create Campaign
        </Button>
      </Link>
    </div>
  )

  return (
    <AppContainer
      appId="social-tasks"
      appName={SOCIAL_TASKS_APP_INFO.name}
      appIcon={SOCIAL_TASKS_APP_INFO.icon}
      appDescription={SOCIAL_TASKS_APP_INFO.description}
      appColor={SOCIAL_TASKS_APP_INFO.color}
      guildId={guildId}
      headerActions={
        campaigns.length > 0 ? (
          <Link href={`/admin/guild/${guildId}/apps/social-tasks/create`}>
            <Button size="sm" className="gap-2" style={{ backgroundColor: guild.accentColor }}>
              <Plus className="h-4 w-4" />
              Create Campaign
            </Button>
          </Link>
        ) : undefined
      }
    >
      {/* Analytics */}
      {campaigns.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="rounded-xl bg-zinc-900/50 border border-zinc-800/50 p-4">
            <div className="flex items-center gap-2 text-zinc-500 text-xs mb-1">
              <Megaphone className="h-3.5 w-3.5" />
              Total Campaigns
            </div>
            <div className="text-2xl font-bold text-white">{analytics.totalCampaigns}</div>
          </div>
          <div className="rounded-xl bg-zinc-900/50 border border-zinc-800/50 p-4">
            <div className="flex items-center gap-2 text-zinc-500 text-xs mb-1">
              <TrendingUp className="h-3.5 w-3.5" />
              Active
            </div>
            <div className="text-2xl font-bold text-emerald-400">{analytics.activeCampaigns}</div>
          </div>
          <div className="rounded-xl bg-zinc-900/50 border border-zinc-800/50 p-4">
            <div className="flex items-center gap-2 text-zinc-500 text-xs mb-1">
              <Trophy className="h-3.5 w-3.5" />
              Distributed
            </div>
            <div className="text-2xl font-bold text-white">{formatCurrency(analytics.totalRewardsDistributed)}</div>
          </div>
          <div className="rounded-xl bg-zinc-900/50 border border-zinc-800/50 p-4">
            <div className="flex items-center gap-2 text-zinc-500 text-xs mb-1">
              <Users className="h-3.5 w-3.5" />
              Participants
            </div>
            <div className="text-2xl font-bold text-white">{analytics.totalParticipants}</div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-white">Campaigns</h2>
        {campaigns.length > 0 && (
          <span className="text-sm text-zinc-500">
            {activeCampaigns.length} active of {campaigns.length} total
          </span>
        )}
      </div>

      {/* Campaigns Grid or Empty State */}
      {campaigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {campaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </AppContainer>
  )
}
