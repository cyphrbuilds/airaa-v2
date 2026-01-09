'use client'

import { Crown, Medal } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LeaderboardEntry } from '@/types'
import { cn, formatCurrency, formatNumber } from '@/lib/utils'

interface LeaderboardProps {
  entries: LeaderboardEntry[]
  currentUserId?: string
  title?: string
}

export function Leaderboard({ entries, currentUserId, title = "Leaderboard" }: LeaderboardProps) {
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-4 w-4 text-yellow-500" />
    if (rank === 2) return <Medal className="h-4 w-4 text-zinc-400" />
    if (rank === 3) return <Medal className="h-4 w-4 text-amber-600" />
    return null
  }

  const getRankBg = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-500/10 to-transparent'
    if (rank === 2) return 'bg-gradient-to-r from-zinc-500/10 to-transparent'
    if (rank === 3) return 'bg-gradient-to-r from-amber-600/10 to-transparent'
    return ''
  }

  return (
    <Card className="border-zinc-800 bg-transparent">
      <CardHeader className="pb-3">
        <CardTitle className="text-base text-zinc-100">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-zinc-800/50">
          {entries.map((entry) => {
            const isCurrentUser = entry.userId === currentUserId
            
            return (
              <div 
                key={entry.userId || entry.rank}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 transition-colors",
                  getRankBg(entry.rank),
                  isCurrentUser && "bg-green-500/10"
                )}
              >
                {/* Rank */}
                <div className="flex items-center justify-center w-8">
                  {getRankIcon(entry.rank) || (
                    <span className="text-sm font-medium text-zinc-500">#{entry.rank}</span>
                  )}
                </div>
                
                {/* Avatar & Name */}
                <Avatar className="h-8 w-8">
                  <AvatarImage src={entry.avatar} alt={entry.username} />
                  <AvatarFallback className="bg-zinc-800 text-xs">
                    {entry.username[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "text-sm font-medium truncate",
                    isCurrentUser ? "text-green-400" : "text-zinc-200"
                  )}>
                    @{entry.username}
                    {isCurrentUser && <span className="text-zinc-500 ml-1">(You)</span>}
                  </p>
                </div>
                
                {/* Score & Payout */}
                <div className="text-right">
                  <p className="text-sm font-semibold text-green-400">
                    {formatCurrency(entry.estimatedPayout)}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {formatNumber(entry.score)} pts
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
