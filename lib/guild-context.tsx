'use client'

import { createContext, useContext, useState, useCallback, useMemo, useSyncExternalStore, ReactNode } from 'react'
import { Guild, GuildMember, InstalledApp, GuildAppInstallation } from '@/types'
import { 
  subscribeToAppStore, 
  getAppStoreSnapshot,
  installAppForGuild,
  uninstallAppFromGuild,
  isAppInstalledForGuild,
  getInstalledAppsForGuild,
  getAllInstalledAppsForGuild
} from '@/lib/app-store'

// Custom overrides for an app within a guild
export interface AppCustomization {
  appId: string
  customIcon?: string
  customName?: string
  customDescription?: string
}

interface GuildContextValue {
  guild: Guild
  members: GuildMember[]
  userRole: 'admin' | 'moderator' | 'member' | null
  
  // App customization
  appCustomizations: Record<string, AppCustomization>
  getAppCustomization: (appId: string) => AppCustomization | undefined
  setAppCustomization: (customization: AppCustomization) => void
  getCustomizedApp: (app: InstalledApp) => InstalledApp
  
  // App installation (from app store)
  installedStoreApps: GuildAppInstallation[]
  installApp: (appId: string, userId: string) => InstalledApp | null
  uninstallApp: (appId: string) => void
  isAppInstalled: (appId: string) => boolean
  getAppInstallation: (appId: string) => GuildAppInstallation | undefined
  
  // Merged installed apps (mock data + dynamically installed)
  allInstalledApps: InstalledApp[]
}

const GuildContext = createContext<GuildContextValue | null>(null)

interface GuildProviderProps {
  guild: Guild
  members: GuildMember[]
  userRole?: 'admin' | 'moderator' | 'member' | null
  children: ReactNode
}

export function GuildProvider({ 
  guild, 
  members, 
  userRole = 'member',
  children 
}: GuildProviderProps) {
  // Store app customizations by appId (kept in React state as it's UI-specific)
  const [appCustomizations, setAppCustomizations] = useState<Record<string, AppCustomization>>({})
  
  // Subscribe to the external app store for re-renders when apps change
  const storeSnapshot = useSyncExternalStore(
    subscribeToAppStore,
    getAppStoreSnapshot,
    getAppStoreSnapshot // Server snapshot (same as client for this use case)
  )

  // Get customization for a specific app
  const getAppCustomization = useCallback((appId: string): AppCustomization | undefined => {
    return appCustomizations[appId]
  }, [appCustomizations])

  // Set/update customization for an app
  const setAppCustomization = useCallback((customization: AppCustomization) => {
    setAppCustomizations(prev => ({
      ...prev,
      [customization.appId]: customization
    }))
  }, [])

  // Get an app with customizations applied
  const getCustomizedApp = useCallback((app: InstalledApp): InstalledApp => {
    const customization = appCustomizations[app.id]
    if (!customization) return app

    return {
      ...app,
      icon: customization.customIcon || app.icon,
      name: customization.customName || app.name,
      description: customization.customDescription || app.description,
    }
  }, [appCustomizations])

  // Install an app from the store - uses external store
  const installApp = useCallback((appId: string, userId: string): InstalledApp | null => {
    return installAppForGuild(guild.id, appId, userId)
  }, [guild.id])

  // Uninstall an app - uses external store
  const uninstallApp = useCallback((appId: string) => {
    uninstallAppFromGuild(guild.id, appId)
  }, [guild.id])

  // Check if an app is installed - uses external store
  const isAppInstalled = useCallback((appId: string): boolean => {
    return isAppInstalledForGuild(guild.id, appId)
  }, [guild.id])

  // Get installation details for an app
  const getAppInstallation = useCallback((appId: string): GuildAppInstallation | undefined => {
    const apps = getInstalledAppsForGuild(guild.id)
    return apps.find(app => app.appId === appId)
  }, [guild.id])

  // Get installed store apps (dynamic only)
  const installedStoreApps = useMemo((): GuildAppInstallation[] => {
    // This triggers re-computation when storeSnapshot changes
    void storeSnapshot
    return getInstalledAppsForGuild(guild.id)
  }, [guild.id, storeSnapshot])

  // Get all installed apps (mock + dynamic) - uses external store
  const allInstalledApps = useMemo((): InstalledApp[] => {
    // This triggers re-computation when storeSnapshot changes
    void storeSnapshot
    return getAllInstalledAppsForGuild(guild.id)
  }, [guild.id, storeSnapshot])

  return (
    <GuildContext.Provider 
      value={{ 
        guild, 
        members, 
        userRole,
        appCustomizations,
        getAppCustomization,
        setAppCustomization,
        getCustomizedApp,
        installedStoreApps,
        installApp,
        uninstallApp,
        isAppInstalled,
        getAppInstallation,
        allInstalledApps,
      }}
    >
      {children}
    </GuildContext.Provider>
  )
}

export function useGuild() {
  const context = useContext(GuildContext)
  if (!context) {
    throw new Error('useGuild must be used within a GuildProvider')
  }
  return context
}

// Optional hook that doesn't throw if outside provider
export function useGuildSafe() {
  return useContext(GuildContext)
}
