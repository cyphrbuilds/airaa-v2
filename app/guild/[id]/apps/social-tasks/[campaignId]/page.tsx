'use client'

import { useState, useSyncExternalStore } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { 
  ArrowLeft, 
  Check, 
  Clock, 
  Users, 
  Trophy, 
  ExternalLink,
  Loader2,
  AlertCircle,
  Twitter
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useGuild } from '@/lib/guild-context'
import { isUserAdminOrMod } from '@/lib/mock-data'
import { 
  getCampaign,
  subscribeToCampaignStore,
  getCampaignStoreSnapshot,
  getCampaignStoreServerSnapshot,
} from '@/lib/campaign-store'
import {
  SOCIAL_TASK_TYPE_LABELS,
  SOCIAL_TASK_TYPE_ICONS,
  DISTRIBUTION_METHOD_LABELS,
  SocialCampaignTask,
  SocialDistributionMethod
} from '@/types'

export default function SocialCampaignDetailPage() {
  const params = useParams()
  const guildId = params.id as string
  const campaignId = params.campaignId as string
  const { guild } = useGuild()
  const isAdminOrMod = isUserAdminOrMod(guildId)
  
  // Subscribe to campaign store changes
  useSyncExternalStore(
    subscribeToCampaignStore,
    getCampaignStoreSnapshot,
    getCampaignStoreServerSnapshot
  )
  
  const campaign = getCampaign(campaignId)
  
  // Track task completion status (mock)
  const [taskStates, setTaskStates] = useState<Record<number, 'idle' | 'verifying' | 'completed'>>({})
  const [isTwitterConnected, setIsTwitterConnected] = useState(false)

  if (!campaign) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Campaign Not Found</h1>
          <p className="text-zinc-400 mb-4">This campaign doesn't exist or has been removed.</p>
          <Link href={`/guild/${guildId}/apps/social-tasks`}>
            <Button>Go Back</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Extract social campaign specific data from config
  const tasks = (campaign.config?.tasks as SocialCampaignTask[]) || []
  const distributionMethod = (campaign.config?.distributionMethod as SocialDistributionMethod) || 'fcfs'
  const rewardsClaimedCount = (campaign.config?.rewardsClaimedCount as number) || 0

  const isLive = campaign.status === 'active'
  const endDateStr = campaign.endDate ? format(campaign.endDate, 'd MMM yyyy, h:mm a') : 'Ongoing'
  const progress = campaign.totalWinners > 0 
    ? ((campaign.completedCount || 0) / campaign.totalWinners) * 100 
    : 0
  const allTasksCompleted = Object.values(taskStates).filter(s => s === 'completed').length === tasks.length
  const completedTasks = Object.values(taskStates).filter(s => s === 'completed').length

  const handleConnectTwitter = async () => {
    // Simulate Twitter connection
    await new Promise(resolve => setTimeout(resolve, 800))
    setIsTwitterConnected(true)
  }

  const handleVerifyTask = async (index: number) => {
    setTaskStates(prev => ({ ...prev, [index]: 'verifying' }))
    // Simulate verification
    await new Promise(resolve => setTimeout(resolve, 1500))
    setTaskStates(prev => ({ ...prev, [index]: 'completed' }))
  }

  const TaskCard = ({ task, index }: { task: SocialCampaignTask; index: number }) => {
    const state = taskStates[index] || 'idle'
    const isCompleted = state === 'completed'
    const isVerifying = state === 'verifying'

    return (
      <div className={`rounded-xl border ${
        isCompleted 
          ? 'border-emerald-500/50 bg-emerald-500/5' 
          : 'border-zinc-800 bg-zinc-900/30'
      } p-5`}>
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-2xl ${
            isCompleted ? 'bg-emerald-500/20' : 'bg-zinc-800'
          }`}>
            {isCompleted ? (
              <Check className="h-6 w-6 text-emerald-400" />
            ) : (
              SOCIAL_TASK_TYPE_ICONS[task.type]
            )}
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-white">
                {SOCIAL_TASK_TYPE_LABELS[task.type]}
              </h4>
              {isCompleted && (
                <Badge className="bg-emerald-500/20 text-emerald-400 text-xs">Completed</Badge>
              )}
            </div>
            
            {/* Task Target */}
            <p className="text-sm text-zinc-400 mb-3">
              {task.type === 'follow' && (
                <>Follow <span className="text-blue-400">@{task.targetAccount}</span></>
              )}
              {(task.type === 'comment' || task.type === 'quote') && (
                <a 
                  href={task.targetPostUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline flex items-center gap-1"
                >
                  View target post <ExternalLink className="h-3 w-3" />
                </a>
              )}
              {task.type === 'post' && 'Create an original post'}
            </p>

            {/* Guidelines */}
            {task.guidelines && (
              <div className="mb-3 p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
                <p className="text-xs font-medium text-zinc-400 mb-1">Guidelines:</p>
                <p className="text-sm text-zinc-300 whitespace-pre-line">{task.guidelines}</p>
              </div>
            )}

            {/* Action Button */}
            {!isCompleted && isTwitterConnected && (
              <div className="flex gap-2">
                {task.type === 'follow' && (
                  <a 
                    href={`https://twitter.com/${task.targetAccount}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm" className="gap-2">
                      <Twitter className="h-4 w-4" />
                      Follow @{task.targetAccount}
                    </Button>
                  </a>
                )}
                {(task.type === 'comment' || task.type === 'quote') && (
                  <a 
                    href={task.targetPostUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm" className="gap-2">
                      <ExternalLink className="h-4 w-4" />
                      Open Post
                    </Button>
                  </a>
                )}
                <Button
                  size="sm"
                  onClick={() => handleVerifyTask(index)}
                  disabled={isVerifying}
                  style={{ backgroundColor: guild.accentColor }}
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Verifying...
                    </>
                  ) : (
                    'Verify Completion'
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-zinc-800/50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link href={`/guild/${guildId}/apps/social-tasks`}>
            <Button variant="ghost" size="sm" className="gap-2 text-zinc-400 hover:text-zinc-100">
              <ArrowLeft className="h-4 w-4" />
              Back to Social Tasks
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Campaign Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-white">{campaign.name}</h1>
                <Badge 
                  className={`${
                    isLive 
                      ? 'bg-emerald-500/20 text-emerald-400' 
                      : 'bg-zinc-700 text-zinc-400'
                  }`}
                >
                  {isLive ? 'Live' : campaign.status}
                </Badge>
              </div>
              <p className="text-zinc-400">
                {tasks.map(t => SOCIAL_TASK_TYPE_LABELS[t.type]).join(' + ') || campaign.name}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-xl bg-zinc-900/50 border border-zinc-800/50 p-4">
              <div className="flex items-center gap-2 text-zinc-500 text-sm mb-1">
                <Trophy className="h-4 w-4" />
                Reward
              </div>
              <div className="text-2xl font-bold text-emerald-400">
                ${campaign.perWinnerReward}
              </div>
              <div className="text-xs text-zinc-500">per winner</div>
            </div>
            <div className="rounded-xl bg-zinc-900/50 border border-zinc-800/50 p-4">
              <div className="flex items-center gap-2 text-zinc-500 text-sm mb-1">
                <Users className="h-4 w-4" />
                Winners
              </div>
              <div className="text-2xl font-bold text-white">
                {campaign.completedCount || 0}/{campaign.totalWinners}
              </div>
              <div className="text-xs text-zinc-500">spots filled</div>
            </div>
            <div className="rounded-xl bg-zinc-900/50 border border-zinc-800/50 p-4">
              <div className="flex items-center gap-2 text-zinc-500 text-sm mb-1">
                <Clock className="h-4 w-4" />
                Method
              </div>
              <div className="text-lg font-semibold text-white">
                {DISTRIBUTION_METHOD_LABELS[distributionMethod] || distributionMethod}
              </div>
            </div>
            <div className="rounded-xl bg-zinc-900/50 border border-zinc-800/50 p-4">
              <div className="flex items-center gap-2 text-zinc-500 text-sm mb-1">
                <Clock className="h-4 w-4" />
                Ends
              </div>
              <div className="text-lg font-semibold text-white">
                {endDateStr}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          {distributionMethod === 'fcfs' && (
            <div className="mt-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-zinc-400">Campaign Progress</span>
                <span className="text-zinc-300">
                  {campaign.completedCount || 0} of {campaign.totalWinners} spots filled
                </span>
              </div>
              <Progress value={progress} className="h-2" />
              {progress >= 90 && (
                <p className="mt-2 text-xs text-amber-400 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Almost full! Complete tasks quickly to secure your spot.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Admin Stats */}
        {isAdminOrMod && (
          <div className="mb-8 p-5 rounded-xl bg-blue-500/10 border border-blue-500/30">
            <h3 className="font-semibold text-blue-400 mb-3">Admin Stats</h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-zinc-400">Participants</p>
                <p className="text-xl font-bold text-white">{campaign.participantsCount || 0}</p>
              </div>
              <div>
                <p className="text-zinc-400">Completed</p>
                <p className="text-xl font-bold text-white">{campaign.completedCount || 0}</p>
              </div>
              <div>
                <p className="text-zinc-400">Rewards Claimed</p>
                <p className="text-xl font-bold text-white">{rewardsClaimedCount}</p>
              </div>
            </div>
          </div>
        )}

        {/* Twitter Connection (for non-admins) */}
        {!isAdminOrMod && !isTwitterConnected && (
          <div className="mb-8 p-6 rounded-xl bg-zinc-900/50 border border-zinc-800/50 text-center">
            <div className="h-14 w-14 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
              <Twitter className="h-7 w-7 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Connect Twitter to Participate</h3>
            <p className="text-zinc-400 text-sm mb-4">
              Connect your Twitter account to verify task completion and earn rewards.
            </p>
            <Button 
              onClick={handleConnectTwitter}
              className="gap-2"
              style={{ backgroundColor: guild.accentColor }}
            >
              <Twitter className="h-4 w-4" />
              Connect Twitter
            </Button>
          </div>
        )}

        {/* Tasks */}
        {(!isAdminOrMod || isTwitterConnected) && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Required Tasks</h2>
              {isTwitterConnected && (
                <span className="text-sm text-zinc-400">
                  {completedTasks}/{tasks.length} completed
                </span>
              )}
            </div>

            <div className="space-y-4 mb-8">
              {tasks.map((task, index) => (
                <TaskCard key={index} task={task} index={index} />
              ))}
            </div>

            {/* Claim Reward */}
            {isTwitterConnected && allTasksCompleted && (
              <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                <div className="h-14 w-14 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-7 w-7 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-emerald-400 mb-2">All Tasks Completed!</h3>
                <p className="text-zinc-400 text-sm mb-4">
                  {distributionMethod === 'fcfs' 
                    ? "Your reward will be sent to your wallet shortly."
                    : distributionMethod === 'raffle'
                      ? "You're entered in the raffle! Winners will be selected after the campaign ends."
                      : "Your reward is being processed."
                  }
                </p>
                <div className="text-3xl font-bold text-emerald-400">
                  ${campaign.perWinnerReward} {campaign.token}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
