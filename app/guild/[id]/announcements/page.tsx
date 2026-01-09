'use client'

import { useParams } from 'next/navigation'
import { format } from 'date-fns'
import { Pin, Shield, Crown } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { AppContainer } from '@/components/app-container'
import { useGuild } from '@/lib/guild-context'
import { getGuildAnnouncements, getUserRoleInGuild } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

export default function AnnouncementsPage() {
  const params = useParams()
  const guildId = params.id as string
  const { guild } = useGuild()
  
  const announcements = getGuildAnnouncements(guildId)
  const userRole = getUserRoleInGuild(guildId)

  // Sort announcements: pinned first, then by date
  const sortedAnnouncements = [...announcements].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    return b.timestamp.getTime() - a.timestamp.getTime()
  })

  const headerActions = userRole === 'admin' ? (
    <Badge 
      className="text-xs"
      style={{ 
        backgroundColor: `${guild.accentColor}20`,
        color: guild.accentColor,
      }}
    >
      <Crown className="h-3 w-3 mr-1" />
      Admin
    </Badge>
  ) : null

  return (
    <AppContainer
      appId="announcements"
      appName="Announcements"
      appIcon="📢"
      appDescription="Important updates and news from the guild"
      headerActions={headerActions}
    >
      <div className="p-6">
        {/* Announcements Feed */}
        <div className="space-y-4">
          {sortedAnnouncements.length > 0 ? (
            sortedAnnouncements.map((announcement) => (
              <Card 
                key={announcement.id}
                className={cn(
                  "border-zinc-800 bg-zinc-900/50 transition-colors hover:bg-zinc-900",
                  announcement.pinned && "border-l-4"
                )}
                style={announcement.pinned ? { borderLeftColor: guild.accentColor } : undefined}
              >
                <CardContent className="p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 ring-2 ring-zinc-800">
                        <AvatarImage src={announcement.authorAvatar} alt={announcement.authorName} />
                        <AvatarFallback className="bg-zinc-800">{announcement.authorName[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-zinc-100">{announcement.authorName}</span>
                          <Badge 
                            variant="secondary" 
                            className="text-xs"
                            style={{
                              backgroundColor: `${guild.accentColor}20`,
                              color: guild.accentColor,
                            }}
                          >
                            <Shield className="h-3 w-3 mr-1" />
                            Admin
                          </Badge>
                        </div>
                        <p className="text-xs text-zinc-500">
                          {format(announcement.timestamp, 'MMM d, yyyy \'at\' h:mm a')}
                        </p>
                      </div>
                    </div>
                    
                    {announcement.pinned && (
                      <Badge 
                        className="flex-shrink-0"
                        style={{
                          backgroundColor: `${guild.accentColor}20`,
                          color: guild.accentColor,
                        }}
                      >
                        <Pin className="h-3 w-3 mr-1" />
                        Pinned
                      </Badge>
                    )}
                  </div>

                  {/* Content */}
                  <div>
                    <h2 className="text-lg font-semibold text-zinc-100 mb-2">
                      {announcement.title}
                    </h2>
                    <div className="prose prose-sm prose-invert max-w-none">
                      <p className="text-zinc-300 whitespace-pre-wrap leading-relaxed">
                        {announcement.content}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div 
                className="flex h-16 w-16 items-center justify-center rounded-full mb-4"
                style={{ backgroundColor: `${guild.accentColor}20` }}
              >
                <Pin className="h-8 w-8" style={{ color: guild.accentColor }} />
              </div>
              <h3 className="text-lg font-semibold text-zinc-200 mb-2">No Announcements Yet</h3>
              <p className="text-zinc-500 max-w-sm">
                Check back later for important updates from the guild admins.
              </p>
            </div>
          )}
        </div>
      </div>
    </AppContainer>
  )
}
