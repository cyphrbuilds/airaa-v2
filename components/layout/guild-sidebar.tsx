'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, ChevronRight, CheckCircle } from 'lucide-react'
import { Guild, InstalledApp } from '@/types'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import { getGuildInstalledApps } from '@/lib/mock-data'

interface GuildSidebarProps {
  guild: Guild
}

export function GuildSidebar({ guild }: GuildSidebarProps) {
  const pathname = usePathname()
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set())
  
  const installedApps = getGuildInstalledApps(guild.id)

  const toggleSection = (sectionId: string) => {
    setCollapsedSections(prev => {
      const newSet = new Set(prev)
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId)
      } else {
        newSet.add(sectionId)
      }
      return newSet
    })
  }

  const isActive = (href: string) => pathname === href
  const isAppActive = (appType: string) => pathname.startsWith(`/guild/${guild.id}/apps/${appType}`)

  return (
    <div className="flex h-full w-[240px] flex-col border-r border-zinc-800/50">
      {/* Banner */}
      <div className="relative h-28 overflow-hidden">
        <img 
          src={guild.banner} 
          alt={guild.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
      </div>

      {/* Guild Info */}
      <div className="relative px-4 -mt-6 pb-4 border-b border-zinc-800/50">
        <div className="flex items-end gap-3">
          <div 
            className="h-12 w-12 rounded-xl overflow-hidden flex-shrink-0 ring-2"
            style={{ 
              boxShadow: `0 0 20px ${guild.accentColor}40`,
              outlineColor: guild.accentColor,
              outline: `2px solid ${guild.accentColor}`
            }}
          >
            <img 
              src={guild.icon} 
              alt={guild.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0 pb-1">
            <div className="flex items-center gap-1.5">
              <h2 className="font-bold text-white truncate">{guild.name}</h2>
              {guild.verified && (
                <CheckCircle className="h-4 w-4 flex-shrink-0" style={{ color: guild.accentColor }} />
              )}
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">{guild.category}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {/* Support Section */}
          <div className="mb-1">
            <div className="px-2 py-1.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Support
            </div>
            <div className="space-y-0.5">
              <Link
                href="#"
                className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-all"
              >
                <span>💬</span>
                <span>Creator support chat</span>
              </Link>
            </div>
          </div>

          {/* Community Section */}
          <div className="mb-1">
            <button
              onClick={() => toggleSection('community')}
              className="flex items-center justify-between w-full px-2 py-1.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider hover:text-zinc-400 transition-colors"
            >
              <span>Community</span>
              {collapsedSections.has('community') ? (
                <ChevronRight className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </button>
            {!collapsedSections.has('community') && (
              <div className="space-y-0.5">
                <Link
                  href={`/guild/${guild.id}`}
                  className={cn(
                    "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-all",
                    isActive(`/guild/${guild.id}`)
                      ? "text-white" 
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                  )}
                  style={isActive(`/guild/${guild.id}`) ? { 
                    backgroundColor: `${guild.accentColor}20`,
                    color: guild.accentColor
                  } : undefined}
                >
                  <span>🏠</span>
                  <span>Overview</span>
                </Link>
                <Link
                  href={`/guild/${guild.id}/announcements`}
                  className={cn(
                    "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-all",
                    isActive(`/guild/${guild.id}/announcements`)
                      ? "text-white" 
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                  )}
                  style={isActive(`/guild/${guild.id}/announcements`) ? { 
                    backgroundColor: `${guild.accentColor}20`,
                    color: guild.accentColor
                  } : undefined}
                >
                  <span>📢</span>
                  <span>Announcements</span>
                </Link>
                <Link
                  href={`/guild/${guild.id}/chat`}
                  className={cn(
                    "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-all",
                    isActive(`/guild/${guild.id}/chat`)
                      ? "text-white" 
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                  )}
                  style={isActive(`/guild/${guild.id}/chat`) ? { 
                    backgroundColor: `${guild.accentColor}20`,
                    color: guild.accentColor
                  } : undefined}
                >
                  <span>💬</span>
                  <span>Chat</span>
                </Link>
              </div>
            )}
          </div>

          {/* Apps Section */}
          {installedApps.length > 0 && (
            <div className="mb-1">
              <button
                onClick={() => toggleSection('apps')}
                className="flex items-center justify-between w-full px-2 py-1.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider hover:text-zinc-400 transition-colors"
              >
                <span>Apps</span>
                {collapsedSections.has('apps') ? (
                  <ChevronRight className="h-3 w-3" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
              </button>
              {!collapsedSections.has('apps') && (
                <div className="space-y-0.5">
                  {installedApps.map((app) => {
                    const active = isAppActive(app.type)
                    
                    return (
                      <Link
                        key={app.id}
                        href={`/guild/${guild.id}/apps/${app.type}`}
                        className={cn(
                          "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-all",
                          active 
                            ? "text-white" 
                            : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                        )}
                        style={active ? { 
                          backgroundColor: `${app.color}20`,
                          color: app.color
                        } : undefined}
                      >
                        <span>{app.icon}</span>
                        <span>{app.name}</span>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
