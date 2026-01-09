'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AvatarStack } from '@/components/ui/avatar-stack'
import { 
  getGuildById, 
  getCampaignsByType,
  guildMembers,
} from '@/lib/mock-data'
import { Campaign, APP_TYPE_INFO } from '@/types'
import { formatCurrency } from '@/lib/utils'

export default function InfoFiAppPage() {
  const params = useParams()
  const guildId = params.id as string
  
  const guild = getGuildById(guildId)
  const allCampaigns = getCampaignsByType(guildId, 'InfoFi')
  
  const activeCampaigns = allCampaigns.filter(c => c.status === 'active')
  const totalCampaigns = allCampaigns.length

  const appInfo = APP_TYPE_INFO['infofi']

  if (!guild) {
    return null
  }

  // Get sample avatars for participant stack
  const participantAvatars = guildMembers.slice(0, 4).map(m => ({ src: m.avatar, alt: m.username }))

  const CampaignCard = ({ campaign }: { campaign: Campaign }) => {
    const isLive = campaign.status === 'active'
    const startDateStr = format(campaign.startDate, 'd MMM yyyy')
    const endDateStr = campaign.endDate ? format(campaign.endDate, 'd MMM yyyy') : 'TBD'

    return (
      <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/50 overflow-hidden hover:border-zinc-700 transition-all">
        {/* Banner Image with Rewards Overlay */}
        <div className="relative h-48 overflow-hidden">
          <img 
            src={campaign.thumbnail}
            alt={campaign.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/30" />
          
          {/* Rewards text overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-sm text-white/70 mb-1">Rewards</span>
            <span className="text-3xl font-bold text-white drop-shadow-lg">
              {formatCurrency(campaign.totalReward)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Guild info + Live badge */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <img 
                src={campaign.guildIcon}
                alt={campaign.guildName}
                className="h-10 w-10 rounded-xl"
              />
              <span className="font-semibold text-zinc-100">{campaign.guildName}</span>
            </div>
            <Badge 
              variant="outline"
              className={`text-xs font-medium px-3 py-1 ${
                isLive 
                  ? 'border-emerald-500/50 text-emerald-400' 
                  : 'border-zinc-600 text-zinc-400'
              }`}
            >
              {isLive ? 'Live' : 'Ended'}
            </Badge>
          </div>

          {/* Duration row */}
          <div className="flex items-center justify-between py-3 border-t border-zinc-800/50">
            <span className="text-sm text-zinc-500">Duration</span>
            <span className="text-sm text-zinc-200 font-medium">
              {startDateStr} - {endDateStr}
            </span>
          </div>

          {/* Participants row */}
          <div className="flex items-center justify-between py-3 border-t border-zinc-800/50">
            <span className="text-sm text-zinc-500">Participants</span>
            <div className="flex items-center gap-2">
              <AvatarStack avatars={participantAvatars} size="sm" maxDisplay={4} />
            </div>
          </div>

          {/* Your Rank row */}
          <div className="flex items-center justify-between py-3 border-t border-zinc-800/50">
            <span className="text-sm text-zinc-500">Your Rank</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold" style={{ color: guild?.accentColor || '#22c55e' }}>
                #42
              </span>
              <span className="text-xs text-zinc-500">of 1,284</span>
            </div>
          </div>

          {/* View Button */}
          <Link href={`/guild/${guildId}/campaign/${campaign.id}`}>
            <Button 
              className="w-full mt-4 text-white font-semibold"
              style={{ backgroundColor: guild?.accentColor || '#22c55e' }}
            >
              View
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* App Header - Fixed */}
      <div className="sticky top-0 z-10 bg-[#111111] border-b border-zinc-800/50">
        <div className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div 
              className="h-10 w-10 rounded-lg flex items-center justify-center text-xl"
              style={{ backgroundColor: `${appInfo.color}20` }}
            >
              {appInfo.icon}
            </div>
            <div>
              <h1 className="text-lg font-bold text-zinc-100">{appInfo.name}</h1>
              <p className="text-sm text-zinc-500">{appInfo.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Campaigns Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Campaigns</h2>
          <span className="text-sm text-zinc-500">
            {activeCampaigns.length} of {totalCampaigns} campaigns
          </span>
        </div>

        {/* Campaign Grid */}
        {allCampaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {allCampaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-12 text-center">
            <div 
              className="h-16 w-16 rounded-xl flex items-center justify-center text-4xl mx-auto mb-4"
              style={{ backgroundColor: `${appInfo.color}20` }}
            >
              {appInfo.icon}
            </div>
            <h3 className="text-lg font-semibold text-zinc-200 mb-2">No Campaigns Yet</h3>
            <p className="text-zinc-500 max-w-sm mx-auto">
              There are no InfoFi campaigns in this guild yet. Check back later!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
