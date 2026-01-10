'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Campaign, CAMPAIGN_TYPE_COLORS } from '@/types'
import { Clock, Users, CheckCircle2, XCircle, ArrowRight, Trophy, TrendingUp } from 'lucide-react'
import { formatDistanceToNowStrict } from 'date-fns'

interface CampaignRewardCardProps {
  campaign: Campaign
  isEligible?: boolean
  ineligibleReason?: string
  className?: string
}

export function CampaignRewardCard({ 
  campaign, 
  isEligible = true, 
  ineligibleReason,
  className 
}: CampaignRewardCardProps) {
  const timeLeft = formatDistanceToNowStrict(campaign.endDate, { addSuffix: false })
  const typeColor = CAMPAIGN_TYPE_COLORS[campaign.type]
  
  // Calculate slots left for UGC (mock calculation)
  const slotsLeft = Math.max(0, Math.floor(Math.random() * 50) + 10)
  
  // Per-content payout for UGC (mock)
  const perContentPayout = Math.floor(campaign.totalReward / campaign.participantsCount)

  const getCTALabel = () => {
    switch (campaign.type) {
      case 'InfoFi':
        return 'View Leaderboard'
      case 'UGC':
        return 'Submit Content'
      case 'Clipping':
        return 'View Tasks'
      default:
        return 'View'
    }
  }

  // Check if user is in winning position
  const isInWinningPosition = campaign.userRank && campaign.topWinners && campaign.userRank <= campaign.topWinners

  const getSecondaryInfo = () => {
    switch (campaign.type) {
      case 'InfoFi':
        return (
          <div className="flex items-center gap-4 flex-wrap">
            {/* User's rank */}
            {campaign.userRank && (
              <div className="flex items-center gap-1.5">
                <TrendingUp className={cn(
                  "h-3.5 w-3.5",
                  isInWinningPosition ? "text-green-500" : "text-amber-500"
                )} />
                <span className={cn(
                  "text-xs font-medium",
                  isInWinningPosition ? "text-green-500" : "text-amber-500"
                )}>
                  Rank #{campaign.userRank}
                </span>
              </div>
            )}
            {/* Top winners */}
            {campaign.topWinners && (
              <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                <Trophy className="h-3.5 w-3.5" />
                <span>Top {campaign.topWinners}</span>
              </div>
            )}
            {/* Eligibility if not participating yet */}
            {!campaign.userRank && (
              <div className="flex items-center gap-1.5">
                {isEligible ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                ) : (
                  <XCircle className="h-3.5 w-3.5 text-red-500" />
                )}
                <span className={cn(
                  "text-xs",
                  isEligible ? "text-green-500" : "text-red-400"
                )}>
                  {isEligible ? 'Eligible' : ineligibleReason || 'Requirements not met'}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <Clock className="h-3.5 w-3.5" />
              <span>{timeLeft} left</span>
            </div>
          </div>
        )
      case 'UGC':
        return (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <Users className="h-3.5 w-3.5" />
              <span>{slotsLeft} slots left</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <Clock className="h-3.5 w-3.5" />
              <span>{timeLeft} left</span>
            </div>
          </div>
        )
      case 'Clipping':
        return (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <Clock className="h-3.5 w-3.5" />
              <span>Deadline: {timeLeft}</span>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  const getRewardDisplay = () => {
    const tokenIcon = campaign.rewardToken?.icon
    const tokenSymbol = campaign.rewardToken?.symbol

    switch (campaign.type) {
      case 'InfoFi':
        return (
          <div className="text-right">
            <div className="flex items-center justify-end gap-1.5">
              <p className="text-lg font-bold text-green-400">
                ${campaign.totalReward.toLocaleString()}
              </p>
              {tokenIcon && (
                <img src={tokenIcon} alt={tokenSymbol} className="h-5 w-5 rounded-full" />
              )}
            </div>
            <p className="text-xs text-zinc-500">
              {tokenSymbol ? `${tokenSymbol} reward pool` : 'reward pool'}
            </p>
          </div>
        )
      case 'UGC':
        return (
          <div className="text-right">
            <div className="flex items-center justify-end gap-1.5">
              <p className="text-lg font-bold text-green-400">
                ${perContentPayout}
              </p>
              {tokenIcon && (
                <img src={tokenIcon} alt={tokenSymbol} className="h-5 w-5 rounded-full" />
              )}
            </div>
            <p className="text-xs text-zinc-500">
              {tokenSymbol ? `${tokenSymbol} per approved` : 'per approved'}
            </p>
          </div>
        )
      case 'Clipping':
        return (
          <div className="text-right">
            <div className="flex items-center justify-end gap-1.5">
              <p className="text-lg font-bold text-green-400">
                up to ${campaign.totalReward.toLocaleString()}
              </p>
              {tokenIcon && (
                <img src={tokenIcon} alt={tokenSymbol} className="h-5 w-5 rounded-full" />
              )}
            </div>
            <p className="text-xs text-zinc-500">
              {tokenSymbol ? `${tokenSymbol} max reward` : 'max reward'}
            </p>
          </div>
        )
      default:
        return (
          <div className="text-right">
            <div className="flex items-center justify-end gap-1.5">
              <p className="text-lg font-bold text-green-400">
                ${campaign.totalReward.toLocaleString()}
              </p>
              {tokenIcon && (
                <img src={tokenIcon} alt={tokenSymbol} className="h-5 w-5 rounded-full" />
              )}
            </div>
          </div>
        )
    }
  }

  const cardContent = (
    <div className={cn(
      "flex items-center justify-between px-4 py-4 rounded-xl border transition-all duration-200",
      isEligible 
        ? "bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/50 cursor-pointer" 
        : "bg-zinc-900/30 border-zinc-800/50 opacity-60",
      className
    )}>
      {/* Left side - Campaign info */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {/* Guild icon */}
        <img 
          src={campaign.guildIcon} 
          alt={campaign.guildName}
          className="h-10 w-10 rounded-lg object-cover flex-shrink-0"
        />
        
        {/* Campaign details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {/* Type indicator dot */}
            <span 
              className="h-2 w-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: typeColor }}
            />
            <p className="text-sm font-medium text-white truncate">
              {campaign.name}
            </p>
          </div>
          
          {/* Secondary info */}
          {getSecondaryInfo()}
        </div>
      </div>

      {/* Right side - Reward & CTA */}
      <div className="flex items-center gap-4 flex-shrink-0">
        {/* Reward display */}
        {getRewardDisplay()}
        
        {/* CTA Button */}
        {isEligible ? (
          <Button 
            size="sm" 
            className="bg-green-600 hover:bg-green-500 text-white font-semibold px-4 gap-2"
          >
            {getCTALabel()}
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button 
            size="sm" 
            variant="outline"
            disabled
            className="border-zinc-700 text-zinc-500 cursor-not-allowed"
          >
            {ineligibleReason || 'Not eligible'}
          </Button>
        )}
      </div>
    </div>
  )

  if (isEligible) {
    return (
      <Link href={`/guild/${campaign.guildId}/campaign/${campaign.id}`}>
        {cardContent}
      </Link>
    )
  }

  return cardContent
}
