/**
 * Tests for lib/mock-data.ts social campaigns functionality
 * Tests the CRUD operations and data merging with persistence
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { SocialCampaignTask } from '@/types'

// Helper to get fresh module imports (since modules can cache state)
async function getModule() {
  const mod = await import('@/lib/mock-data')
  return mod
}

// Helper to get persistence module
async function getPersistenceModule() {
  const mod = await import('@/lib/persistence')
  return mod
}

// Sample task data
const sampleTasks: SocialCampaignTask[] = [
  { type: 'follow', targetAccount: '@testaccount' },
  { type: 'comment', targetPostUrl: 'https://twitter.com/test/status/123', guidelines: 'Be nice!' },
]

describe('createSocialCampaign', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('creates campaign with unique ID', async () => {
    const { createSocialCampaign } = await getModule()
    
    const campaign = createSocialCampaign(
      'guild-1',
      'Test Campaign',
      sampleTasks,
      'fcfs',
      'base',
      'USDC',
      1000,
      100
    )
    
    expect(campaign.id).toMatch(/^social-\d+$/)
    expect(campaign.guildId).toBe('guild-1')
    expect(campaign.name).toBe('Test Campaign')
  })

  it('calculates perWinnerReward correctly', async () => {
    const { createSocialCampaign } = await getModule()
    
    const campaign = createSocialCampaign(
      'guild-1',
      'Reward Test',
      sampleTasks,
      'fcfs',
      'base',
      'USDC',
      1000, // rewardPool
      100   // totalWinners
    )
    
    expect(campaign.perWinnerReward).toBe(10) // 1000 / 100 = 10
  })

  it('calculates serviceFee correctly (10%)', async () => {
    const { createSocialCampaign } = await getModule()
    
    const campaign = createSocialCampaign(
      'guild-1',
      'Fee Test',
      sampleTasks,
      'fcfs',
      'base',
      'USDC',
      1000, // rewardPool
      100
    )
    
    expect(campaign.serviceFee).toBe(100) // 10% of 1000
    expect(campaign.totalPayable).toBe(1100) // 1000 + 100
  })

  it('persists to localStorage immediately after creation', async () => {
    const { createSocialCampaign } = await getModule()
    
    createSocialCampaign(
      'guild-1',
      'Persist Test',
      sampleTasks,
      'fcfs',
      'base',
      'USDC',
      500,
      50
    )
    
    const stored = localStorage.getItem('airaa_demo_v2')
    expect(stored).not.toBeNull()
    
    const parsed = JSON.parse(stored!)
    expect(parsed.socialCampaigns['guild-1']).toBeDefined()
    expect(parsed.socialCampaigns['guild-1'].length).toBeGreaterThan(0)
    expect(parsed.socialCampaigns['guild-1'].some((c: any) => c.name === 'Persist Test')).toBe(true)
  })

  it('adds campaign to correct guild', async () => {
    const { createSocialCampaign, getSocialCampaigns } = await getModule()
    
    createSocialCampaign('guild-1', 'G1 Campaign', sampleTasks, 'fcfs', 'base', 'USDC', 100, 10)
    createSocialCampaign('guild-2', 'G2 Campaign', sampleTasks, 'raffle', 'ethereum', 'ETH', 200, 20)
    
    const g1Campaigns = getSocialCampaigns('guild-1')
    const g2Campaigns = getSocialCampaigns('guild-2')
    
    expect(g1Campaigns.some(c => c.name === 'G1 Campaign')).toBe(true)
    expect(g2Campaigns.some(c => c.name === 'G2 Campaign')).toBe(true)
    expect(g1Campaigns.some(c => c.name === 'G2 Campaign')).toBe(false)
  })

  it('sets correct default values', async () => {
    const { createSocialCampaign } = await getModule()
    
    const campaign = createSocialCampaign(
      'guild-1',
      'Defaults Test',
      sampleTasks,
      'fcfs',
      'base',
      'USDC',
      1000,
      100
    )
    
    expect(campaign.status).toBe('active')
    expect(campaign.participantsCount).toBe(0)
    expect(campaign.completedCount).toBe(0)
    expect(campaign.rewardsClaimedCount).toBe(0)
    expect(campaign.createdAt).toBeInstanceOf(Date)
  })

  it('accepts optional parameters', async () => {
    const { createSocialCampaign } = await getModule()
    
    const eligibilityFilters = { minFollowers: 1000, verifiedOnly: true }
    const endDate = new Date('2025-12-31')
    
    const campaign = createSocialCampaign(
      'guild-1',
      'Optional Params Test',
      sampleTasks,
      'fcfs',
      'base',
      'USDC',
      1000,
      100,
      eligibilityFilters,
      undefined, // kolList
      undefined, // kolRewardPerUser
      endDate
    )
    
    expect(campaign.eligibilityFilters).toEqual(eligibilityFilters)
    expect(campaign.endDate).toEqual(endDate)
  })

  it('handles customized distribution with KOL list', async () => {
    const { createSocialCampaign } = await getModule()
    
    const kolList = ['@influencer1', '@influencer2', '@influencer3']
    
    const campaign = createSocialCampaign(
      'guild-1',
      'KOL Campaign',
      sampleTasks,
      'customized',
      'base',
      'USDC',
      3000, // 3 KOLs * 1000 each
      3,
      undefined,
      kolList,
      1000 // per KOL reward
    )
    
    expect(campaign.distributionMethod).toBe('customized')
    expect(campaign.kolList).toEqual(kolList)
    expect(campaign.kolRewardPerUser).toBe(1000)
  })
})

describe('getSocialCampaigns', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns empty array for guild with no campaigns', async () => {
    const { getSocialCampaigns } = await getModule()
    
    const campaigns = getSocialCampaigns('nonexistent-guild')
    
    expect(campaigns).toEqual([])
  })

  it('returns only campaigns for specified guild', async () => {
    const { createSocialCampaign, getSocialCampaigns } = await getModule()
    
    createSocialCampaign('guild-1', 'G1 Only', sampleTasks, 'fcfs', 'base', 'USDC', 100, 10)
    createSocialCampaign('guild-2', 'G2 Only', sampleTasks, 'fcfs', 'base', 'USDC', 100, 10)
    
    const g1Campaigns = getSocialCampaigns('guild-1')
    
    expect(g1Campaigns.every(c => c.guildId === 'guild-1')).toBe(true)
  })

  it('returns campaigns from default guilds structure', async () => {
    const { getSocialCampaigns } = await getModule()
    
    // Default guilds should exist even without campaigns
    const g1Campaigns = getSocialCampaigns('guild-1')
    const g2Campaigns = getSocialCampaigns('guild-2')
    
    expect(Array.isArray(g1Campaigns)).toBe(true)
    expect(Array.isArray(g2Campaigns)).toBe(true)
  })
})

describe('getActiveSocialCampaigns', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('filters to only return active campaigns', async () => {
    const { createSocialCampaign, getActiveSocialCampaigns } = await getModule()
    
    // Create an active campaign
    createSocialCampaign('guild-1', 'Active Campaign', sampleTasks, 'fcfs', 'base', 'USDC', 100, 10)
    
    const activeCampaigns = getActiveSocialCampaigns('guild-1')
    
    expect(activeCampaigns.every(c => c.status === 'active')).toBe(true)
    expect(activeCampaigns.some(c => c.name === 'Active Campaign')).toBe(true)
  })

  it('returns empty array when no active campaigns exist', async () => {
    const { getActiveSocialCampaigns } = await getModule()
    
    const activeCampaigns = getActiveSocialCampaigns('nonexistent-guild')
    
    expect(activeCampaigns).toEqual([])
  })
})

describe('getSocialCampaignById', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('finds campaign by ID across all guilds', async () => {
    const { createSocialCampaign, getSocialCampaignById } = await getModule()
    
    const created = createSocialCampaign('guild-2', 'Find Me', sampleTasks, 'raffle', 'base', 'USDC', 100, 10)
    
    const found = getSocialCampaignById(created.id)
    
    expect(found).toBeDefined()
    expect(found?.name).toBe('Find Me')
    expect(found?.guildId).toBe('guild-2')
  })

  it('returns undefined for non-existent campaign ID', async () => {
    const { getSocialCampaignById } = await getModule()
    
    const found = getSocialCampaignById('nonexistent-campaign-id')
    
    expect(found).toBeUndefined()
  })
})

describe('calculateCampaignTotals', () => {
  it('calculates all totals correctly', async () => {
    const { calculateCampaignTotals } = await getModule()
    
    const totals = calculateCampaignTotals(1000, 50)
    
    expect(totals.perWinnerReward).toBe(20) // 1000 / 50
    expect(totals.serviceFee).toBe(100) // 10% of 1000
    expect(totals.totalPayable).toBe(1100) // 1000 + 100
  })

  it('handles zero winners', async () => {
    const { calculateCampaignTotals } = await getModule()
    
    const totals = calculateCampaignTotals(1000, 0)
    
    expect(totals.perWinnerReward).toBe(0)
    expect(totals.serviceFee).toBe(100)
    expect(totals.totalPayable).toBe(1100)
  })
})

describe('getSocialCampaignAnalytics', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns correct analytics summary', async () => {
    const { createSocialCampaign, getSocialCampaignAnalytics } = await getModule()
    
    createSocialCampaign('guild-1', 'Campaign 1', sampleTasks, 'fcfs', 'base', 'USDC', 100, 10)
    createSocialCampaign('guild-1', 'Campaign 2', sampleTasks, 'raffle', 'base', 'USDC', 200, 20)
    
    const analytics = getSocialCampaignAnalytics('guild-1')
    
    expect(analytics.totalCampaigns).toBeGreaterThanOrEqual(2)
    expect(analytics.activeCampaigns).toBeGreaterThanOrEqual(2)
    expect(typeof analytics.totalRewardsDistributed).toBe('number')
    expect(typeof analytics.totalParticipants).toBe('number')
  })

  it('returns zeros for guild with no campaigns', async () => {
    const { getSocialCampaignAnalytics } = await getModule()
    
    const analytics = getSocialCampaignAnalytics('empty-guild')
    
    expect(analytics.totalCampaigns).toBe(0)
    expect(analytics.activeCampaigns).toBe(0)
  })
})

describe('Persistence Integration', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('campaigns survive simulated page refresh', async () => {
    // First "session" - create campaign
    const { createSocialCampaign } = await getModule()
    const created = createSocialCampaign('guild-1', 'Persistent', sampleTasks, 'fcfs', 'base', 'USDC', 100, 10)
    const createdId = created.id
    
    // Simulate page refresh by getting fresh persistence module
    vi.resetModules()
    const { getPersistedSocialCampaigns } = await getPersistenceModule()
    
    // Check persistence layer directly
    const persisted = getPersistedSocialCampaigns('guild-1')
    expect(persisted.some(c => c.id === createdId)).toBe(true)
  })

  it('multiple campaigns per guild all persist correctly', async () => {
    const { createSocialCampaign } = await getModule()
    
    createSocialCampaign('guild-1', 'Campaign A', sampleTasks, 'fcfs', 'base', 'USDC', 100, 10)
    createSocialCampaign('guild-1', 'Campaign B', sampleTasks, 'raffle', 'base', 'USDC', 200, 20)
    createSocialCampaign('guild-1', 'Campaign C', sampleTasks, 'customized', 'base', 'USDC', 300, 30)
    
    const stored = JSON.parse(localStorage.getItem('airaa_demo_v2')!)
    const guild1Campaigns = stored.socialCampaigns['guild-1']
    
    expect(guild1Campaigns.length).toBeGreaterThanOrEqual(3)
    expect(guild1Campaigns.some((c: any) => c.name === 'Campaign A')).toBe(true)
    expect(guild1Campaigns.some((c: any) => c.name === 'Campaign B')).toBe(true)
    expect(guild1Campaigns.some((c: any) => c.name === 'Campaign C')).toBe(true)
  })

  it('preserves all campaign fields including dates', async () => {
    const { createSocialCampaign } = await getModule()
    
    const endDate = new Date('2025-06-15T00:00:00Z')
    const created = createSocialCampaign(
      'guild-1',
      'Full Fields Test',
      sampleTasks,
      'fcfs',
      'base',
      'USDC',
      1000,
      100,
      { minFollowers: 500 },
      undefined,
      undefined,
      endDate
    )
    
    // Read directly from localStorage and parse
    const stored = JSON.parse(localStorage.getItem('airaa_demo_v2')!)
    const campaign = stored.socialCampaigns['guild-1'].find((c: any) => c.id === created.id)
    
    expect(campaign).toBeDefined()
    expect(campaign.name).toBe('Full Fields Test')
    expect(campaign.distributionMethod).toBe('fcfs')
    expect(campaign.blockchain).toBe('base')
    expect(campaign.token).toBe('USDC')
    expect(campaign.rewardPool).toBe(1000)
    expect(campaign.totalWinners).toBe(100)
    expect(campaign.eligibilityFilters.minFollowers).toBe(500)
    // Dates are stored as ISO strings
    expect(typeof campaign.createdAt).toBe('string')
    expect(campaign.endDate).toBe('2025-06-15T00:00:00.000Z')
  })
})
