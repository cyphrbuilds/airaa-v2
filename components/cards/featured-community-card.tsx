'use client'

import Link from 'next/link'
import { Guild } from '@/types'
import { AvatarStack } from '@/components/ui/avatar-stack'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatRewardsShort, guildMembers } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

interface FeaturedCommunityCardProps {
  guild: Guild
  className?: string
}

export function FeaturedCommunityCard({ guild, className }: FeaturedCommunityCardProps) {
  // Get some member avatars for display
  const memberAvatars = guildMembers.slice(0, 5).map(m => ({ src: m.avatar, alt: m.username }))
  
  const hasActiveCampaigns = guild.activeCampaigns > 0

  return (
    <Link
      href={`/guild/${guild.id}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border border-zinc-800 transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-800/20 card-hover min-w-[320px] max-w-[320px]",
        className
      )}
    >
      {/* Banner Image */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={guild.banner}
          alt={guild.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/60 to-transparent" />

        {/* Rewards Badge - Centered */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Badge 
            className="bg-zinc-900/80 text-zinc-100 border-zinc-700 backdrop-blur-sm font-medium text-sm px-3 py-1"
          >
            Rewards
          </Badge>
          <div className="mt-2 text-center">
            <span className="text-[50px] font-bold text-white drop-shadow-lg">
              ${formatRewardsShort(guild.totalRewardsDistributed)}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative flex flex-col flex-1 p-4 -mt-6">
        {/* Guild Info */}
        <div className="flex items-center gap-3 mb-3">
          <div 
            className="h-12 w-12 rounded-xl overflow-hidden border-4 border-zinc-900 flex-shrink-0 bg-zinc-800"
          >
            <img
              src={guild.icon}
              alt={guild.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-zinc-100 truncate group-hover:text-white transition-colors">
                {guild.name}
              </h3>
              {hasActiveCampaigns && (
                <Badge className="bg-green-500/20 text-green-500 border-green-500/30 text-xs">
                  Live
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Activity Info */}
        <div className="flex items-center justify-between text-sm mb-4">
          <div>
            <p className="text-zinc-500 text-xs">Active campaigns</p>
            <p className="text-zinc-200 font-medium">{guild.activeCampaigns} campaigns</p>
          </div>
          <div className="text-right">
            <p className="text-zinc-500 text-xs">Members</p>
            <AvatarStack avatars={memberAvatars} size="sm" maxDisplay={4} />
          </div>
        </div>

        {/* View Button */}
        <Button
          className="w-full mt-auto"
          style={{
            backgroundColor: guild.accentColor,
            color: 'white',
          }}
        >
          View
        </Button>
      </div>
    </Link>
  )
}
