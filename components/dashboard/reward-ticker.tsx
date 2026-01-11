'use client'

import Link from 'next/link'
import { RewardPayout } from '@/types'

interface RewardTickerProps {
  payouts: RewardPayout[]
}

export function RewardTicker({ payouts }: RewardTickerProps) {
  // Duplicate payouts for seamless loop
  const items = [...payouts, ...payouts]

  const formatRewardDisplay = (payout: RewardPayout) => {
    if (payout.rewardType === 'token') {
      return (
        <span className="flex items-center gap-1.5 text-sm font-semibold text-green-500">
          earned
          {payout.tokenIcon && (
            <img
              src={payout.tokenIcon}
              alt={payout.tokenSymbol}
              className="h-4 w-4 rounded-full"
            />
          )}
          <span>{payout.amount.toLocaleString()}</span>
          <span>${payout.tokenSymbol}</span>
        </span>
      )
    } else {
      // Points reward
      return (
        <span className="text-sm font-semibold text-green-500">
          earned {payout.amount.toLocaleString()} {payout.pointsName}
        </span>
      )
    }
  }

  return (
    <div className="relative w-full overflow-hidden border-b border-zinc-800/50 py-2.5">
      <div className="flex animate-marquee hover:[animation-play-state:paused]">
        {items.map((payout, index) => (
          <div
            key={`${payout.id}-${index}`}
            className="flex items-center gap-2 whitespace-nowrap flex-shrink-0 px-4"
          >
            <img
              src={payout.avatar}
              alt={payout.username}
              className="h-5 w-5 rounded-full"
            />
            <span className="text-sm font-medium text-zinc-200">
              {payout.username}
            </span>
            {formatRewardDisplay(payout)}
            <span className="text-sm text-zinc-500">from</span>
            <Link
              href={`/guild/${payout.guildId}`}
              className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
            >
              <img
                src={payout.guildIcon}
                alt={payout.guildName}
                className="h-4 w-4 rounded-full"
              />
              <span className="text-sm text-zinc-400">
                {payout.guildName}
              </span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
