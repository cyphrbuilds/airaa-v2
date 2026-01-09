'use client'

import Link from 'next/link'
import { format } from 'date-fns'
import { Campaign, CAMPAIGN_TYPE_COLORS } from '@/types'
import { cn } from '@/lib/utils'

interface CampaignCardNewProps {
  campaign: Campaign
  className?: string
}

export function CampaignCardNew({ campaign, className }: CampaignCardNewProps) {
  const typeColor = CAMPAIGN_TYPE_COLORS[campaign.type]
  const formattedStartDate = format(campaign.startDate, 'd MMM yy')
  const formattedEndDate = format(campaign.endDate, 'd MMM yy')
  
  // Get first 3 participants for avatars (mock)
  const participantAvatars = [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=p1',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=p2',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=p3',
  ]

  return (
    <Link
      href={`/guild/${campaign.guildId}/campaign/${campaign.id}`}
      className={cn("group block", className)}
    >
      {/* Card with gradient border effect */}
      <div className="relative rounded-2xl overflow-hidden">
        {/* Gradient border glow effect */}
        <div 
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `linear-gradient(135deg, ${typeColor}40 0%, transparent 50%, ${typeColor}20 100%)`,
            filter: 'blur(1px)',
          }}
        />
        
        {/* Card content */}
        <div className="relative border border-zinc-800/80 rounded-2xl overflow-hidden transition-all duration-300 group-hover:border-zinc-700/80 group-hover:bg-zinc-800/20">
          
          {/* Image section with overlay */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <img 
              src={campaign.thumbnail} 
              alt={campaign.name}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />
            
            {/* Top tags row */}
            <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
              <div className="flex items-center gap-2">
                {/* Campaign type badge with colored dot */}
                <div 
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium backdrop-blur-sm"
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    border: `1px solid ${typeColor}40`,
                  }}
                >
                  <span 
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: typeColor }}
                  />
                  <span className="text-white">{campaign.type}</span>
                </div>
                
                {/* Category badge */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-sm border border-zinc-700/50 text-xs font-medium text-zinc-300">
                  {campaign.category}
                </div>
              </div>
              
              {/* Live badge */}
              {campaign.status === 'active' && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-500/90 text-xs font-semibold text-white">
                  Live
                </div>
              )}
            </div>
            
            {/* Campaign title overlaid at bottom of image */}
            <div className="absolute bottom-3 left-3 right-3">
              <h3 className="text-base font-semibold text-white line-clamp-2 drop-shadow-lg">
                {campaign.name}
              </h3>
            </div>
          </div>
          
          {/* Info section */}
          <div className="p-4 space-y-4">
            {/* Guild info row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img 
                  src={campaign.guildIcon}
                  alt={campaign.guildName}
                  className="h-5 w-5 rounded-md"
                />
                <span className="text-sm font-medium text-white">{campaign.guildName}</span>
              </div>
              <span className="text-xs text-zinc-500">
                Started on {formattedStartDate}
              </span>
            </div>
            
            {/* Rewards row */}
            <div className="flex items-center justify-between py-3 border-t border-b border-zinc-800/50">
              <span className="text-sm text-zinc-400">Rewards</span>
              <span className="text-lg font-bold text-green-500">
                ${campaign.totalReward.toLocaleString()}
              </span>
            </div>
            
            {/* Bottom stats row */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              {/* End date */}
              <div>
                <p className="text-zinc-500 mb-1">Ends on</p>
                <p className="text-white font-medium">{formattedEndDate}</p>
              </div>
              
              {/* Participants */}
              <div>
                <p className="text-zinc-500 mb-1">Participants</p>
                <div className="flex items-center">
                  <span className="text-white font-medium mr-1.5">{campaign.participantsCount}</span>
                  <div className="flex -space-x-1.5">
                    {participantAvatars.map((avatar, i) => (
                        <img
                          key={i}
                          src={avatar}
                          alt=""
                          className="h-4 w-4 rounded-full border border-zinc-900"
                        />
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Type */}
              <div>
                <p className="text-zinc-500 mb-1">Type</p>
                <p className="text-white font-medium">{campaign.participationType}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
