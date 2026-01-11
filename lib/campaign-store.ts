/**
 * Unified Campaign Store
 * 
 * Single source of truth for all campaigns across all apps and guilds.
 * Provides:
 * - CRUD operations for campaigns
 * - Query functions (by guild, by app type, all)
 * - Subscribe/notify system for React components
 * - Memory cache + localStorage persistence
 * - Seed data initialization
 */

import { 
  UnifiedCampaign, 
  CreateCampaignParams, 
  UNIFIED_APP_TYPE_INFO,
  UnifiedCampaignStatus 
} from '@/types'
import { 
  getPersistedCampaigns, 
  addPersistedCampaign, 
  updatePersistedCampaign,
  deletePersistedCampaign
} from '@/lib/persistence'
import { guilds } from '@/lib/mock-data'

// ============================================
// Module State
// ============================================

// In-memory cache for campaigns (keyed by campaign ID)
const campaignsMap: Map<string, UnifiedCampaign> = new Map()

// Track if we've initialized from localStorage/seed
let isInitialized = false

// Listeners for React components
const listeners: Set<() => void> = new Set()

// Snapshot version for useSyncExternalStore
let snapshotVersion = 0

// ============================================
// Initialization
// ============================================

/**
 * Initialize the store from persisted storage and seed data
 * Called lazily on first client access
 */
function ensureInitialized(): void {
  if (isInitialized) return
  if (typeof window === 'undefined') return
  
  isInitialized = true
  
  // Load persisted campaigns
  const persisted = getPersistedCampaigns()
  for (const [id, campaign] of Object.entries(persisted)) {
    // Hydrate guild info if missing
    const hydratedCampaign = hydrateGuildInfo(campaign)
    campaignsMap.set(id, hydratedCampaign)
  }
  
  // Note: Seed data is loaded separately via initializeWithSeedData()
  // This allows mock-data.ts to call it after defining seed campaigns
}

/**
 * Hydrate guild info for a campaign (in case it was stored without it)
 */
function hydrateGuildInfo(campaign: UnifiedCampaign): UnifiedCampaign {
  if (campaign.guildName && campaign.guildIcon) {
    return campaign
  }
  
  const guild = guilds.find(g => g.id === campaign.guildId)
  if (guild) {
    return {
      ...campaign,
      guildName: campaign.guildName || guild.name,
      guildIcon: campaign.guildIcon || guild.icon,
    }
  }
  
  return campaign
}

/**
 * Initialize the store with seed data (called from mock-data.ts)
 * Only adds campaigns that don't already exist in persisted storage
 */
export function initializeWithSeedData(seedCampaigns: UnifiedCampaign[]): void {
  ensureInitialized()
  
  let added = 0
  for (const campaign of seedCampaigns) {
    // Only add if not already in the map (persisted takes precedence)
    if (!campaignsMap.has(campaign.id)) {
      campaignsMap.set(campaign.id, campaign)
      added++
    }
  }
  
  if (added > 0) {
    console.log(`[CampaignStore] Initialized with ${added} seed campaigns`)
  }
}

// ============================================
// Change Notification
// ============================================

/**
 * Notify all listeners of changes
 */
function emitChange(): void {
  snapshotVersion++
  listeners.forEach(listener => listener())
}

/**
 * Subscribe to store changes (for React useSyncExternalStore)
 */
export function subscribeToCampaignStore(listener: () => void): () => void {
  listeners.add(listener)
  ensureInitialized()
  return () => {
    listeners.delete(listener)
  }
}

/**
 * Get snapshot version for useSyncExternalStore
 */
export function getCampaignStoreSnapshot(): number {
  return snapshotVersion
}

/**
 * Get server snapshot for useSyncExternalStore (SSR)
 */
export function getCampaignStoreServerSnapshot(): number {
  return 0
}

// ============================================
// CRUD Operations
// ============================================

/**
 * Create a new campaign
 * Returns the created campaign with generated ID
 */
export function createCampaign(params: CreateCampaignParams): UnifiedCampaign {
  ensureInitialized()
  
  const guild = guilds.find(g => g.id === params.guildId)
  const appInfo = UNIFIED_APP_TYPE_INFO[params.appType] || {
    name: params.appType,
    icon: '📦',
    color: '#6b7280'
  }
  
  const campaign: UnifiedCampaign = {
    id: `campaign-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    guildId: params.guildId,
    guildName: guild?.name || 'Unknown Guild',
    guildIcon: guild?.icon || '',
    appType: params.appType,
    appName: appInfo.name,
    name: params.name,
    description: params.description,
    thumbnail: params.thumbnail,
    rewardPool: params.rewardPool,
    perWinnerReward: params.perWinnerReward,
    totalWinners: params.totalWinners,
    token: params.token,
    blockchain: params.blockchain,
    status: 'active',
    createdAt: new Date(),
    endDate: params.endDate,
    participantsCount: 0,
    completedCount: 0,
    config: params.config,
  }
  
  // Add to memory cache
  campaignsMap.set(campaign.id, campaign)
  
  // Persist to localStorage
  addPersistedCampaign(campaign)
  
  emitChange()
  
  return campaign
}

/**
 * Get a campaign by ID
 */
export function getCampaign(campaignId: string): UnifiedCampaign | undefined {
  ensureInitialized()
  return campaignsMap.get(campaignId)
}

/**
 * Update a campaign
 */
export function updateCampaign(
  campaignId: string, 
  updates: Partial<Omit<UnifiedCampaign, 'id' | 'guildId' | 'appType' | 'createdAt'>>
): UnifiedCampaign | undefined {
  ensureInitialized()
  
  const existing = campaignsMap.get(campaignId)
  if (!existing) return undefined
  
  const updated: UnifiedCampaign = {
    ...existing,
    ...updates,
  }
  
  campaignsMap.set(campaignId, updated)
  updatePersistedCampaign(campaignId, updates)
  
  emitChange()
  
  return updated
}

/**
 * Delete a campaign
 */
export function deleteCampaign(campaignId: string): boolean {
  ensureInitialized()
  
  const existed = campaignsMap.has(campaignId)
  if (existed) {
    campaignsMap.delete(campaignId)
    deletePersistedCampaign(campaignId)
    emitChange()
  }
  
  return existed
}

// ============================================
// Query Functions
// ============================================

/**
 * Get all campaigns
 */
export function getAllCampaigns(): UnifiedCampaign[] {
  ensureInitialized()
  return Array.from(campaignsMap.values())
}

/**
 * Get all active campaigns
 */
export function getActiveCampaigns(): UnifiedCampaign[] {
  ensureInitialized()
  return Array.from(campaignsMap.values()).filter(c => c.status === 'active')
}

/**
 * Get campaigns by guild ID
 */
export function getCampaignsByGuild(guildId: string): UnifiedCampaign[] {
  ensureInitialized()
  return Array.from(campaignsMap.values()).filter(c => c.guildId === guildId)
}

/**
 * Get active campaigns by guild ID
 */
export function getActiveCampaignsByGuild(guildId: string): UnifiedCampaign[] {
  ensureInitialized()
  return Array.from(campaignsMap.values()).filter(
    c => c.guildId === guildId && c.status === 'active'
  )
}

/**
 * Get campaigns by app type
 */
export function getCampaignsByApp(appType: string): UnifiedCampaign[] {
  ensureInitialized()
  return Array.from(campaignsMap.values()).filter(c => c.appType === appType)
}

/**
 * Get active campaigns by app type
 */
export function getActiveCampaignsByApp(appType: string): UnifiedCampaign[] {
  ensureInitialized()
  return Array.from(campaignsMap.values()).filter(
    c => c.appType === appType && c.status === 'active'
  )
}

/**
 * Get campaigns by guild and app type
 */
export function getCampaignsByGuildAndApp(guildId: string, appType: string): UnifiedCampaign[] {
  ensureInitialized()
  return Array.from(campaignsMap.values()).filter(
    c => c.guildId === guildId && c.appType === appType
  )
}

/**
 * Get active campaigns by guild and app type
 */
export function getActiveCampaignsByGuildAndApp(guildId: string, appType: string): UnifiedCampaign[] {
  ensureInitialized()
  return Array.from(campaignsMap.values()).filter(
    c => c.guildId === guildId && c.appType === appType && c.status === 'active'
  )
}

/**
 * Get campaign count by status
 */
export function getCampaignCountByStatus(status: UnifiedCampaignStatus): number {
  ensureInitialized()
  return Array.from(campaignsMap.values()).filter(c => c.status === status).length
}

/**
 * Get total rewards distributed across all campaigns
 */
export function getTotalRewardsInCampaigns(): number {
  ensureInitialized()
  return Array.from(campaignsMap.values())
    .filter(c => c.status === 'active')
    .reduce((sum, c) => sum + c.rewardPool, 0)
}

// ============================================
// Utility Functions
// ============================================

/**
 * Clear all campaigns (for reset/demo purposes)
 */
export function clearCampaigns(): void {
  campaignsMap.clear()
  isInitialized = false
  emitChange()
}

/**
 * Get campaigns map size (for debugging)
 */
export function getCampaignCount(): number {
  ensureInitialized()
  return campaignsMap.size
}
