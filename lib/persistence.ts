/**
 * Demo Storage Persistence Layer
 * 
 * Provides localStorage persistence for demo data with:
 * - Versioned schema for migrations
 * - Date field revival (JSON stringifies dates as strings)
 * - Change notification system for React re-renders
 * - Reset functionality for fresh demos
 * - SSR safety (no window access during server render)
 */

import { SocialCampaign, GuildAppInstallation, UnifiedCampaign } from '@/types'

// ============================================
// Schema Definition
// ============================================

const STORAGE_KEY = 'airaa_demo_v2'
const SCHEMA_VERSION = 2

/**
 * Schema for all persisted demo data (v2)
 * - Added unified campaigns store
 * - Deprecated socialCampaigns (migrated to campaigns)
 */
export interface DemoStorageSchema {
  version: number
  /** @deprecated Use campaigns instead - kept for migration */
  socialCampaigns: Record<string, SocialCampaign[]>
  installedApps: Record<string, GuildAppInstallation[]>
  /** Unified campaign store keyed by campaign ID */
  campaigns: Record<string, UnifiedCampaign>
}

/**
 * Empty default schema
 */
const DEFAULT_SCHEMA: DemoStorageSchema = {
  version: SCHEMA_VERSION,
  socialCampaigns: {},
  installedApps: {},
  campaigns: {},
}

// ============================================
// Date Field Registry
// ============================================

/**
 * Fields that contain Date objects and need revival after JSON parse
 * Format: 'entityType.fieldName' for top-level, or 'entityType.*.fieldName' for array items
 */
const DATE_FIELDS: Record<string, string[]> = {
  socialCampaigns: ['createdAt', 'endDate'],
  installedApps: ['installedAt'],
  campaigns: ['createdAt', 'endDate'],
}

/**
 * Revive Date fields in an object
 */
function reviveDates<T>(obj: T, dateFields: string[]): T {
  if (!obj || typeof obj !== 'object') return obj
  
  const result = { ...obj } as Record<string, unknown>
  
  for (const field of dateFields) {
    if (result[field] && typeof result[field] === 'string') {
      result[field] = new Date(result[field] as string)
    }
  }
  
  return result as T
}

/**
 * Revive dates in a record of arrays (e.g., socialCampaigns per guild)
 */
function reviveDatesInRecord<T>(
  record: Record<string, T[]>,
  dateFields: string[]
): Record<string, T[]> {
  const result: Record<string, T[]> = {}
  
  for (const [key, items] of Object.entries(record)) {
    result[key] = items.map(item => reviveDates(item, dateFields))
  }
  
  return result
}

/**
 * Revive dates in a flat record (e.g., campaigns keyed by ID)
 */
function reviveDatesInMap<T>(
  record: Record<string, T>,
  dateFields: string[]
): Record<string, T> {
  const result: Record<string, T> = {}
  
  for (const [key, item] of Object.entries(record)) {
    result[key] = reviveDates(item, dateFields)
  }
  
  return result
}

// ============================================
// Storage Operations
// ============================================

/**
 * Check if we're in a browser environment
 */
function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined'
}

/**
 * Load data from localStorage with migration support
 */
export function loadDemoData(): DemoStorageSchema {
  if (!isBrowser()) {
    return { ...DEFAULT_SCHEMA }
  }
  
  try {
    // Try loading v2 first
    let raw = localStorage.getItem(STORAGE_KEY)
    
    // If no v2 data, try loading v1 and migrate
    if (!raw) {
      const v1Raw = localStorage.getItem('airaa_demo_v1')
      if (v1Raw) {
        console.log('[DemoStorage] Migrating from v1 to v2...')
        const v1Data = JSON.parse(v1Raw)
        const migratedData = migrateV1ToV2(v1Data)
        saveDemoDataInternal(migratedData)
        // Clean up old v1 data
        localStorage.removeItem('airaa_demo_v1')
        return migratedData
      }
      return { ...DEFAULT_SCHEMA }
    }
    
    const parsed = JSON.parse(raw) as DemoStorageSchema
    
    // Version check
    if (parsed.version !== SCHEMA_VERSION) {
      console.warn('[DemoStorage] Schema version mismatch, resetting to defaults')
      return { ...DEFAULT_SCHEMA }
    }
    
    // Revive Date fields
    return {
      version: parsed.version,
      socialCampaigns: reviveDatesInRecord(
        parsed.socialCampaigns || {},
        DATE_FIELDS.socialCampaigns
      ),
      installedApps: reviveDatesInRecord(
        parsed.installedApps || {},
        DATE_FIELDS.installedApps
      ),
      campaigns: reviveDatesInMap(
        parsed.campaigns || {},
        DATE_FIELDS.campaigns
      ),
    }
  } catch (error) {
    console.error('[DemoStorage] Failed to load data, resetting to defaults:', error)
    return { ...DEFAULT_SCHEMA }
  }
}

/**
 * Migrate v1 schema to v2
 * Converts old socialCampaigns to unified campaigns format
 */
function migrateV1ToV2(v1Data: { socialCampaigns?: Record<string, SocialCampaign[]>; installedApps?: Record<string, GuildAppInstallation[]> }): DemoStorageSchema {
  const campaigns: Record<string, UnifiedCampaign> = {}
  
  // Migrate social campaigns to unified format
  if (v1Data.socialCampaigns) {
    for (const [guildId, guildCampaigns] of Object.entries(v1Data.socialCampaigns)) {
      for (const sc of guildCampaigns) {
        const unified: UnifiedCampaign = {
          id: sc.id,
          guildId: sc.guildId,
          guildName: '', // Will be filled by campaign store on load
          guildIcon: '',
          appType: 'social-tasks',
          appName: 'Social Tasks',
          name: sc.name,
          rewardPool: sc.rewardPool,
          perWinnerReward: sc.perWinnerReward,
          totalWinners: sc.totalWinners,
          token: sc.token,
          blockchain: sc.blockchain,
          status: sc.status === 'draft' ? 'draft' : 
                  sc.status === 'active' ? 'active' : 
                  sc.status === 'completed' ? 'completed' : 'cancelled',
          createdAt: new Date(sc.createdAt),
          endDate: sc.endDate ? new Date(sc.endDate) : undefined,
          participantsCount: sc.participantsCount,
          completedCount: sc.completedCount,
          config: {
            tasks: sc.tasks,
            distributionMethod: sc.distributionMethod,
            eligibilityFilters: sc.eligibilityFilters,
            kolList: sc.kolList,
            kolRewardPerUser: sc.kolRewardPerUser,
            serviceFee: sc.serviceFee,
            totalPayable: sc.totalPayable,
          }
        }
        campaigns[unified.id] = unified
      }
    }
  }
  
  return {
    version: SCHEMA_VERSION,
    socialCampaigns: {}, // Cleared after migration
    installedApps: v1Data.installedApps || {},
    campaigns,
  }
}

/**
 * Internal save without emitting change (used during migration)
 */
function saveDemoDataInternal(data: DemoStorageSchema): void {
  if (!isBrowser()) return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('[DemoStorage] Failed to save data:', error)
  }
}

/**
 * Save data to localStorage
 */
export function saveDemoData(data: DemoStorageSchema): void {
  if (!isBrowser()) {
    return
  }
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    emitChange()
  } catch (error) {
    console.error('[DemoStorage] Failed to save data:', error)
  }
}

/**
 * Reset all demo data
 */
export function resetDemoData(): void {
  if (!isBrowser()) {
    return
  }
  
  try {
    localStorage.removeItem(STORAGE_KEY)
    emitChange()
  } catch (error) {
    console.error('[DemoStorage] Failed to reset data:', error)
  }
}

/**
 * Reset and reload the page (for UI reset button)
 */
export function resetAndReload(): void {
  resetDemoData()
  if (isBrowser()) {
    window.location.reload()
  }
}

// ============================================
// Change Notification System
// ============================================

const listeners: Set<() => void> = new Set()
let snapshotVersion = 0

/**
 * Notify all listeners of changes
 */
function emitChange(): void {
  snapshotVersion++
  listeners.forEach(listener => listener())
}

/**
 * Subscribe to storage changes (for React useSyncExternalStore)
 */
export function subscribeToDemoStorage(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/**
 * Get snapshot version for useSyncExternalStore
 */
export function getDemoStorageSnapshot(): number {
  return snapshotVersion
}

// ============================================
// Entity-Specific Helpers
// ============================================

/**
 * Get social campaigns for a guild from persisted storage
 */
export function getPersistedSocialCampaigns(guildId: string): SocialCampaign[] {
  const data = loadDemoData()
  return data.socialCampaigns[guildId] || []
}

/**
 * Save social campaigns for a guild
 */
export function savePersistedSocialCampaigns(
  guildId: string,
  campaigns: SocialCampaign[]
): void {
  const data = loadDemoData()
  data.socialCampaigns[guildId] = campaigns
  saveDemoData(data)
}

/**
 * Add a social campaign
 */
export function addPersistedSocialCampaign(campaign: SocialCampaign): void {
  const data = loadDemoData()
  if (!data.socialCampaigns[campaign.guildId]) {
    data.socialCampaigns[campaign.guildId] = []
  }
  data.socialCampaigns[campaign.guildId].push(campaign)
  saveDemoData(data)
}

/**
 * Get all persisted social campaigns across all guilds
 */
export function getAllPersistedSocialCampaigns(): Record<string, SocialCampaign[]> {
  const data = loadDemoData()
  return data.socialCampaigns
}

/**
 * Get installed apps for a guild from persisted storage
 */
export function getPersistedInstalledApps(guildId: string): GuildAppInstallation[] {
  const data = loadDemoData()
  return data.installedApps[guildId] || []
}

/**
 * Save installed apps for a guild
 */
export function savePersistedInstalledApps(
  guildId: string,
  apps: GuildAppInstallation[]
): void {
  const data = loadDemoData()
  data.installedApps[guildId] = apps
  saveDemoData(data)
}

/**
 * Add an installed app
 */
export function addPersistedInstalledApp(installation: GuildAppInstallation): void {
  const data = loadDemoData()
  if (!data.installedApps[installation.guildId]) {
    data.installedApps[installation.guildId] = []
  }
  // Prevent duplicates
  const exists = data.installedApps[installation.guildId].some(
    app => app.appId === installation.appId
  )
  if (!exists) {
    data.installedApps[installation.guildId].push(installation)
    saveDemoData(data)
  }
}

/**
 * Remove an installed app
 */
export function removePersistedInstalledApp(guildId: string, appId: string): void {
  const data = loadDemoData()
  if (data.installedApps[guildId]) {
    data.installedApps[guildId] = data.installedApps[guildId].filter(
      app => app.appId !== appId
    )
    saveDemoData(data)
  }
}

/**
 * Get all persisted installed apps across all guilds
 */
export function getAllPersistedInstalledApps(): Record<string, GuildAppInstallation[]> {
  const data = loadDemoData()
  return data.installedApps
}

/**
 * Delete all campaigns for a guild by app type
 * Maps app type (slug) to the corresponding campaign storage
 */
export function deletePersistedCampaignsByAppType(guildId: string, appType: string): void {
  const data = loadDemoData()
  
  // Delete from unified campaigns store
  const campaignIds = Object.keys(data.campaigns)
  for (const id of campaignIds) {
    const campaign = data.campaigns[id]
    if (campaign.guildId === guildId && campaign.appType === appType) {
      delete data.campaigns[id]
    }
  }
  
  // Also clean up deprecated socialCampaigns if exists
  if (appType === 'social-tasks' && data.socialCampaigns[guildId]) {
    delete data.socialCampaigns[guildId]
  }
  
  saveDemoData(data)
}

// ============================================
// Unified Campaign Helpers
// ============================================

/**
 * Get all persisted unified campaigns
 */
export function getPersistedCampaigns(): Record<string, UnifiedCampaign> {
  const data = loadDemoData()
  return data.campaigns
}

/**
 * Get a single persisted campaign by ID
 */
export function getPersistedCampaign(campaignId: string): UnifiedCampaign | undefined {
  const data = loadDemoData()
  return data.campaigns[campaignId]
}

/**
 * Get all persisted campaigns for a specific guild
 */
export function getPersistedCampaignsByGuild(guildId: string): UnifiedCampaign[] {
  const data = loadDemoData()
  return Object.values(data.campaigns).filter(c => c.guildId === guildId)
}

/**
 * Get all persisted campaigns for a specific app type
 */
export function getPersistedCampaignsByApp(appType: string): UnifiedCampaign[] {
  const data = loadDemoData()
  return Object.values(data.campaigns).filter(c => c.appType === appType)
}

/**
 * Add a unified campaign to storage
 */
export function addPersistedCampaign(campaign: UnifiedCampaign): void {
  const data = loadDemoData()
  data.campaigns[campaign.id] = campaign
  saveDemoData(data)
}

/**
 * Update an existing unified campaign
 */
export function updatePersistedCampaign(campaignId: string, updates: Partial<UnifiedCampaign>): void {
  const data = loadDemoData()
  if (data.campaigns[campaignId]) {
    data.campaigns[campaignId] = { ...data.campaigns[campaignId], ...updates }
    saveDemoData(data)
  }
}

/**
 * Delete a unified campaign by ID
 */
export function deletePersistedCampaign(campaignId: string): void {
  const data = loadDemoData()
  delete data.campaigns[campaignId]
  saveDemoData(data)
}
