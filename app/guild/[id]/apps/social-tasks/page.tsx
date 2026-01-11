'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useSyncExternalStore } from 'react'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AppContainer } from '@/components/app-container'
import { useGuild } from '@/lib/guild-context'
import { 
  getActiveCampaignsByGuildAndApp,
  subscribeToCampaignStore,
  getCampaignStoreSnapshot,
  getCampaignStoreServerSnapshot
} from '@/lib/campaign-store'
import { 
  UnifiedCampaign,
  SocialCampaignTask,
  SocialDistributionMethod,
  SOCIAL_TASK_TYPE_LABELS,
  DISTRIBUTION_METHOD_LABELS 
} from '@/types'

// App metadata for Social Tasks
const SOCIAL_TASKS_APP_INFO = {
  name: 'Social Tasks',
  icon: '📱',
  color: '#3b82f6',
  description: 'Earn rewards for social media tasks'
}

export default function SocialTasksAppPage() {
  const params = useParams()
  const guildId = params.id as string
  const { guild } = useGuild()
  
  // Subscribe to campaign store changes
  useSyncExternalStore(
    subscribeToCampaignStore,
    getCampaignStoreSnapshot,
    getCampaignStoreServerSnapshot
  )
  
  // Get active campaigns for this guild and app type
  const activeCampaigns = getActiveCampaignsByGuildAndApp(guildId, 'social-tasks')

  // Campaign Card Component
  const CampaignCard = ({ campaign }: { campaign: UnifiedCampaign }) => {
    // Extract tasks from config
    const tasks = (campaign.config?.tasks as SocialCampaignTask[]) || []
    const distributionMethod = (campaign.config?.distributionMethod as SocialDistributionMethod) || 'fcfs'
    const taskSummary = tasks.map(t => SOCIAL_TASK_TYPE_LABELS[t.type]).join(' + ') || campaign.name
    const endDateStr = campaign.endDate ? format(campaign.endDate, 'd MMM') : 'Ongoing'

    return (
      <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/50 p-5 hover:border-zinc-700 transition-all">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-1">{campaign.name}</h3>
            <p className="text-sm text-zinc-500">{taskSummary}</p>
          </div>
          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs">
            Live
          </Badge>
        </div>

        {/* Reward highlight */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-2xl font-bold text-emerald-400">
            ${campaign.perWinnerReward}
          </span>
          <span className="text-sm text-zinc-500">per winner</span>
        </div>

        {/* Meta */}
        <div className="flex items-center justify-between text-sm text-zinc-500 mb-4">
          <span>{DISTRIBUTION_METHOD_LABELS[distributionMethod] || distributionMethod}</span>
          <span>Ends {endDateStr}</span>
        </div>

        {/* Action Button */}
        <Link href={`/guild/${guildId}/apps/social-tasks/${campaign.id}`}>
          <Button 
            className="w-full"
            style={{ backgroundColor: guild.accentColor }}
          >
            Participate
          </Button>
        </Link>
      </div>
    )
  }

  // Empty State
  const EmptyState = () => (
    <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-12 text-center">
      <div 
        className="h-14 w-14 rounded-xl flex items-center justify-center text-3xl mx-auto mb-4"
        style={{ backgroundColor: `${SOCIAL_TASKS_APP_INFO.color}15` }}
      >
        📱
      </div>
      <h3 className="text-lg font-semibold text-zinc-200 mb-2">No Campaigns Available</h3>
      <p className="text-zinc-500 text-sm max-w-sm mx-auto">
        There are no active social task campaigns right now. Check back later!
      </p>
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
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Available Campaigns</h2>
        {activeCampaigns.length > 0 && (
          <span className="text-sm text-zinc-500">
            {activeCampaigns.length} active
          </span>
        )}
      </div>

      {/* Campaigns Grid or Empty State */}
      {activeCampaigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {activeCampaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </AppContainer>
  )
}
