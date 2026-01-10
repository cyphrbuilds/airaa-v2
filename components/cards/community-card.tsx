'use client'

import Link from 'next/link'
import { Users, Trophy, BadgeCheck } from 'lucide-react'
import { Guild, GUILD_CATEGORY_COLORS } from '@/types'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface CommunityCardProps {
  guild: Guild
  className?: string
}

export function CommunityCard({ guild, className }: CommunityCardProps) {
  const categoryColor = GUILD_CATEGORY_COLORS[guild.category]
  const hasActiveCampaigns = guild.activeCampaigns > 0

  return (
    <Link
      href={`/guild/${guild.id}`}
      className={cn(
        "group flex items-center gap-3 p-3 rounded-xl border border-zinc-800 bg-zinc-900/50 transition-all duration-200 hover:border-zinc-600 hover:bg-zinc-800/70 min-w-[220px]",
        className
      )}
    >
      {/* Logo */}
      <div 
        className="h-10 w-10 rounded-lg overflow-hidden border border-zinc-700 bg-zinc-800 flex-shrink-0"
      >
        <img
          src={guild.icon}
          alt={guild.name}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Name + Category Row */}
        <div className="flex items-center gap-1.5 mb-1">
          <h3 className="font-semibold text-sm text-zinc-100 truncate group-hover:text-white transition-colors">
            {guild.name}
          </h3>
          {guild.verified && (
            <BadgeCheck className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
          )}
        </div>
        
        {/* Category + Stats Row */}
        <div className="flex items-center gap-2 text-[11px]">
          <Badge 
            variant="secondary" 
            className="text-[9px] px-1.5 py-0 h-4"
            style={{ 
              backgroundColor: `${categoryColor}20`,
              color: categoryColor,
            }}
          >
            {guild.category}
          </Badge>
          
          <span className="text-zinc-500">•</span>
          
          <div className="flex items-center gap-0.5 text-zinc-400">
            <Users className="h-3 w-3" />
            <span>{(guild.totalMembers / 1000).toFixed(0)}K</span>
          </div>
          
          {hasActiveCampaigns && (
            <>
              <span className="text-zinc-500">•</span>
              <div className="flex items-center gap-0.5 text-green-500">
                <Trophy className="h-3 w-3" />
                <span>{guild.activeCampaigns}</span>
              </div>
            </>
          )}
          
          <span className="text-zinc-500">•</span>
          
          <span className="font-medium text-zinc-300">
            ${(guild.totalRewardsDistributed / 1000000).toFixed(1)}M
          </span>
        </div>
      </div>
    </Link>
  )
}
