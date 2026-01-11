'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  UnifiedCampaign, 
  UNIFIED_APP_TYPE_INFO,
  SocialCampaignTask,
  SOCIAL_TASK_TYPE_LABELS
} from '@/types'
import { Clock, Users, ArrowRight, Coins } from 'lucide-react'
import { formatDistanceToNowStrict, format } from 'date-fns'

interface UnifiedCampaignCardProps {
  campaign: UnifiedCampaign
  /** Show guild badge (useful on global campaigns page) */
  showGuild?: boolean
  /** Compact mode for list views */
  compact?: boolean
  className?: string
}

export function UnifiedCampaignCard({ 
  campaign, 
  showGuild = true,
  compact = false,
  className 
}: UnifiedCampaignCardProps) {
  const appInfo = UNIFIED_APP_TYPE_INFO[campaign.appType] || {
    name: campaign.appName,
    icon: '📦',
    color: '#6b7280'
  }
  
  const timeLeft = campaign.endDate 
    ? formatDistanceToNowStrict(campaign.endDate, { addSuffix: false })
    : 'Ongoing'
  
  const endDateStr = campaign.endDate 
    ? format(campaign.endDate, 'd MMM')
    : 'Ongoing'

  // Get task summary for social tasks campaigns
  const getTaskSummary = () => {
    if (campaign.appType !== 'social-tasks') return null
    const tasks = (campaign.config?.tasks as SocialCampaignTask[]) || []
    if (tasks.length === 0) return null
    return tasks.map(t => SOCIAL_TASK_TYPE_LABELS[t.type]).join(' + ')
  }

  // Generate href based on campaign type
  const getHref = () => {
    if (campaign.appType === 'social-tasks') {
      return `/guild/${campaign.guildId}/apps/social-tasks/${campaign.id}`
    }
    if (campaign.appType === 'infofi') {
      return `/guild/${campaign.guildId}/apps/infofi/${campaign.id}`
    }
    // Fallback for other app types
    return `/guild/${campaign.guildId}/apps/${campaign.appType}/${campaign.id}`
  }

  const taskSummary = getTaskSummary()

  if (compact) {
    // Compact list item style
    return (
      <Link href={getHref()}>
        <div className={cn(
          "flex items-center justify-between px-4 py-4 rounded-xl border transition-all duration-200",
          "bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/50 cursor-pointer",
          className
        )}>
          {/* Left side - Campaign info */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {/* Guild icon */}
            {showGuild && (
              <img 
                src={campaign.guildIcon} 
                alt={campaign.guildName}
                className="h-10 w-10 rounded-lg object-cover flex-shrink-0"
              />
            )}
            
            {/* Campaign details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {/* App type indicator */}
                <span 
                  className="h-2 w-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: appInfo.color }}
                />
                <p className="text-sm font-medium text-white truncate">
                  {campaign.name}
                </p>
              </div>
              
              {/* Secondary info */}
              <div className="flex items-center gap-4 flex-wrap">
                {showGuild && (
                  <span className="text-xs text-zinc-500">{campaign.guildName}</span>
                )}
                <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{timeLeft} left</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <Users className="h-3.5 w-3.5" />
                  <span>{campaign.participantsCount} joined</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Reward & CTA */}
          <div className="flex items-center gap-4 flex-shrink-0">
            {/* Reward display */}
            <div className="text-right">
              <p className="text-lg font-bold text-green-400">
                ${campaign.perWinnerReward}
              </p>
              <p className="text-xs text-zinc-500">per winner</p>
            </div>
            
            {/* CTA Button */}
            <Button 
              size="sm" 
              className="bg-green-600 hover:bg-green-500 text-white font-semibold px-4 gap-2"
            >
              Participate
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Link>
    )
  }

  // Card style (default)
  return (
    <Link href={getHref()}>
      <div className={cn(
        "rounded-xl border border-zinc-800/50 bg-zinc-900/50 p-5 hover:border-zinc-700 transition-all h-full",
        className
      )}>
        {/* Header with guild and app type */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            {showGuild && (
              <div className="flex items-center gap-2 mb-2">
                <img 
                  src={campaign.guildIcon} 
                  alt={campaign.guildName}
                  className="h-6 w-6 rounded-md object-cover"
                />
                <span className="text-xs text-zinc-400">{campaign.guildName}</span>
              </div>
            )}
            <h3 className="text-lg font-semibold text-white mb-1 truncate">{campaign.name}</h3>
            {taskSummary && (
              <p className="text-sm text-zinc-500">{taskSummary}</p>
            )}
            {campaign.description && !taskSummary && (
              <p className="text-sm text-zinc-500 line-clamp-2">{campaign.description}</p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs">
              Live
            </Badge>
            <Badge 
              className="text-xs border"
              style={{ 
                backgroundColor: `${appInfo.color}15`,
                borderColor: `${appInfo.color}30`,
                color: appInfo.color 
              }}
            >
              {appInfo.icon} {appInfo.name}
            </Badge>
          </div>
        </div>

        {/* Reward highlight */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-2xl font-bold text-emerald-400">
            ${campaign.perWinnerReward}
          </span>
          <span className="text-sm text-zinc-500">per winner</span>
          <span className="text-xs text-zinc-600 ml-auto">
            {campaign.token}
          </span>
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-between text-sm text-zinc-500 mb-4">
          <div className="flex items-center gap-1">
            <Coins className="h-4 w-4" />
            <span>${campaign.rewardPool.toLocaleString()} pool</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{campaign.totalWinners} winners</span>
          </div>
        </div>

        {/* Meta row */}
        <div className="flex items-center justify-between text-sm text-zinc-500 mb-4">
          <span>{campaign.participantsCount} participants</span>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>Ends {endDateStr}</span>
          </div>
        </div>

        {/* Action Button */}
        <Button 
          className="w-full bg-green-600 hover:bg-green-500 text-white"
        >
          Participate
        </Button>
      </div>
    </Link>
  )
}
