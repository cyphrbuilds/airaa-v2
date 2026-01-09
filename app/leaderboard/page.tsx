'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Medal, Trophy, Crown, Users, TrendingUp, DollarSign } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { leaderboardUsers, leaderboardGuilds, currentUser } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

type TimeFilter = 'all' | 'month' | 'week'

const timeFilters: { value: TimeFilter; label: string }[] = [
  { value: 'all', label: 'All Time' },
  { value: 'month', label: 'This Month' },
  { value: 'week', label: 'This Week' },
]

function getRankIcon(rank: number) {
  if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />
  if (rank === 2) return <Medal className="h-5 w-5 text-zinc-400" />
  if (rank === 3) return <Medal className="h-5 w-5 text-amber-600" />
  return null
}

function getRankBg(rank: number) {
  if (rank === 1) return 'bg-gradient-to-r from-yellow-500/20 to-transparent border-l-yellow-500'
  if (rank === 2) return 'bg-gradient-to-r from-zinc-500/20 to-transparent border-l-zinc-400'
  if (rank === 3) return 'bg-gradient-to-r from-amber-600/20 to-transparent border-l-amber-600'
  return ''
}

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState('creators')
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all')

  // Find current user's rank
  const userRank = leaderboardUsers.find(u => u.userId === currentUser.id)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-zinc-800/50">
        <div className="hero-bg hero-particles absolute inset-0" />
        <div className="relative px-6 py-12 max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/20">
              <Trophy className="h-5 w-5 text-green-500" />
            </div>
            <h1 className="text-4xl font-bold text-white">
              Leaderboard
            </h1>
          </div>
          <p className="text-zinc-400 text-lg max-w-2xl">
            See who's leading the pack. Compete, climb the ranks, and earn recognition.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-8 max-w-7xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
            <TabsList className="bg-zinc-800/50 p-1">
              <TabsTrigger 
                value="creators" 
                className="gap-2 data-[state=active]:bg-zinc-700 data-[state=active]:text-white"
              >
                <Users className="h-4 w-4" />
                Creators
              </TabsTrigger>
              <TabsTrigger 
                value="guilds" 
                className="gap-2 data-[state=active]:bg-zinc-700 data-[state=active]:text-white"
              >
                <Trophy className="h-4 w-4" />
                Guilds
              </TabsTrigger>
            </TabsList>

            {/* Time filter */}
            <div className="flex items-center gap-2">
              {timeFilters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setTimeFilter(filter.value)}
                  className={cn(
                    "px-4 py-1.5 rounded-lg text-sm font-medium transition-all",
                    timeFilter === filter.value
                      ? "bg-green-500/20 text-green-500"
                      : "text-zinc-400 hover:text-zinc-200 bg-zinc-800/50 hover:bg-zinc-800"
                  )}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Creators Leaderboard */}
          <TabsContent value="creators">
            {/* Top 3 Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {leaderboardUsers.slice(0, 3).map((user, index) => (
                <Card 
                  key={user.userId}
                  className={cn(
                    "border-zinc-800 bg-transparent overflow-hidden",
                    index === 0 && "md:order-2 ring-2 ring-yellow-500/30",
                    index === 1 && "md:order-1",
                    index === 2 && "md:order-3"
                  )}
                >
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      {getRankIcon(user.rank)}
                    </div>
                    <Avatar className={cn(
                      "h-20 w-20 mx-auto mb-4",
                      user.rank === 1 && "ring-4 ring-yellow-500/50",
                      user.rank === 2 && "ring-4 ring-zinc-400/50",
                      user.rank === 3 && "ring-4 ring-amber-600/50"
                    )}>
                      <AvatarImage src={user.avatar} alt={user.username} />
                      <AvatarFallback className="bg-zinc-800 text-xl">
                        {user.username[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold text-zinc-100 mb-1">@{user.username}</h3>
                    <p className="text-2xl font-bold text-green-500 mb-2">
                      ${user.totalEarnings.toLocaleString()}
                    </p>
                    <div className="flex items-center justify-center gap-4 text-sm text-zinc-400">
                      <span>{user.campaignsCompleted} campaigns</span>
                      <span>{user.score.toLocaleString()} pts</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Full Table */}
            <Card className="border-zinc-800 bg-transparent">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-zinc-800">
                        <th className="text-left py-4 px-4 text-sm font-medium text-zinc-500 w-16">Rank</th>
                        <th className="text-left py-4 px-4 text-sm font-medium text-zinc-500">Creator</th>
                        <th className="text-right py-4 px-4 text-sm font-medium text-zinc-500">Earnings</th>
                        <th className="text-right py-4 px-4 text-sm font-medium text-zinc-500">Campaigns</th>
                        <th className="text-right py-4 px-4 text-sm font-medium text-zinc-500">Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboardUsers.map((user) => {
                        const isCurrentUser = user.userId === currentUser.id
                        
                        return (
                          <tr 
                            key={user.userId}
                            className={cn(
                              "border-b border-zinc-800/50 transition-colors hover:bg-zinc-800/30",
                              getRankBg(user.rank),
                              isCurrentUser && "bg-green-500/10 border-l-4 border-l-green-500"
                            )}
                          >
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                {getRankIcon(user.rank) || (
                                  <span className="text-zinc-500 font-medium">#{user.rank}</span>
                                )}
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={user.avatar} alt={user.username} />
                                  <AvatarFallback className="bg-zinc-800">
                                    {user.username[0].toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className={cn(
                                    "font-medium",
                                    isCurrentUser ? "text-green-500" : "text-zinc-200"
                                  )}>
                                    @{user.username}
                                    {isCurrentUser && <span className="text-xs text-zinc-500 ml-2">(You)</span>}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <span className="font-semibold text-green-500">
                                ${user.totalEarnings.toLocaleString()}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-right text-zinc-400">
                              {user.campaignsCompleted}
                            </td>
                            <td className="py-4 px-4 text-right text-zinc-400">
                              {user.score.toLocaleString()}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Your Rank Card (if not in top 10) */}
            {userRank && userRank.rank > 10 && (
              <Card className="mt-4 border-green-500/30 bg-green-500/5">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-green-500">#{userRank.rank}</span>
                      <Avatar className="h-10 w-10 ring-2 ring-green-500">
                        <AvatarImage src={userRank.avatar} alt={userRank.username} />
                        <AvatarFallback className="bg-zinc-800">
                          {userRank.username[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-green-500">@{userRank.username}</p>
                        <p className="text-xs text-zinc-500">Your position</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8 text-right">
                      <div>
                        <p className="text-sm text-zinc-500">Earnings</p>
                        <p className="font-semibold text-green-500">${userRank.totalEarnings.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-zinc-500">Score</p>
                        <p className="font-medium text-zinc-200">{userRank.score.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Guilds Leaderboard */}
          <TabsContent value="guilds">
            {/* Top 3 Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {leaderboardGuilds.slice(0, 3).map((guild, index) => (
                <Link 
                  href={`/guild/${guild.guildId}`}
                  key={guild.guildId}
                  className={cn(
                    "block",
                    index === 0 && "md:order-2",
                    index === 1 && "md:order-1",
                    index === 2 && "md:order-3"
                  )}
                >
                  <Card 
                    className={cn(
                      "border-zinc-800 bg-transparent overflow-hidden transition-all hover:border-zinc-700",
                      index === 0 && "ring-2 ring-yellow-500/30"
                    )}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="flex justify-center mb-4">
                        {getRankIcon(guild.rank)}
                      </div>
                      <div className={cn(
                        "h-20 w-20 mx-auto mb-4 rounded-xl overflow-hidden",
                        guild.rank === 1 && "ring-4 ring-yellow-500/50",
                        guild.rank === 2 && "ring-4 ring-zinc-400/50",
                        guild.rank === 3 && "ring-4 ring-amber-600/50"
                      )}>
                        <img 
                          src={guild.guildIcon} 
                          alt={guild.guildName}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <h3 className="font-semibold text-zinc-100 mb-1">{guild.guildName}</h3>
                      <p className="text-2xl font-bold text-green-500 mb-2">
                        ${(guild.totalRewardsDistributed / 1000000).toFixed(1)}M
                      </p>
                      <div className="flex items-center justify-center gap-4 text-sm text-zinc-400">
                        <span>{guild.totalMembers.toLocaleString()} members</span>
                        <span>{guild.activeCampaigns} campaigns</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Full Table */}
            <Card className="border-zinc-800 bg-transparent">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-zinc-800">
                        <th className="text-left py-4 px-4 text-sm font-medium text-zinc-500 w-16">Rank</th>
                        <th className="text-left py-4 px-4 text-sm font-medium text-zinc-500">Guild</th>
                        <th className="text-right py-4 px-4 text-sm font-medium text-zinc-500">Distributed</th>
                        <th className="text-right py-4 px-4 text-sm font-medium text-zinc-500">Members</th>
                        <th className="text-right py-4 px-4 text-sm font-medium text-zinc-500">Campaigns</th>
                        <th className="text-right py-4 px-4 text-sm font-medium text-zinc-500">Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboardGuilds.map((guild) => (
                        <tr 
                          key={guild.guildId}
                          className={cn(
                            "border-b border-zinc-800/50 transition-colors hover:bg-zinc-800/30",
                            getRankBg(guild.rank)
                          )}
                        >
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              {getRankIcon(guild.rank) || (
                                <span className="text-zinc-500 font-medium">#{guild.rank}</span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <Link href={`/guild/${guild.guildId}`} className="flex items-center gap-3 hover:opacity-80">
                              <div className="h-10 w-10 rounded-lg overflow-hidden">
                                <img 
                                  src={guild.guildIcon} 
                                  alt={guild.guildName}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <p className="font-medium text-zinc-200">{guild.guildName}</p>
                            </Link>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <span className="font-semibold text-green-500">
                              ${(guild.totalRewardsDistributed / 1000).toLocaleString()}k
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right text-zinc-400">
                            {guild.totalMembers.toLocaleString()}
                          </td>
                          <td className="py-4 px-4 text-right text-zinc-400">
                            {guild.activeCampaigns}
                          </td>
                          <td className="py-4 px-4 text-right text-zinc-400">
                            {guild.score.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
