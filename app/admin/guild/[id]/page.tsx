'use client'

import { useParams } from 'next/navigation'
import { BarChart3, Users, Settings, TrendingUp } from 'lucide-react'
import { useGuild } from '@/lib/guild-context'

export default function AdminGuildOverview() {
  const params = useParams()
  const guildId = params.id as string
  const { guild, members, allInstalledApps } = useGuild()

  const stats = [
    { label: 'Total Members', value: guild.totalMembers.toLocaleString(), icon: Users },
    { label: 'Active Campaigns', value: guild.activeCampaigns, icon: TrendingUp },
    { label: 'Installed Apps', value: allInstalledApps.length, icon: Settings },
    { label: 'Total Rewards', value: `$${(guild.totalRewardsDistributed / 1000000).toFixed(1)}M`, icon: BarChart3 },
  ]

  return (
    <div className="h-full overflow-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-amber-500 text-sm font-medium mb-2">
          <Settings className="h-4 w-4" />
          <span>Admin Dashboard</span>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">{guild.name}</h1>
        <p className="text-zinc-400">Manage your guild settings, apps, and analytics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div 
              key={stat.label}
              className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-4"
            >
              <div className="flex items-center gap-3 mb-3">
                <div 
                  className="h-10 w-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${guild.accentColor}20` }}
                >
                  <Icon className="h-5 w-5" style={{ color: guild.accentColor }} />
                </div>
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-zinc-500">{stat.label}</p>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a 
            href={`/admin/guild/${guildId}/apps/infofi`}
            className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-4 hover:bg-zinc-800/50 transition-colors"
          >
            <div className="text-2xl mb-2">📚</div>
            <p className="font-medium text-white">Manage InfoFi</p>
            <p className="text-sm text-zinc-500">Configure campaigns and analytics</p>
          </a>
          <a 
            href={`/guild/${guildId}/admin/app-store`}
            className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-4 hover:bg-zinc-800/50 transition-colors"
          >
            <div className="text-2xl mb-2">🏪</div>
            <p className="font-medium text-white">App Store</p>
            <p className="text-sm text-zinc-500">Browse and install apps</p>
          </a>
          <a 
            href={`/guild/${guildId}/admin/dashboard`}
            className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-4 hover:bg-zinc-800/50 transition-colors"
          >
            <div className="text-2xl mb-2">📊</div>
            <p className="font-medium text-white">Analytics</p>
            <p className="text-sm text-zinc-500">View detailed stats</p>
          </a>
        </div>
      </div>

      {/* Installed Apps */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Installed Apps</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allInstalledApps.map((app) => (
            <a
              key={app.id}
              href={`/admin/guild/${guildId}/apps/${app.type}`}
              className="flex items-center gap-3 bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-4 hover:bg-zinc-800/50 transition-colors"
            >
              <div 
                className="h-10 w-10 rounded-lg flex items-center justify-center text-xl"
                style={{ backgroundColor: `${app.color}20` }}
              >
                {app.icon}
              </div>
              <div>
                <p className="font-medium text-white">{app.name}</p>
                <p className="text-xs text-zinc-500">Click to manage</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
