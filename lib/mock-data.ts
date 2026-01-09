import { 
  User, 
  Guild, 
  GuildMember, 
  Campaign, 
  Announcement, 
  GuildApp,
  LeaderboardUser,
  LeaderboardGuild,
  CampaignHistory,
  PayoutHistory,
  ActivityData,
  LeaderboardEntry,
  UserCampaignStats,
  RewardPayout,
  InstalledApp,
  TwitterPost,
  CampaignType,
  ChatMessage,
  StoreApp,
  GuildAppInstallation,
  SupportConversation,
  SupportMessage
} from '@/types'

// Current logged-in user (mock auth)
export const currentUser: User = {
  id: 'user-1',
  username: 'clipmaster_pro',
  avatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=clipmaster',
  walletBalance: 4892.50,
  auraPoints: 28750,
  joinedGuilds: ['guild-1', 'guild-2'],
  rank: 8,
  totalEarnings: 12400,
  campaignsCompleted: 12
}

// Guilds (formerly communities) - Real Web3 Projects
export const guilds: Guild[] = [
  {
    id: 'guild-1',
    name: 'Uniswap',
    description: 'The largest decentralized exchange. Swap, earn, and build on the leading DeFi protocol.',
    icon: 'https://img.logo.dev/uniswap.org?token=pk_CqDF3xGeT3OFezZ1mvTe3Q',
    banner: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=300&fit=crop',
    accentColor: '#FF007A',
    accentGradient: 'linear-gradient(135deg, #FF007A 0%, #d4006a 100%)',
    category: 'DeFi',
    activeCampaigns: 5,
    totalMembers: 128000,
    onlineMembers: 4500,
    totalRewardsDistributed: 8500000,
    chatEnabled: true,
    verified: true,
    chains: ['ethereum', 'arbitrum', 'polygon', 'base', 'optimism'],
    sections: []
  },
  {
    id: 'guild-2',
    name: 'Aave',
    description: 'The leading decentralized lending protocol. Lend, borrow, and earn with the most trusted DeFi protocol.',
    icon: 'https://img.logo.dev/aave.com?token=pk_CqDF3xGeT3OFezZ1mvTe3Q',
    banner: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=800&h=300&fit=crop',
    accentColor: '#B6509E',
    accentGradient: 'linear-gradient(135deg, #B6509E 0%, #2ebac6 100%)',
    category: 'DeFi',
    activeCampaigns: 4,
    totalMembers: 89000,
    onlineMembers: 2800,
    totalRewardsDistributed: 4200000,
    chatEnabled: true,
    verified: true,
    chains: ['ethereum', 'arbitrum', 'polygon', 'optimism', 'avalanche'],
    sections: []
  },
  {
    id: 'guild-3',
    name: 'Arbitrum',
    description: 'The leading Ethereum Layer 2. Scale your dApps with low fees and fast transactions.',
    icon: 'https://img.logo.dev/arbitrum.io?token=pk_CqDF3xGeT3OFezZ1mvTe3Q',
    banner: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=300&fit=crop',
    accentColor: '#28A0F0',
    accentGradient: 'linear-gradient(135deg, #28A0F0 0%, #1a6fb0 100%)',
    category: 'Infrastructure',
    activeCampaigns: 6,
    totalMembers: 156000,
    onlineMembers: 5200,
    totalRewardsDistributed: 12000000,
    chatEnabled: true,
    verified: true,
    chains: ['arbitrum'],
    sections: []
  },
  {
    id: 'guild-4',
    name: 'OpenSea',
    description: 'The world\'s largest NFT marketplace. Discover, collect, and sell extraordinary NFTs.',
    icon: 'https://img.logo.dev/opensea.io?token=pk_CqDF3xGeT3OFezZ1mvTe3Q',
    banner: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=300&fit=crop',
    accentColor: '#2081E2',
    accentGradient: 'linear-gradient(135deg, #2081E2 0%, #1868b7 100%)',
    category: 'NFTs',
    activeCampaigns: 5,
    totalMembers: 245000,
    onlineMembers: 8900,
    totalRewardsDistributed: 6800000,
    chatEnabled: true,
    verified: true,
    chains: ['ethereum', 'polygon', 'base', 'arbitrum'],
    sections: []
  },
  {
    id: 'guild-5',
    name: 'Axie Infinity',
    description: 'Play-to-earn gaming revolution. Battle, breed, and trade fantasy creatures called Axies.',
    icon: 'https://img.logo.dev/axieinfinity.com?token=pk_CqDF3xGeT3OFezZ1mvTe3Q',
    banner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=300&fit=crop',
    accentColor: '#0055D5',
    accentGradient: 'linear-gradient(135deg, #0055D5 0%, #00c8ff 100%)',
    category: 'Gaming',
    activeCampaigns: 4,
    totalMembers: 320000,
    onlineMembers: 12500,
    totalRewardsDistributed: 9500000,
    chatEnabled: true,
    verified: true,
    chains: ['ronin', 'ethereum'],
    sections: []
  },
  {
    id: 'guild-6',
    name: 'Lens Protocol',
    description: 'The social layer for Web3. Build decentralized social apps on the composable social graph.',
    icon: 'https://img.logo.dev/lens.xyz?token=pk_CqDF3xGeT3OFezZ1mvTe3Q',
    banner: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800&h=300&fit=crop',
    accentColor: '#00501E',
    accentGradient: 'linear-gradient(135deg, #00501E 0%, #ABFE2C 100%)',
    category: 'Social',
    activeCampaigns: 3,
    totalMembers: 78000,
    onlineMembers: 2100,
    totalRewardsDistributed: 2400000,
    chatEnabled: true,
    verified: true,
    chains: ['polygon', 'ethereum'],
    sections: []
  }
]

// Campaigns - Real Web3 Project Marketing Campaigns
export const campaigns: Campaign[] = [
  {
    id: 'camp-1',
    name: 'Uniswap v4 Hooks Explainer',
    description: 'Create educational content explaining Uniswap v4 Hooks and how they revolutionize DeFi. Best tutorials win big rewards.',
    thumbnail: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=300&fit=crop',
    tags: ['EDUCATION', 'PERSONAL BRAND'],
    type: 'InfoFi',
    category: 'DeFi',
    participationType: 'Onchain + Social',
    guildId: 'guild-1',
    guildName: 'Uniswap',
    guildIcon: 'https://img.logo.dev/uniswap.org?token=pk_CqDF3xGeT3OFezZ1mvTe3Q',
    platforms: ['youtube', 'tiktok', 'twitter'],
    totalReward: 50000,
    paidOut: 32500,
    participantsCount: 342,
    startDate: new Date('2024-11-01'),
    endDate: new Date('2025-02-28'),
    status: 'active',
    featured: true,
    forYou: true,
    rules: [
      'Content must accurately explain Uniswap v4 Hooks',
      'Include at least one practical use case example',
      'Minimum 2 minutes for YouTube, 60 seconds for TikTok',
      'Must link to official Uniswap documentation'
    ],
    howToParticipate: [
      'Study Uniswap v4 Hooks documentation',
      'Create educational content in your style',
      'Post to your platform with #UniswapHooks',
      'Submit link for verification and rewards'
    ],
    createdAt: new Date('2024-10-28')
  },
  {
    id: 'camp-2',
    name: 'First Swap Tutorial Challenge',
    description: 'Help onboard new users to DeFi by creating beginner-friendly Uniswap swap tutorials.',
    thumbnail: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=300&fit=crop',
    tags: ['EDUCATION', 'LIFESTYLE'],
    type: 'UGC',
    category: 'DeFi',
    participationType: 'Social',
    guildId: 'guild-1',
    guildName: 'Uniswap',
    guildIcon: 'https://img.logo.dev/uniswap.org?token=pk_CqDF3xGeT3OFezZ1mvTe3Q',
    platforms: ['tiktok', 'instagram', 'youtube'],
    totalReward: 25000,
    paidOut: 18200,
    participantsCount: 456,
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-01-31'),
    status: 'active',
    featured: true,
    rules: [
      'Must be beginner-friendly and clear',
      'Show actual swap process step-by-step',
      'Include safety tips (gas fees, slippage)',
      'Available in any language'
    ],
    howToParticipate: [
      'Create a simple swap tutorial video',
      'Focus on first-time crypto users',
      'Post with #MyFirstSwap',
      'Submit for reward consideration'
    ],
    createdAt: new Date('2024-12-28')
  },
  {
    id: 'camp-3',
    name: 'GHO Stablecoin Deep Dive',
    description: 'Create content about Aave\'s GHO stablecoin - how it works, use cases, and why it matters for DeFi.',
    thumbnail: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=400&h=300&fit=crop',
    tags: ['EDUCATION', 'PERSONAL BRAND'],
    type: 'InfoFi',
    category: 'DeFi',
    participationType: 'Onchain + Social',
    guildId: 'guild-2',
    guildName: 'Aave',
    guildIcon: 'https://img.logo.dev/aave.com?token=pk_CqDF3xGeT3OFezZ1mvTe3Q',
    platforms: ['youtube', 'twitter'],
    totalReward: 35000,
    paidOut: 12400,
    participantsCount: 127,
    startDate: new Date('2025-01-02'),
    endDate: new Date('2025-03-01'),
    status: 'active',
    forYou: true,
    rules: [
      'Explain GHO mechanics accurately',
      'Compare with other stablecoins',
      'Include risk disclaimers',
      'No financial advice claims'
    ],
    howToParticipate: [
      'Research GHO stablecoin mechanics',
      'Create in-depth explainer content',
      'Post with #GHOExplained',
      'Submit for review'
    ],
    createdAt: new Date('2024-12-30')
  },
  {
    id: 'camp-4',
    name: 'DeFi Safety Tips Series',
    description: 'Help users stay safe in DeFi. Create content about avoiding scams, managing risk, and best security practices.',
    thumbnail: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop',
    tags: ['EDUCATION', 'LIFESTYLE'],
    type: 'UGC',
    category: 'DeFi',
    participationType: 'Social',
    guildId: 'guild-2',
    guildName: 'Aave',
    guildIcon: 'https://img.logo.dev/aave.com?token=pk_CqDF3xGeT3OFezZ1mvTe3Q',
    platforms: ['youtube', 'tiktok', 'instagram'],
    totalReward: 20000,
    paidOut: 8900,
    participantsCount: 234,
    startDate: new Date('2024-12-10'),
    endDate: new Date('2025-02-28'),
    status: 'active',
    featured: true,
    rules: [
      'Focus on practical safety tips',
      'Include real examples (anonymized)',
      'Cover wallet security, phishing, smart contract risks',
      'Suitable for all skill levels'
    ],
    howToParticipate: [
      'Choose a DeFi safety topic',
      'Create helpful educational content',
      'Post with #DeFiSafety',
      'Submit link for rewards'
    ],
    createdAt: new Date('2024-12-05')
  },
  {
    id: 'camp-5',
    name: 'Arbitrum Orbit Chain Explainer',
    description: 'Explain how Arbitrum Orbit enables anyone to launch their own L3 chain. Technical deep-dives welcome!',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop',
    tags: ['EDUCATION', 'PERSONAL BRAND'],
    type: 'InfoFi',
    category: 'Education',
    participationType: 'Onchain + Social',
    guildId: 'guild-3',
    guildName: 'Arbitrum',
    guildIcon: 'https://img.logo.dev/arbitrum.io?token=pk_CqDF3xGeT3OFezZ1mvTe3Q',
    platforms: ['youtube', 'twitter'],
    totalReward: 45000,
    paidOut: 28700,
    participantsCount: 156,
    startDate: new Date('2024-12-01'),
    endDate: new Date('2025-02-15'),
    status: 'active',
    forYou: true,
    rules: [
      'Explain Orbit technology accurately',
      'Include benefits for developers',
      'Show real Orbit chains as examples',
      'Technical accuracy required'
    ],
    howToParticipate: [
      'Study Arbitrum Orbit documentation',
      'Create comprehensive explainer',
      'Post with #ArbitrumOrbit',
      'Submit for technical review'
    ],
    createdAt: new Date('2024-11-28')
  },
  {
    id: 'camp-6',
    name: 'Bridge to Arbitrum Tutorial',
    description: 'Create simple tutorials showing users how to bridge assets to Arbitrum. Help onboard the next million users!',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop',
    tags: ['EDUCATION', 'LIFESTYLE'],
    type: 'UGC',
    category: 'Education',
    participationType: 'Social',
    guildId: 'guild-3',
    guildName: 'Arbitrum',
    guildIcon: 'https://img.logo.dev/arbitrum.io?token=pk_CqDF3xGeT3OFezZ1mvTe3Q',
    platforms: ['youtube', 'tiktok'],
    totalReward: 30000,
    paidOut: 19200,
    participantsCount: 289,
    startDate: new Date('2024-12-15'),
    endDate: new Date('2025-02-28'),
    status: 'active',
    featured: true,
    forYou: true,
    rules: [
      'Show official bridge process',
      'Explain gas fees and timing',
      'Include security reminders',
      'Beginner-friendly language required'
    ],
    howToParticipate: [
      'Create step-by-step bridge tutorial',
      'Use official Arbitrum bridge',
      'Post with #BridgeToArbitrum',
      'Submit for rewards'
    ],
    createdAt: new Date('2024-12-10')
  },
  {
    id: 'camp-7',
    name: 'NFT Collection Spotlight Series',
    description: 'Showcase emerging NFT artists and collections on OpenSea. Help creators get discovered!',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop',
    tags: ['ENTERTAINMENT', 'LIFESTYLE'],
    type: 'Clipping',
    category: 'NFT',
    participationType: 'Social',
    guildId: 'guild-4',
    guildName: 'OpenSea',
    guildIcon: 'https://img.logo.dev/opensea.io?token=pk_CqDF3xGeT3OFezZ1mvTe3Q',
    platforms: ['twitter', 'instagram', 'tiktok'],
    totalReward: 25000,
    paidOut: 11500,
    participantsCount: 312,
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-02-28'),
    status: 'active',
    rules: [
      'Feature collections with <1000 sales',
      'Interview or spotlight the artist',
      'Include OpenSea collection link',
      'Original content only'
    ],
    howToParticipate: [
      'Discover emerging NFT artists on OpenSea',
      'Create spotlight content',
      'Tag artists and post with #OpenSeaSpotlight',
      'Submit for consideration'
    ],
    createdAt: new Date('2024-12-28')
  },
  {
    id: 'camp-8',
    name: 'Axie Origins Gameplay Challenge',
    description: 'Create entertaining Axie Infinity Origins gameplay content. Show off your battles, strategies, and epic moments!',
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop',
    tags: ['GAMING', 'ENTERTAINMENT'],
    type: 'UGC',
    category: 'Gaming',
    participationType: 'Onchain + Social',
    guildId: 'guild-5',
    guildName: 'Axie Infinity',
    guildIcon: 'https://img.logo.dev/axieinfinity.com?token=pk_CqDF3xGeT3OFezZ1mvTe3Q',
    platforms: ['youtube', 'tiktok'],
    totalReward: 40000,
    paidOut: 22100,
    participantsCount: 523,
    startDate: new Date('2024-12-01'),
    endDate: new Date('2025-02-15'),
    status: 'active',
    featured: true,
    forYou: true,
    rules: [
      'Feature Axie Origins gameplay',
      'Show game download link',
      'Include your Ronin wallet for verification',
      'Weekly winners based on engagement'
    ],
    howToParticipate: [
      'Play Axie Infinity Origins',
      'Record exciting gameplay moments',
      'Post with #AxieOrigins',
      'Submit for weekly rewards'
    ],
    createdAt: new Date('2024-11-25')
  },
  {
    id: 'camp-9',
    name: 'Build on Lens Tutorial',
    description: 'Create developer tutorials showing how to build social apps on Lens Protocol. Help grow the ecosystem!',
    thumbnail: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=400&h=300&fit=crop',
    tags: ['EDUCATION', 'PERSONAL BRAND'],
    type: 'InfoFi',
    category: 'Social',
    participationType: 'Onchain + Social',
    guildId: 'guild-6',
    guildName: 'Lens Protocol',
    guildIcon: 'https://img.logo.dev/lens.xyz?token=pk_CqDF3xGeT3OFezZ1mvTe3Q',
    platforms: ['youtube', 'twitter'],
    totalReward: 35000,
    paidOut: 14800,
    participantsCount: 89,
    startDate: new Date('2024-12-15'),
    endDate: new Date('2025-03-01'),
    status: 'active',
    forYou: true,
    rules: [
      'Must include working code examples',
      'Use official Lens SDK/API',
      'Cover a specific use case',
      'Beginner to intermediate level'
    ],
    howToParticipate: [
      'Build something on Lens Protocol',
      'Create tutorial documenting the process',
      'Post with #BuildOnLens',
      'Submit GitHub repo and video'
    ],
    createdAt: new Date('2024-12-10')
  },
  {
    id: 'camp-10',
    name: 'Decentralized Social Explainer',
    description: 'Help people understand why decentralized social matters. Create content explaining web3 social benefits.',
    thumbnail: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&h=300&fit=crop',
    tags: ['EDUCATION', 'LIFESTYLE'],
    type: 'UGC',
    category: 'Social',
    participationType: 'Social',
    guildId: 'guild-6',
    guildName: 'Lens Protocol',
    guildIcon: 'https://img.logo.dev/lens.xyz?token=pk_CqDF3xGeT3OFezZ1mvTe3Q',
    platforms: ['tiktok', 'instagram', 'twitter'],
    totalReward: 15000,
    paidOut: 6200,
    participantsCount: 178,
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-02-15'),
    status: 'active',
    rules: [
      'Explain benefits of owning your social graph',
      'Compare with traditional social media',
      'Keep it accessible to non-crypto users',
      'No FUD about other platforms'
    ],
    howToParticipate: [
      'Create engaging explainer content',
      'Focus on user benefits',
      'Post with #OwnYourSocial',
      'Submit for rewards'
    ],
    createdAt: new Date('2024-12-28')
  }
]

// Guild members for guild-1
export const guildMembers: GuildMember[] = [
  { id: 'user-1', username: 'clipmaster_pro', avatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=clipmaster', role: 'admin', isOnline: true, auraPoints: 28750, twitterHandle: 'clipmaster_pro' },
  { id: 'user-2', username: 'viral_queen', avatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=viralqueen', role: 'moderator', isOnline: true, auraPoints: 42000, twitterHandle: 'viral_queen' },
  { id: 'user-3', username: 'content_king', avatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=contentking', role: 'member', isOnline: true, auraPoints: 35200, twitterHandle: 'content_king' },
  { id: 'user-4', username: 'tiktok_pro', avatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=tiktokpro', role: 'member', isOnline: true, auraPoints: 22100, twitterHandle: 'tiktok_pro' },
  { id: 'user-5', username: 'shorts_master', avatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=shortsmaster', role: 'member', isOnline: true, auraPoints: 19800, twitterHandle: 'shorts_master' },
  { id: 'user-6', username: 'viral_maker', avatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=viralmaker', role: 'member', isOnline: true, auraPoints: 45230, twitterHandle: 'viral_maker' },
  { id: 'user-7', username: 'edit_wizard', avatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=editwizard', role: 'moderator', isOnline: false, auraPoints: 31500, twitterHandle: 'edit_wizard' },
  { id: 'user-8', username: 'clip_guru', avatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=clipguru', role: 'member', isOnline: false, auraPoints: 15600, twitterHandle: 'clip_guru' },
  { id: 'user-9', username: 'trend_setter', avatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=trendsetter', role: 'member', isOnline: false, auraPoints: 12400, twitterHandle: 'trend_setter' },
  { id: 'user-10', username: 'content_pro', avatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=contentpro', role: 'member', isOnline: false, auraPoints: 8900, twitterHandle: 'content_pro' }
]

// Leaderboard data - Creators
export const leaderboardUsers: LeaderboardUser[] = [
  { rank: 1, userId: 'user-6', username: 'viral_maker', avatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=viralmaker', totalEarnings: 45230, campaignsCompleted: 28, score: 98500 },
  { rank: 2, userId: 'user-2', username: 'viral_queen', avatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=viralqueen', totalEarnings: 42000, campaignsCompleted: 24, score: 87200 },
  { rank: 3, userId: 'user-3', username: 'content_king', avatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=contentking', totalEarnings: 35200, campaignsCompleted: 19, score: 72400 },
  { rank: 4, userId: 'user-7', username: 'edit_wizard', avatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=editwizard', totalEarnings: 31500, campaignsCompleted: 17, score: 65800 },
  { rank: 5, userId: 'user-1', username: 'clipmaster_pro', avatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=clipmaster', totalEarnings: 28750, campaignsCompleted: 15, score: 58200 },
  { rank: 6, userId: 'user-4', username: 'tiktok_pro', avatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=tiktokpro', totalEarnings: 22100, campaignsCompleted: 14, score: 48500 },
  { rank: 7, userId: 'user-5', username: 'shorts_master', avatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=shortsmaster', totalEarnings: 19800, campaignsCompleted: 12, score: 42100 },
  { rank: 8, userId: 'user-8', username: 'clip_guru', avatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=clipguru', totalEarnings: 15600, campaignsCompleted: 10, score: 35200 },
  { rank: 9, userId: 'user-9', username: 'trend_setter', avatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=trendsetter', totalEarnings: 12400, campaignsCompleted: 8, score: 28900 },
  { rank: 10, userId: 'user-10', username: 'content_pro', avatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=contentpro', totalEarnings: 8900, campaignsCompleted: 6, score: 21500 }
]

// Leaderboard data - Guilds
export const leaderboardGuilds: LeaderboardGuild[] = [
  { rank: 1, guildId: 'guild-3', guildName: 'Arbitrum', guildIcon: 'https://img.logo.dev/arbitrum.io?token=pk_CqDF3xGeT3OFezZ1mvTe3Q', totalRewardsDistributed: 12000000, activeCampaigns: 6, totalMembers: 156000, score: 185000 },
  { rank: 2, guildId: 'guild-5', guildName: 'Axie Infinity', guildIcon: 'https://img.logo.dev/axieinfinity.com?token=pk_CqDF3xGeT3OFezZ1mvTe3Q', totalRewardsDistributed: 9500000, activeCampaigns: 4, totalMembers: 320000, score: 142000 },
  { rank: 3, guildId: 'guild-1', guildName: 'Uniswap', guildIcon: 'https://img.logo.dev/uniswap.org?token=pk_CqDF3xGeT3OFezZ1mvTe3Q', totalRewardsDistributed: 8500000, activeCampaigns: 5, totalMembers: 128000, score: 128000 },
  { rank: 4, guildId: 'guild-4', guildName: 'OpenSea', guildIcon: 'https://img.logo.dev/opensea.io?token=pk_CqDF3xGeT3OFezZ1mvTe3Q', totalRewardsDistributed: 6800000, activeCampaigns: 5, totalMembers: 245000, score: 112000 },
  { rank: 5, guildId: 'guild-2', guildName: 'Aave', guildIcon: 'https://img.logo.dev/aave.com?token=pk_CqDF3xGeT3OFezZ1mvTe3Q', totalRewardsDistributed: 4200000, activeCampaigns: 4, totalMembers: 89000, score: 98000 },
  { rank: 6, guildId: 'guild-6', guildName: 'Lens Protocol', guildIcon: 'https://img.logo.dev/lens.xyz?token=pk_CqDF3xGeT3OFezZ1mvTe3Q', totalRewardsDistributed: 2400000, activeCampaigns: 3, totalMembers: 78000, score: 72000 }
]

// Announcements for guild-1 (Uniswap)
export const announcements: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Uniswap v4 Hooks Campaign Launch!',
    content: 'We are thrilled to announce our biggest campaign yet - the Uniswap v4 Hooks Explainer campaign with $50,000 in rewards! Create educational content about v4 Hooks and help developers understand this game-changing feature. Check the campaigns page for full details.',
    timestamp: new Date('2025-01-05'),
    pinned: true,
    authorId: 'user-1',
    authorName: 'uniswap_community',
    authorAvatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=uniswap'
  },
  {
    id: 'ann-2',
    title: 'Weekly Rewards: $75K Distributed!',
    content: 'This week we distributed over $75,000 in rewards across all our campaigns! Top earner was @defi_educator with $3,200 for their excellent v4 tutorial series. The First Swap Challenge is heating up - keep those tutorials coming!',
    timestamp: new Date('2025-01-08'),
    pinned: false,
    authorId: 'user-2',
    authorName: 'uni_rewards',
    authorAvatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=unirewards'
  }
]

// Guild apps
export const guildApps: GuildApp[] = [
  { id: 'app-1', name: 'Campaigns', description: 'Create and manage reward campaigns for your community', icon: 'trophy', category: 'core', installed: true },
  { id: 'app-2', name: 'Announcements', description: 'Post important updates and pin messages', icon: 'megaphone', category: 'core', installed: true },
  { id: 'app-3', name: 'Chat', description: 'Real-time messaging for community members', icon: 'message-circle', category: 'core', installed: true },
  { id: 'app-4', name: 'Analytics', description: 'Track campaign performance and member engagement', icon: 'bar-chart-3', category: 'analytics', installed: true },
  { id: 'app-5', name: 'Leaderboard', description: 'Rank members by earnings and activity', icon: 'medal', category: 'engagement', installed: true },
  { id: 'app-6', name: 'Polls', description: 'Create community polls and gather feedback', icon: 'file-text', category: 'engagement', installed: false }
]

// Installed apps per guild (campaign app types)
export const installedApps: Record<string, InstalledApp[]> = {
  'guild-1': [
    { id: 'inst-1', type: 'infofi', name: 'InfoFi', icon: '📚', description: 'Educational and informational content campaigns', color: '#22c55e', installedAt: new Date('2024-10-01') },
  ],
  'guild-2': [
    { id: 'inst-2', type: 'infofi', name: 'InfoFi', icon: '📚', description: 'Educational and informational content campaigns', color: '#22c55e', installedAt: new Date('2024-10-15') },
  ],
  'guild-3': [
    { id: 'inst-3', type: 'infofi', name: 'InfoFi', icon: '📚', description: 'Educational and informational content campaigns', color: '#22c55e', installedAt: new Date('2024-09-01') },
  ],
  'guild-4': [
    { id: 'inst-4', type: 'infofi', name: 'InfoFi', icon: '📚', description: 'Educational and informational content campaigns', color: '#22c55e', installedAt: new Date('2024-11-01') },
  ],
  'guild-5': [
    { id: 'inst-5', type: 'infofi', name: 'InfoFi', icon: '📚', description: 'Educational and informational content campaigns', color: '#22c55e', installedAt: new Date('2024-08-01') },
  ],
  'guild-6': [
    { id: 'inst-6', type: 'infofi', name: 'InfoFi', icon: '📚', description: 'Educational and informational content campaigns', color: '#22c55e', installedAt: new Date('2024-10-20') },
  ],
}

// Mock Twitter posts per guild
export const twitterPosts: Record<string, TwitterPost[]> = {
  'guild-1': [
    {
      id: 'tweet-1',
      content: '🦄 Uniswap v4 is revolutionizing DeFi with Hooks!\n\nDevelopers can now customize pools like never before. The future of AMMs is here.\n\n#Uniswap #DeFi #Web3',
      author: 'Uniswap',
      handle: 'Uniswap',
      avatar: 'https://img.logo.dev/uniswap.org?token=pk_CqDF3xGeT3OFezZ1mvTe3Q',
      timestamp: new Date('2025-01-08T14:30:00'),
      likes: 2840,
      retweets: 892,
      replies: 156
    },
    {
      id: 'tweet-2',
      content: '💰 Over $75K distributed to content creators this week!\n\nThank you to everyone participating in our campaigns. Keep creating amazing content!\n\n#UniswapCreators',
      author: 'Uniswap',
      handle: 'Uniswap',
      avatar: 'https://img.logo.dev/uniswap.org?token=pk_CqDF3xGeT3OFezZ1mvTe3Q',
      timestamp: new Date('2025-01-07T10:15:00'),
      likes: 1560,
      retweets: 423,
      replies: 89
    },
    {
      id: 'tweet-3',
      content: 'New tutorial campaign launching soon! 🎬\n\nHelp onboard the next wave of DeFi users and earn rewards.\n\nStay tuned for details...',
      author: 'Uniswap',
      handle: 'Uniswap',
      avatar: 'https://img.logo.dev/uniswap.org?token=pk_CqDF3xGeT3OFezZ1mvTe3Q',
      timestamp: new Date('2025-01-05T16:45:00'),
      likes: 3200,
      retweets: 1100,
      replies: 234
    }
  ],
  'guild-2': [
    {
      id: 'tweet-4',
      content: '👻 GHO stablecoin continues to grow!\n\nOur native stablecoin is backed by the security of Aave. Learn more about how GHO works.\n\n#GHO #Aave #Stablecoins',
      author: 'Aave',
      handle: 'AaveAave',
      avatar: 'https://img.logo.dev/aave.com?token=pk_CqDF3xGeT3OFezZ1mvTe3Q',
      timestamp: new Date('2025-01-09T09:00:00'),
      likes: 1890,
      retweets: 567,
      replies: 98
    },
    {
      id: 'tweet-5',
      content: 'Safety first! 🛡️\n\nOur DeFi Safety campaign has reached over 500 creators. Together we are making crypto safer for everyone.\n\n#DeFiSafety',
      author: 'Aave',
      handle: 'AaveAave',
      avatar: 'https://img.logo.dev/aave.com?token=pk_CqDF3xGeT3OFezZ1mvTe3Q',
      timestamp: new Date('2025-01-06T11:30:00'),
      likes: 2100,
      retweets: 789,
      replies: 145
    }
  ],
  'guild-3': [
    {
      id: 'tweet-6',
      content: '🚀 Arbitrum processes more transactions than Ethereum mainnet!\n\nThe L2 revolution is here. Build with us.\n\n#Arbitrum #Layer2 #Ethereum',
      author: 'Arbitrum',
      handle: 'arbitrum',
      avatar: 'https://img.logo.dev/arbitrum.io?token=pk_CqDF3xGeT3OFezZ1mvTe3Q',
      timestamp: new Date('2025-01-08T15:00:00'),
      likes: 4500,
      retweets: 1800,
      replies: 312
    }
  ],
  'guild-4': [
    {
      id: 'tweet-7',
      content: '🎨 Discover emerging artists on OpenSea!\n\nOur NFT Spotlight campaign is helping new creators get discovered.\n\n#NFTs #OpenSea #DigitalArt',
      author: 'OpenSea',
      handle: 'opensea',
      avatar: 'https://img.logo.dev/opensea.io?token=pk_CqDF3xGeT3OFezZ1mvTe3Q',
      timestamp: new Date('2025-01-09T12:00:00'),
      likes: 3200,
      retweets: 920,
      replies: 187
    }
  ],
  'guild-5': [
    {
      id: 'tweet-8',
      content: '⚔️ Axie Origins Season 8 is LIVE!\n\nNew mechanics, new strategies, new rewards. Jump in and show us your best battles!\n\n#AxieInfinity #Gaming #P2E',
      author: 'Axie Infinity',
      handle: 'AxieInfinity',
      avatar: 'https://img.logo.dev/axieinfinity.com?token=pk_CqDF3xGeT3OFezZ1mvTe3Q',
      timestamp: new Date('2025-01-07T18:00:00'),
      likes: 5600,
      retweets: 2100,
      replies: 456
    }
  ],
  'guild-6': [
    {
      id: 'tweet-9',
      content: '🌿 Own your social graph with Lens Protocol.\n\nYour followers, your content, your data. Web3 social is here.\n\n#Lens #Web3Social #Decentralized',
      author: 'Lens Protocol',
      handle: 'LensProtocol',
      avatar: 'https://img.logo.dev/lens.xyz?token=pk_CqDF3xGeT3OFezZ1mvTe3Q',
      timestamp: new Date('2025-01-08T10:30:00'),
      likes: 2800,
      retweets: 1100,
      replies: 198
    }
  ]
}

// Campaign history for current user
export const campaignHistory: CampaignHistory[] = [
  { id: 'hist-1', campaignName: 'Uniswap v3 Tutorial Series', guildName: 'Uniswap', endDate: new Date('2024-12-31'), reward: 1850, rank: 3, totalParticipants: 245 },
  { id: 'hist-2', campaignName: 'Aave Lending Basics', guildName: 'Aave', endDate: new Date('2024-12-15'), reward: 920, rank: 8, totalParticipants: 312 },
  { id: 'hist-3', campaignName: 'Arbitrum One Launch', guildName: 'Arbitrum', endDate: new Date('2024-11-30'), reward: 1770, rank: 5, totalParticipants: 189 }
]

// Payout history for current user
export const payoutHistory: PayoutHistory[] = [
  { id: 'pay-1', amount: 1850, date: new Date('2025-01-02'), type: 'campaign_reward', description: 'Uniswap v4 Hooks Explainer' },
  { id: 'pay-2', amount: 500, date: new Date('2024-12-28'), type: 'referral', description: 'Referral bonus - 5 new creators' },
  { id: 'pay-3', amount: 920, date: new Date('2024-12-16'), type: 'campaign_reward', description: 'Aave GHO Deep Dive' },
  { id: 'pay-4', amount: 250, date: new Date('2024-12-10'), type: 'bonus', description: 'Top 10 weekly creator bonus' },
  { id: 'pay-5', amount: 1770, date: new Date('2024-12-01'), type: 'campaign_reward', description: 'Arbitrum Bridge Tutorial' }
]

// Activity data for charts
export const activityData: ActivityData[] = [
  { date: '2025-01-01', participants: 1240, rewards: 15000 },
  { date: '2025-01-02', participants: 1380, rewards: 18200 },
  { date: '2025-01-03', participants: 1520, rewards: 21000 },
  { date: '2025-01-04', participants: 1450, rewards: 19500 },
  { date: '2025-01-05', participants: 1680, rewards: 24800 },
  { date: '2025-01-06', participants: 1890, rewards: 28400 },
  { date: '2025-01-07', participants: 2100, rewards: 32000 },
  { date: '2025-01-08', participants: 1950, rewards: 29500 },
  { date: '2025-01-09', participants: 2250, rewards: 35000 }
]

// Recent reward payouts for the ticker - shows users who earned
export const recentPayouts: RewardPayout[] = [
  { id: 'payout-1', odsa: 'user-6', username: 'defi_educator', avatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=defieducator', guildId: 'guild-1', guildName: 'Uniswap', guildIcon: 'https://img.logo.dev/uniswap.org?token=pk_CqDF3xGeT3OFezZ1mvTe3Q', campaignName: 'v4 Hooks Explainer', amount: 5200, timestamp: new Date('2025-01-09T10:30:00') },
  { id: 'payout-2', odsa: 'user-2', username: 'crypto_sarah', avatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=cryptosarah', guildId: 'guild-3', guildName: 'Arbitrum', guildIcon: 'https://img.logo.dev/arbitrum.io?token=pk_CqDF3xGeT3OFezZ1mvTe3Q', campaignName: 'Bridge Tutorial', amount: 8400, timestamp: new Date('2025-01-09T09:15:00') },
  { id: 'payout-3', odsa: 'user-5', username: 'gaming_legend', avatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=gaminglegend', guildId: 'guild-5', guildName: 'Axie Infinity', guildIcon: 'https://img.logo.dev/axieinfinity.com?token=pk_CqDF3xGeT3OFezZ1mvTe3Q', campaignName: 'Origins Gameplay', amount: 3100, timestamp: new Date('2025-01-09T08:45:00') },
  { id: 'payout-4', odsa: 'user-3', username: 'yield_hunter', avatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=yieldhunter', guildId: 'guild-2', guildName: 'Aave', guildIcon: 'https://img.logo.dev/aave.com?token=pk_CqDF3xGeT3OFezZ1mvTe3Q', campaignName: 'GHO Deep Dive', amount: 2800, timestamp: new Date('2025-01-09T07:20:00') },
  { id: 'payout-5', odsa: 'user-8', username: 'nft_whale', avatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=nftwhale', guildId: 'guild-4', guildName: 'OpenSea', guildIcon: 'https://img.logo.dev/opensea.io?token=pk_CqDF3xGeT3OFezZ1mvTe3Q', campaignName: 'Collection Spotlight', amount: 1500, timestamp: new Date('2025-01-08T22:30:00') },
  { id: 'payout-6', odsa: 'user-9', username: 'web3_builder', avatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=web3builder', guildId: 'guild-6', guildName: 'Lens Protocol', guildIcon: 'https://img.logo.dev/lens.xyz?token=pk_CqDF3xGeT3OFezZ1mvTe3Q', campaignName: 'Build on Lens', amount: 950, timestamp: new Date('2025-01-08T18:15:00') },
  { id: 'payout-7', odsa: 'user-1', username: 'clipmaster_pro', avatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=clipmaster', guildId: 'guild-1', guildName: 'Uniswap', guildIcon: 'https://img.logo.dev/uniswap.org?token=pk_CqDF3xGeT3OFezZ1mvTe3Q', campaignName: 'First Swap Tutorial', amount: 4200, timestamp: new Date('2025-01-08T14:00:00') },
  { id: 'payout-8', odsa: 'user-4', username: 'l2_maxi', avatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=l2maxi', guildId: 'guild-3', guildName: 'Arbitrum', guildIcon: 'https://img.logo.dev/arbitrum.io?token=pk_CqDF3xGeT3OFezZ1mvTe3Q', campaignName: 'Orbit Explainer', amount: 6700, timestamp: new Date('2025-01-08T11:30:00') },
]

// Helper functions
export function getGuildById(id: string): Guild | undefined {
  return guilds.find(g => g.id === id)
}

export function getCampaignById(id: string): Campaign | undefined {
  return campaigns.find(c => c.id === id)
}

export function getCampaignsByGuild(guildId: string): Campaign[] {
  return campaigns.filter(c => c.guildId === guildId)
}

export function getGuildAnnouncements(guildId: string): Announcement[] {
  // In a real app, this would filter by guildId
  return announcements
}

export function getGuildMembers(guildId: string): GuildMember[] {
  // In a real app, this would filter by guildId
  return guildMembers
}

export function getUserRoleInGuild(guildId: string): 'admin' | 'moderator' | 'member' | null {
  if (guildId === 'guild-1') return 'admin'
  if (guildId === 'guild-2') return 'member'
  return null
}

export function getCampaignLeaderboard(campaignId: string): LeaderboardEntry[] {
  // Sample display names for variety
  const displayNames = [
    'Thriver🏆🏆', 'HknNFT 🐕🦌', 'katexbt.hl', 'Aether Midas ⌘⚔', 
    'cryptopsihoz', 'DeFi_Wizard', 'Web3_Builder', 'Alpha_Hunter',
    'Yield_Farmer', 'NFT_Collector'
  ]
  
  // Sample connections (other users they're connected to)
  const sampleConnections = [
    'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=conn1',
    'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=conn2',
    'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=conn3',
    'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=conn4',
  ]
  
  // Create deterministic seed from campaignId
  const seed = campaignId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  
  return guildMembers.slice(0, 10).map((member, index) => {
    // Generate multiplier - top rankers have higher multipliers (deterministic)
    const baseMultiplier = 15 - (index * 1.2)
    const variance = ((seed + index * 17) % 20) / 10 - 1 // -1 to 1 deterministic variance
    const multiplier = Math.max(1, baseMultiplier + variance)
    
    // Generate aura percentage - decreasing by rank (deterministic)
    const baseAura = 12 - (index * 1)
    const auraVariance = ((seed + index * 13) % 20) / 10 - 1
    const auraPercent = Math.max(1, baseAura + auraVariance)
    
    // Deterministic score and payout
    const score = ((seed * (index + 1) * 7) % 50000) + 10000
    const payout = ((seed * (index + 1) * 3) % 500) + 100
    
    // Deterministic connections count
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
}

export function getUserCampaignStats(campaignId: string): UserCampaignStats {
  // Use deterministic values based on campaignId to avoid hydration mismatch
  const hash = campaignId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return {
    rank: (hash % 20) + 1,
    score: ((hash * 17) % 30000) + 5000,
    estimatedReward: ((hash * 7) % 300) + 50,
    isParticipating: (hash % 3) !== 0
  }
}

export function getFeaturedCampaigns(): Campaign[] {
  return campaigns.filter(c => c.featured && c.status === 'active')
}

export function getForYouCampaigns(): Campaign[] {
  return campaigns.filter(c => c.forYou && c.status === 'active')
}

export function getActiveCampaigns(): Campaign[] {
  return campaigns.filter(c => c.status === 'active')
}

export function getTotalRewardsDistributed(): number {
  return guilds.reduce((acc, guild) => acc + guild.totalRewardsDistributed, 0)
}

export function formatRewardsShort(amount: number): string {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M`
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(0)}K`
  }
  return amount.toString()
}

export function getGuildInstalledApps(guildId: string): InstalledApp[] {
  return installedApps[guildId] || []
}

export function getGuildTwitterPosts(guildId: string): TwitterPost[] {
  return twitterPosts[guildId] || []
}

export function getCampaignsByType(guildId: string, type: CampaignType): Campaign[] {
  return campaigns.filter(c => c.guildId === guildId && c.type === type)
}

export function getInfoFiCampaigns(guildId: string): Campaign[] {
  return getCampaignsByType(guildId, 'InfoFi')
}

// Mock chat messages per guild
export const chatMessages: Record<string, ChatMessage[]> = {
  'guild-1': [
    {
      id: 'msg-1',
      guildId: 'guild-1',
      content: 'Hey everyone! Just submitted my first v4 Hooks tutorial. Excited to see how it does! 🚀',
      authorId: 'user-3',
      authorUsername: 'content_king',
      authorAvatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=contentking',
      authorRole: 'member',
      timestamp: new Date('2025-01-09T08:30:00'),
      reactions: [
        { emoji: '🔥', count: 5, userIds: ['user-1', 'user-2', 'user-4', 'user-5', 'user-6'] },
        { emoji: '👍', count: 3, userIds: ['user-7', 'user-8', 'user-9'] }
      ],
      mentions: []
    },
    {
      id: 'msg-2',
      guildId: 'guild-1',
      content: 'Nice work @content_king! Make sure to include the gas optimization section - that part is crucial for the hooks explanation.',
      authorId: 'user-1',
      authorUsername: 'clipmaster_pro',
      authorAvatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=clipmaster',
      authorRole: 'admin',
      timestamp: new Date('2025-01-09T08:35:00'),
      reactions: [
        { emoji: '👍', count: 2, userIds: ['user-3', 'user-4'] }
      ],
      mentions: ['user-3'],
      replyToId: 'msg-1',
      replyToUsername: 'content_king'
    },
    {
      id: 'msg-3',
      guildId: 'guild-1',
      content: 'Quick reminder: The First Swap Tutorial Challenge deadline is January 31st. We have already distributed $18K out of $25K in rewards! 💰',
      authorId: 'user-2',
      authorUsername: 'viral_queen',
      authorAvatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=viralqueen',
      authorRole: 'moderator',
      timestamp: new Date('2025-01-09T09:00:00'),
      reactions: [
        { emoji: '🚀', count: 8, userIds: ['user-1', 'user-3', 'user-4', 'user-5', 'user-6', 'user-7', 'user-8', 'user-9'] },
        { emoji: '💰', count: 4, userIds: ['user-3', 'user-5', 'user-8', 'user-10'] }
      ],
      mentions: []
    },
    {
      id: 'msg-4',
      guildId: 'guild-1',
      content: 'Does anyone know if we can use multiple hooks in a single pool? Still trying to wrap my head around the composability aspect.',
      authorId: 'user-4',
      authorUsername: 'tiktok_pro',
      authorAvatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=tiktokpro',
      authorRole: 'member',
      timestamp: new Date('2025-01-09T09:15:00'),
      reactions: [],
      mentions: []
    },
    {
      id: 'msg-5',
      guildId: 'guild-1',
      content: '@tiktok_pro Yes! You can compose multiple hooks together. Check out the docs on hook composition - it is one of the most powerful features of v4.',
      authorId: 'user-7',
      authorUsername: 'edit_wizard',
      authorAvatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=editwizard',
      authorRole: 'moderator',
      timestamp: new Date('2025-01-09T09:20:00'),
      reactions: [
        { emoji: '❤️', count: 1, userIds: ['user-4'] },
        { emoji: '🙏', count: 1, userIds: ['user-4'] }
      ],
      mentions: ['user-4'],
      replyToId: 'msg-4',
      replyToUsername: 'tiktok_pro'
    },
    {
      id: 'msg-6',
      guildId: 'guild-1',
      content: 'Just hit 50K views on my swap tutorial! Thanks for all the support from this community 🎉',
      authorId: 'user-6',
      authorUsername: 'viral_maker',
      authorAvatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=viralmaker',
      authorRole: 'member',
      timestamp: new Date('2025-01-09T10:00:00'),
      reactions: [
        { emoji: '🎉', count: 12, userIds: ['user-1', 'user-2', 'user-3', 'user-4', 'user-5', 'user-7', 'user-8', 'user-9', 'user-10', 'user-11', 'user-12', 'user-13'] },
        { emoji: '🔥', count: 6, userIds: ['user-1', 'user-2', 'user-3', 'user-4', 'user-5', 'user-7'] },
        { emoji: '👀', count: 3, userIds: ['user-8', 'user-9', 'user-10'] }
      ],
      mentions: []
    },
    {
      id: 'msg-7',
      guildId: 'guild-1',
      content: 'Congrats! What platform did you post on?',
      authorId: 'user-5',
      authorUsername: 'shorts_master',
      authorAvatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=shortsmaster',
      authorRole: 'member',
      timestamp: new Date('2025-01-09T10:05:00'),
      reactions: [],
      mentions: [],
      replyToId: 'msg-6',
      replyToUsername: 'viral_maker'
    },
    {
      id: 'msg-8',
      guildId: 'guild-1',
      content: '@shorts_master TikTok and YouTube Shorts simultaneously. The algo loved it on both platforms!',
      authorId: 'user-6',
      authorUsername: 'viral_maker',
      authorAvatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=viralmaker',
      authorRole: 'member',
      timestamp: new Date('2025-01-09T10:08:00'),
      reactions: [
        { emoji: '👍', count: 2, userIds: ['user-5', 'user-4'] }
      ],
      mentions: ['user-5'],
      replyToId: 'msg-7',
      replyToUsername: 'shorts_master'
    },
    {
      id: 'msg-9',
      guildId: 'guild-1',
      content: 'gm frens! Who else is grinding on campaigns today? 🌅',
      authorId: 'user-8',
      authorUsername: 'clip_guru',
      authorAvatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=clipguru',
      authorRole: 'member',
      timestamp: new Date('2025-01-09T11:00:00'),
      reactions: [
        { emoji: '☀️', count: 5, userIds: ['user-1', 'user-3', 'user-5', 'user-6', 'user-9'] },
        { emoji: '💪', count: 3, userIds: ['user-2', 'user-4', 'user-7'] }
      ],
      mentions: []
    },
    {
      id: 'msg-10',
      guildId: 'guild-1',
      content: 'New week, new content! Working on a hook that implements dynamic fees based on volatility. Anyone interested in collabing on the explainer video?',
      authorId: 'user-9',
      authorUsername: 'trend_setter',
      authorAvatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=trendsetter',
      authorRole: 'member',
      timestamp: new Date('2025-01-09T11:30:00'),
      reactions: [
        { emoji: '🤝', count: 4, userIds: ['user-1', 'user-3', 'user-6', 'user-8'] },
        { emoji: '🔥', count: 2, userIds: ['user-2', 'user-7'] }
      ],
      mentions: []
    }
  ],
  'guild-2': [
    {
      id: 'msg-aave-1',
      guildId: 'guild-2',
      content: 'Just published my GHO explainer! Focused on the collateral mechanism - let me know what you think.',
      authorId: 'user-3',
      authorUsername: 'content_king',
      authorAvatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=contentking',
      authorRole: 'member',
      timestamp: new Date('2025-01-09T09:00:00'),
      reactions: [
        { emoji: '👍', count: 4, userIds: ['user-1', 'user-2', 'user-4', 'user-5'] }
      ],
      mentions: []
    },
    {
      id: 'msg-aave-2',
      guildId: 'guild-2',
      content: 'Great content! The DeFi Safety campaign is getting a lot of traction. Keep the quality content coming everyone! 🛡️',
      authorId: 'user-2',
      authorUsername: 'viral_queen',
      authorAvatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=viralqueen',
      authorRole: 'moderator',
      timestamp: new Date('2025-01-09T09:30:00'),
      reactions: [
        { emoji: '🚀', count: 6, userIds: ['user-1', 'user-3', 'user-4', 'user-5', 'user-6', 'user-7'] }
      ],
      mentions: []
    }
  ],
  'guild-3': [
    {
      id: 'msg-arb-1',
      guildId: 'guild-3',
      content: 'Just bridged my first assets to Arbitrum! The gas savings are incredible compared to mainnet 🚀',
      authorId: 'user-4',
      authorUsername: 'tiktok_pro',
      authorAvatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=tiktokpro',
      authorRole: 'member',
      timestamp: new Date('2025-01-09T10:00:00'),
      reactions: [
        { emoji: '🔥', count: 5, userIds: ['user-1', 'user-2', 'user-3', 'user-5', 'user-6'] }
      ],
      mentions: []
    },
    {
      id: 'msg-arb-2',
      guildId: 'guild-3',
      content: 'The Orbit Explainer campaign is heating up! Already seeing some amazing technical breakdowns from the community.',
      authorId: 'user-1',
      authorUsername: 'clipmaster_pro',
      authorAvatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=clipmaster',
      authorRole: 'admin',
      timestamp: new Date('2025-01-09T10:30:00'),
      reactions: [
        { emoji: '💪', count: 4, userIds: ['user-2', 'user-4', 'user-5', 'user-7'] }
      ],
      mentions: []
    }
  ],
  'guild-4': [
    {
      id: 'msg-opensea-1',
      guildId: 'guild-4',
      content: 'Found an incredible artist for the spotlight series! Their collection is all hand-drawn pixel art 🎨',
      authorId: 'user-5',
      authorUsername: 'shorts_master',
      authorAvatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=shortsmaster',
      authorRole: 'member',
      timestamp: new Date('2025-01-09T11:00:00'),
      reactions: [
        { emoji: '🎨', count: 6, userIds: ['user-1', 'user-2', 'user-3', 'user-4', 'user-6', 'user-7'] },
        { emoji: '👀', count: 3, userIds: ['user-8', 'user-9', 'user-10'] }
      ],
      mentions: []
    },
    {
      id: 'msg-opensea-2',
      guildId: 'guild-4',
      content: 'Remember to always verify collection authenticity before featuring! Check for the blue checkmark.',
      authorId: 'user-7',
      authorUsername: 'edit_wizard',
      authorAvatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=editwizard',
      authorRole: 'moderator',
      timestamp: new Date('2025-01-09T11:15:00'),
      reactions: [
        { emoji: '✅', count: 4, userIds: ['user-1', 'user-5', 'user-6', 'user-8'] }
      ],
      mentions: []
    }
  ],
  'guild-5': [
    {
      id: 'msg-axie-1',
      guildId: 'guild-5',
      content: 'Season 8 meta is wild! Anyone else running the new aqua builds? 🐟',
      authorId: 'user-6',
      authorUsername: 'viral_maker',
      authorAvatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=viralmaker',
      authorRole: 'member',
      timestamp: new Date('2025-01-09T12:00:00'),
      reactions: [
        { emoji: '🎮', count: 5, userIds: ['user-1', 'user-2', 'user-3', 'user-4', 'user-5'] },
        { emoji: '⚔️', count: 3, userIds: ['user-7', 'user-8', 'user-9'] }
      ],
      mentions: []
    },
    {
      id: 'msg-axie-2',
      guildId: 'guild-5',
      content: 'Great content this week everyone! The gameplay challenge rewards are being distributed tomorrow 💰',
      authorId: 'user-2',
      authorUsername: 'viral_queen',
      authorAvatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=viralqueen',
      authorRole: 'moderator',
      timestamp: new Date('2025-01-09T12:30:00'),
      reactions: [
        { emoji: '🎉', count: 8, userIds: ['user-1', 'user-3', 'user-4', 'user-5', 'user-6', 'user-7', 'user-8', 'user-9'] }
      ],
      mentions: []
    }
  ],
  'guild-6': [
    {
      id: 'msg-lens-1',
      guildId: 'guild-6',
      content: 'Just deployed my first Lens app using the SDK! The documentation is super helpful 🌿',
      authorId: 'user-3',
      authorUsername: 'content_king',
      authorAvatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=contentking',
      authorRole: 'member',
      timestamp: new Date('2025-01-09T13:00:00'),
      reactions: [
        { emoji: '🌱', count: 5, userIds: ['user-1', 'user-2', 'user-4', 'user-5', 'user-6'] },
        { emoji: '👏', count: 3, userIds: ['user-7', 'user-8', 'user-9'] }
      ],
      mentions: []
    },
    {
      id: 'msg-lens-2',
      guildId: 'guild-6',
      content: 'The Build on Lens campaign has some amazing submissions! Web3 social is really taking off.',
      authorId: 'user-1',
      authorUsername: 'clipmaster_pro',
      authorAvatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=clipmaster',
      authorRole: 'admin',
      timestamp: new Date('2025-01-09T13:30:00'),
      reactions: [
        { emoji: '🚀', count: 6, userIds: ['user-2', 'user-3', 'user-4', 'user-5', 'user-6', 'user-7'] }
      ],
      mentions: []
    }
  ]
}

// Helper function to get chat messages for a guild
export function getGuildChatMessages(guildId: string): ChatMessage[] {
  return chatMessages[guildId] || []
}

// Helper to get a member by ID (useful for mentions)
export function getMemberById(memberId: string): GuildMember | undefined {
  return guildMembers.find(m => m.id === memberId)
}

// ============================================
// App Store Data
// ============================================

export const storeApps: StoreApp[] = [
  // ===== VIRALITY CATEGORY =====
  {
    id: 'app-infofi',
    slug: 'infofi',
    name: 'InfoFi',
    icon: 'https://api.dicebear.com/7.x/shapes/svg?seed=infofi&backgroundColor=22c55e&shape1Color=16a34a&shape2Color=15803d',
    shortDescription: 'Drive education-based viral reach through creator campaigns.',
    fullDescription: `InfoFi enables guilds to run educational content campaigns that reward creators for producing high-quality explainer content about your protocol or product.

Create live chat rooms where members can talk, share feedback, and stay engaged.

Key features:
• Real-time content tracking with engagement metrics
• AI-powered content quality scoring
• Multi-platform support (YouTube, Twitter, TikTok)
• Customizable reward tiers based on reach and quality
• Automated payout distribution

Perfect for protocols looking to educate their community and drive organic awareness through authentic creator content.`,
    category: 'Virality',
    developer: {
      name: 'Airaa',
      icon: 'https://api.dicebear.com/7.x/shapes/svg?seed=airaa',
      verified: true
    },
    stats: {
      reviews: 47,
      rating: 4.8,
      weeklyInstalls: 5150,
      totalInstalls: 42800,
      monthlyActiveUsers: 267600
    },
    screenshots: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=500&fit=crop'
    ],
    features: [
      'Real-time content tracking with engagement metrics',
      'AI-powered content quality scoring',
      'Multi-platform support (YouTube, Twitter, TikTok)',
      'Customizable reward tiers based on reach and quality',
      'Automated payout distribution'
    ],
    color: '#22c55e',
    isFree: true,
    isFeatured: true
  },
  {
    id: 'app-faucet',
    slug: 'faucet',
    name: 'Faucet',
    icon: 'https://api.dicebear.com/7.x/shapes/svg?seed=faucet&backgroundColor=06b6d4&shape1Color=0891b2&shape2Color=0e7490',
    shortDescription: 'Distribute tokens to verified community members.',
    fullDescription: `Faucet allows guilds to distribute tokens to verified community members as rewards for completing tasks, engagement, or as part of community growth initiatives.

Key features:
• Sybil-resistant verification with multiple identity providers
• Configurable claim limits and cooldown periods
• Multi-token support across EVM chains
• Integration with social verification
• Detailed analytics on distribution patterns

Ideal for onboarding new users and incentivizing early community participation.`,
    category: 'Virality',
    developer: {
      name: 'Airaa',
      icon: 'https://api.dicebear.com/7.x/shapes/svg?seed=airaa',
      verified: true
    },
    stats: {
      reviews: 23,
      rating: 4.5,
      weeklyInstalls: 2340,
      totalInstalls: 18500,
      monthlyActiveUsers: 89000
    },
    screenshots: [
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&h=500&fit=crop'
    ],
    features: [
      'Sybil-resistant verification with multiple identity providers',
      'Configurable claim limits and cooldown periods',
      'Multi-token support across EVM chains',
      'Integration with social verification',
      'Detailed analytics on distribution patterns'
    ],
    color: '#06b6d4',
    isFree: true,
    isNew: true
  },
  {
    id: 'app-affiliate',
    slug: 'affiliate',
    name: 'Affiliate',
    icon: 'https://api.dicebear.com/7.x/shapes/svg?seed=affiliate&backgroundColor=f59e0b&shape1Color=d97706&shape2Color=b45309',
    shortDescription: 'Track referral links and reward affiliates automatically.',
    fullDescription: `Affiliate enables guilds to create trackable referral programs with custom commission structures and automated payouts.

Key features:
• Unique referral link generation
• Real-time conversion tracking
• Tiered commission structures
• Automated USDC/token payouts
• Fraud detection and prevention

Perfect for growing your protocol through incentivized word-of-mouth marketing.`,
    category: 'Virality',
    developer: {
      name: 'Airaa',
      icon: 'https://api.dicebear.com/7.x/shapes/svg?seed=airaa',
      verified: true
    },
    stats: {
      reviews: 31,
      rating: 4.6,
      weeklyInstalls: 1890,
      totalInstalls: 24300,
      monthlyActiveUsers: 156000
    },
    screenshots: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop'
    ],
    features: [
      'Unique referral link generation',
      'Real-time conversion tracking',
      'Tiered commission structures',
      'Automated USDC/token payouts',
      'Fraud detection and prevention'
    ],
    color: '#f59e0b',
    isFree: true
  },
  {
    id: 'app-referral',
    slug: 'referral',
    name: 'Referral',
    icon: 'https://api.dicebear.com/7.x/shapes/svg?seed=referral&backgroundColor=8b5cf6&shape1Color=7c3aed&shape2Color=6d28d9',
    shortDescription: 'Create invite programs with milestone-based rewards.',
    fullDescription: `Referral helps guilds build viral growth through gamified invite programs with milestone rewards and leaderboards.

Key features:
• Gamified milestone system
• Real-time invite leaderboards
• Custom reward tiers
• Social sharing integrations
• Anti-gaming protections

Drive exponential growth through your existing community.`,
    category: 'Virality',
    developer: {
      name: 'Airaa',
      icon: 'https://api.dicebear.com/7.x/shapes/svg?seed=airaa',
      verified: true
    },
    stats: {
      reviews: 18,
      rating: 4.4,
      weeklyInstalls: 1245,
      totalInstalls: 15600,
      monthlyActiveUsers: 78000
    },
    screenshots: [
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop'
    ],
    features: [
      'Gamified milestone system',
      'Real-time invite leaderboards',
      'Custom reward tiers',
      'Social sharing integrations',
      'Anti-gaming protections'
    ],
    color: '#8b5cf6',
    isFree: true
  },

  // ===== ONCHAIN CATEGORY =====
  {
    id: 'app-liquidity',
    slug: 'liquidity',
    name: 'Liquidity',
    icon: 'https://api.dicebear.com/7.x/shapes/svg?seed=liquidity&backgroundColor=3b82f6&shape1Color=2563eb&shape2Color=1d4ed8',
    shortDescription: 'Incentivize liquidity provision with reward campaigns.',
    fullDescription: `Liquidity enables guilds to run LP incentive programs that reward users for providing liquidity to designated pools.

Key features:
• Multi-DEX support (Uniswap, Curve, Balancer)
• Time-weighted reward calculations
• Boosted rewards for lock-ups
• Real-time TVL tracking
• Automated reward distribution

Attract and retain liquidity providers with competitive incentive programs.`,
    category: 'Onchain',
    developer: {
      name: 'Airaa',
      icon: 'https://api.dicebear.com/7.x/shapes/svg?seed=airaa',
      verified: true
    },
    stats: {
      reviews: 56,
      rating: 4.9,
      weeklyInstalls: 3420,
      totalInstalls: 38900,
      monthlyActiveUsers: 234000
    },
    screenshots: [
      'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=500&fit=crop'
    ],
    features: [
      'Multi-DEX support (Uniswap, Curve, Balancer)',
      'Time-weighted reward calculations',
      'Boosted rewards for lock-ups',
      'Real-time TVL tracking',
      'Automated reward distribution'
    ],
    color: '#3b82f6',
    isFree: true,
    isFeatured: true
  },
  {
    id: 'app-token-holding',
    slug: 'token-holding',
    name: 'Token Holding',
    icon: 'https://api.dicebear.com/7.x/shapes/svg?seed=tokenholding&backgroundColor=eab308&shape1Color=ca8a04&shape2Color=a16207',
    shortDescription: 'Reward long-term holders with tiered incentives.',
    fullDescription: `Token Holding rewards users who hold your token over time with increasing benefits and exclusive access.

Key features:
• Snapshot-based balance tracking
• Tiered reward multipliers
• Holder leaderboards
• Exclusive access gating
• Diamond hands achievements

Build a loyal community of long-term believers.`,
    category: 'Onchain',
    developer: {
      name: 'Airaa',
      icon: 'https://api.dicebear.com/7.x/shapes/svg?seed=airaa',
      verified: true
    },
    stats: {
      reviews: 29,
      rating: 4.5,
      weeklyInstalls: 1780,
      totalInstalls: 21400,
      monthlyActiveUsers: 145000
    },
    screenshots: [
      'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&h=500&fit=crop'
    ],
    features: [
      'Snapshot-based balance tracking',
      'Tiered reward multipliers',
      'Holder leaderboards',
      'Exclusive access gating',
      'Diamond hands achievements'
    ],
    color: '#eab308',
    isFree: true
  },
  {
    id: 'app-lending',
    slug: 'lending-borrowing',
    name: 'Lending/Borrowing',
    icon: 'https://api.dicebear.com/7.x/shapes/svg?seed=lending&backgroundColor=06b6d4&shape1Color=0891b2&shape2Color=0e7490',
    shortDescription: 'Incentivize DeFi participation in lending protocols.',
    fullDescription: `Lending/Borrowing rewards users for active participation in supported lending protocols.

Key features:
• Multi-protocol support (Aave, Compound, Morpho)
• Supply and borrow tracking
• Interest rate boosters
• Health factor monitoring
• Cross-chain aggregation

Grow protocol TVL through targeted incentive campaigns.`,
    category: 'Onchain',
    developer: {
      name: 'Airaa',
      icon: 'https://api.dicebear.com/7.x/shapes/svg?seed=airaa',
      verified: true
    },
    stats: {
      reviews: 34,
      rating: 4.7,
      weeklyInstalls: 2150,
      totalInstalls: 28700,
      monthlyActiveUsers: 189000
    },
    screenshots: [
      'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=500&fit=crop'
    ],
    features: [
      'Multi-protocol support (Aave, Compound, Morpho)',
      'Supply and borrow tracking',
      'Interest rate boosters',
      'Health factor monitoring',
      'Cross-chain aggregation'
    ],
    color: '#06b6d4',
    isFree: true
  },

  // ===== VIDEO CATEGORY =====
  {
    id: 'app-clipping',
    slug: 'clipping',
    name: 'Clipping',
    icon: 'https://api.dicebear.com/7.x/shapes/svg?seed=clipping&backgroundColor=ec4899&shape1Color=db2777&shape2Color=be185d',
    shortDescription: 'Run video clipping campaigns for viral short-form content.',
    fullDescription: `Clipping enables guilds to run campaigns that reward creators for turning long-form content into viral short-form clips.

Key features:
• Source video integration
• Clip submission and review workflow
• Engagement tracking across platforms
• Quality scoring algorithms
• Batch approval tools

Turn your content library into viral short-form gold.`,
    category: 'Video',
    developer: {
      name: 'Airaa',
      icon: 'https://api.dicebear.com/7.x/shapes/svg?seed=airaa',
      verified: true
    },
    stats: {
      reviews: 67,
      rating: 4.8,
      weeklyInstalls: 4280,
      totalInstalls: 52300,
      monthlyActiveUsers: 312000
    },
    screenshots: [
      'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&h=500&fit=crop'
    ],
    features: [
      'Source video integration',
      'Clip submission and review workflow',
      'Engagement tracking across platforms',
      'Quality scoring algorithms',
      'Batch approval tools'
    ],
    color: '#ec4899',
    isFree: true,
    isFeatured: true
  },
  {
    id: 'app-ugc',
    slug: 'ugc',
    name: 'UGC',
    icon: 'https://api.dicebear.com/7.x/shapes/svg?seed=ugc&backgroundColor=f97316&shape1Color=ea580c&shape2Color=c2410c',
    shortDescription: 'Launch user-generated content campaigns at scale.',
    fullDescription: `UGC empowers guilds to run large-scale user-generated content campaigns with automated tracking and rewards.

Key features:
• Hashtag and mention tracking
• Multi-platform aggregation
• Content moderation tools
• Performance-based rewards
• Creator CRM integration

Harness the creativity of your community at scale.`,
    category: 'Video',
    developer: {
      name: 'Airaa',
      icon: 'https://api.dicebear.com/7.x/shapes/svg?seed=airaa',
      verified: true
    },
    stats: {
      reviews: 52,
      rating: 4.6,
      weeklyInstalls: 3890,
      totalInstalls: 45600,
      monthlyActiveUsers: 278000
    },
    screenshots: [
      'https://images.unsplash.com/photo-1492724441997-5dc865305da7?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=800&h=500&fit=crop'
    ],
    features: [
      'Hashtag and mention tracking',
      'Multi-platform aggregation',
      'Content moderation tools',
      'Performance-based rewards',
      'Creator CRM integration'
    ],
    color: '#f97316',
    isFree: true
  },

  // ===== AIRDROPS CATEGORY =====
  {
    id: 'app-token-airdrop',
    slug: 'token-airdrop',
    name: 'Token Airdrop',
    icon: 'https://api.dicebear.com/7.x/shapes/svg?seed=tokenairdrop&backgroundColor=f97316&shape1Color=ea580c&shape2Color=c2410c',
    shortDescription: 'Distribute ERC-20 tokens to qualified recipients.',
    fullDescription: `Token Airdrop enables efficient distribution of ERC-20 tokens to qualified community members based on custom criteria.

Key features:
• CSV import and criteria builder
• Gas-optimized batch transfers
• Claim portal with eligibility checker
• Anti-sybil verification
• Vesting schedule support

Execute airdrops with precision and security.`,
    category: 'Airdrops',
    developer: {
      name: 'Airaa',
      icon: 'https://api.dicebear.com/7.x/shapes/svg?seed=airaa',
      verified: true
    },
    stats: {
      reviews: 89,
      rating: 4.9,
      weeklyInstalls: 5620,
      totalInstalls: 78400,
      monthlyActiveUsers: 456000
    },
    screenshots: [
      'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&h=500&fit=crop'
    ],
    features: [
      'CSV import and criteria builder',
      'Gas-optimized batch transfers',
      'Claim portal with eligibility checker',
      'Anti-sybil verification',
      'Vesting schedule support'
    ],
    color: '#f97316',
    isFree: true,
    isFeatured: true
  },
  {
    id: 'app-nft-airdrop',
    slug: 'nft-airdrop',
    name: 'NFT Airdrop',
    icon: 'https://api.dicebear.com/7.x/shapes/svg?seed=nftairdrop&backgroundColor=a855f7&shape1Color=9333ea&shape2Color=7e22ce',
    shortDescription: 'Distribute NFTs to your community members.',
    fullDescription: `NFT Airdrop enables guilds to distribute collectibles and membership NFTs to community members.

Key features:
• ERC-721 and ERC-1155 support
• Dynamic metadata generation
• Claim page with wallet connection
• Snapshot-based eligibility
• Reveal mechanics

Reward your community with exclusive digital collectibles.`,
    category: 'Airdrops',
    developer: {
      name: 'Airaa',
      icon: 'https://api.dicebear.com/7.x/shapes/svg?seed=airaa',
      verified: true
    },
    stats: {
      reviews: 41,
      rating: 4.7,
      weeklyInstalls: 2890,
      totalInstalls: 34500,
      monthlyActiveUsers: 198000
    },
    screenshots: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=800&h=500&fit=crop'
    ],
    features: [
      'ERC-721 and ERC-1155 support',
      'Dynamic metadata generation',
      'Claim page with wallet connection',
      'Snapshot-based eligibility',
      'Reveal mechanics'
    ],
    color: '#a855f7',
    isFree: true,
    isNew: true
  },

  // ===== TOOLS CATEGORY =====
  {
    id: 'app-outreach',
    slug: 'outreach',
    name: 'Outreach',
    icon: 'https://api.dicebear.com/7.x/shapes/svg?seed=outreach&backgroundColor=8b5cf6&shape1Color=7c3aed&shape2Color=6d28d9',
    shortDescription: 'Run community outreach and engagement campaigns.',
    fullDescription: `Outreach helps guilds coordinate community outreach efforts with task-based rewards.

Key features:
• Task board with assignments
• Social engagement tracking
• Community ambassador program
• Progress dashboards
• Team coordination tools

Mobilize your community for coordinated growth initiatives.`,
    category: 'Tools',
    developer: {
      name: 'Airaa',
      icon: 'https://api.dicebear.com/7.x/shapes/svg?seed=airaa',
      verified: true
    },
    stats: {
      reviews: 25,
      rating: 4.4,
      weeklyInstalls: 1560,
      totalInstalls: 19800,
      monthlyActiveUsers: 112000
    },
    screenshots: [
      'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1552581234-26160f608093?w=800&h=500&fit=crop'
    ],
    features: [
      'Task board with assignments',
      'Social engagement tracking',
      'Community ambassador program',
      'Progress dashboards',
      'Team coordination tools'
    ],
    color: '#8b5cf6',
    isFree: true
  },

  // ===== DAPPS CATEGORY =====
  {
    id: 'app-jumper',
    slug: 'jumper',
    name: 'Jumper',
    icon: 'https://img.logo.dev/jumper.exchange?token=pk_CqDF3xGeT3OFezZ1mvTe3Q',
    shortDescription: 'Incentivize cross-chain bridging through Jumper.',
    fullDescription: `Jumper integration allows guilds to reward users for bridging assets across chains using the Jumper aggregator.

Key features:
• Bridge transaction tracking
• Volume-based rewards
• Multi-chain support
• Route optimization insights
• Leaderboard competitions

Drive cross-chain adoption with targeted incentives.`,
    category: 'Dapps',
    developer: {
      name: 'Jumper',
      icon: 'https://img.logo.dev/jumper.exchange?token=pk_CqDF3xGeT3OFezZ1mvTe3Q',
      verified: true
    },
    stats: {
      reviews: 38,
      rating: 4.6,
      weeklyInstalls: 2340,
      totalInstalls: 31200,
      monthlyActiveUsers: 187000
    },
    screenshots: [
      'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=500&fit=crop'
    ],
    features: [
      'Bridge transaction tracking',
      'Volume-based rewards',
      'Multi-chain support',
      'Route optimization insights',
      'Leaderboard competitions'
    ],
    color: '#14b8a6',
    isFree: true
  },
  {
    id: 'app-aave',
    slug: 'aave',
    name: 'Aave',
    icon: 'https://img.logo.dev/aave.com?token=pk_CqDF3xGeT3OFezZ1mvTe3Q',
    shortDescription: 'Reward Aave protocol participation and engagement.',
    fullDescription: `Aave integration enables guilds to reward users for lending and borrowing on Aave protocol.

Key features:
• Supply and borrow tracking
• GHO stablecoin integration
• Multi-market support
• Health factor rewards
• Protocol governance participation

Incentivize active Aave usage across your community.`,
    category: 'Dapps',
    developer: {
      name: 'Aave',
      icon: 'https://img.logo.dev/aave.com?token=pk_CqDF3xGeT3OFezZ1mvTe3Q',
      verified: true
    },
    stats: {
      reviews: 62,
      rating: 4.8,
      weeklyInstalls: 3890,
      totalInstalls: 48700,
      monthlyActiveUsers: 298000
    },
    screenshots: [
      'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=500&fit=crop'
    ],
    features: [
      'Supply and borrow tracking',
      'GHO stablecoin integration',
      'Multi-market support',
      'Health factor rewards',
      'Protocol governance participation'
    ],
    color: '#B6509E',
    isFree: true,
    isFeatured: true
  },
  {
    id: 'app-polymarket',
    slug: 'polymarket',
    name: 'Polymarket',
    icon: 'https://img.logo.dev/polymarket.com?token=pk_CqDF3xGeT3OFezZ1mvTe3Q',
    shortDescription: 'Incentivize prediction market participation.',
    fullDescription: `Polymarket integration enables guilds to reward users for participating in prediction markets.

Key features:
• Position tracking
• Volume-based rewards
• Market creation incentives
• Accuracy leaderboards
• Event-based campaigns

Engage your community through prediction markets.`,
    category: 'Dapps',
    developer: {
      name: 'Polymarket',
      icon: 'https://img.logo.dev/polymarket.com?token=pk_CqDF3xGeT3OFezZ1mvTe3Q',
      verified: true
    },
    stats: {
      reviews: 28,
      rating: 4.5,
      weeklyInstalls: 1780,
      totalInstalls: 22400,
      monthlyActiveUsers: 134000
    },
    screenshots: [
      'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=500&fit=crop'
    ],
    features: [
      'Position tracking',
      'Volume-based rewards',
      'Market creation incentives',
      'Accuracy leaderboards',
      'Event-based campaigns'
    ],
    color: '#3b82f6',
    isFree: true
  }
]

// Helper functions for store apps
export function getStoreApps(): StoreApp[] {
  return storeApps
}

export function getStoreAppBySlug(slug: string): StoreApp | undefined {
  return storeApps.find(app => app.slug === slug)
}

export function getStoreAppById(id: string): StoreApp | undefined {
  return storeApps.find(app => app.id === id)
}

export function getStoreAppsByCategory(category: string): StoreApp[] {
  if (category === 'All') return storeApps
  return storeApps.filter(app => app.category === category)
}

export function getFeaturedStoreApps(): StoreApp[] {
  return storeApps.filter(app => app.isFeatured)
}

export function getNewStoreApps(): StoreApp[] {
  return storeApps.filter(app => app.isNew)
}

// ============================================
// Support Chat Data
// ============================================

// Support conversations for guild-1 (Uniswap)
export const supportConversations: SupportConversation[] = [
  {
    id: 'conv-1',
    guildId: 'guild-1',
    memberId: 'user-3',
    memberUsername: 'content_king',
    memberAvatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=contentking',
    lastMessage: 'Thanks for the help! That makes sense now.',
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
    unreadCount: 0,
    status: 'active'
  },
  {
    id: 'conv-2',
    guildId: 'guild-1',
    memberId: 'user-4',
    memberUsername: 'tiktok_pro',
    memberAvatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=tiktokpro',
    lastMessage: 'When will the new campaign go live?',
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    unreadCount: 1,
    status: 'active'
  },
  {
    id: 'conv-3',
    guildId: 'guild-1',
    memberId: 'user-5',
    memberUsername: 'shorts_master',
    memberAvatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=shortsmaster',
    lastMessage: 'I submitted my video but it shows pending',
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    unreadCount: 2,
    status: 'active'
  },
  {
    id: 'conv-4',
    guildId: 'guild-1',
    memberId: 'user-6',
    memberUsername: 'viral_maker',
    memberAvatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=viralmaker',
    lastMessage: 'Got it, I\'ll update my content accordingly.',
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    unreadCount: 0,
    status: 'resolved'
  },
  {
    id: 'conv-5',
    guildId: 'guild-1',
    memberId: 'user-8',
    memberUsername: 'clip_guru',
    memberAvatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=clipguru',
    lastMessage: 'Perfect, thank you for the quick response!',
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    unreadCount: 0,
    status: 'resolved'
  }
]

// Support messages - organized by conversation
export const supportMessages: SupportMessage[] = [
  // Conversation 1 - content_king
  {
    id: 'smsg-1-1',
    conversationId: 'conv-1',
    senderId: 'user-3',
    senderUsername: 'content_king',
    senderAvatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=contentking',
    senderType: 'member',
    content: 'Hey! I have a question about the v4 Hooks campaign requirements.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    isRead: true
  },
  {
    id: 'smsg-1-2',
    conversationId: 'conv-1',
    senderId: 'user-1',
    senderUsername: 'clipmaster_pro',
    senderAvatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=clipmaster',
    senderType: 'admin',
    content: 'Hi! Sure, happy to help. What would you like to know about the campaign?',
    timestamp: new Date(Date.now() - 1000 * 60 * 55), // 55 min ago
    isRead: true
  },
  {
    id: 'smsg-1-3',
    conversationId: 'conv-1',
    senderId: 'user-3',
    senderUsername: 'content_king',
    senderAvatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=contentking',
    senderType: 'member',
    content: 'Do I need to cover all the hook types or can I focus on just one?',
    timestamp: new Date(Date.now() - 1000 * 60 * 50), // 50 min ago
    isRead: true
  },
  {
    id: 'smsg-1-4',
    conversationId: 'conv-1',
    senderId: 'user-1',
    senderUsername: 'clipmaster_pro',
    senderAvatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=clipmaster',
    senderType: 'admin',
    content: 'Great question! You can definitely focus on just one hook type. In fact, deep dives into specific hooks tend to perform really well. The key is making it educational and accessible.',
    timestamp: new Date(Date.now() - 1000 * 60 * 40), // 40 min ago
    isRead: true
  },
  {
    id: 'smsg-1-5',
    conversationId: 'conv-1',
    senderId: 'user-3',
    senderUsername: 'content_king',
    senderAvatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=contentking',
    senderType: 'member',
    content: 'Thanks for the help! That makes sense now.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
    isRead: true
  },
  
  // Conversation 2 - tiktok_pro
  {
    id: 'smsg-2-1',
    conversationId: 'conv-2',
    senderId: 'user-4',
    senderUsername: 'tiktok_pro',
    senderAvatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=tiktokpro',
    senderType: 'member',
    content: 'Hi there! I heard there\'s a new TikTok-focused campaign coming up?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    isRead: true
  },
  {
    id: 'smsg-2-2',
    conversationId: 'conv-2',
    senderId: 'user-1',
    senderUsername: 'clipmaster_pro',
    senderAvatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=clipmaster',
    senderType: 'admin',
    content: 'Yes! We\'re planning a new short-form content campaign. Stay tuned for the announcement!',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.5), // 2.5 hours ago
    isRead: true
  },
  {
    id: 'smsg-2-3',
    conversationId: 'conv-2',
    senderId: 'user-4',
    senderUsername: 'tiktok_pro',
    senderAvatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=tiktokpro',
    senderType: 'member',
    content: 'When will the new campaign go live?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    isRead: false
  },
  
  // Conversation 3 - shorts_master
  {
    id: 'smsg-3-1',
    conversationId: 'conv-3',
    senderId: 'user-5',
    senderUsername: 'shorts_master',
    senderAvatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=shortsmaster',
    senderType: 'member',
    content: 'Hello! I submitted my video for the First Swap Tutorial campaign.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
    isRead: true
  },
  {
    id: 'smsg-3-2',
    conversationId: 'conv-3',
    senderId: 'user-5',
    senderUsername: 'shorts_master',
    senderAvatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=shortsmaster',
    senderType: 'member',
    content: 'I submitted my video but it shows pending',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    isRead: false
  },
  
  // Conversation 4 - viral_maker
  {
    id: 'smsg-4-1',
    conversationId: 'conv-4',
    senderId: 'user-6',
    senderUsername: 'viral_maker',
    senderAvatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=viralmaker',
    senderType: 'member',
    content: 'Quick question - can I use music in my Uniswap explainer video?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25), // 25 hours ago
    isRead: true
  },
  {
    id: 'smsg-4-2',
    conversationId: 'conv-4',
    senderId: 'user-1',
    senderUsername: 'clipmaster_pro',
    senderAvatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=clipmaster',
    senderType: 'admin',
    content: 'Yes, but make sure to use royalty-free music or music you have rights to. We recommend checking the platform\'s music library for safe options.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24.5), // 24.5 hours ago
    isRead: true
  },
  {
    id: 'smsg-4-3',
    conversationId: 'conv-4',
    senderId: 'user-6',
    senderUsername: 'viral_maker',
    senderAvatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=viralmaker',
    senderType: 'member',
    content: 'Got it, I\'ll update my content accordingly.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 24 hours ago
    isRead: true
  },
  
  // Conversation 5 - clip_guru
  {
    id: 'smsg-5-1',
    conversationId: 'conv-5',
    senderId: 'user-8',
    senderUsername: 'clip_guru',
    senderAvatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=clipguru',
    senderType: 'member',
    content: 'Is there a minimum video length requirement for the clipping campaign?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 50), // 50 hours ago
    isRead: true
  },
  {
    id: 'smsg-5-2',
    conversationId: 'conv-5',
    senderId: 'user-1',
    senderUsername: 'clipmaster_pro',
    senderAvatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=clipmaster',
    senderType: 'admin',
    content: 'The minimum is 30 seconds, but we recommend 60-90 seconds for optimal engagement. Anything over 3 minutes might be too long for this particular campaign.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 49), // 49 hours ago
    isRead: true
  },
  {
    id: 'smsg-5-3',
    conversationId: 'conv-5',
    senderId: 'user-8',
    senderUsername: 'clip_guru',
    senderAvatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=clipguru',
    senderType: 'member',
    content: 'Perfect, thank you for the quick response!',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 48 hours ago
    isRead: true
  }
]

// Helper functions for support chat
export function getSupportConversations(guildId: string): SupportConversation[] {
  return supportConversations.filter(conv => conv.guildId === guildId)
}

export function getSupportConversationById(conversationId: string): SupportConversation | undefined {
  return supportConversations.find(conv => conv.id === conversationId)
}

export function getSupportConversationForMember(guildId: string, memberId: string): SupportConversation | undefined {
  return supportConversations.find(conv => conv.guildId === guildId && conv.memberId === memberId)
}

export function getSupportMessages(conversationId: string): SupportMessage[] {
  return supportMessages.filter(msg => msg.conversationId === conversationId)
}

export function getOrCreateSupportConversation(
  guildId: string,
  memberId: string,
  memberUsername?: string,
  memberAvatar?: string
): SupportConversation {
  const existing = getSupportConversationForMember(guildId, memberId)
  if (existing) return existing
  
  // Get member info if not provided
  const member = guildMembers.find(m => m.id === memberId)
  
  // Create a new conversation
  return {
    id: `conv-new-${memberId}`,
    guildId,
    memberId,
    memberUsername: memberUsername || member?.username || 'Unknown',
    memberAvatar: memberAvatar || member?.avatar || 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=unknown',
    lastMessage: '',
    lastMessageAt: new Date(),
    unreadCount: 0,
    status: 'active'
  }
}

/**
 * Add a new support message to a conversation
 * In a real app, this would POST to an API
 */
export function addSupportMessage(
  conversationId: string,
  senderId: string,
  senderUsername: string,
  senderAvatar: string,
  senderType: 'member' | 'admin',
  content: string
): SupportMessage {
  const newMessage: SupportMessage = {
    id: `smsg-${Date.now()}`,
    conversationId,
    senderId,
    senderUsername,
    senderAvatar,
    senderType,
    content,
    timestamp: new Date(),
    isRead: false
  }
  
  // In a real app, this would update the database
  // For now, just return the message (mock data is static)
  return newMessage
}

/**
 * Mark all messages in a conversation as read
 * In a real app, this would PUT to an API
 */
export function markConversationAsRead(conversationId: string): void {
  // In a real app, this would update the database
  // For mock purposes, this is a no-op since we don't persist state
}
