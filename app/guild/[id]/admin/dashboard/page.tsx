'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { 
  Package, 
  Trophy, 
  Users, 
  TrendingUp, 
  ArrowRight,
  PlusCircle 
} from 'lucide-react'
import { AppContainer } from '@/components/app-container'
import { StatsCard } from '@/components/stats-card'
import { Button } from '@/components/ui/button'
import { useGuild } from '@/lib/guild-context'
import { 
  getGuildInstalledApps, 
  getCampaignsByGuild,
  getStoreApps 
} from '@/lib/mock-data'
import { formatNumber } from '@/lib/utils'

export default function AdminDashboardPage() {
  const params = useParams()
  const guildId = params.id as string
  const { guild, installedStoreApps, members, userRole } = useGuild()

  const installedApps = getGuildInstalledApps(guildId)
  const campaigns = getCampaignsByGuild(guildId)
  const storeApps = getStoreApps()
  
  const activeCampaigns = campaigns.filter(c => c.status === 'active')
  const totalMembers = members.length
  const newlyInstalledApps = installedStoreApps.length

  // Only admins should see this page
  if (userRole !== 'admin') {
    return (
      <AppContainer
        appId="admin-dashboard"
        appName="Admin Dashboard"
        appIcon="📊"
        appDescription="Guild administration overview"
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-zinc-400">You don't have permission to access this page.</p>
          </div>
        </div>
      </AppContainer>
    )
  }

  return (
    <AppContainer
      appId="admin-dashboard"
      appName="Admin Dashboard"
      appIcon="📊"
      appDescription="Guild administration overview"
    >
      <div className="p-6">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">
            Welcome back, Admin
          </h1>
          <p className="text-zinc-400">
            Here's an overview of your guild's performance and activity.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            label="Installed Apps"
            value={installedApps.length + newlyInstalledApps}
            icon={Package}
            trend={{ value: newlyInstalledApps, positive: true }}
          />
          <StatsCard
            label="Active Campaigns"
            value={activeCampaigns.length}
            icon={Trophy}
            trend={{ value: 12.5, positive: true }}
          />
          <StatsCard
            label="Guild Members"
            value={formatNumber(guild.totalMembers)}
            icon={Users}
            trend={{ value: 8.3, positive: true }}
          />
          <StatsCard
            label="Total Campaigns"
            value={campaigns.length}
            icon={TrendingUp}
            trend={{ value: 4.2, positive: true }}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* App Store CTA */}
          <div 
            className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-6 hover:bg-zinc-900/50 transition-all"
          >
            <div className="flex items-start gap-4">
              <div 
                className="h-12 w-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${guild.accentColor}20` }}
              >
                <PlusCircle className="h-6 w-6" style={{ color: guild.accentColor }} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">
                  Install New Apps
                </h3>
                <p className="text-sm text-zinc-400 mb-4">
                  Browse the app store to discover new campaign types and tools for your guild.
                </p>
                <Link href={`/guild/${guildId}/admin/app-store`}>
                  <Button 
                    className="gap-2"
                    style={{ backgroundColor: guild.accentColor }}
                  >
                    Browse App Store
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Available Apps Overview */}
          <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Available in App Store
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Total Apps</span>
                <span className="text-sm font-medium text-white">{storeApps.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Virality Apps</span>
                <span className="text-sm font-medium text-white">
                  {storeApps.filter(a => a.category === 'Virality').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Onchain Apps</span>
                <span className="text-sm font-medium text-white">
                  {storeApps.filter(a => a.category === 'Onchain').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Video Apps</span>
                <span className="text-sm font-medium text-white">
                  {storeApps.filter(a => a.category === 'Video').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Dapps Integrations</span>
                <span className="text-sm font-medium text-white">
                  {storeApps.filter(a => a.category === 'Dapps').length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Currently Installed Apps */}
        <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
              Currently Installed Apps
            </h3>
            <Link href={`/guild/${guildId}/admin/app-store`}>
              <Button variant="ghost" className="text-sm text-zinc-400 hover:text-white gap-2">
                Add more
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          {installedApps.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {installedApps.map((app) => (
                <Link 
                  key={app.id}
                  href={`/guild/${guildId}/apps/${app.type}`}
                  className="group"
                >
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-800/30 hover:bg-zinc-800/50 transition-all">
                    <div 
                      className="h-10 w-10 rounded-lg flex items-center justify-center text-xl"
                      style={{ backgroundColor: `${app.color}20` }}
                    >
                      {app.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-zinc-100 group-hover:text-white transition-colors truncate">
                        {app.name}
                      </h4>
                      <p className="text-xs text-zinc-500 truncate">
                        {app.description}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-zinc-600 group-hover:text-zinc-400 transition-colors flex-shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-zinc-200 mb-2">No Apps Installed</h4>
              <p className="text-zinc-500 mb-4 max-w-sm mx-auto">
                Install apps from the App Store to run campaigns and engage your community.
              </p>
              <Link href={`/guild/${guildId}/admin/app-store`}>
                <Button style={{ backgroundColor: guild.accentColor }}>
                  Browse App Store
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </AppContainer>
  )
}
