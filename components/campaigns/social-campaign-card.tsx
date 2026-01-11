'use client'

import { useState } from 'react'
import { cn, truncateUrl } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { 
  UnifiedCampaign,
  SocialCampaignTask,
  SocialDistributionMethod,
  SOCIAL_TASK_TYPE_LABELS,
  DISTRIBUTION_METHOD_LABELS
} from '@/types'
import { 
  ChevronDown, 
  Clock, 
  CheckCircle2, 
  Loader2, 
  ExternalLink,
  Circle,
  Layers
} from 'lucide-react'
import { formatDistanceToNowStrict } from 'date-fns'

interface SocialCampaignCardProps {
  campaign: UnifiedCampaign
  onVerifyTask?: (campaignId: string, taskIndex: number) => void
  onClaimReward?: (campaignId: string) => void
  className?: string
}

// Twitter/X icon
const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

// Get task summary text (e.g., "Follow · Comment")
function getTasksSummary(tasks: SocialCampaignTask[]): string {
  return tasks.map(t => SOCIAL_TASK_TYPE_LABELS[t.type]).join(' · ')
}

// Get display text for a task
function getTaskDisplayText(task: SocialCampaignTask): string {
  const label = SOCIAL_TASK_TYPE_LABELS[task.type]
  if (task.type === 'follow' && task.targetAccount) {
    return `${label} @${task.targetAccount} on X`
  }
  if ((task.type === 'comment' || task.type === 'quote') && task.targetPostUrl) {
    return `${label} ${truncateUrl(task.targetPostUrl)}`
  }
  return `${label} on X`
}

// Get secondary text for a task
function getTaskSecondaryText(task: SocialCampaignTask): string {
  if (task.type === 'follow' && task.targetAccount) {
    return `Go to @${task.targetAccount}`
  }
  return 'Opens in new tab'
}

// Get link for a task
function getTaskLink(task: SocialCampaignTask): string | null {
  if (task.type === 'follow' && task.targetAccount) {
    return `https://x.com/${task.targetAccount.replace('@', '')}`
  }
  if ((task.type === 'comment' || task.type === 'quote') && task.targetPostUrl) {
    return task.targetPostUrl
  }
  return null
}

// Reward display component
function RewardDisplay({ 
  amount, 
  tokenIcon, 
  tokenSymbol,
  variant = 'default',
  size = 'default'
}: { 
  amount: number
  tokenIcon?: string
  tokenSymbol?: string
  variant?: 'default' | 'muted' | 'success'
  size?: 'default' | 'large'
}) {
  const colorClasses = {
    default: 'text-green-400',
    muted: 'text-zinc-400',
    success: 'text-green-500'
  }
  
  const sizeClasses = {
    default: 'text-lg',
    large: 'text-xl'
  }
  
  return (
    <div className="flex items-center gap-1.5">
      <span className={cn("font-bold", colorClasses[variant], sizeClasses[size])}>
        ${amount}
      </span>
      {tokenIcon && (
        <img 
          src={tokenIcon} 
          alt={tokenSymbol || 'token'} 
          className={cn("rounded-full", size === 'large' ? 'h-6 w-6' : 'h-5 w-5')}
        />
      )}
    </div>
  )
}

// Task row component
function TaskRow({ 
  task, 
  index,
  isVerified,
  onVerify, 
  isLoading,
}: { 
  task: SocialCampaignTask
  index: number
  isVerified: boolean
  onVerify: () => void
  isLoading: boolean
}) {
  const link = getTaskLink(task)
  
  return (
    <div className={cn(
      "flex items-center justify-between py-3 px-3 rounded-lg",
      isVerified ? "bg-green-500/5" : "bg-zinc-800/30"
    )}>
      <div className="flex items-center gap-3">
        {/* Status indicator */}
        {isVerified ? (
          <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
        ) : (
          <Circle className="h-5 w-5 text-zinc-500 flex-shrink-0" />
        )}
        
        {/* Task icon */}
        <div className={cn(
          "h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0",
          isVerified ? "bg-green-500/10" : "bg-zinc-800"
        )}>
          <XIcon className={cn("h-4 w-4", isVerified ? "text-green-400" : "text-white")} />
        </div>
        
        {/* Task text */}
        <div>
          <p className={cn(
            "text-sm font-medium",
            isVerified ? "text-zinc-400" : "text-white"
          )}>
            {getTaskDisplayText(task)}
          </p>
          <p className="text-xs text-zinc-500">
            {getTaskSecondaryText(task)}
          </p>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="flex items-center gap-2">
        {!isVerified && link && (
          <Button 
            variant="outline" 
            size="sm"
            className="border-zinc-700 hover:bg-zinc-800"
            onClick={() => window.open(link, '_blank')}
          >
            <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
            Open
          </Button>
        )}
        
        {isVerified ? (
          <span className="text-sm font-medium text-green-500 px-3 py-1.5">
            Verified
          </span>
        ) : (
          <Button 
            size="sm" 
            variant="outline"
            className="border-green-600/50 text-green-400 hover:bg-green-600/10 hover:text-green-300"
            onClick={onVerify}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Verify'
            )}
          </Button>
        )}
      </div>
    </div>
  )
}

export function SocialCampaignCard({ 
  campaign, 
  onVerifyTask, 
  onClaimReward,
  className 
}: SocialCampaignCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [loadingTaskIndex, setLoadingTaskIndex] = useState<number | null>(null)
  const [isClaimLoading, setIsClaimLoading] = useState(false)
  const [verifiedTasks, setVerifiedTasks] = useState<Set<number>>(new Set())

  // Extract data from campaign config
  const tasks = (campaign.config?.tasks as SocialCampaignTask[]) || []
  const distributionMethod = (campaign.config?.distributionMethod as SocialDistributionMethod) || 'fcfs'
  
  const totalTasks = tasks.length
  const verifiedCount = verifiedTasks.size
  const allVerified = verifiedCount === totalTasks && totalTasks > 0
  
  const timeLeft = campaign.endDate 
    ? formatDistanceToNowStrict(campaign.endDate, { addSuffix: false })
    : 'Ongoing'

  // Distribution method colors
  const getDistributionColors = () => {
    switch (distributionMethod) {
      case 'fcfs':
        return { bg: 'bg-green-500/10', text: 'text-green-400' }
      case 'raffle':
        return { bg: 'bg-purple-500/10', text: 'text-purple-400' }
      case 'customized':
        return { bg: 'bg-blue-500/10', text: 'text-blue-400' }
      default:
        return { bg: 'bg-zinc-500/10', text: 'text-zinc-400' }
    }
  }
  
  const distributionColors = getDistributionColors()

  const handleVerifyTask = async (taskIndex: number) => {
    setLoadingTaskIndex(taskIndex)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setVerifiedTasks(prev => new Set([...prev, taskIndex]))
    if (onVerifyTask) {
      onVerifyTask(campaign.id, taskIndex)
    }
    setLoadingTaskIndex(null)
  }

  const handleClaimReward = async () => {
    if (!allVerified) return
    setIsClaimLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    if (onClaimReward) {
      onClaimReward(campaign.id)
    }
    setIsClaimLoading(false)
  }

  // If no tasks, show simple card
  if (totalTasks === 0) {
    return (
      <div className={cn(
        "flex items-center justify-between px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-800",
        className
      )}>
        <div className="flex items-center gap-3">
          <img 
            src={campaign.guildIcon} 
            alt={campaign.guildName}
            className="h-8 w-8 rounded-lg object-cover"
          />
          <div>
            <p className="text-sm font-medium text-white">{campaign.name}</p>
            <p className="text-xs text-zinc-500">{campaign.guildName}</p>
          </div>
        </div>
        <RewardDisplay 
          amount={campaign.perWinnerReward} 
        />
      </div>
    )
  }

  // Main collapsible card
  return (
    <div className={cn(
      "rounded-xl border transition-all duration-200",
      isExpanded 
        ? "bg-zinc-900/80 border-zinc-700" 
        : "bg-zinc-900/50 border-zinc-800 hover:border-zinc-700",
      className
    )}>
      {/* Collapsed row */}
      <div 
        className="flex items-center justify-between px-4 py-3 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Guild icon with bundle indicator */}
          <div className="relative">
            <img 
              src={campaign.guildIcon} 
              alt={campaign.guildName}
              className="h-8 w-8 rounded-lg object-cover"
            />
            <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-blue-600 flex items-center justify-center">
              <Layers className="h-2.5 w-2.5 text-white" />
            </div>
          </div>
          
          {/* Campaign info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              Complete {totalTasks} actions for {campaign.guildName}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              {isExpanded ? (
                <span className="text-xs text-zinc-400">
                  {verifiedCount} of {totalTasks} completed
                </span>
              ) : (
                <span className="text-xs text-zinc-500">
                  {getTasksSummary(tasks)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right side info */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Distribution method badge */}
          <div className={cn(
            "px-2 py-0.5 rounded-md text-xs font-medium",
            distributionColors.bg,
            distributionColors.text
          )}>
            {DISTRIBUTION_METHOD_LABELS[distributionMethod] || distributionMethod}
          </div>

          {/* Time left */}
          <div className="flex items-center gap-1 text-xs text-zinc-400">
            <Clock className="h-3 w-3" />
            <span>{timeLeft}</span>
          </div>

          {/* Earn amount */}
          <RewardDisplay 
            amount={campaign.perWinnerReward} 
          />

          {/* Expand indicator */}
          <ChevronDown className={cn(
            "h-5 w-5 text-zinc-400 transition-transform",
            isExpanded && "rotate-180"
          )} />
        </div>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-1 border-t border-zinc-800/50">
          <div className="flex flex-col gap-2 mt-3">
            {/* Task list */}
            {tasks.map((task, index) => (
              <TaskRow
                key={index}
                task={task}
                index={index}
                isVerified={verifiedTasks.has(index)}
                onVerify={() => handleVerifyTask(index)}
                isLoading={loadingTaskIndex === index}
              />
            ))}

            {/* Progress bar */}
            <div className="mt-3 mb-2">
              <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-300"
                  style={{ width: `${(verifiedCount / totalTasks) * 100}%` }}
                />
              </div>
            </div>

            {/* Claim button */}
            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-zinc-500">
                Complete all {totalTasks} actions to claim your reward
              </p>
              <Button 
                size="sm" 
                className={cn(
                  "font-semibold gap-2 transition-all",
                  allVerified 
                    ? "bg-green-600 hover:bg-green-500 text-white" 
                    : "bg-zinc-700 text-zinc-400 cursor-not-allowed"
                )}
                onClick={handleClaimReward}
                disabled={!allVerified || isClaimLoading}
              >
                {isClaimLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : null}
                Claim ${campaign.perWinnerReward}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
