/**
 * Authenticated user in the application
 * Contains profile info, wallet data, and guild memberships
 */
export interface User {
  /** Unique identifier */
  id: string
  /** Display username */
  username: string
  /** URL to user's avatar image */
  avatar: string
  /** User's token/wallet balance in USD */
  walletBalance: number
  /** Gamification points earned */
  auraPoints: number
  /** Array of guild IDs the user has joined */
  joinedGuilds: string[]
  /** Global leaderboard rank (if applicable) */
  rank?: number
  /** Total earnings across all campaigns */
  totalEarnings?: number
  /** Number of campaigns completed */
  campaignsCompleted?: number
}

/** Social media platforms supported for campaigns */
export type Platform = 'youtube' | 'tiktok' | 'instagram' | 'twitter'

/** Categories for guilds */
export type GuildCategory = 'DeFi' | 'Gaming' | 'NFTs' | 'DAOs' | 'Infrastructure' | 'Social' | 'Entertainment' | 'Education'

/**
 * Navigation item in a guild's sidebar section
 */
export interface GuildSectionItem {
  /** Unique identifier */
  id: string
  /** Display text */
  label: string
  /** Optional emoji icon */
  emoji?: string
  /** Navigation path */
  href: string
  /** Whether to visually highlight this item */
  isHighlighted?: boolean
}

/**
 * Section in a guild's sidebar navigation
 * Groups related navigation items
 */
export interface GuildSection {
  /** Unique identifier */
  id: string
  /** Section header text */
  name: string
  /** Optional icon for the section */
  icon?: string
  /** Whether section can be collapsed */
  isCollapsible?: boolean
  /** Navigation items in this section */
  items: GuildSectionItem[]
}

/**
 * A guild/community in the platform
 * Contains all configuration and metadata for a community
 */
export interface Guild {
  /** Unique identifier */
  id: string
  /** Display name */
  name: string
  /** Description/tagline */
  description: string
  /** URL to guild icon/logo */
  icon: string
  /** URL to guild banner image */
  banner: string
  /** Primary brand color (hex) */
  accentColor: string
  /** CSS gradient for backgrounds */
  accentGradient: string
  /** Category for discovery/filtering */
  category: GuildCategory
  /** Number of currently active campaigns */
  activeCampaigns: number
  /** Total member count */
  totalMembers: number
  /** Currently online members */
  onlineMembers: number
  /** Total rewards distributed in USD */
  totalRewardsDistributed: number
  /** Whether guild chat is enabled */
  chatEnabled: boolean
  /** Sidebar navigation sections */
  sections: GuildSection[]
  /** Whether guild is verified */
  verified: boolean
  /** Blockchain networks the guild operates on */
  chains?: string[]
}

/**
 * Member of a guild with their role and status
 */
export interface GuildMember {
  /** Unique identifier */
  id: string
  /** Display username */
  username: string
  /** URL to avatar image */
  avatar: string
  /** Member's role in the guild */
  role: 'admin' | 'moderator' | 'member'
  /** Whether member is currently online */
  isOnline: boolean
  /** Aura points earned in this guild */
  auraPoints: number
  /** Optional linked Twitter handle */
  twitterHandle?: string
}

export type CampaignTag = 'CLIPPING' | 'MUSIC' | 'ENTERTAINMENT' | 'PERSONAL BRAND' | 'LIFESTYLE' | 'GAMING' | 'EDUCATION' | 'SPORTS'
export type CampaignStatus = 'active' | 'upcoming' | 'past'
export type CampaignType = 'InfoFi' | 'Mini' | 'UGC' | 'Clipping'
export type ParticipationType = 'Onchain' | 'Social' | 'Onchain + Social'
export type CampaignCategory = 'Marketplace' | 'Gaming' | 'DeFi' | 'NFT' | 'Social' | 'Education'

export interface Campaign {
  id: string
  name: string
  description: string
  thumbnail: string
  tags: CampaignTag[]
  type: CampaignType
  category: CampaignCategory
  participationType: ParticipationType
  guildId: string
  guildName: string
  guildIcon: string
  platforms: Platform[]
  totalReward: number
  paidOut: number
  participantsCount: number
  startDate: Date
  endDate: Date
  status: CampaignStatus
  rules: string[]
  howToParticipate: string[]
  createdAt: Date
  featured?: boolean
  forYou?: boolean
  /** Token used for rewards (optional) */
  rewardToken?: RewardToken
  /** Number of top winners that will be rewarded (e.g., 100 for "Top 100") */
  topWinners?: number
  /** User's current rank in the campaign (if participating) */
  userRank?: number
}

export interface LeaderboardEntry {
  rank: number
  userId: string
  username: string
  avatar: string
  score: number
  estimatedPayout: number
  // New fields for InfoFi leaderboard
  multiplier?: number
  auraPercent?: number
  socialHandle?: string
  connections?: string[] // avatar URLs
}

export interface LeaderboardUser {
  rank: number
  userId: string
  username: string
  avatar: string
  totalEarnings: number
  campaignsCompleted: number
  score: number
}

export interface LeaderboardGuild {
  rank: number
  guildId: string
  guildName: string
  guildIcon: string
  totalRewardsDistributed: number
  activeCampaigns: number
  totalMembers: number
  score: number
}

export interface UserCampaignStats {
  rank: number
  score: number
  estimatedReward: number
  isParticipating: boolean
  badges?: string[] // badge IDs or names earned in this campaign
}

export interface Announcement {
  id: string
  title: string
  content: string
  timestamp: Date
  pinned: boolean
  authorId: string
  authorName: string
  authorAvatar: string
}

export interface GuildApp {
  id: string
  name: string
  description: string
  icon: string
  category: 'core' | 'analytics' | 'engagement'
  installed: boolean
}

// App-based campaign system types
export type AppType = 'infofi' | 'ugc' | 'clipping' | 'mini'

export interface InstalledApp {
  id: string
  type: string  // App slug (e.g., 'infofi', 'faucet', 'affiliate')
  name: string
  icon: string
  description: string
  color: string
  installedAt: Date
}

export interface TwitterPost {
  id: string
  content: string
  author: string
  handle: string
  avatar: string
  timestamp: Date
  likes: number
  retweets: number
  replies: number
}

// App type metadata for display
export const APP_TYPE_INFO: Record<AppType, { name: string; icon: string; color: string; description: string }> = {
  'infofi': { 
    name: 'InfoFi', 
    icon: '📚', 
    color: '#22c55e',
    description: 'Educational and informational content campaigns'
  },
  'ugc': { 
    name: 'UGC', 
    icon: '🎬', 
    color: '#f97316',
    description: 'User-generated content campaigns'
  },
  'clipping': { 
    name: 'Clipping', 
    icon: '✂️', 
    color: '#ec4899',
    description: 'Video clipping and editing campaigns'
  },
  'mini': { 
    name: 'Mini', 
    icon: '⚡', 
    color: '#3b82f6',
    description: 'Quick and simple micro-campaigns'
  },
}

export interface CampaignHistory {
  id: string
  campaignName: string
  guildName: string
  endDate: Date
  reward: number
  rank: number
  totalParticipants: number
}

export interface PayoutHistory {
  id: string
  amount: number
  date: Date
  type: 'campaign_reward' | 'referral' | 'bonus'
  description: string
}

export interface ActivityData {
  date: string
  participants: number
  rewards: number
}

export interface RewardPayout {
  id: string
  odsa: string
  username: string
  avatar: string
  guildId: string
  guildName: string
  guildIcon: string
  campaignName: string
  amount: number
  timestamp: Date
}

// Chat types
export interface ChatReaction {
  emoji: string
  count: number
  userIds: string[] // users who reacted
}

export interface ChatMessage {
  id: string
  guildId: string
  content: string
  authorId: string
  authorUsername: string
  authorAvatar: string
  authorRole: 'admin' | 'moderator' | 'member'
  timestamp: Date
  reactions: ChatReaction[]
  mentions: string[] // userIds mentioned in message
  replyToId?: string // parent message ID for replies
  replyToUsername?: string // cached username of parent message author
  isEdited?: boolean
}

// Common emoji reactions for chat
export const CHAT_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🔥', '🚀', '👀'] as const

// Tag colors mapping
export const TAG_COLORS: Record<CampaignTag, { bg: string; text: string }> = {
  'CLIPPING': { bg: 'bg-pink-500/20', text: 'text-pink-400' },
  'MUSIC': { bg: 'bg-purple-500/20', text: 'text-purple-400' },
  'ENTERTAINMENT': { bg: 'bg-orange-500/20', text: 'text-orange-400' },
  'PERSONAL BRAND': { bg: 'bg-blue-500/20', text: 'text-blue-400' },
  'LIFESTYLE': { bg: 'bg-teal-500/20', text: 'text-teal-400' },
  'GAMING': { bg: 'bg-red-500/20', text: 'text-red-400' },
  'EDUCATION': { bg: 'bg-green-500/20', text: 'text-green-400' },
  'SPORTS': { bg: 'bg-yellow-500/20', text: 'text-yellow-400' },
}

// Platform colors
export const PLATFORM_COLORS: Record<Platform, string> = {
  'youtube': '#FF0000',
  'tiktok': '#00F2EA',
  'instagram': '#E4405F',
  'twitter': '#1DA1F2',
}

// Guild category colors
export const GUILD_CATEGORY_COLORS: Record<GuildCategory, string> = {
  'DeFi': '#22c55e',
  'Gaming': '#ef4444',
  'NFTs': '#a855f7',
  'DAOs': '#3b82f6',
  'Infrastructure': '#6b7280',
  'Social': '#ec4899',
  'Entertainment': '#f97316',
  'Education': '#14b8a6',
}

// Campaign type colors (for the colored dot indicator)
export const CAMPAIGN_TYPE_COLORS: Record<CampaignType, string> = {
  'InfoFi': '#22c55e',   // green
  'Mini': '#3b82f6',     // blue
  'UGC': '#f97316',      // orange
  'Clipping': '#ec4899', // pink
}

// Campaign category colors
export const CAMPAIGN_CATEGORY_COLORS: Record<CampaignCategory, string> = {
  'Marketplace': '#6b7280',
  'Gaming': '#ef4444',
  'DeFi': '#22c55e',
  'NFT': '#a855f7',
  'Social': '#ec4899',
  'Education': '#14b8a6',
}

// ============================================
// App Store Types
// ============================================

/**
 * Categories for apps in the App Store
 * Used to filter and organize distribution tools
 */
export type StoreAppCategory = 
  | 'Virality' 
  | 'Onchain' 
  | 'Video' 
  | 'Airdrops' 
  | 'Tools' 
  | 'Dapps'

/** All available app store categories in display order */
export const STORE_APP_CATEGORIES: StoreAppCategory[] = [
  'Virality',
  'Onchain',
  'Video',
  'Airdrops',
  'Tools',
  'Dapps'
]

/** Color mapping for each app store category (used in badges and UI accents) */
export const STORE_APP_CATEGORY_COLORS: Record<StoreAppCategory, string> = {
  'Virality': '#22c55e',
  'Onchain': '#3b82f6',
  'Video': '#ec4899',
  'Airdrops': '#f97316',
  'Tools': '#8b5cf6',
  'Dapps': '#14b8a6',
}

/**
 * Developer information for an app in the store
 */
export interface StoreAppDeveloper {
  /** Display name of the developer/company */
  name: string
  /** URL to the developer's logo/avatar */
  icon: string
  /** Whether the developer is verified by the platform */
  verified: boolean
}

/**
 * Usage statistics for an app in the store
 */
export interface StoreAppStats {
  /** Total number of reviews */
  reviews: number
  /** Average rating (1-5 scale) */
  rating: number
  /** Number of installs in the last 7 days */
  weeklyInstalls: number
  /** Total installs across all time */
  totalInstalls: number
  /** Number of unique active users in the last 30 days */
  monthlyActiveUsers: number
}

/**
 * App available in the App Store
 * Represents a distribution tool that guilds can install
 */
export interface StoreApp {
  /** Unique identifier */
  id: string
  /** URL-friendly identifier (e.g., 'infofi', 'faucet') */
  slug: string
  /** Display name */
  name: string
  /** URL to the app's icon/logo */
  icon: string
  /** Brief description shown on cards (~50-100 chars) */
  shortDescription: string
  /** Full description shown on detail page */
  fullDescription: string
  /** Category for filtering */
  category: StoreAppCategory
  /** Developer info */
  developer: StoreAppDeveloper
  /** Usage statistics */
  stats: StoreAppStats
  /** URLs to screenshot images for the detail page */
  screenshots: string[]
  /** Key features as bullet points */
  features: string[]
  /** Theme color for UI accents */
  color: string
  /** Whether the app is free to use */
  isFree: boolean
  /** Flag for newly released apps (shows badge) */
  isNew?: boolean
  /** Flag for featured apps (higher visibility) */
  isFeatured?: boolean
}

/**
 * Record of an app installed in a guild
 * Tracks installation metadata and any customizations
 */
export interface GuildAppInstallation {
  /** ID of the installed app (references StoreApp.id) */
  appId: string
  /** ID of the guild where installed */
  guildId: string
  /** When the app was installed */
  installedAt: Date
  /** User ID of who installed the app */
  installedBy: string
  /** Guild-specific custom name override */
  customName?: string
  /** Guild-specific custom icon override */
  customIcon?: string
  /** Guild-specific custom description override */
  customDescription?: string
}

// ============================================
// Support Chat Types
// ============================================

/**
 * Status of a support conversation
 * - 'active': Ongoing conversation, may have unread messages
 * - 'resolved': Conversation marked as resolved by admin
 */
export type SupportConversationStatus = 'active' | 'resolved'

/**
 * A support conversation between a guild member and admins
 * 
 * Each member can have one conversation per guild. Admins can view
 * and respond to all conversations in their guild's support inbox.
 * 
 * @example
 * ```ts
 * const conversation: SupportConversation = {
 *   id: 'conv-1',
 *   guildId: 'guild-1',
 *   memberId: 'user-2',
 *   memberUsername: 'alice_crypto',
 *   memberAvatar: 'https://...',
 *   lastMessage: 'Thanks for the help!',
 *   lastMessageAt: new Date(),
 *   unreadCount: 0,
 *   status: 'active'
 * }
 * ```
 */
export interface SupportConversation {
  /** Unique identifier for the conversation */
  id: string
  /** Guild this conversation belongs to */
  guildId: string
  /** ID of the member who initiated the conversation */
  memberId: string
  /** Display name of the member (cached for list display) */
  memberUsername: string
  /** Avatar URL of the member (cached for list display) */
  memberAvatar: string
  /** Preview of the most recent message */
  lastMessage: string
  /** Timestamp of the most recent message */
  lastMessageAt: Date
  /** Number of unread messages (for admin inbox) */
  unreadCount: number
  /** Current status of the conversation */
  status: SupportConversationStatus
}

/**
 * A single message within a support conversation
 * 
 * Messages can be sent by either the member or an admin.
 * The senderType field determines the UI styling and alignment.
 * 
 * @example
 * ```ts
 * const message: SupportMessage = {
 *   id: 'msg-1',
 *   conversationId: 'conv-1',
 *   senderId: 'user-2',
 *   senderUsername: 'alice_crypto',
 *   senderAvatar: 'https://...',
 *   senderType: 'member',
 *   content: 'Hi, I have a question about the campaign.',
 *   timestamp: new Date(),
 *   isRead: true
 * }
 * ```
 */
export interface SupportMessage {
  /** Unique identifier for the message */
  id: string
  /** ID of the conversation this message belongs to */
  conversationId: string
  /** ID of the user who sent the message */
  senderId: string
  /** Display name of the sender */
  senderUsername: string
  /** Avatar URL of the sender */
  senderAvatar: string
  /** Whether sender is a 'member' or 'admin' (affects UI styling) */
  senderType: 'member' | 'admin'
  /** The message content */
  content: string
  /** When the message was sent */
  timestamp: Date
  /** Whether the message has been read by the recipient */
  isRead: boolean
}

// ============================================
// Admin Members Table Types
// ============================================

/**
 * Auto-derived member personas based on behavior and contribution
 * These are read-only and computed from member activity
 */
export type MemberPersona = 
  | 'Creator' 
  | 'Power Creator' 
  | 'Trader' 
  | 'DeFi Native' 
  | 'Referrer' 
  | 'Passive'

/**
 * Wallet value categories based on total holdings
 */
export type WalletCategory = '<$1k' | '$1k-$10k' | '$10k-$100k' | '$100k+'

/**
 * Extended member type for admin members table
 * Contains all contribution metrics and behavior data
 */
export interface AdminMember {
  /** Unique identifier */
  id: string
  /** Display name */
  name: string
  /** Username handle */
  username: string
  /** URL to avatar image */
  avatar: string
  /** Wallet address */
  wallet: string
  /** Member's role in the guild */
  role: 'admin' | 'moderator' | 'member'
  /** Auto-derived persona based on behavior */
  persona: MemberPersona
  /** Total posts/content created */
  posts: number
  /** Total impressions generated */
  impressions: number
  /** Engagement rate as percentage (0-100) */
  engagement: number
  /** Trading volume in USD */
  volume: number
  /** Fees generated in USD */
  fees: number
  /** Number of successful referrals */
  referrals: number
  /** Top protocols used (e.g., ['Uniswap', 'Aave', 'Lido']) */
  topProtocols: string[]
  /** Wallet value category */
  walletCategory: WalletCategory
  /** When member joined the guild */
  joinedAt: Date
}

/** Color mapping for member personas (used in badges) */
export const PERSONA_COLORS: Record<MemberPersona, string> = {
  'Creator': '#3b82f6',       // blue
  'Power Creator': '#22c55e', // green
  'Trader': '#f97316',        // orange
  'DeFi Native': '#8b5cf6',   // purple
  'Referrer': '#ec4899',      // pink
  'Passive': '#6b7280',       // gray
}

/** Color mapping for wallet categories (used in badges) */
export const WALLET_CATEGORY_COLORS: Record<WalletCategory, string> = {
  '<$1k': '#6b7280',       // gray
  '$1k-$10k': '#3b82f6',   // blue
  '$10k-$100k': '#8b5cf6', // purple
  '$100k+': '#22c55e',     // green
}

// ============================================
// Reward Token Types
// ============================================

/** Token used for rewards */
export interface RewardToken {
  /** Token symbol (e.g. 'USDC', 'XRP', 'ETH') */
  symbol: string
  /** URL to token icon */
  icon: string
}

/** Common token definitions for convenience */
export const COMMON_TOKENS: Record<string, RewardToken> = {
  USDC: { symbol: 'USDC', icon: '/tokens/usdc.svg' },
  XRP: { symbol: 'XRP', icon: '/tokens/xrp.svg' },
  ETH: { symbol: 'ETH', icon: '/tokens/eth.svg' },
  SOL: { symbol: 'SOL', icon: '/tokens/sol.svg' },
  USDT: { symbol: 'USDT', icon: '/tokens/usdt.svg' },
}

// ============================================
// Social Task Types (Instant Rewards)
// ============================================

/** Payout distribution method for social tasks */
export type PayoutType = 'fcfs' | 'raffle' | 'capped'

/** Current status of a social task for a user */
export type TaskStatus = 'available' | 'pending' | 'completed' | 'rewarded'

/** Type of social action required */
export type TaskAction = 'follow' | 'retweet' | 'reply' | 'quote'

/**
 * A social task for instant rewards
 * These are quick, verifiable actions on social platforms
 */
export interface SocialTask {
  /** Unique identifier */
  id: string
  /** Type of action required */
  action: TaskAction
  /** Target handle or post URL */
  target: string
  /** Display name of the brand/account */
  brandName: string
  /** Brand icon URL */
  brandIcon: string
  /** Platform (currently only twitter) */
  platform: 'twitter'
  /** Amount earned for completing task */
  earnAmount: number
  /** Token used for reward payment */
  rewardToken?: RewardToken
  /** How rewards are distributed */
  payoutType: PayoutType
  /** When the task expires */
  endTime: Date
  /** Total slots available (for capped tasks) */
  slotsTotal?: number
  /** Slots already claimed (for capped tasks) */
  slotsFilled?: number
  /** Current status for the user */
  status: TaskStatus
  /** Whether user needs to connect their X account first */
  requiresConnect: boolean
  /** Whether user is eligible for this task */
  isEligible?: boolean
  /** Reason why user is not eligible (if applicable) */
  ineligibleReason?: string
  /** Guild ID this task belongs to */
  guildId: string
  /** Guild name */
  guildName: string
}

/** Labels for payout types */
export const PAYOUT_TYPE_LABELS: Record<PayoutType, string> = {
  'fcfs': 'First Come First Served',
  'raffle': 'Raffle',
  'capped': 'Limited Spots'
}

/** Short labels for payout types (badge display) */
export const PAYOUT_TYPE_SHORT: Record<PayoutType, string> = {
  'fcfs': 'FCFS',
  'raffle': 'Raffle',
  'capped': 'Capped'
}

/** Colors for payout type badges */
export const PAYOUT_TYPE_COLORS: Record<PayoutType, { bg: string; text: string }> = {
  'fcfs': { bg: 'bg-blue-500/20', text: 'text-blue-400' },
  'raffle': { bg: 'bg-purple-500/20', text: 'text-purple-400' },
  'capped': { bg: 'bg-amber-500/20', text: 'text-amber-400' }
}

/** Labels for task actions */
export const TASK_ACTION_LABELS: Record<TaskAction, string> = {
  'follow': 'Follow',
  'retweet': 'Retweet',
  'reply': 'Reply to',
  'quote': 'Quote'
}

/** User's daily earnings summary */
export interface EarningsSummary {
  /** Total earned today */
  earnedToday: number
  /** Total earned this week */
  earnedThisWeek: number
  /** Total pending verification */
  pendingAmount: number
  /** Number of tasks completed today */
  tasksCompletedToday: number
}

// ============================================
// Bundle Task Types (Multi-Action Tasks)
// ============================================

/** Status of a sub-action within a bundle task */
export type SubActionStatus = 'pending' | 'verified'

/**
 * A single action within a bundle task
 * Each sub-action must be verified individually
 */
export interface SubAction {
  /** Unique identifier for this sub-action */
  id: string
  /** Type of action required */
  action: TaskAction
  /** Target handle or post URL */
  target: string
  /** Current verification status */
  status: SubActionStatus
}

/**
 * A bundle task requiring multiple actions for a single reward
 * User must complete and verify all sub-actions to claim the reward
 */
export interface BundleTask {
  /** Unique identifier */
  id: string
  /** Display name of the brand/account */
  brandName: string
  /** Brand icon URL */
  brandIcon: string
  /** Platform (currently only twitter) */
  platform: 'twitter'
  /** Array of required sub-actions */
  actions: SubAction[]
  /** Total amount earned for completing all actions */
  earnAmount: number
  /** Token used for reward payment */
  rewardToken?: RewardToken
  /** How rewards are distributed */
  payoutType: PayoutType
  /** When the task expires */
  endTime: Date
  /** Overall status of the bundle task */
  status: TaskStatus
  /** Whether user is eligible for this task */
  isEligible?: boolean
  /** Reason why user is not eligible (if applicable) */
  ineligibleReason?: string
  /** Guild ID this task belongs to */
  guildId: string
  /** Guild name */
  guildName: string
}
