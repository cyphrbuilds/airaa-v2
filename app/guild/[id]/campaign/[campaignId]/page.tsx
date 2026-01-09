'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Zap, Users, CheckCircle2, Trophy, Target, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion'
import { Leaderboard } from '@/components/leaderboard'
import { AppContainer } from '@/components/app-container'
import { useGuild } from '@/lib/guild-context'
import { 
  getCampaignById, 
  getCampaignLeaderboard,
  getUserCampaignStats,
  currentUser,
} from '@/lib/mock-data'
import { formatCurrency, formatNumber, cn } from '@/lib/utils'
import { TAG_COLORS, APP_TYPE_INFO } from '@/types'

export default function CampaignPage() {
  const params = useParams()
  const guildId = params.id as string
  const campaignId = params.campaignId as string
  const { guild } = useGuild()
  
  const campaign = getCampaignById(campaignId)
  const leaderboard = getCampaignLeaderboard(campaignId)
  const userStats = getUserCampaignStats(campaignId)

  if (!campaign) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-zinc-500">Campaign not found</p>
      </div>
    )
  }

  const budgetProgress = (campaign.paidOut / campaign.totalReward) * 100
  const timeLeft = formatDistanceToNow(campaign.endDate, { addSuffix: false })
  
  // Get app info for the campaign type
  const appTypeKey = campaign.type.toLowerCase() as keyof typeof APP_TYPE_INFO
  const appInfo = APP_TYPE_INFO[appTypeKey] || { icon: '🏆', color: guild.accentColor }

  const headerActions = (
    <Link href={`/guild/${guildId}`}>
      <Button variant="ghost" size="sm" className="gap-2 text-zinc-400 hover:text-zinc-100">
        <ArrowLeft className="h-4 w-4" />
        Back to Guild
      </Button>
    </Link>
  )

  return (
    <AppContainer
      appId={`campaign-${campaignId}`}
      appName={campaign.name}
      appIcon={appInfo.icon}
      appDescription={campaign.description}
      appColor={appInfo.color}
      headerActions={headerActions}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hero */}
          <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50">
            {/* Banner/Thumbnail */}
            <div className="relative h-48 overflow-hidden">
              <img 
                src={campaign.thumbnail}
                alt={campaign.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/60 to-transparent" />
              
              {/* Tags overlay */}
              <div className="absolute top-4 left-4 flex gap-2">
                {campaign.tags.map((tag) => {
                  const colors = TAG_COLORS[tag]
                  return (
                    <Badge 
                      key={tag} 
                      variant="outline" 
                      className={cn("text-xs font-semibold border backdrop-blur-sm", colors.bg, colors.text)}
                    >
                      {tag}
                    </Badge>
                  )
                })}
              </div>
            </div>
            
            <div className="p-6 -mt-12 relative">
              <h1 className="text-2xl font-bold text-zinc-100 mb-2">
                {campaign.name}
              </h1>
              
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src={campaign.guildIcon}
                  alt={campaign.guildName}
                  className="h-5 w-5 rounded"
                />
                <span className="text-zinc-400">{campaign.guildName}</span>
              </div>
              
              <p className="text-zinc-400 mb-6">
                {campaign.description}
              </p>

              {/* Key metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-zinc-800/50 rounded-lg p-3">
                  <p className="text-xs text-zinc-500 mb-1">Total Reward</p>
                  <p className="text-xl font-bold text-green-500">${campaign.totalReward.toLocaleString()}</p>
                </div>
                <div className="bg-zinc-800/50 rounded-lg p-3">
                  <p className="text-xs text-zinc-500 mb-1">Time Left</p>
                  <p className="text-xl font-bold text-zinc-100">{timeLeft}</p>
                </div>
                <div className="bg-zinc-800/50 rounded-lg p-3">
                  <p className="text-xs text-zinc-500 mb-1">Participants</p>
                  <p className="text-xl font-bold text-zinc-100">{formatNumber(campaign.participantsCount)}</p>
                </div>
                <div className="bg-zinc-800/50 rounded-lg p-3">
                  <p className="text-xs text-zinc-500 mb-1">Type</p>
                  <p className="text-xl font-bold text-zinc-100 capitalize">{campaign.type}</p>
                </div>
              </div>

              {/* Budget progress */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-zinc-400">Budget Progress</span>
                  <span className="text-sm font-medium text-green-500">
                    ${formatNumber(campaign.paidOut)} / ${formatNumber(campaign.totalReward)}
                  </span>
                </div>
                <Progress value={budgetProgress} className="h-2" />
                <p className="text-xs text-zinc-500 mt-1">
                  ${formatNumber(campaign.totalReward - campaign.paidOut)} remaining
                </p>
              </div>

              {!userStats.isParticipating && campaign.status === 'active' && (
                <Button 
                  size="lg" 
                  className="mt-2"
                  style={{ background: guild.accentGradient }}
                >
                  <Target className="h-4 w-4 mr-2" />
                  Join Campaign
                </Button>
              )}
            </div>
          </div>

          {/* Rules & How to Participate */}
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardContent className="p-0">
              <Accordion type="single" collapsible defaultValue="rules">
                <AccordionItem value="rules" className="border-zinc-800">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800">
                        <CheckCircle2 className="h-4 w-4 text-zinc-400" />
                      </div>
                      <span className="font-semibold text-zinc-100">Campaign Rules</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <ul className="space-y-3">
                      {campaign.rules.map((rule, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-800 text-xs font-medium text-zinc-400">
                            {index + 1}
                          </span>
                          <span className="text-zinc-300 pt-0.5">{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="participate" className="border-zinc-800 border-b-0">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex items-center gap-3">
                      <div 
                        className="flex h-8 w-8 items-center justify-center rounded-lg"
                        style={{ backgroundColor: `${guild.accentColor}20` }}
                      >
                        <Target className="h-4 w-4" style={{ color: guild.accentColor }} />
                      </div>
                      <span className="font-semibold text-zinc-100">How to Participate</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <ul className="space-y-3">
                      {campaign.howToParticipate.map((step, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span 
                            className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium"
                            style={{ 
                              backgroundColor: `${guild.accentColor}20`,
                              color: guild.accentColor
                            }}
                          >
                            {index + 1}
                          </span>
                          <span className="text-zinc-300 pt-0.5">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* User Stats */}
          {userStats.isParticipating && (
            <Card 
              className="border-2"
              style={{ 
                borderColor: `${guild.accentColor}50`,
                backgroundColor: `${guild.accentColor}05`
              }}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Trophy className="h-4 w-4" style={{ color: guild.accentColor }} />
                  Your Position
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-zinc-100">#{userStats.rank}</p>
                    <p className="text-xs text-zinc-500">Rank</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-zinc-100">{formatNumber(userStats.score)}</p>
                    <p className="text-xs text-zinc-500">Score</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold" style={{ color: guild.accentColor }}>
                      {formatCurrency(userStats.estimatedReward)}
                    </p>
                    <p className="text-xs text-zinc-500">Est. Reward</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Leaderboard */}
          <Leaderboard 
            entries={leaderboard} 
            currentUserId={currentUser.id}
            title="Top Creators"
          />
        </div>
      </div>
    </AppContainer>
  )
}
