'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { AppContainer } from '@/components/app-container'
import { useGuild } from '@/lib/guild-context'
import { getGuildInstalledApps, getCampaignsByType } from '@/lib/mock-data'
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
  const { guild, getCustomizedApp } = useGuild()
  
  const installedApps = getGuildInstalledApps(guildId)

  // Get campaign counts for each app type
  const getAppCampaignCount = (type: AppType): number => {
    const campaignType = APP_TO_CAMPAIGN_TYPE[type]
    return getCampaignsByType(guildId, campaignType).filter(c => c.status === 'active').length
  }

  return (
    <AppContainer
      appId="apps"
      appName="Apps"
      appIcon="📱"
      appDescription="Campaign types available in this guild"
    >
      {/* Apps Grid */}
      {installedApps.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {installedApps.map((app) => {
            const customizedApp = getCustomizedApp(app)
            // app.type can be any string slug from the app store, only count if it's a known campaign type
            const appType = app.type as AppType
            const campaignCount = APP_TO_CAMPAIGN_TYPE[appType] ? getAppCampaignCount(appType) : 0
            return (
              <Link 
                key={app.id} 
                href={`/guild/${guildId}/apps/${app.type}`}
                className="group"
              >
                <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-5 hover:bg-zinc-900/60 hover:border-zinc-700 transition-all h-full">
                  <div className="flex items-start gap-4">
                    <div 
                      className="h-14 w-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ backgroundColor: `${app.color}20` }}
                    >
                      {customizedApp.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-zinc-100 group-hover:text-white transition-colors mb-1">
                        {customizedApp.name}
                      </h3>
                      <p className="text-sm text-zinc-500 mb-3">
                        {customizedApp.description}
                      </p>
                      {campaignCount > 0 && (
                        <span 
                          className="text-xs font-medium px-2 py-1 rounded-full"
                          style={{ 
                            backgroundColor: `${app.color}20`,
                            color: app.color 
                          }}
                        >
                          {campaignCount} active campaign{campaignCount !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    <ArrowRight className="h-5 w-5 text-zinc-600 group-hover:text-zinc-400 transition-colors flex-shrink-0 mt-1" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-12 text-center">
          <div 
            className="h-16 w-16 rounded-xl flex items-center justify-center text-4xl mx-auto mb-4"
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
    </AppContainer>
  )
}
