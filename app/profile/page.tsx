'use client'

import { format } from 'date-fns'
import Link from 'next/link'
import { 
  Wallet, 
  Sparkles, 
  Trophy, 
  DollarSign,
  Gift,
  Award,
  TrendingUp,
  Medal
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { campaignHistory, payoutHistory, guilds, leaderboardUsers } from '@/lib/mock-data'
import { formatCurrency, formatNumber } from '@/lib/utils'

export default function ProfilePage() {
  const { user } = useAuth()

  const payoutTypeIcons = {
    campaign_reward: Trophy,
    referral: Gift,
    bonus: Award,
  }

  const payoutTypeColors = {
    campaign_reward: 'text-green-400',
    referral: 'text-blue-400',
    bonus: 'text-purple-400',
  }

  const totalEarned = campaignHistory.reduce((sum, h) => sum + h.reward, 0)
  const bestRank = Math.min(...campaignHistory.map(h => h.rank))
  const userLeaderboardRank = leaderboardUsers.find(u => u.userId === user.id)
  const joinedGuilds = guilds.filter(g => user.joinedGuilds.includes(g.id))

  return (
    <div className="min-h-screen p-6">
      {/* Profile Header */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-800 p-8 mb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-green-500/5" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative flex items-start gap-6">
          <Avatar className="h-24 w-24 ring-4 ring-green-500/30">
            <AvatarImage src={user.avatar} alt={user.username} />
            <AvatarFallback className="text-2xl bg-zinc-800">{user.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold text-zinc-100">@{user.username}</h1>
              {userLeaderboardRank && (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  <Medal className="h-3 w-3 mr-1" />
                  #{userLeaderboardRank.rank} Global
                </Badge>
              )}
            </div>
            <p className="text-zinc-400 mb-6">Creator since January 2025</p>
            
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/20 ring-1 ring-green-500/30">
                  <Wallet className="h-7 w-7 text-green-500" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wide">Wallet Balance</p>
                  <p className="text-2xl font-bold text-green-400">
                    {formatCurrency(user.walletBalance)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/20 ring-1 ring-green-500/30">
                  <Sparkles className="h-7 w-7 text-green-500" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wide">Aura Points</p>
                  <p className="text-2xl font-bold gradient-text">
                    {formatNumber(user.auraPoints)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/20 ring-1 ring-green-500/30">
                  <Trophy className="h-7 w-7 text-green-500" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wide">Campaigns</p>
                  <p className="text-2xl font-bold text-zinc-100">
                    {campaignHistory.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="border-zinc-800">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-zinc-500 mb-1">Total Earned</p>
            <p className="text-2xl font-bold text-green-400">
              {formatCurrency(totalEarned)}
            </p>
          </CardContent>
        </Card>
        <Card className="border-zinc-800">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-zinc-500 mb-1">Best Rank</p>
            <p className="text-2xl font-bold text-green-400">
              #{bestRank}
            </p>
          </CardContent>
        </Card>
        <Card className="border-zinc-800">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-zinc-500 mb-1">Guilds</p>
            <p className="text-2xl font-bold text-zinc-100">
              {user.joinedGuilds.length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-zinc-800">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-zinc-500 mb-1">Avg. Reward</p>
            <p className="text-2xl font-bold text-zinc-100">
              {formatCurrency(totalEarned / campaignHistory.length)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Joined Guilds */}
      <Card className="border-zinc-800 mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Trophy className="h-4 w-4 text-green-500" />
            Your Guilds
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {joinedGuilds.map((guild) => (
              <Link
                key={guild.id}
                href={`/guild/${guild.id}`}
                className="flex items-center gap-3 px-4 py-3 rounded-lg border border-zinc-800 hover:bg-zinc-800/30 transition-colors"
              >
                <div className="h-10 w-10 rounded-lg overflow-hidden">
                  <img src={guild.icon} alt={guild.name} className="h-full w-full object-cover" />
                </div>
                <div>
                  <p className="font-medium text-zinc-200">{guild.name}</p>
                  <p className="text-xs text-zinc-500">{guild.activeCampaigns} active campaigns</p>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Campaign History */}
        <Card className="border-zinc-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Trophy className="h-4 w-4 text-green-500" />
              Campaign History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {campaignHistory.map((history) => (
                <div 
                  key={history.id}
                  className="flex items-center gap-4 p-3 rounded-lg border border-zinc-800 hover:bg-zinc-800/30 transition-colors"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-green-500/20 to-green-600/20">
                    <span className="text-sm font-bold text-green-400">#{history.rank}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-zinc-200 truncate">{history.campaignName}</p>
                    <p className="text-xs text-zinc-500">{history.guildName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-400">{formatCurrency(history.reward)}</p>
                    <p className="text-xs text-zinc-500">
                      {format(history.endDate, 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payout History */}
        <Card className="border-zinc-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <DollarSign className="h-4 w-4 text-green-500" />
              Payout History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {payoutHistory.map((payout) => {
                const Icon = payoutTypeIcons[payout.type]
                const colorClass = payoutTypeColors[payout.type]
                
                return (
                  <div 
                    key={payout.id}
                    className="flex items-center gap-4 p-3 rounded-lg border border-zinc-800 hover:bg-zinc-800/30 transition-colors"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800">
                      <Icon className={`h-5 w-5 ${colorClass}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-zinc-200 truncate">{payout.description}</p>
                      <Badge variant="secondary" className="text-xs capitalize mt-0.5">
                        {payout.type.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-400">+{formatCurrency(payout.amount)}</p>
                      <p className="text-xs text-zinc-500">
                        {format(payout.date, 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
