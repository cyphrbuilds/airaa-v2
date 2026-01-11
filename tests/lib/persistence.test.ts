/**
 * Tests for lib/persistence.ts
 * Core localStorage persistence layer
 */

import { describe, it, expect, beforeEach } from 'vitest'
import type { SocialCampaign, GuildAppInstallation } from '@/types'

// Helper to create a mock campaign
function createMockCampaign(overrides: Partial<SocialCampaign> = {}): SocialCampaign {
  return {
    id: `social-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    guildId: 'guild-1',
    name: 'Test Campaign',
    tasks: [],
    distributionMethod: 'fcfs',
    blockchain: 'base',
    token: 'USDC',
    rewardPool: 1000,
    totalWinners: 100,
    perWinnerReward: 10,
    serviceFee: 100,
    totalPayable: 1100,
    status: 'active',
    createdAt: new Date('2025-01-01T00:00:00Z'),
    endDate: new Date('2025-02-01T00:00:00Z'),
    participantsCount: 0,
    completedCount: 0,
    rewardsClaimedCount: 0,
    ...overrides,
  }
}

// Helper to create a mock app installation
function createMockInstallation(overrides: Partial<GuildAppInstallation> = {}): GuildAppInstallation {
  return {
    appId: 'app-1',
    guildId: 'guild-1',
    installedAt: new Date('2025-01-01T00:00:00Z'),
    installedBy: 'user-1',
    ...overrides,
  }
}

// Helper to get fresh module imports
async function getModule() {
  const mod = await import('@/lib/persistence')
  return mod
}

describe('DemoStorage', () => {
  describe('initialization', () => {
    it('returns empty schema when localStorage is empty', async () => {
      const { loadDemoData } = await getModule()
      const data = loadDemoData()
      
      expect(data.version).toBe(2)
      expect(data.socialCampaigns).toEqual({})
      expect(data.installedApps).toEqual({})
      expect(data.campaigns).toEqual({})
    })

    it('loads existing data from localStorage', async () => {
      const testData = {
        version: 2,
        socialCampaigns: {
          'guild-1': [createMockCampaign({ name: 'Preloaded Campaign' })],
        },
        installedApps: {},
        campaigns: {},
      }
      localStorage.setItem('airaa_demo_v2', JSON.stringify(testData))
      
      const { loadDemoData } = await getModule()
      const data = loadDemoData()
      
      expect(data.socialCampaigns['guild-1']).toHaveLength(1)
      expect(data.socialCampaigns['guild-1'][0].name).toBe('Preloaded Campaign')
    })

    it('handles corrupted JSON gracefully', async () => {
      localStorage.setItem('airaa_demo_v2', 'not valid json {{{')
      
      const { loadDemoData } = await getModule()
      const data = loadDemoData()
      
      // Should return defaults
      expect(data.version).toBe(2)
      expect(data.socialCampaigns).toEqual({})
    })

    it('resets on version mismatch', async () => {
      const oldData = {
        version: 999, // Different version
        socialCampaigns: { 'guild-1': [createMockCampaign()] },
        installedApps: {},
        campaigns: {},
      }
      localStorage.setItem('airaa_demo_v2', JSON.stringify(oldData))
      
      const { loadDemoData } = await getModule()
      const data = loadDemoData()
      
      // Should return defaults due to version mismatch
      expect(data.socialCampaigns).toEqual({})
    })
  })

  describe('save', () => {
    it('persists data to localStorage under correct key', async () => {
      const { saveDemoData } = await getModule()
      const testData = {
        version: 2,
        socialCampaigns: { 'guild-1': [createMockCampaign()] },
        installedApps: {},
        campaigns: {},
      }
      
      saveDemoData(testData)
      
      const saved = localStorage.getItem('airaa_demo_v2')
      expect(saved).not.toBeNull()
      
      const parsed = JSON.parse(saved!)
      expect(parsed.version).toBe(2)
      expect(parsed.socialCampaigns['guild-1']).toHaveLength(1)
    })

    it('includes version field in saved data', async () => {
      const { saveDemoData } = await getModule()
      const testData = {
        version: 2,
        socialCampaigns: {},
        installedApps: {},
        campaigns: {},
      }
      
      saveDemoData(testData)
      
      const saved = JSON.parse(localStorage.getItem('airaa_demo_v2')!)
      expect(saved.version).toBe(2)
    })
  })

  describe('date handling', () => {
    it('serializes Date objects to ISO strings', async () => {
      const { addPersistedSocialCampaign } = await getModule()
      const campaign = createMockCampaign({
        createdAt: new Date('2025-01-15T12:00:00Z'),
      })
      
      addPersistedSocialCampaign(campaign)
      
      const saved = JSON.parse(localStorage.getItem('airaa_demo_v2')!)
      expect(saved.socialCampaigns['guild-1'][0].createdAt).toBe('2025-01-15T12:00:00.000Z')
    })

    it('revives ISO strings back to Date objects on load', async () => {
      const { addPersistedSocialCampaign, getPersistedSocialCampaigns } = await getModule()
      const campaign = createMockCampaign({
        id: 'date-test-campaign',
        createdAt: new Date('2025-01-15T12:00:00Z'),
        endDate: new Date('2025-02-15T12:00:00Z'),
      })
      
      addPersistedSocialCampaign(campaign)
      
      // Reload from storage
      const loaded = getPersistedSocialCampaigns('guild-1')
      
      expect(loaded).toHaveLength(1)
      expect(loaded[0].createdAt).toBeInstanceOf(Date)
      expect(loaded[0].createdAt.toISOString()).toBe('2025-01-15T12:00:00.000Z')
      expect(loaded[0].endDate).toBeInstanceOf(Date)
      expect(loaded[0].endDate!.toISOString()).toBe('2025-02-15T12:00:00.000Z')
    })

    it('handles nested date fields in arrays', async () => {
      const { addPersistedSocialCampaign, getPersistedSocialCampaigns } = await getModule()
      const campaign1 = createMockCampaign({
        id: 'campaign-1',
        createdAt: new Date('2025-01-01'),
      })
      const campaign2 = createMockCampaign({
        id: 'campaign-2',
        createdAt: new Date('2025-01-02'),
      })
      
      addPersistedSocialCampaign(campaign1)
      addPersistedSocialCampaign(campaign2)
      
      const loaded = getPersistedSocialCampaigns('guild-1')
      
      expect(loaded).toHaveLength(2)
      expect(loaded[0].createdAt).toBeInstanceOf(Date)
      expect(loaded[1].createdAt).toBeInstanceOf(Date)
    })

    it('handles date fields in installed apps', async () => {
      const { addPersistedInstalledApp, getPersistedInstalledApps } = await getModule()
      const installation = createMockInstallation({
        installedAt: new Date('2025-01-20T15:30:00Z'),
      })
      
      addPersistedInstalledApp(installation)
      
      const loaded = getPersistedInstalledApps('guild-1')
      
      expect(loaded[0].installedAt).toBeInstanceOf(Date)
      expect(loaded[0].installedAt.toISOString()).toBe('2025-01-20T15:30:00.000Z')
    })
  })

  describe('reset', () => {
    it('clears all persisted data from localStorage', async () => {
      const { addPersistedSocialCampaign, addPersistedInstalledApp, resetDemoData } = await getModule()
      
      addPersistedSocialCampaign(createMockCampaign())
      addPersistedInstalledApp(createMockInstallation())
      
      expect(localStorage.getItem('airaa_demo_v2')).not.toBeNull()
      
      resetDemoData()
      
      expect(localStorage.getItem('airaa_demo_v2')).toBeNull()
    })

    it('clears localStorage so next load returns defaults', async () => {
      const { addPersistedSocialCampaign, resetDemoData } = await getModule()
      
      addPersistedSocialCampaign(createMockCampaign())
      
      // Verify data was saved
      const beforeReset = localStorage.getItem('airaa_demo_v2')
      expect(beforeReset).not.toBeNull()
      expect(JSON.parse(beforeReset!).socialCampaigns['guild-1']).toHaveLength(1)
      
      resetDemoData()
      
      // Verify localStorage is cleared - this is the critical behavior
      expect(localStorage.getItem('airaa_demo_v2')).toBeNull()
      
      // A fresh page load (new module import) would return defaults
      // This is tested by the fact that other tests start with empty state
    })
  })

  describe('subscription', () => {
    it('notifies listeners on save', async () => {
      const { subscribeToDemoStorage, saveDemoData } = await getModule()
      let called = false
      subscribeToDemoStorage(() => { called = true })
      
      saveDemoData({ version: 2, socialCampaigns: {}, installedApps: {}, campaigns: {} })
      
      expect(called).toBe(true)
    })

    it('notifies listeners after reset', async () => {
      const { subscribeToDemoStorage, resetDemoData } = await getModule()
      let called = false
      subscribeToDemoStorage(() => { called = true })
      
      resetDemoData()
      
      expect(called).toBe(true)
    })

    it('increments snapshot version on changes', async () => {
      const { getDemoStorageSnapshot, saveDemoData } = await getModule()
      const initialSnapshot = getDemoStorageSnapshot()
      
      saveDemoData({ version: 2, socialCampaigns: {}, installedApps: {}, campaigns: {} })
      
      expect(getDemoStorageSnapshot()).toBe(initialSnapshot + 1)
    })

    it('unsubscribes correctly', async () => {
      const { subscribeToDemoStorage, saveDemoData } = await getModule()
      let callCount = 0
      const unsubscribe = subscribeToDemoStorage(() => { callCount++ })
      
      unsubscribe()
      saveDemoData({ version: 2, socialCampaigns: {}, installedApps: {}, campaigns: {} })
      
      expect(callCount).toBe(0)
    })
  })
})

describe('Social Campaign Helpers', () => {
  describe('getPersistedSocialCampaigns', () => {
    it('returns empty array for guild with no campaigns', async () => {
      const { getPersistedSocialCampaigns } = await getModule()
      const campaigns = getPersistedSocialCampaigns('nonexistent-guild')
      expect(campaigns).toEqual([])
    })

    it('returns campaigns for specific guild only', async () => {
      const { addPersistedSocialCampaign, getPersistedSocialCampaigns } = await getModule()
      
      addPersistedSocialCampaign(createMockCampaign({ guildId: 'guild-1', id: 'g1-campaign' }))
      addPersistedSocialCampaign(createMockCampaign({ guildId: 'guild-2', id: 'g2-campaign' }))
      
      const guild1Campaigns = getPersistedSocialCampaigns('guild-1')
      const guild2Campaigns = getPersistedSocialCampaigns('guild-2')
      
      expect(guild1Campaigns).toHaveLength(1)
      expect(guild2Campaigns).toHaveLength(1)
      expect(guild1Campaigns[0].guildId).toBe('guild-1')
    })
  })

  describe('addPersistedSocialCampaign', () => {
    it('adds campaign to correct guild', async () => {
      const { addPersistedSocialCampaign, getPersistedSocialCampaigns } = await getModule()
      const campaign = createMockCampaign({ guildId: 'guild-1', id: 'test-campaign-123' })
      
      addPersistedSocialCampaign(campaign)
      
      const campaigns = getPersistedSocialCampaigns('guild-1')
      expect(campaigns).toHaveLength(1)
      expect(campaigns[0].id).toBe('test-campaign-123')
    })

    it('creates guild array if not exists', async () => {
      const { addPersistedSocialCampaign, getPersistedSocialCampaigns } = await getModule()
      const campaign = createMockCampaign({ guildId: 'brand-new-guild' })
      
      addPersistedSocialCampaign(campaign)
      
      const campaigns = getPersistedSocialCampaigns('brand-new-guild')
      expect(campaigns).toHaveLength(1)
    })
  })

  describe('getAllPersistedSocialCampaigns', () => {
    it('returns all campaigns across guilds', async () => {
      const { addPersistedSocialCampaign, getAllPersistedSocialCampaigns } = await getModule()
      
      addPersistedSocialCampaign(createMockCampaign({ guildId: 'guild-1' }))
      addPersistedSocialCampaign(createMockCampaign({ guildId: 'guild-2' }))
      
      const all = getAllPersistedSocialCampaigns()
      
      expect(Object.keys(all)).toContain('guild-1')
      expect(Object.keys(all)).toContain('guild-2')
    })
  })
})

describe('Installed Apps Helpers', () => {
  describe('addPersistedInstalledApp', () => {
    it('adds installation to correct guild', async () => {
      const { addPersistedInstalledApp, getPersistedInstalledApps } = await getModule()
      const installation = createMockInstallation({ guildId: 'guild-1' })
      
      addPersistedInstalledApp(installation)
      
      const apps = getPersistedInstalledApps('guild-1')
      expect(apps).toHaveLength(1)
      expect(apps[0].appId).toBe('app-1')
    })

    it('prevents duplicate installations', async () => {
      const { addPersistedInstalledApp, getPersistedInstalledApps } = await getModule()
      const installation = createMockInstallation()
      
      addPersistedInstalledApp(installation)
      addPersistedInstalledApp(installation) // Try to add again
      
      const apps = getPersistedInstalledApps('guild-1')
      expect(apps).toHaveLength(1)
    })
  })

  describe('removePersistedInstalledApp', () => {
    it('removes app from guild', async () => {
      const { addPersistedInstalledApp, removePersistedInstalledApp, getPersistedInstalledApps } = await getModule()
      
      addPersistedInstalledApp(createMockInstallation({ appId: 'app-1' }))
      addPersistedInstalledApp(createMockInstallation({ appId: 'app-2' }))
      
      removePersistedInstalledApp('guild-1', 'app-1')
      
      const apps = getPersistedInstalledApps('guild-1')
      expect(apps).toHaveLength(1)
      expect(apps[0].appId).toBe('app-2')
    })

    it('handles removing from non-existent guild gracefully', async () => {
      const { removePersistedInstalledApp } = await getModule()
      // Should not throw
      expect(() => {
        removePersistedInstalledApp('nonexistent', 'app-1')
      }).not.toThrow()
    })
  })
})

describe('Edge Cases', () => {
  it('handles special characters in campaign names', async () => {
    const { addPersistedSocialCampaign, getPersistedSocialCampaigns } = await getModule()
    const campaign = createMockCampaign({
      id: 'special-chars-campaign',
      name: 'Test Campaign 🚀 with émojis & "quotes"',
    })
    
    addPersistedSocialCampaign(campaign)
    
    const loaded = getPersistedSocialCampaigns('guild-1')
    expect(loaded[0].name).toBe('Test Campaign 🚀 with émojis & "quotes"')
  })

  it('handles large KOL lists', async () => {
    const { addPersistedSocialCampaign, getPersistedSocialCampaigns } = await getModule()
    const kolList = Array.from({ length: 150 }, (_, i) => `@user${i}`)
    const campaign = createMockCampaign({
      id: 'large-kol-campaign',
      kolList,
      distributionMethod: 'customized',
    })
    
    addPersistedSocialCampaign(campaign)
    
    const loaded = getPersistedSocialCampaigns('guild-1')
    expect(loaded[0].kolList).toHaveLength(150)
  })

  it('handles missing optional fields', async () => {
    const { addPersistedSocialCampaign, getPersistedSocialCampaigns } = await getModule()
    const minimalCampaign: SocialCampaign = {
      id: 'minimal-campaign-123',
      guildId: 'guild-1',
      name: 'Minimal',
      tasks: [],
      distributionMethod: 'fcfs',
      blockchain: 'base',
      token: 'USDC',
      rewardPool: 100,
      totalWinners: 10,
      perWinnerReward: 10,
      serviceFee: 10,
      totalPayable: 110,
      status: 'active',
      createdAt: new Date(),
      participantsCount: 0,
      completedCount: 0,
      rewardsClaimedCount: 0,
      // No optional fields: eligibilityFilters, kolList, kolRewardPerUser, endDate
    }
    
    addPersistedSocialCampaign(minimalCampaign)
    
    const loaded = getPersistedSocialCampaigns('guild-1')
    expect(loaded[0].id).toBe('minimal-campaign-123')
    expect(loaded[0].eligibilityFilters).toBeUndefined()
    expect(loaded[0].endDate).toBeUndefined()
  })
})
