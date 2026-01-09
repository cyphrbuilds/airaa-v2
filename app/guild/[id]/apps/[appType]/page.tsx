'use client'

import { useParams } from 'next/navigation'
import { Sparkles, Settings } from 'lucide-react'
import { AppContainer } from '@/components/app-container'
import { Button } from '@/components/ui/button'
import { useGuild } from '@/lib/guild-context'
import { getStoreAppBySlug } from '@/lib/mock-data'
import { HowItWorksModal } from '@/components/how-it-works'

export default function GenericAppPage() {
  const params = useParams()
  const guildId = params.id as string
  const appType = params.appType as string
  
  const { guild, allInstalledApps, getCustomizedApp } = useGuild()
  
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
      headerActions={<HowItWorksModal appSlug={appType} communityName={guild.name} />}
    >
      {/* Empty State - Coming Soon */}
      <div className="flex flex-col items-center justify-center h-full min-h-[500px] px-4 relative">
        {/* Decorative background */}
        <div 
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 30%, ${appColor}40 0%, transparent 50%)`,
          }}
        />
        
        {/* Content */}
        <div className="relative z-10 text-center max-w-md">
          {/* App Icon */}
          <div 
            className="h-24 w-24 rounded-3xl flex items-center justify-center text-5xl mx-auto mb-6 shadow-lg"
            style={{ 
              backgroundColor: `${appColor}20`,
              boxShadow: `0 0 60px ${appColor}20`,
            }}
          >
            {appInfo.icon}
          </div>
          
          {/* Title */}
          <h2 className="text-2xl font-bold text-white mb-3">
            {appInfo.name}
          </h2>
          
          {/* Description */}
          <p className="text-zinc-400 mb-8 leading-relaxed">
            {appInfo.description}
          </p>
          
          {/* Coming Soon Badge */}
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8"
            style={{ 
              backgroundColor: `${appColor}15`,
              color: appColor,
            }}
          >
            <Sparkles className="h-4 w-4" />
            <span>Coming Soon</span>
          </div>
          
          {/* Info text */}
          <p className="text-sm text-zinc-500 max-w-xs mx-auto">
            This app has been installed but doesn't have any active campaigns yet. 
            Check back soon for updates!
          </p>
          
          {/* Optional: Settings hint for admins */}
          <div className="mt-8 pt-6 border-t border-zinc-800/50">
            <div className="flex items-center justify-center gap-2 text-xs text-zinc-600">
              <Settings className="h-3.5 w-3.5" />
              <span>Right-click the app in the sidebar to customize</span>
            </div>
          </div>
        </div>
      </div>
    </AppContainer>
  )
}
