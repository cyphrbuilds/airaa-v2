'use client'

import { 
  DollarSign, 
  Users, 
  Trophy, 
  TrendingUp,
  ArrowUpRight,
} from 'lucide-react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts'
import { StatsCard } from '@/components/stats-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { campaigns, activityData } from '@/lib/mock-data'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { CampaignTag, TAG_COLORS } from '@/types'
import { cn } from '@/lib/utils'

// Mock data for admin charts
const rewardSpendData = [
  { month: 'Aug', spend: 45000 },
  { month: 'Sep', spend: 62000 },
  { month: 'Oct', spend: 58000 },
  { month: 'Nov', spend: 89000 },
  { month: 'Dec', spend: 95000 },
  { month: 'Jan', spend: 125000 },
]

export default function AdminDashboard() {
  const totalRewardsSpent = rewardSpendData.reduce((sum, d) => sum + d.spend, 0)
  const totalParticipants = campaigns.reduce((sum, c) => sum + c.participantsCount, 0)
  const activeCampaignCount = campaigns.filter(c => c.status === 'active').length
  const totalRewards = campaigns.reduce((sum, c) => sum + c.totalReward, 0)
  const avgReward = totalRewards / campaigns.length

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-100 mb-2">Admin Dashboard</h1>
        <p className="text-zinc-400">
          Overview of your platform performance and analytics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          label="Total Paid Out"
          value={formatCurrency(campaigns.reduce((sum, c) => sum + c.paidOut, 0))}
          icon={DollarSign}
          valueClassName="text-green-400"
          trend={{ value: 23.5, positive: true }}
        />
        <StatsCard
          label="Active Campaigns"
          value={activeCampaignCount}
          icon={Trophy}
          trend={{ value: 12, positive: true }}
        />
        <StatsCard
          label="Total Participants"
          value={formatNumber(totalParticipants)}
          icon={Users}
          trend={{ value: 8.3, positive: true }}
        />
        <StatsCard
          label="Avg. Reward"
          value={formatCurrency(avgReward)}
          icon={TrendingUp}
          trend={{ value: 4.2, positive: true }}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Reward Spend Chart */}
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              <span>Reward Spend Over Time</span>
              <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +32%
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={rewardSpendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fill: '#71717a', fontSize: 12 }}
                    axisLine={{ stroke: '#27272a' }}
                    tickLine={false}
                  />
                  <YAxis 
                    tickFormatter={(v) => `$${v/1000}k`}
                    tick={{ fill: '#71717a', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#18181b',
                      border: '1px solid #27272a',
                      borderRadius: '8px',
                      color: '#fafafa',
                    }}
                    formatter={(value: number) => [formatCurrency(value), 'Spent']}
                  />
                  <Bar 
                    dataKey="spend" 
                    fill="#22c55e" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Participation Trend */}
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              <span>Daily Participation</span>
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +18%
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    tick={{ fill: '#71717a', fontSize: 12 }}
                    axisLine={{ stroke: '#27272a' }}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fill: '#71717a', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#18181b',
                      border: '1px solid #27272a',
                      borderRadius: '8px',
                      color: '#fafafa',
                    }}
                    labelFormatter={(d) => new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="participants" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Performance Table */}
      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardHeader>
          <CardTitle className="text-base">Campaign Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left py-3 px-4 text-sm font-medium text-zinc-500">Campaign</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-zinc-500">Tags</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-zinc-500">Status</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-zinc-500">Participants</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-zinc-500">Budget</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-zinc-500">Progress</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.slice(0, 6).map((campaign) => {
                  const statusColors = {
                    active: 'bg-green-500/20 text-green-400 border-green-500/30',
                    upcoming: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
                    past: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
                  }
                  const progress = Math.round((campaign.paidOut / campaign.totalReward) * 100)
                  
                  return (
                    <tr key={campaign.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                      <td className="py-3 px-4">
                        <span className="font-medium text-zinc-200">{campaign.name}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1">
                          {campaign.tags.slice(0, 2).map((tag) => {
                            const colors = TAG_COLORS[tag]
                            return (
                              <Badge 
                                key={tag} 
                                className={cn(colors.bg, colors.text)} 
                                variant="outline"
                              >
                                {tag}
                              </Badge>
                            )
                          })}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={statusColors[campaign.status]} variant="outline">
                          {campaign.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right text-zinc-300">
                        {campaign.participantsCount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="font-medium text-green-400">
                          ${formatNumber(campaign.paidOut)}
                        </span>
                        <span className="text-zinc-500"> / ${formatNumber(campaign.totalReward)}</span>
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-zinc-200">
                        {progress}%
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
