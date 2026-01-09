'use client'

import { LeaderboardUser } from '@/types'
import { cn } from '@/lib/utils'
import { Trophy, Medal, Award } from 'lucide-react'

interface TopEarnerCardProps {
  user: LeaderboardUser
  className?: string
}

const rankIcons: Record<number, React.ReactNode> = {
  1: <Trophy className="h-4 w-4 text-yellow-500" />,
  2: <Medal className="h-4 w-4 text-zinc-400" />,
  3: <Award className="h-4 w-4 text-amber-600" />,
}

const rankColors: Record<number, string> = {
  1: 'bg-yellow-500/10 border-yellow-500/30',
  2: 'bg-zinc-400/10 border-zinc-400/30',
  3: 'bg-amber-600/10 border-amber-600/30',
}

export function TopEarnerCard({ user, className }: TopEarnerCardProps) {
  const isTopThree = user.rank <= 3
  const RankIcon = rankIcons[user.rank]

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg border transition-all hover:bg-zinc-800/30",
        isTopThree ? rankColors[user.rank] : "border-zinc-800",
        className
      )}
    >
      {/* Rank */}
      <div className="flex items-center justify-center w-8 h-8 flex-shrink-0">
        {RankIcon ? (
          RankIcon
        ) : (
          <span className="text-sm font-bold text-zinc-500">#{user.rank}</span>
        )}
      </div>

      {/* Avatar */}
      <div className="h-10 w-10 rounded-full overflow-hidden flex-shrink-0 border-2 border-zinc-700">
        <img
          src={user.avatar}
          alt={user.username}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-zinc-100 truncate">{user.username}</p>
        <p className="text-xs text-zinc-500">
          {user.campaignsCompleted} campaigns
        </p>
      </div>

      {/* Earnings */}
      <div className="text-right flex-shrink-0">
        <p className="font-bold text-green-500">
          ${user.totalEarnings.toLocaleString()}
        </p>
        <p className="text-xs text-zinc-500">this week</p>
      </div>
    </div>
  )
}

interface TopEarnersListProps {
  users: LeaderboardUser[]
  maxDisplay?: number
  className?: string
}

export function TopEarnersList({ users, maxDisplay = 5, className }: TopEarnersListProps) {
  const displayUsers = users.slice(0, maxDisplay)

  return (
    <div className={cn("space-y-2", className)}>
      {displayUsers.map((user) => (
        <TopEarnerCard key={user.userId} user={user} />
      ))}
    </div>
  )
}
