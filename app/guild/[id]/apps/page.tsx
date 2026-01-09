'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getGuildById, getGuildInstalledApps, getCampaignsByType } from '@/lib/mock-data'
import { CampaignType, AppType } from '@/types'

// Map AppType to CampaignType
const APP_TO_CAMPAIGN_TYPE: Record<AppType, CampaignType> = {
  'infofi': 'InfoFi',
  'ugc': 'UGC',
  'clipping': 'Clipping',
  'mini': 'Mini',
}

export default function GuildAppsPage() {
  const params = useParams()
  const guildId = params.id as string
  
  const guild = getGuildById(guildId)
  const installedApps = getGuildInstalledApps(guildId)

  if (!guild) {
    return null
  }

  // Get campaign counts for each app type
  const getAppCampaignCount = (type: AppType): number => {
    const campaignType = APP_TO_CAMPAIGN_TYPE[type]
    return getCampaignsByType(guildId, campaignType).filter(c => c.status === 'active').length
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Installed Apps</h2>
          <p className="text-sm text-zinc-500">
            Campaign types available in this guild
          </p>
        </div>
      </div>

      {/* Apps Grid */}
      {installedApps.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {installedApps.map((app) => (
            <Link 
              key={app.id} 
              href={`/guild/${guildId}/apps/${app.type}`}
              className="group"
            >
              <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-5 hover:bg-zinc-900/60 hover:border-zinc-700 transition-all">
                <div className="flex items-center gap-4">
                  <div 
                    className="h-12 w-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${app.color}20` }}
                  >
                    {app.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-zinc-100 group-hover:text-white transition-colors">
                      {app.name}
                    </h3>
                    <p className="text-sm text-zinc-500 truncate">
                      {app.description}
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-8 text-center">
          <div 
            className="h-12 w-12 rounded-lg flex items-center justify-center text-3xl mx-auto mb-4"
            style={{ backgroundColor: `${guild.accentColor}20` }}
          >
            📱
          </div>
          <h3 className="text-lg font-semibold text-zinc-200 mb-2">No Apps Installed</h3>
          <p className="text-zinc-500 max-w-sm mx-auto">
            This guild hasn't installed any campaign apps yet. Check back later!
          </p>
        </div>
      )}
    </div>
  )
}
