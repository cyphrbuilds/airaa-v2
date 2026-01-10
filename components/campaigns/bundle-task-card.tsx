'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { 
  BundleTask, 
  SubAction,
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
  Circle,
  XCircle,
  Layers
} from 'lucide-react'
import { formatDistanceToNowStrict } from 'date-fns'

interface BundleTaskCardProps {
  task: BundleTask
  onVerifyAction?: (taskId: string, actionId: string) => void
  onClaimReward?: (taskId: string) => void
  className?: string
}

// Twitter/X icon
const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

// Get action summary text (e.g., "Follow · Quote · Reply")
function getActionsSummary(actions: SubAction[]): string {
  return actions.map(a => TASK_ACTION_LABELS[a.action]).join(' · ')
}

// Get target display text for an action
function getActionTargetText(action: SubAction): string {
  const label = TASK_ACTION_LABELS[action.action]
  if (action.action === 'follow') {
    return `${label} ${action.target} on X`
  }
  return `${label} post on X`
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

// Sub-action row component
function SubActionRow({ 
  action, 
  onVerify, 
  isLoading,
  disabled
}: { 
  action: SubAction
  onVerify: () => void
  isLoading: boolean
  disabled: boolean
}) {
  const isVerified = action.status === 'verified'
  
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
        
        {/* Action icon */}
        <div className={cn(
          "h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0",
          isVerified ? "bg-green-500/10" : "bg-zinc-800"
        )}>
          <XIcon className={cn("h-4 w-4", isVerified ? "text-green-400" : "text-white")} />
        </div>
        
        {/* Action text */}
        <div>
          <p className={cn(
            "text-sm font-medium",
            isVerified ? "text-zinc-400" : "text-white"
          )}>
            {getActionTargetText(action)}
          </p>
          <p className="text-xs text-zinc-500">
            {action.action === 'follow' ? `Go to ${action.target}` : 'Opens in new tab'}
          </p>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="flex items-center gap-2">
        {!isVerified && (
          <Button 
            variant="outline" 
            size="sm"
            className="border-zinc-700 hover:bg-zinc-800"
            onClick={() => window.open(
              action.action === 'follow' 
                ? `https://x.com/${action.target.replace('@', '')}` 
                : action.target, 
              '_blank'
            )}
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
            disabled={isLoading || disabled}
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

export function BundleTaskCard({ 
  task, 
  onVerifyAction, 
  onClaimReward,
  className 
}: BundleTaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [loadingActionId, setLoadingActionId] = useState<string | null>(null)
  const [isClaimLoading, setIsClaimLoading] = useState(false)

  const isCompleted = task.status === 'completed' || task.status === 'rewarded'
  const isEligible = task.isEligible !== false
  
  const verifiedCount = task.actions.filter(a => a.status === 'verified').length
  const totalActions = task.actions.length
  const allVerified = verifiedCount === totalActions
  
  const timeLeft = formatDistanceToNowStrict(task.endTime, { addSuffix: false })
  const payoutColors = PAYOUT_TYPE_COLORS[task.payoutType]

  const handleVerifyAction = async (actionId: string) => {
    if (!onVerifyAction || !isEligible) return
    setLoadingActionId(actionId)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    onVerifyAction(task.id, actionId)
    setLoadingActionId(null)
  }

  const handleClaimReward = async () => {
    if (!onClaimReward || !allVerified) return
    setIsClaimLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    onClaimReward(task.id)
    setIsClaimLoading(false)
  }

  // Completed card (collapsed, success state)
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
            <p className="text-sm text-zinc-400 line-through">
              Complete {totalActions} actions for {task.brandName}
            </p>
            <p className="text-xs text-zinc-500">{getActionsSummary(task.actions)}</p>
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

  // Ineligible card (disabled state)
  if (!isEligible) {
    return (
      <div className={cn(
        "flex items-center justify-between px-4 py-3 rounded-xl bg-zinc-900/30 border border-zinc-800/50 opacity-60",
        className
      )}>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <img 
            src={task.brandIcon} 
            alt={task.brandName}
            className="h-8 w-8 rounded-lg object-cover flex-shrink-0 grayscale opacity-50"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-zinc-400 truncate">
              Complete {totalActions} actions for {task.brandName}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <XCircle className="h-3 w-3 text-red-500" />
              <span className="text-xs text-red-400">
                {task.ineligibleReason || 'Requirements not met'}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <RewardDisplay 
            amount={task.earnAmount} 
            tokenIcon={task.rewardToken?.icon}
            tokenSymbol={task.rewardToken?.symbol}
            variant="muted"
          />
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

  // Available card (collapsible with sub-actions)
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
          {/* Brand icon with bundle indicator */}
          <div className="relative">
            <img 
              src={task.brandIcon} 
              alt={task.brandName}
              className="h-8 w-8 rounded-lg object-cover"
            />
            <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-blue-600 flex items-center justify-center">
              <Layers className="h-2.5 w-2.5 text-white" />
            </div>
          </div>
          
          {/* Task info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              Complete {totalActions} actions for {task.brandName}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              {isExpanded ? (
                <span className="text-xs text-zinc-400">
                  {verifiedCount} of {totalActions} completed
                </span>
              ) : (
                <span className="text-xs text-zinc-500">
                  {getActionsSummary(task.actions)}
                </span>
              )}
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

          {/* Time left */}
          <div className="flex items-center gap-1 text-xs text-zinc-400">
            <Clock className="h-3 w-3" />
            <span>{timeLeft}</span>
          </div>

          {/* Earn amount - prominent */}
          <RewardDisplay 
            amount={task.earnAmount} 
            tokenIcon={task.rewardToken?.icon}
            tokenSymbol={task.rewardToken?.symbol}
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
            {/* Sub-action list */}
            {task.actions.map((action) => (
              <SubActionRow
                key={action.id}
                action={action}
                onVerify={() => handleVerifyAction(action.id)}
                isLoading={loadingActionId === action.id}
                disabled={!isEligible}
              />
            ))}

            {/* Progress bar */}
            <div className="mt-3 mb-2">
              <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-300"
                  style={{ width: `${(verifiedCount / totalActions) * 100}%` }}
                />
              </div>
            </div>

            {/* Claim button */}
            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-zinc-500">
                Complete all {totalActions} actions to claim your reward
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
                Claim ${task.earnAmount}
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
        </div>
      )}
    </div>
  )
}
