'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Inbox, Zap, Trophy, RefreshCw } from 'lucide-react'

type RewardSpeed = 'instant' | 'campaign'

interface EmptyStateProps {
  type: 'no-tasks' | 'no-campaigns' | 'no-results'
  rewardSpeed: RewardSpeed
  onSwitchMode?: () => void
  onRefresh?: () => void
  className?: string
}

export function EmptyState({ type, rewardSpeed, onSwitchMode, onRefresh, className }: EmptyStateProps) {
  const getContent = () => {
    switch (type) {
      case 'no-tasks':
        return {
          icon: <Zap className="h-8 w-8 text-zinc-600" />,
          title: "No instant tasks available",
          description: "Check back soon for new social tasks, or try campaign rewards for bigger payouts.",
          action: rewardSpeed === 'instant' ? (
            <Button 
              onClick={onSwitchMode}
              className="bg-green-600 hover:bg-green-500 text-white"
            >
              <Trophy className="h-4 w-4 mr-2" />
              View Campaign Rewards
            </Button>
          ) : null
        }
      case 'no-campaigns':
        return {
          icon: <Trophy className="h-8 w-8 text-zinc-600" />,
          title: "No campaigns available",
          description: "All campaigns are full or have ended. Try instant rewards for quick earnings.",
          action: rewardSpeed === 'campaign' ? (
            <Button 
              onClick={onSwitchMode}
              className="bg-green-600 hover:bg-green-500 text-white"
            >
              <Zap className="h-4 w-4 mr-2" />
              View Instant Rewards
            </Button>
          ) : null
        }
      case 'no-results':
        return {
          icon: <Inbox className="h-8 w-8 text-zinc-600" />,
          title: "No results found",
          description: "Try adjusting your filters or search query.",
          action: onRefresh ? (
            <Button 
              variant="outline"
              onClick={onRefresh}
              className="border-zinc-700 hover:bg-zinc-800"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset Filters
            </Button>
          ) : null
        }
      default:
        return {
          icon: <Inbox className="h-8 w-8 text-zinc-600" />,
          title: "Nothing here yet",
          description: "Check back later for new opportunities.",
          action: null
        }
    }
  }

  const content = getContent()

  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-16 text-center",
      className
    )}>
      <div className="h-16 w-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4">
        {content.icon}
      </div>
      <h3 className="text-lg font-semibold text-zinc-200 mb-2">
        {content.title}
      </h3>
      <p className="text-sm text-zinc-500 max-w-sm mb-6">
        {content.description}
      </p>
      {content.action}
    </div>
  )
}
