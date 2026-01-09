'use client'

import Link from 'next/link'
import { Clock, Users } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { Campaign, TAG_COLORS, Platform } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

// Platform icons
const platformIcons: Record<Platform, React.FC<{ className?: string }>> = {
  youtube: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  ),
  tiktok: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
    </svg>
  ),
  instagram: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  ),
  twitter: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
}

interface CampaignCardSimpleProps {
  campaign: Campaign
  className?: string
}

export function CampaignCardSimple({ campaign, className }: CampaignCardSimpleProps) {
  const progress = (campaign.paidOut / campaign.totalReward) * 100
  const timeLeft = formatDistanceToNow(campaign.endDate, { addSuffix: false })
  const budgetRemaining = campaign.totalReward - campaign.paidOut

  return (
    <Link
      href={`/guild/${campaign.guildId}/campaign/${campaign.id}`}
      className={cn(
        "group block overflow-hidden rounded-xl border border-zinc-800 transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-800/20 card-hover",
        className
      )}
    >
      {/* Header with thumbnail and tags */}
      <div className="relative">
        <div className="h-36 overflow-hidden">
          <img 
            src={campaign.thumbnail} 
            alt={campaign.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/50 to-transparent" />
        </div>
        
        {/* Tags */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {campaign.tags.slice(0, 2).map((tag) => {
            const colors = TAG_COLORS[tag]
            return (
              <Badge 
                key={tag}
                variant="outline"
                className={cn(
                  "text-[10px] font-semibold backdrop-blur-sm",
                  colors.bg,
                  colors.text
                )}
              >
                {tag}
              </Badge>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 -mt-4 relative">
        <h3 className="font-semibold text-zinc-100 truncate group-hover:text-white transition-colors mb-1">
          {campaign.name}
        </h3>
        
        {/* Guild info */}
        <div className="flex items-center gap-2 mb-3">
          <img 
            src={campaign.guildIcon}
            alt={campaign.guildName}
            className="h-4 w-4 rounded"
          />
          <span className="text-sm text-zinc-500">{campaign.guildName}</span>
          
          {/* Platform icons */}
          <div className="flex items-center gap-1 ml-auto">
            {campaign.platforms.map((platform) => {
              const Icon = platformIcons[platform]
              return (
                <div 
                  key={platform}
                  className="h-5 w-5 rounded bg-zinc-800 flex items-center justify-center"
                >
                  <Icon className="h-3 w-3 text-zinc-400" />
                </div>
              )
            })}
          </div>
        </div>

        {/* Reward and time */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-lg font-bold text-green-500">
              ${campaign.totalReward.toLocaleString()}
            </span>
            <span className="text-xs text-zinc-500 ml-1">reward</span>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-400">
            <Clock className="h-4 w-4" />
            <span className="text-sm">{timeLeft} left</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <Progress value={progress} className="h-1.5" />
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-500">
              ${campaign.paidOut.toLocaleString()} paid
            </span>
            <span className="text-green-500 font-medium">
              ${budgetRemaining.toLocaleString()} left
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
