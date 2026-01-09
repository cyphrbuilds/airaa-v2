/**
 * Step content configurations for all app types
 * The {Community} placeholder in intro headings will be replaced with the actual guild name
 */

export interface Step {
  title: string
  description: string
}

export interface AppStepContent {
  introHeading: string  // Uses {Community} placeholder
  introDescription: string
  steps: Step[]
}

export const appStepContent: Record<string, AppStepContent> = {
  // InfoFi - Mindshare campaign
  infofi: {
    introHeading: 'What is InfoFi Campaign?',
    introDescription: 'InfoFi is a mindshare campaign where creators compete on impact.',
    steps: [
      {
        title: 'Create content',
        description: 'Creators post about the project on supported social platforms.',
      },
      {
        title: 'Impact is measured',
        description: 'Content is scored using Aura based on engagement and quality.',
      },
      {
        title: 'Live leaderboard',
        description: 'Creators are ranked in real time based on their performance.',
      },
      {
        title: 'Rewards are distributed',
        description: 'Top-ranked creators earn a larger share of the reward pool.',
      },
      {
        title: 'Performance wins',
        description: 'There are no fixed payouts. Better performance earns more.',
      },
    ],
  },

  // Faucet
  faucet: {
    introHeading: 'Welcome to the {Community} Faucet',
    introDescription: 'Claim rewards by completing simple actions and getting paid.',
    steps: [
      {
        title: 'Check eligibility',
        description: 'See how much you can earn before participating.',
      },
      {
        title: 'Claim a slot',
        description: 'Claim rewards from the faucet.',
      },
      {
        title: 'Post and submit',
        description: 'Complete the action and submit proof.',
      },
      {
        title: 'Earn rewards',
        description: 'Get paid after verification.',
      },
    ],
  },

  // Affiliate
  affiliate: {
    introHeading: 'Welcome to the {Community} Affiliate Program',
    introDescription: 'Earn commissions by referring users to the project.',
    steps: [
      {
        title: 'Get your link',
        description: 'Receive a unique affiliate link.',
      },
      {
        title: 'Share and promote',
        description: 'Post your link across platforms.',
      },
      {
        title: 'Drive conversions',
        description: 'Referrals are tracked automatically.',
      },
      {
        title: 'Earn commissions',
        description: 'Get paid for successful referrals.',
      },
    ],
  },

  // Referral
  referral: {
    introHeading: 'Welcome to the {Community} Referral Campaign',
    introDescription: 'Invite others and earn rewards.',
    steps: [
      {
        title: 'Get referral link',
        description: 'Each user receives a unique link.',
      },
      {
        title: 'Invite users',
        description: 'Share the link with your audience.',
      },
      {
        title: 'Referrals join',
        description: 'Invited users complete required actions.',
      },
      {
        title: 'Earn rewards',
        description: 'Get rewarded for successful referrals.',
      },
    ],
  },

  // Liquidity
  liquidity: {
    introHeading: 'Welcome to the {Community} Liquidity Program',
    introDescription: 'Earn rewards by providing liquidity.',
    steps: [
      {
        title: 'Check requirements',
        description: 'View eligible pools and criteria.',
      },
      {
        title: 'Provide liquidity',
        description: 'Add liquidity using your wallet.',
      },
      {
        title: 'Stay eligible',
        description: 'Liquidity is tracked over time.',
      },
      {
        title: 'Earn rewards',
        description: 'Rewards depend on contribution.',
      },
    ],
  },

  // Token Holding
  'token-holding': {
    introHeading: 'Welcome to the {Community} Holder Rewards',
    introDescription: 'Earn rewards for holding tokens.',
    steps: [
      {
        title: 'Check eligibility',
        description: 'Wallet balances are checked automatically.',
      },
      {
        title: 'Hold tokens',
        description: 'Maintain required holdings.',
      },
      {
        title: 'Build consistency',
        description: 'Longer holding improves rewards.',
      },
      {
        title: 'Receive rewards',
        description: 'Rewards are distributed periodically.',
      },
    ],
  },

  // Lending / Borrowing
  'lending-borrowing': {
    introHeading: 'Welcome to the {Community} Lending Program',
    introDescription: 'Earn rewards by lending or borrowing.',
    steps: [
      {
        title: 'Connect wallet',
        description: 'Wallet activity is tracked.',
      },
      {
        title: 'Lend or borrow',
        description: 'Perform eligible actions.',
      },
      {
        title: 'Usage is measured',
        description: 'Amount and duration matter.',
      },
      {
        title: 'Earn rewards',
        description: 'Get rewarded for participation.',
      },
    ],
  },

  // Clipping
  clipping: {
    introHeading: 'Welcome to the {Community} Clipping Campaign',
    introDescription: 'Earn money by posting short-form clips.',
    steps: [
      {
        title: 'Claim a task',
        description: 'Select available clip tasks.',
      },
      {
        title: 'Create and post',
        description: 'Post clips on supported platforms.',
      },
      {
        title: 'Views are tracked',
        description: 'Performance is measured automatically.',
      },
      {
        title: 'Get paid',
        description: 'Rewards depend on performance.',
      },
    ],
  },

  // UGC
  ugc: {
    introHeading: 'Welcome to the {Community} UGC Campaign',
    introDescription: 'Earn rewards by creating original content.',
    steps: [
      {
        title: 'Join the campaign',
        description: 'Review content guidelines.',
      },
      {
        title: 'Create content',
        description: 'Produce original UGC.',
      },
      {
        title: 'Content is reviewed',
        description: 'Quality and relevance are evaluated.',
      },
      {
        title: 'Earn rewards',
        description: 'Approved content gets paid.',
      },
    ],
  },

  // Token Airdrop
  'token-airdrop': {
    introHeading: 'Welcome to the {Community} Token Airdrop',
    introDescription: 'Check eligibility and claim tokens.',
    steps: [
      {
        title: 'Check eligibility',
        description: 'Wallets are checked automatically.',
      },
      {
        title: 'Qualify',
        description: 'Meet required conditions.',
      },
      {
        title: 'Claim tokens',
        description: 'Eligible users can claim.',
      },
      {
        title: 'Receive airdrop',
        description: 'Tokens are sent to your wallet.',
      },
    ],
  },

  // NFT Airdrop
  'nft-airdrop': {
    introHeading: 'Welcome to the {Community} NFT Airdrop',
    introDescription: 'Check eligibility and claim NFTs.',
    steps: [
      {
        title: 'Check eligibility',
        description: 'Eligibility is verified automatically.',
      },
      {
        title: 'Qualify',
        description: 'Meet campaign criteria.',
      },
      {
        title: 'Claim NFT',
        description: 'Eligible users can claim.',
      },
      {
        title: 'Receive NFT',
        description: 'NFTs are sent to your wallet.',
      },
    ],
  },
}

/**
 * Get step content for an app, replacing {Community} placeholder
 */
export function getAppSteps(appSlug: string, communityName: string): Step[] {
  const content = appStepContent[appSlug]
  if (!content) return []

  // Create intro step with community name substitution
  const introStep: Step = {
    title: content.introHeading.replace('{Community}', communityName),
    description: content.introDescription,
  }

  return [introStep, ...content.steps]
}

/**
 * Check if an app has how-it-works content
 */
export function hasHowItWorksContent(appSlug: string): boolean {
  return appSlug in appStepContent
}
