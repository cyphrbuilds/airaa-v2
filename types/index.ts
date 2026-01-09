export interface User {
  id: string
  username: string
  avatar: string
  walletBalance: number
  auraPoints: number
  joinedGuilds: string[]
  rank?: number
  totalEarnings?: number
  campaignsCompleted?: number
}

export type Platform = 'youtube' | 'tiktok' | 'instagram' | 'twitter'

export type GuildCategory = 'DeFi' | 'Gaming' | 'NFTs' | 'DAOs' | 'Infrastructure' | 'Social' | 'Entertainment' | 'Education'

export interface GuildSectionItem {
  id: string
  label: string
  emoji?: string
  href: string
  isHighlighted?: boolean
}

export interface GuildSection {
  id: string
  name: string
  icon?: string
  isCollapsible?: boolean
  items: GuildSectionItem[]
}

export interface Guild {
  id: string
  name: string
  description: string
  icon: string
  banner: string
  accentColor: string
  accentGradient: string
  category: GuildCategory
  activeCampaigns: number
  totalMembers: number
  onlineMembers: number
  totalRewardsDistributed: number
  chatEnabled: boolean
  sections: GuildSection[]
  verified: boolean
  chains?: string[]
}

export interface GuildMember {
  id: string
  username: string
  avatar: string
  role: 'admin' | 'moderator' | 'member'
  isOnline: boolean
  auraPoints: number
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
  type: AppType
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
