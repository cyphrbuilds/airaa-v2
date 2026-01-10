'use client'

import { useParams } from 'next/navigation'
import { Settings, BarChart3, Users, Sparkles } from 'lucide-react'
import { AppContainer } from '@/components/app-container'
import { ViewModeBanner } from '@/components/admin/view-mode-banner'
import { useGuild } from '@/lib/guild-context'
import { getStoreAppBySlug, isUserAdminOrMod } from '@/lib/mock-data'

export default function AdminAppPage() {
  const params = useParams()
  const guildId = params.id as string
  const appType = params.appType as string
  
  const { guild, allInstalledApps, getCustomizedApp, userRole } = useGuild()
  
  // Find the installed app by type/slug
  const installedApp = allInstalledApps.find(app => app.type === appType)
  
  // Also check the store for more app details
  const storeApp = getStoreAppBySlug(appType)
  
  // Get customized version if available
  const appInfo = installedApp 
    ? getCustomizedApp(installedApp) 
    : storeApp 
      ? { 
          id: storeApp.id,
          type: storeApp.slug,
          name: storeApp.name, 
          icon: '📦', 
          description: storeApp.shortDescription,
          color: storeApp.color,
          installedAt: new Date()
        }
      : null

  const isAdminOrMod = isUserAdminOrMod(guildId)

  // App not found
  if (!appInfo) {
    return (
      <AppContainer
        appId={appType}
        appName="App Not Found"
        appIcon="❓"
        appDescription="This app could not be found"
      >
        <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
          <div className="h-20 w-20 rounded-2xl bg-zinc-800/50 flex items-center justify-center text-5xl mb-6">
            ❓
          </div>
          <h2 className="text-xl font-semibold text-zinc-200 mb-2">App Not Found</h2>
          <p className="text-zinc-500 text-center max-w-sm">
            This app hasn't been installed in this guild yet.
          </p>
        </div>
      </AppContainer>
    )
  }

  const appColor = installedApp?.color || storeApp?.color || guild.accentColor

  return (
    <AppContainer
      appId={appType}
      appName={appInfo.name}
      appIcon={appInfo.icon}
      appDescription={appInfo.description}
      appColor={appColor}
      headerActions={
        <ViewModeBanner 
          guildId={guildId} 
          appType={appType} 
          isAdminOrMod={isAdminOrMod}
          accentColor={appColor}
        />
      }
    >
      {/* Admin View Content */}
      <div className="flex flex-col h-full min-h-[500px] px-4 relative">
        {/* Decorative background */}
        <div 
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 30%, ${appColor}40 0%, transparent 50%)`,
          }}
        />
        
        {/* Admin Badge */}
        <div className="relative z-10 pt-6 pb-4">
          <div 
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{ 
              backgroundColor: '#f59e0b20',
              color: '#f59e0b',
            }}
          >
            <Settings className="h-3.5 w-3.5" />
            <span>Admin View</span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="relative z-10 grid grid-cols-3 gap-4 mb-8">
          <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-zinc-500" />
              <span className="text-xs text-zinc-500">Participants</span>
            </div>
            <p className="text-2xl font-bold text-white">1,234</p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-4 w-4 text-zinc-500" />
              <span className="text-xs text-zinc-500">Engagement</span>
            </div>
            <p className="text-2xl font-bold text-white">87%</p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-zinc-500" />
              <span className="text-xs text-zinc-500">Rewards Paid</span>
            </div>
            <p className="text-2xl font-bold text-white">$12.4K</p>
          </div>
        </div>
        
        {/* Content Placeholder */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto">
          {/* App Icon */}
          <div 
            className="h-20 w-20 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-6 shadow-lg"
            style={{ 
              backgroundColor: `${appColor}20`,
              boxShadow: `0 0 60px ${appColor}20`,
            }}
          >
            {appInfo.icon}
          </div>
          
          {/* Title */}
          <h2 className="text-xl font-bold text-white mb-3">
            {appInfo.name} Admin Dashboard
          </h2>
          
          {/* Description */}
          <p className="text-zinc-400 mb-6 leading-relaxed">
            Manage campaigns, view analytics, and configure settings for this app.
          </p>
          
          {/* Coming Soon Badge */}
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
            style={{ 
              backgroundColor: `${appColor}15`,
              color: appColor,
            }}
          >
            <Sparkles className="h-4 w-4" />
            <span>Admin features coming soon</span>
          </div>
        </div>
      </div>
    </AppContainer>
  )
}
