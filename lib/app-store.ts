/**
 * Module-level store for installed apps
 * This persists across React component lifecycle and navigations
 */

import { GuildAppInstallation, InstalledApp, StoreApp } from '@/types'
import { getStoreAppById, getGuildInstalledApps } from '@/lib/mock-data'

// Module-level storage (persists across React lifecycle until page refresh)
const installedAppsMap: Map<string, GuildAppInstallation[]> = new Map()

// Listeners for React components to subscribe to changes
const listeners: Set<() => void> = new Set()

// Snapshot version for React 18 useSyncExternalStore
let snapshotVersion = 0

// Map store app categories to emojis
function getCategoryEmoji(category: string): string {
  const emojiMap: Record<string, string> = {
    'Virality': '📢',
    'Onchain': '⛓️',
    'Video': '🎬',
    'Airdrops': '🪂',
    'Tools': '🛠️',
    'Dapps': '📱',
  }
  return emojiMap[category] || '📦'
}

// Convert a StoreApp to InstalledApp format
function storeAppToInstalledApp(storeApp: StoreApp, installedAt: Date = new Date()): InstalledApp {
  return {
    id: storeApp.id,
    type: storeApp.slug,
    name: storeApp.name,
    icon: getCategoryEmoji(storeApp.category),
    description: storeApp.shortDescription,
    color: storeApp.color,
    installedAt,
  }
}

// Notify all listeners of changes
function emitChange() {
  snapshotVersion++
  listeners.forEach(listener => listener())
}

/**
 * Get all installed apps for a guild (dynamic only - use getAllInstalledAppsForGuild for merged)
 */
export function getInstalledAppsForGuild(guildId: string): GuildAppInstallation[] {
  return installedAppsMap.get(guildId) || []
}

/**
 * Install an app for a guild
 * Returns the InstalledApp for navigation, or null if app not found
 */
export function installAppForGuild(
  guildId: string, 
  appId: string, 
  userId: string
): InstalledApp | null {
  const storeApp = getStoreAppById(appId)
  if (!storeApp) return null

  const installation: GuildAppInstallation = {
    appId,
    guildId,
    installedAt: new Date(),
    installedBy: userId,
  }

  const currentApps = installedAppsMap.get(guildId) || []
  
  // Don't add if already installed
  if (currentApps.some(app => app.appId === appId)) {
    return storeAppToInstalledApp(storeApp)
  }

  installedAppsMap.set(guildId, [...currentApps, installation])
  emitChange()

  return storeAppToInstalledApp(storeApp, installation.installedAt)
}

/**
 * Uninstall an app from a guild
 */
export function uninstallAppFromGuild(guildId: string, appId: string): void {
  const currentApps = installedAppsMap.get(guildId) || []
  const filteredApps = currentApps.filter(app => app.appId !== appId)
  
  if (filteredApps.length !== currentApps.length) {
    installedAppsMap.set(guildId, filteredApps)
    emitChange()
  }
}

/**
 * Check if an app is installed for a guild (checks both dynamic and mock data)
 */
export function isAppInstalledForGuild(guildId: string, appId: string): boolean {
  // Check dynamically installed apps
  const dynamicApps = installedAppsMap.get(guildId) || []
  if (dynamicApps.some(app => app.appId === appId)) return true
  
  // Check mock data apps
  const mockApps = getGuildInstalledApps(guildId)
  return mockApps.some(app => app.id === appId)
}

/**
 * Get all installed apps merged (mock data + dynamic)
 */
export function getAllInstalledAppsForGuild(guildId: string): InstalledApp[] {
  const mockApps = getGuildInstalledApps(guildId)
  const dynamicInstallations = installedAppsMap.get(guildId) || []

  // Convert dynamic installations to InstalledApp format
  const dynamicApps: InstalledApp[] = dynamicInstallations
    .map(installation => {
      const storeApp = getStoreAppById(installation.appId)
      if (!storeApp) return null
      return storeAppToInstalledApp(storeApp, installation.installedAt)
    })
    .filter((app): app is InstalledApp => app !== null)

  // Deduplicate by app type/slug (mock apps take precedence)
  const mockAppTypes = new Set(mockApps.map(app => app.type))
  const uniqueDynamicApps = dynamicApps.filter(app => !mockAppTypes.has(app.type))

  return [...mockApps, ...uniqueDynamicApps]
}

/**
 * Subscribe to store changes (for React useSyncExternalStore)
 */
export function subscribeToAppStore(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/**
 * Get snapshot version for useSyncExternalStore
 * Returns a number that changes when data changes
 */
export function getAppStoreSnapshot(): number {
  return snapshotVersion
}
