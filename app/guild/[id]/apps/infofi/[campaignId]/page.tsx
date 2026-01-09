'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Trophy, Users, Clock, Sparkles } from 'lucide-react'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { 
  getGuildById, 
  getCampaignById,
  getCampaignLeaderboard,
} from '@/lib/mock-data'
import { formatCurrency } from '@/lib/utils'

export default function InfoFiCampaignDetailPage() {
  const params = useParams()
  const guildId = params.id as string
  const campaignId = params.campaignId as string
  
  const guild = getGuildById(guildId)
  const campaign = getCampaignById(campaignId)
  const leaderboard = getCampaignLeaderboard(campaignId)

  if (!guild || !campaign) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-zinc-500">Campaign not found</p>
      </div>
    )
  }

  const isLive = campaign.status === 'active'
  const startDateStr = format(campaign.startDate, 'd MMM yyyy')
  const endDateStr = campaign.endDate ? format(campaign.endDate, 'd MMM yyyy') : 'TBD'

  // Get medal for top 3
  const getMedalIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <span className="text-lg">🥇</span>
      case 2:
        return <span className="text-lg">🥈</span>
      case 3:
        return <span className="text-lg">🥉</span>
      default:
        return <span className="text-zinc-500 font-medium">#{rank}</span>
    }
  }

  return (
    <div className="min-h-screen">
      {/* Back Link */}
      <div className="px-6 pt-6">
        <Link 
          href={`/guild/${guildId}/apps/infofi`}
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to InfoFi
        </Link>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Banner Image */}
        <div className="relative h-64 mx-6 mt-4 rounded-2xl overflow-hidden">
          <img 
            src={campaign.thumbnail}
            alt={campaign.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          {/* Overlay Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-center gap-3 mb-3">
              <img 
                src={campaign.guildIcon}
                alt={campaign.guildName}
                className="h-10 w-10 rounded-xl border-2 border-white/20"
              />
              <span className="text-white font-medium">{campaign.guildName}</span>
              <Badge 
                variant="outline"
                className={`text-xs font-medium px-3 py-1 ${
                  isLive 
                    ? 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10' 
                    : 'border-zinc-600 text-zinc-400'
                }`}
              >
                {isLive ? 'Live' : 'Ended'}
              </Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{campaign.name}</h1>
            <p className="text-zinc-300 text-sm max-w-2xl">{campaign.description}</p>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-xl bg-zinc-900/50 border border-zinc-800/50 p-4">
            <div className="flex items-center gap-2 text-zinc-500 text-sm mb-1">
              <Trophy className="h-4 w-4" />
              Total Rewards
            </div>
            <div className="text-xl font-bold text-emerald-400">
              {formatCurrency(campaign.totalReward)}
            </div>
          </div>
          <div className="rounded-xl bg-zinc-900/50 border border-zinc-800/50 p-4">
            <div className="flex items-center gap-2 text-zinc-500 text-sm mb-1">
              <Users className="h-4 w-4" />
              Participants
            </div>
            <div className="text-xl font-bold text-white">
              {campaign.participantsCount.toLocaleString()}
            </div>
          </div>
          <div className="rounded-xl bg-zinc-900/50 border border-zinc-800/50 p-4">
            <div className="flex items-center gap-2 text-zinc-500 text-sm mb-1">
              <Clock className="h-4 w-4" />
              Duration
            </div>
            <div className="text-sm font-medium text-white">
              {startDateStr} - {endDateStr}
            </div>
          </div>
          <div className="rounded-xl bg-zinc-900/50 border border-zinc-800/50 p-4">
            <div className="flex items-center gap-2 text-zinc-500 text-sm mb-1">
              <Sparkles className="h-4 w-4" />
              Type
            </div>
            <div className="text-xl font-bold text-blue-400">
              InfoFi
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard Section */}
      <div className="px-6 pb-8">
        <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/30 overflow-hidden">
          {/* Leaderboard Header */}
          <div className="px-6 py-4 border-b border-zinc-800/50">
            <h2 className="text-lg font-semibold text-white">Leaderboard</h2>
            <p className="text-sm text-zinc-500">Top creators ranked by score and multiplier</p>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-zinc-900/50 text-xs font-medium text-zinc-500 uppercase tracking-wider">
            <div className="col-span-1">Rank</div>
            <div className="col-span-3">Creator</div>
            <div className="col-span-2 text-right">Multiplier</div>
            <div className="col-span-2 text-right">Aura %</div>
            <div className="col-span-2 text-center">Connections</div>
            <div className="col-span-2 text-right">Est. Payout</div>
          </div>

          {/* Leaderboard Entries */}
          <div className="divide-y divide-zinc-800/50">
            {leaderboard.map((entry, index) => {
              const isTopThree = entry.rank <= 3
              return (
                <div 
                  key={entry.userId}
                  className={`grid grid-cols-12 gap-4 px-6 py-4 items-center transition-colors hover:bg-zinc-800/30 ${
                    isTopThree ? 'bg-zinc-800/20' : ''
                  }`}
                >
                  {/* Rank */}
                  <div className="col-span-1 flex items-center justify-center">
                    {getMedalIcon(entry.rank)}
                  </div>

                  {/* Creator */}
                  <div className="col-span-3 flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-zinc-700">
                      <AvatarImage src={entry.avatar} alt={entry.username} />
                      <AvatarFallback className="bg-zinc-800 text-zinc-400">
                        {entry.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-white truncate max-w-[150px]">
                        @{entry.socialHandle || entry.username}
                      </div>
                      <div className="text-xs text-zinc-500">
                        {entry.score.toLocaleString()} pts
                      </div>
                    </div>
                  </div>

                  {/* Multiplier */}
                  <div className="col-span-2 text-right">
                    <span 
                      className="font-bold text-lg"
                      style={{ color: guild.accentColor }}
                    >
                      {entry.multiplier?.toFixed(1)}x
                    </span>
                  </div>

                  {/* Aura % */}
                  <div className="col-span-2 text-right">
                    <span className="text-emerald-400 font-medium">
                      {entry.auraPercent?.toFixed(2)}%
                    </span>
                  </div>

                  {/* Connections */}
                  <div className="col-span-2 flex justify-center">
                    <div className="flex -space-x-2">
                      {entry.connections?.slice(0, 4).map((avatar, i) => (
                        <Avatar key={i} className="h-7 w-7 border-2 border-zinc-900">
                          <AvatarImage src={avatar} />
                          <AvatarFallback className="bg-zinc-800 text-xs">?</AvatarFallback>
                        </Avatar>
                      ))}
                      {(entry.connections?.length || 0) > 4 && (
                        <div className="h-7 w-7 rounded-full bg-zinc-800 border-2 border-zinc-900 flex items-center justify-center text-xs text-zinc-400">
                          +{(entry.connections?.length || 0) - 4}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Est. Payout */}
                  <div className="col-span-2 text-right">
                    <span className="font-bold text-emerald-400">
                      ${entry.estimatedPayout}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
