/**
 * Module-level store for installed apps
 * This persists across React component lifecycle and navigations
 * Now with localStorage persistence for demo mode
 */

import { GuildAppInstallation, InstalledApp, StoreApp } from '@/types'
import { getStoreAppById, getGuildInstalledApps } from '@/lib/mock-data'
import { 
  getAllPersistedInstalledApps, 
  addPersistedInstalledApp, 
  removePersistedInstalledApp,
  deletePersistedCampaignsByAppType
} from '@/lib/persistence'

// Module-level storage (persists across React lifecycle until page refresh)
const installedAppsMap: Map<string, GuildAppInstallation[]> = new Map()

// Track if we've initialized from localStorage (for hydration safety)
let isInitialized = false

// Initialize from persisted storage - called lazily on first client access
function ensureInitialized() {
  if (isInitialized) return
  if (typeof window === 'undefined') return
  
  isInitialized = true
  const persisted = getAllPersistedInstalledApps()
  for (const [guildId, apps] of Object.entries(persisted)) {
    installedAppsMap.set(guildId, apps)
  }
  // Note: We don't emit change during initialization to avoid
  // triggering subscribers before they expect data to be ready.
  // The data will be available on their next read.
}

// Listeners for React components to subscribe to changes
const listeners: Set<() => void> = new Set()

// Snapshot version for React 18 useSyncExternalStore
let snapshotVersion = 0

// Map store app categories to emojis
function getCategoryEmoji(category: string): string {
  const emojiMap: Record<string, string> = {
    'Campaigns': '🎯',
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
  ensureInitialized()
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
  ensureInitialized()
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

  // Update in-memory map
  installedAppsMap.set(guildId, [...currentApps, installation])
  
  // Persist to localStorage
  addPersistedInstalledApp(installation)
  
  emitChange()

  return storeAppToInstalledApp(storeApp, installation.installedAt)
}

/**
 * Uninstall an app from a guild
 */
export function uninstallAppFromGuild(guildId: string, appId: string): void {
  ensureInitialized()
  const currentApps = installedAppsMap.get(guildId) || []
  const filteredApps = currentApps.filter(app => app.appId !== appId)
  
  if (filteredApps.length !== currentApps.length) {
    // Update in-memory map
    installedAppsMap.set(guildId, filteredApps)
    
    // Persist to localStorage
    removePersistedInstalledApp(guildId, appId)
    
    emitChange()
  }
}

/**
 * Delete an app and all its associated campaign data
 * This completely removes the app and any campaigns created with it
 */
export function deleteAppWithData(guildId: string, appId: string, appType: string): void {
  // Delete associated campaign data first
  deletePersistedCampaignsByAppType(guildId, appType)
  
  // Then uninstall the app
  uninstallAppFromGuild(guildId, appId)
}

/**
 * Check if an app is a mock/default app (not dynamically installed)
 * Mock apps cannot be deleted
 */
export function isMockApp(guildId: string, appId: string): boolean {
  const mockApps = getGuildInstalledApps(guildId)
  return mockApps.some(app => app.id === appId)
}

/**
 * Check if an app is installed for a guild (checks both dynamic and mock data)
 */
export function isAppInstalledForGuild(guildId: string, appId: string): boolean {
  ensureInitialized()
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
  ensureInitialized()
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
 * Get all installed apps for SERVER rendering (no localStorage data)
 * Used to prevent hydration mismatch
 */
export function getAllInstalledAppsForGuildServer(guildId: string): InstalledApp[] {
  // Only return mock apps during SSR
  return getGuildInstalledApps(guildId)
}

/**
 * Subscribe to store changes (for React useSyncExternalStore)
 */
export function subscribeToAppStore(listener: () => void): () => void {
  listeners.add(listener)
  // Initialize on first subscription (client-side only)
  ensureInitialized()
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

/**
 * Get server snapshot for useSyncExternalStore
 * Always returns 0 since server doesn't have localStorage data
 */
export function getAppStoreServerSnapshot(): number {
  return 0
}

/**
 * Clear all dynamically installed apps (used by reset demo)
 * Note: This only clears the in-memory map, not localStorage
 * For full reset, use resetDemoData() from persistence.ts
 */
export function clearInstalledApps(): void {
  installedAppsMap.clear()
  isInitialized = false
  emitChange()
}
