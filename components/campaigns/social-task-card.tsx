'use client'

import { useState } from 'react'
import { cn, truncateUrl } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { 
  SocialTask, 
  TASK_ACTION_LABELS, 
  PAYOUT_TYPE_SHORT, 
  PAYOUT_TYPE_COLORS 
} from '@/types'
import { 
  ChevronDown, 
  Clock, 
  CheckCircle2, 
  Loader2, 
  ExternalLink,
  UserPlus,
  Users,
  XCircle
} from 'lucide-react'
import { formatDistanceToNowStrict } from 'date-fns'

interface SocialTaskCardProps {
  task: SocialTask
  onComplete?: (taskId: string) => void
  isConnected?: boolean
  onConnect?: () => void
  className?: string
}

// Twitter/X icon
const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

// Reward amount with token icon
function RewardDisplay({ 
  amount, 
  tokenIcon, 
  tokenSymbol,
  variant = 'default' 
}: { 
  amount: number
  tokenIcon?: string
  tokenSymbol?: string
  variant?: 'default' | 'muted' | 'success'
}) {
  const colorClasses = {
    default: 'text-green-400',
    muted: 'text-zinc-400',
    success: 'text-green-500'
  }
  
  return (
    <div className="flex items-center gap-1.5">
      <span className={cn("text-lg font-bold", colorClasses[variant])}>
        ${amount}
      </span>
      {tokenIcon && (
        <img 
          src={tokenIcon} 
          alt={tokenSymbol || 'token'} 
          className="h-5 w-5 rounded-full"
        />
      )}
    </div>
  )
}

export function SocialTaskCard({ 
  task, 
  onComplete, 
  isConnected = true, 
  onConnect,
  className 
}: SocialTaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const isCompleted = task.status === 'completed' || task.status === 'rewarded'
  const isPending = task.status === 'pending'
  const isAvailable = task.status === 'available'
  const isEligible = task.isEligible !== false // Default to true if undefined

  const timeLeft = formatDistanceToNowStrict(task.endTime, { addSuffix: false })
  const payoutColors = PAYOUT_TYPE_COLORS[task.payoutType]
  
  const getActionText = () => {
    const action = TASK_ACTION_LABELS[task.action]
    if (task.action === 'follow') {
      // For follow actions, show truncated target (could be @username or URL)
      const displayTarget = task.target.startsWith('http') 
        ? truncateUrl(task.target) 
        : task.target
      return `${action} ${displayTarget}`
    }
    // For retweet, quote, reply - truncate the URL
    if (task.target && task.target.startsWith('http')) {
      return `${action} ${truncateUrl(task.target)}`
    }
    return `${action} post on X`
  }

  const handleComplete = async () => {
    if (!isAvailable || !onComplete || !isEligible) return
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    onComplete(task.id)
    setIsLoading(false)
  }

  const handleConnect = () => {
    if (onConnect) onConnect()
  }

  // Completed card (collapsed, dimmed)
  if (isCompleted) {
    return (
      <div className={cn(
        "flex items-center justify-between px-4 py-3 rounded-xl bg-zinc-900/30 border border-zinc-800/50",
        className
      )}>
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </div>
          <div>
            <p className="text-sm text-zinc-400 line-through">{getActionText()}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-green-500">Earned</span>
          <RewardDisplay 
            amount={task.earnAmount} 
            tokenIcon={task.rewardToken?.icon}
            tokenSymbol={task.rewardToken?.symbol}
            variant="success"
          />
        </div>
      </div>
    )
  }

  // Pending card
  if (isPending) {
    return (
      <div className={cn(
        "flex items-center justify-between px-4 py-3 rounded-xl bg-amber-500/5 border border-amber-500/20",
        className
      )}>
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <Loader2 className="h-4 w-4 text-amber-500 animate-spin" />
          </div>
          <div>
            <p className="text-sm text-zinc-300">{getActionText()}</p>
            <p className="text-xs text-amber-500">Verifying...</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <RewardDisplay 
            amount={task.earnAmount} 
            tokenIcon={task.rewardToken?.icon}
            tokenSymbol={task.rewardToken?.symbol}
            variant="muted"
          />
          <span className="text-sm text-zinc-400">pending</span>
        </div>
      </div>
    )
  }

  // Ineligible card (disabled state)
  if (!isEligible) {
    return (
      <div className={cn(
        "flex items-center justify-between px-4 py-3 rounded-xl bg-zinc-900/30 border border-zinc-800/50 opacity-60",
        className
      )}>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Brand icon - dimmed */}
          <img 
            src={task.brandIcon} 
            alt={task.brandName}
            className="h-8 w-8 rounded-lg object-cover flex-shrink-0 grayscale opacity-50"
          />
          
          {/* Task info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-zinc-400 truncate">
              {getActionText()}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <XCircle className="h-3 w-3 text-red-500" />
              <span className="text-xs text-red-400">
                {task.ineligibleReason || 'Requirements not met'}
              </span>
            </div>
          </div>
        </div>

        {/* Right side info */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Earn amount - muted */}
          <RewardDisplay 
            amount={task.earnAmount} 
            tokenIcon={task.rewardToken?.icon}
            tokenSymbol={task.rewardToken?.symbol}
            variant="muted"
          />

          {/* Disabled button */}
          <Button 
            size="sm" 
            variant="outline"
            disabled
            className="border-zinc-700 text-zinc-500 cursor-not-allowed"
          >
            Not eligible
          </Button>
        </div>
      </div>
    )
  }

  // Available card (collapsible)
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
          {/* Brand icon */}
          <img 
            src={task.brandIcon} 
            alt={task.brandName}
            className="h-8 w-8 rounded-lg object-cover flex-shrink-0"
          />
          
          {/* Task info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {getActionText()}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-zinc-500">{task.brandName}</span>
            </div>
          </div>
        </div>

        {/* Right side info */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Payout type badge */}
          <div className={cn(
            "px-2 py-0.5 rounded-md text-xs font-medium",
            payoutColors.bg,
            payoutColors.text
          )}>
            {PAYOUT_TYPE_SHORT[task.payoutType]}
          </div>

          {/* Slots remaining (for capped) */}
          {task.payoutType === 'capped' && task.slotsTotal && task.slotsFilled !== undefined && (
            <div className="flex items-center gap-1 text-xs text-zinc-400">
              <Users className="h-3 w-3" />
              <span>{task.slotsTotal - task.slotsFilled} left</span>
            </div>
          )}

          {/* Time left */}
          <div className="flex items-center gap-1 text-xs text-zinc-400">
            <Clock className="h-3 w-3" />
            <span>{timeLeft}</span>
          </div>

          {/* Earn amount - prominent with token icon */}
          <RewardDisplay 
            amount={task.earnAmount} 
            tokenIcon={task.rewardToken?.icon}
            tokenSymbol={task.rewardToken?.symbol}
          />

          {/* CTA or expand */}
          {!isExpanded ? (
            <Button 
              size="sm" 
              className="bg-green-600 hover:bg-green-500 text-white font-semibold px-4"
              onClick={(e) => {
                e.stopPropagation()
                if (task.requiresConnect && !isConnected) {
                  setIsExpanded(true)
                } else {
                  handleComplete()
                }
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Complete'
              )}
            </Button>
          ) : (
            <ChevronDown className={cn(
              "h-5 w-5 text-zinc-400 transition-transform",
              isExpanded && "rotate-180"
            )} />
          )}
        </div>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-1 border-t border-zinc-800/50">
          <div className="flex flex-col gap-4">
            {/* Connect X if required */}
            {task.requiresConnect && !isConnected && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50">
                <div className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4 text-zinc-400" />
                  <span className="text-sm text-zinc-300">Connect your X account to complete this task</span>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleConnect}
                  className="border-zinc-700 hover:bg-zinc-800"
                >
                  <XIcon className="h-4 w-4 mr-2" />
                  Connect X
                </Button>
              </div>
            )}

            {/* Task action */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                  <XIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{getActionText()}</p>
                  <p className="text-xs text-zinc-500">
                    {task.action === 'follow' ? `Go to ${task.target}` : 'Opens in new tab'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-zinc-700 hover:bg-zinc-800"
                  onClick={() => window.open(
                    task.action === 'follow' 
                      ? `https://x.com/${task.target.replace('@', '')}` 
                      : task.target, 
                    '_blank'
                  )}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open
                </Button>
                <Button 
                  size="sm" 
                  className="bg-green-600 hover:bg-green-500 text-white font-semibold gap-2"
                  onClick={handleComplete}
                  disabled={isLoading || (task.requiresConnect && !isConnected)}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : null}
                  Verify & Claim ${task.earnAmount}
                  {task.rewardToken?.icon && (
                    <img 
                      src={task.rewardToken.icon} 
                      alt={task.rewardToken.symbol} 
                      className="h-4 w-4 rounded-full"
                    />
                  )}
                </Button>
              </div>
            </div>

            {/* Auto-verification notice */}
            <p className="text-xs text-zinc-500">
              Task completion is verified automatically. Rewards are distributed{' '}
              {task.payoutType === 'fcfs' ? 'instantly' : task.payoutType === 'raffle' ? 'via raffle at end' : 'until slots fill'}.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
