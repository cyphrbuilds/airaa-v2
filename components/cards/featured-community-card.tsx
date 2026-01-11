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
        "group flex flex-col rounded-xl border border-zinc-800 bg-zinc-900/50 transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-800/50 min-w-[280px] max-w-[280px]",
        className
      )}
    >
      {/* Guild Header */}
      <div className="flex items-center gap-3 p-4 pb-3">
        <div className="h-10 w-10 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-800">
          <img
            src={guild.icon}
            alt={guild.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-zinc-100 truncate text-sm group-hover:text-white transition-colors">
              {guild.name}
            </h3>
            {hasActiveCampaigns && (
              <Badge className="bg-green-500/20 text-green-500 border-green-500/30 text-[10px] px-1.5 py-0">
                Live
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-2 px-4 py-3 border-t border-zinc-800/50">
        <div>
          <p className="text-zinc-500 text-[10px] uppercase tracking-wider">Rewards</p>
          <p className="text-green-400 font-bold text-sm">
            ${formatRewardsShort(guild.totalRewardsDistributed)}
          </p>
        </div>
        <div>
          <p className="text-zinc-500 text-[10px] uppercase tracking-wider">Campaigns</p>
          <p className="text-zinc-200 font-medium text-sm">{guild.activeCampaigns} active</p>
        </div>
        <div>
          <p className="text-zinc-500 text-[10px] uppercase tracking-wider">Members</p>
          <AvatarStack avatars={memberAvatars} size="sm" maxDisplay={3} />
        </div>
      </div>

      {/* View Button */}
      <div className="p-3 pt-0">
        <Button
          size="sm"
          className="w-full h-8 text-xs font-medium"
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
