/**
 * API Abstraction Layer
 * 
 * This module provides a centralized abstraction for all data fetching operations.
 * Currently uses mock data from lib/mock-data.ts, but designed to be easily
 * replaced with real API calls when a backend is integrated.
 * 
 * Usage:
 * import { api } from '@/lib/api'
 * const guilds = await api.guilds.getAll()
 * const campaign = await api.campaigns.getById('camp-1')
 */

import {
  Guild,
  Campaign,
  GuildMember,
  Announcement,
  LeaderboardEntry,
  LeaderboardUser,
  LeaderboardGuild,
  UserCampaignStats,
  InstalledApp,
  TwitterPost,
  RewardPayout,
  ChatMessage,
  CampaignType,
  User,
  CampaignHistory,
  PayoutHistory,
  ActivityData,
  SupportConversation,
  SupportMessage,
} from '@/types'

import {
  guilds,
  campaigns,
  guildMembers,
  announcements,
  leaderboardUsers,
  leaderboardGuilds,
  currentUser,
  installedApps,
  twitterPosts,
  recentPayouts,
  chatMessages,
  campaignHistory,
  payoutHistory,
  activityData,
  getSupportConversations,
  getSupportMessages,
  getOrCreateSupportConversation,
  addSupportMessage,
  markConversationAsRead,
} from '@/lib/mock-data'

// Simulate network delay for realistic UX testing
const SIMULATE_DELAY = false
const DELAY_MS = 300

async function delay<T>(data: T): Promise<T> {
  if (SIMULATE_DELAY) {
    await new Promise(resolve => setTimeout(resolve, DELAY_MS))
  }
  return data
}

// ============================================================================
// GUILDS API
// ============================================================================

export const guildsApi = {
  /**
   * Get all guilds
   */
  async getAll(): Promise<Guild[]> {
    return delay(guilds)
  },

  /**
   * Get a single guild by ID
   */
  async getById(id: string): Promise<Guild | undefined> {
    const guild = guilds.find(g => g.id === id)
    return delay(guild)
  },

  /**
   * Get guilds the current user has joined
   */
  async getJoinedGuilds(userId: string): Promise<Guild[]> {
    const user = userId === currentUser.id ? currentUser : null
    if (!user) return delay([])
    return delay(guilds.filter(g => user.joinedGuilds.includes(g.id)))
  },

  /**
   * Get featured guilds (with active campaigns, sorted by rewards)
   */
  async getFeatured(limit: number = 6): Promise<Guild[]> {
    const featured = [...guilds]
      .filter(g => g.activeCampaigns > 0)
      .sort((a, b) => b.totalRewardsDistributed - a.totalRewardsDistributed)
      .slice(0, limit)
    return delay(featured)
  },

  /**
   * Get guild members
   */
  async getMembers(guildId: string): Promise<GuildMember[]> {
    // In a real implementation, this would filter by guildId
    return delay(guildMembers)
  },

  /**
   * Get guild announcements
   */
  async getAnnouncements(guildId: string): Promise<Announcement[]> {
    // In a real implementation, this would filter by guildId
    return delay(announcements)
  },

  /**
   * Get installed apps for a guild
   */
  async getInstalledApps(guildId: string): Promise<InstalledApp[]> {
    return delay(installedApps[guildId] || [])
  },

  /**
   * Get Twitter/X posts for a guild
   */
  async getTwitterPosts(guildId: string): Promise<TwitterPost[]> {
    return delay(twitterPosts[guildId] || [])
  },

  /**
   * Get user's role in a guild
   */
  async getUserRole(guildId: string, userId: string): Promise<'admin' | 'moderator' | 'member' | null> {
    // Mock implementation
    if (guildId === 'guild-1') return delay('admin')
    if (guildId === 'guild-2') return delay('member')
    return delay(null)
  },
}

// ============================================================================
// CAMPAIGNS API
// ============================================================================

export const campaignsApi = {
  /**
   * Get all campaigns
   */
  async getAll(): Promise<Campaign[]> {
    return delay(campaigns)
  },

  /**
   * Get a single campaign by ID
   */
  async getById(id: string): Promise<Campaign | undefined> {
    const campaign = campaigns.find(c => c.id === id)
    return delay(campaign)
  },

  /**
   * Get campaigns by guild
   */
  async getByGuild(guildId: string): Promise<Campaign[]> {
    return delay(campaigns.filter(c => c.guildId === guildId))
  },

  /**
   * Get campaigns by type within a guild
   */
  async getByType(guildId: string, type: CampaignType): Promise<Campaign[]> {
    return delay(campaigns.filter(c => c.guildId === guildId && c.type === type))
  },

  /**
   * Get active campaigns
   */
  async getActive(): Promise<Campaign[]> {
    return delay(campaigns.filter(c => c.status === 'active'))
  },

  /**
   * Get featured campaigns
   */
  async getFeatured(): Promise<Campaign[]> {
    return delay(campaigns.filter(c => c.featured && c.status === 'active'))
  },

  /**
   * Get "For You" personalized campaigns
   */
  async getForYou(): Promise<Campaign[]> {
    return delay(campaigns.filter(c => c.forYou && c.status === 'active'))
  },

  /**
   * Get campaign leaderboard
   */
  async getLeaderboard(campaignId: string): Promise<LeaderboardEntry[]> {
    // Create deterministic leaderboard based on campaignId
    const displayNames = [
      'Thriver🏆🏆', 'HknNFT 🐕🦌', 'katexbt.hl', 'Aether Midas ⌘⚔',
      'cryptopsihoz', 'DeFi_Wizard', 'Web3_Builder', 'Alpha_Hunter',
      'Yield_Farmer', 'NFT_Collector'
    ]

    const sampleConnections = [
      'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=conn1',
      'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=conn2',
      'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=conn3',
      'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=conn4',
    ]

    const seed = campaignId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)

    const leaderboard = guildMembers.slice(0, 10).map((member, index) => {
      const baseMultiplier = 15 - (index * 1.2)
      const variance = ((seed + index * 17) % 20) / 10 - 1
      const multiplier = Math.max(1, baseMultiplier + variance)

      const baseAura = 12 - (index * 1)
      const auraVariance = ((seed + index * 13) % 20) / 10 - 1
      const auraPercent = Math.max(1, baseAura + auraVariance)

      const score = ((seed * (index + 1) * 7) % 50000) + 10000
      const payout = ((seed * (index + 1) * 3) % 500) + 100
      const connectionsCount = ((seed + index) % 3) + 2

      return {
        rank: index + 1,
        userId: member.id,
        username: displayNames[index] || member.username,
        avatar: member.avatar,
        score: score,
        estimatedPayout: payout,
        multiplier: parseFloat(multiplier.toFixed(1)),
        auraPercent: parseFloat(auraPercent.toFixed(2)),
        socialHandle: member.username,
        connections: sampleConnections.slice(0, connectionsCount)
      }
    })

    return delay(leaderboard)
  },

  /**
   * Get user's stats for a campaign
   */
  async getUserStats(campaignId: string, userId: string): Promise<UserCampaignStats> {
    const hash = campaignId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return delay({
      rank: (hash % 20) + 1,
      score: ((hash * 17) % 30000) + 5000,
      estimatedReward: ((hash * 7) % 300) + 50,
      isParticipating: (hash % 3) !== 0
    })
  },
}

// ============================================================================
// LEADERBOARD API
// ============================================================================

export const leaderboardApi = {
  /**
   * Get global user leaderboard
   */
  async getUsers(): Promise<LeaderboardUser[]> {
    return delay(leaderboardUsers)
  },

  /**
   * Get global guild leaderboard
   */
  async getGuilds(): Promise<LeaderboardGuild[]> {
    return delay(leaderboardGuilds)
  },
}

// ============================================================================
// USER API
// ============================================================================

export const userApi = {
  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<User> {
    return delay(currentUser)
  },

  /**
   * Get user by ID
   */
  async getById(id: string): Promise<User | undefined> {
    if (id === currentUser.id) {
      return delay(currentUser)
    }
    return delay(undefined)
  },

  /**
   * Get user's campaign history
   */
  async getCampaignHistory(userId: string): Promise<CampaignHistory[]> {
    return delay(campaignHistory)
  },

  /**
   * Get user's payout history
   */
  async getPayoutHistory(userId: string): Promise<PayoutHistory[]> {
    return delay(payoutHistory)
  },
}

// ============================================================================
// CHAT API
// ============================================================================

export const chatApi = {
  /**
   * Get chat messages for a guild
   */
  async getMessages(guildId: string): Promise<ChatMessage[]> {
    return delay(chatMessages[guildId] || [])
  },

  /**
   * Send a chat message (mock - just returns the message)
   */
  async sendMessage(
    guildId: string,
    content: string,
    authorId: string,
    replyToId?: string
  ): Promise<ChatMessage> {
    const author = guildMembers.find(m => m.id === authorId)
    const replyTo = replyToId
      ? chatMessages[guildId]?.find(m => m.id === replyToId)
      : undefined

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      guildId,
      content,
      authorId,
      authorUsername: author?.username || 'Unknown',
      authorAvatar: author?.avatar || '',
      authorRole: author?.role || 'member',
      timestamp: new Date(),
      reactions: [],
      mentions: [],
      replyToId,
      replyToUsername: replyTo?.authorUsername,
    }

    return delay(newMessage)
  },
}

// ============================================================================
// ANALYTICS API
// ============================================================================

export const analyticsApi = {
  /**
   * Get activity data for charts
   */
  async getActivityData(): Promise<ActivityData[]> {
    return delay(activityData)
  },

  /**
   * Get recent reward payouts
   */
  async getRecentPayouts(): Promise<RewardPayout[]> {
    return delay(recentPayouts)
  },

  /**
   * Get total rewards distributed across all guilds
   */
  async getTotalRewardsDistributed(): Promise<number> {
    const total = guilds.reduce((acc, guild) => acc + guild.totalRewardsDistributed, 0)
    return delay(total)
  },
}

// ============================================================================
// SUPPORT API
// ============================================================================

export const supportApi = {
  /**
   * Get all support conversations for a guild (admin use)
   * @param guildId - The guild to get conversations for
   * @returns Array of support conversations sorted by most recent
   */
  async getConversations(guildId: string): Promise<SupportConversation[]> {
    const conversations = getSupportConversations(guildId)
    return delay(conversations)
  },

  /**
   * Get messages for a specific conversation
   * @param conversationId - The conversation to get messages for
   * @returns Array of messages in chronological order
   */
  async getMessages(conversationId: string): Promise<SupportMessage[]> {
    const messages = getSupportMessages(conversationId)
    return delay(messages)
  },

  /**
   * Get or create a support conversation for a member
   * Used when a member opens support chat - creates if doesn't exist
   * @param guildId - The guild the conversation belongs to
   * @param memberId - The member starting/continuing the conversation
   * @param memberUsername - Display name of the member
   * @param memberAvatar - Avatar URL of the member
   * @returns The existing or newly created conversation
   */
  async getOrCreateConversation(
    guildId: string,
    memberId: string,
    memberUsername: string,
    memberAvatar: string
  ): Promise<SupportConversation> {
    const conversation = getOrCreateSupportConversation(
      guildId,
      memberId,
      memberUsername,
      memberAvatar
    )
    return delay(conversation)
  },

  /**
   * Send a message in a support conversation
   * @param conversationId - The conversation to send the message in
   * @param senderId - ID of the user sending the message
   * @param senderUsername - Display name of the sender
   * @param senderAvatar - Avatar URL of the sender
   * @param senderType - Whether sender is 'member' or 'admin'
   * @param content - The message content
   * @returns The newly created message
   */
  async sendMessage(
    conversationId: string,
    senderId: string,
    senderUsername: string,
    senderAvatar: string,
    senderType: 'member' | 'admin',
    content: string
  ): Promise<SupportMessage> {
    const message = addSupportMessage(
      conversationId,
      senderId,
      senderUsername,
      senderAvatar,
      senderType,
      content
    )
    return delay(message)
  },

  /**
   * Mark all messages in a conversation as read
   * Used when admin opens a conversation
   * @param conversationId - The conversation to mark as read
   */
  async markAsRead(conversationId: string): Promise<void> {
    markConversationAsRead(conversationId)
    return delay(undefined)
  },
}

// ============================================================================
// UNIFIED API EXPORT
// ============================================================================

export const api = {
  guilds: guildsApi,
  campaigns: campaignsApi,
  leaderboard: leaderboardApi,
  user: userApi,
  chat: chatApi,
  analytics: analyticsApi,
  support: supportApi,
}

// Default export for convenience
export default api
