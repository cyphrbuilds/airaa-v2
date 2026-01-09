'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { DollarSign, Users, Trophy, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CampaignCardSimple } from '@/components/cards/campaign-card-simple'
import { StatsCard } from '@/components/stats-card'
import { TeamMembers } from '@/components/guild/team-members'
import { TwitterFeed } from '@/components/guild/twitter-feed'
import { AppContainer } from '@/components/app-container'
import { useGuild } from '@/lib/guild-context'
import { 
  getCampaignsByGuild, 
  getGuildTwitterPosts,
  getGuildInstalledApps
} from '@/lib/mock-data'
import { formatCurrencyCompact, formatNumber } from '@/lib/utils'
import { GUILD_CATEGORY_COLORS } from '@/types'

export default function GuildOverviewPage() {
  const params = useParams()
  const guildId = params.id as string
  const { guild, members, getCustomizedApp } = useGuild()
  
  const campaigns = getCampaignsByGuild(guildId)
  const twitterPosts = getGuildTwitterPosts(guildId)
  const installedApps = getGuildInstalledApps(guildId)
  
  const activeCampaigns = campaigns.filter(c => c.status === 'active')
  const totalCampaignsRun = campaigns.length

  const categoryColor = GUILD_CATEGORY_COLORS[guild.category]

  return (
    <AppContainer
      appId="overview"
      appName="Overview"
      appIcon="🏠"
      appDescription={`Welcome to ${guild.name}`}
    >
      <div className="min-h-full">
        {/* Hero Banner */}
        <div className="relative h-48 md:h-56 overflow-hidden">
          <img 
            src={guild.banner} 
            alt={guild.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#111111]/80 to-transparent" />
          
          {/* Guild Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-end gap-4">
              <div 
                className="h-20 w-20 rounded-2xl overflow-hidden flex-shrink-0 ring-4 ring-[#111111]"
                style={{ 
                  boxShadow: `0 0 30px ${guild.accentColor}40`,
                }}
              >
                <img 
                  src={guild.icon} 
                  alt={guild.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0 pb-1">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl md:text-3xl font-bold text-white">{guild.name}</h1>
                  {guild.verified && (
                    <CheckCircle className="h-6 w-6 flex-shrink-0" style={{ color: guild.accentColor }} />
                  )}
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <Badge 
                    className="text-xs font-semibold"
                    style={{ 
                      backgroundColor: `${categoryColor}20`,
                      color: categoryColor,
                    }}
                  >
                    {guild.category}
                  </Badge>
                  {guild.chains && guild.chains.length > 0 && (
                    <span className="text-sm text-zinc-400">
                      {guild.chains.length} chain{guild.chains.length > 1 ? 's' : ''} supported
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          {/* Description */}
          <div className="mb-8">
            <p className="text-zinc-300 text-lg leading-relaxed max-w-3xl">
              {guild.description}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatsCard
              label="Rewards Distributed"
              value={formatCurrencyCompact(guild.totalRewardsDistributed)}
              icon={DollarSign}
            />
            <StatsCard
              label="Active Campaigns"
              value={guild.activeCampaigns}
              icon={Trophy}
            />
            <StatsCard
              label="Total Members"
              value={formatNumber(guild.totalMembers)}
              icon={Users}
            />
            <StatsCard
              label="Campaigns Run"
              value={totalCampaignsRun}
              icon={TrendingUp}
            />
          </div>

          {/* Two Column Layout for Team & Twitter */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Team Members */}
            <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-5">
              <TeamMembers members={members} guild={guild} maxDisplay={4} />
            </div>

            {/* Twitter Feed */}
            <TwitterFeed posts={twitterPosts} guild={guild} maxPosts={3} />
          </div>

          {/* Active Campaigns Preview */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-white">Active Campaigns</h2>
                <p className="text-sm text-zinc-500">
                  {activeCampaigns.length} active campaign{activeCampaigns.length !== 1 ? 's' : ''} available
                </p>
              </div>
              {installedApps.length > 0 && (
                <Link href={`/guild/${guildId}/apps`}>
                  <Button 
                    variant="outline" 
                    className="gap-2 border-zinc-700 hover:border-zinc-600"
                    style={{ 
                      color: guild.accentColor,
                    }}
                  >
                    Browse Apps
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
            
            {activeCampaigns.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {activeCampaigns.slice(0, 3).map((campaign) => (
                  <CampaignCardSimple key={campaign.id} campaign={campaign} />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-8 text-center">
                <Trophy className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-zinc-200 mb-2">No Active Campaigns</h3>
                <p className="text-zinc-500 max-w-sm mx-auto">
                  Check back later for new campaigns and reward opportunities.
                </p>
              </div>
            )}
          </section>

          {/* Installed Apps Preview */}
          {installedApps.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-white">Installed Apps</h2>
                  <p className="text-sm text-zinc-500">
                    Campaign types available in this guild
                  </p>
                </div>
                <Link href={`/guild/${guildId}/apps`}>
                  <Button 
                    variant="ghost" 
                    className="gap-2 text-zinc-400 hover:text-white"
                  >
                    View all
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {installedApps.map((app) => {
                  const customizedApp = getCustomizedApp(app)
                  return (
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
                            {customizedApp.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-zinc-100 group-hover:text-white transition-colors">
                              {customizedApp.name}
                            </h3>
                            <p className="text-sm text-zinc-500 truncate">
                              {customizedApp.description}
                            </p>
                          </div>
                          <ArrowRight className="h-5 w-5 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </section>
          )}
        </div>
      </div>
    </AppContainer>
  )
}
