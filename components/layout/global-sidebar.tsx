'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Compass, Trophy, Medal, Plus, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth-context'
import { guilds } from '@/lib/mock-data'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'

const navItems = [
  { id: 'discover', label: 'Discover', icon: Compass, href: '/discover' },
  { id: 'campaigns', label: 'Campaigns', icon: Trophy, href: '/campaigns' },
  { id: 'leaderboard', label: 'Leaderboard', icon: Medal, href: '/leaderboard' },
]

export function GlobalSidebar() {
  const pathname = usePathname()
  const { user } = useAuth()
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Auto-collapse when navigating to guild routes
  useEffect(() => {
    const isInGuild = pathname.startsWith('/guild/')
    setIsCollapsed(isInGuild)
  }, [pathname])
  
  const joinedGuilds = guilds.filter(g => 
    user.joinedGuilds.includes(g.id)
  ).slice(0, 7)

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/')
  const isGuildActive = (id: string) => pathname.startsWith(`/guild/${id}`)

  return (
    <div 
      className={cn(
        "flex h-screen flex-col border-r border-zinc-800/50 bg-zinc-950 sidebar-transition flex-shrink-0",
        isCollapsed ? "w-[72px]" : "w-[240px]"
      )}
    >
      {/* Logo */}
      <div className={cn(
        "flex items-center h-14 border-b border-zinc-800/50",
        isCollapsed ? "justify-center px-3" : "px-4"
      )}>
        <Link 
          href="/discover"
          className="flex items-center gap-2"
        >
          <img 
            src="/logo.png" 
            alt="Airaa" 
            className="h-9 w-9 rounded-lg object-contain"
          />
          {!isCollapsed && (
            <span className="text-lg font-bold text-white">Airaa</span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <div className={cn("py-3", isCollapsed ? "px-3" : "px-3")}>
        {navItems.map((item) => {
          const active = isActive(item.href)
          const Icon = item.icon
          
          return isCollapsed ? (
            <Tooltip key={item.id}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={cn(
                    "flex h-10 w-full items-center justify-center rounded-lg mb-1 transition-all duration-200",
                    active 
                      ? "bg-green-500/15 text-green-500" 
                      : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                  )}
                >
                  <Icon className="h-5 w-5" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-zinc-900 border-zinc-700">
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "flex h-10 w-full items-center gap-3 rounded-lg px-3 mb-1 transition-all duration-200",
                active 
                  ? "bg-green-500/15 text-green-500" 
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>

      <Separator className="bg-zinc-800/50" />

      {/* Guilds Section */}
      <div className="flex-1 overflow-hidden py-3">
        {!isCollapsed && (
          <div className="px-4 mb-2">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Your Guilds
            </span>
          </div>
        )}
        
        <ScrollArea className="h-full px-3">
          <div className={cn(
            "flex flex-col",
            isCollapsed ? "items-center gap-2" : "gap-1"
          )}>
            {joinedGuilds.map((guild) => {
              const active = isGuildActive(guild.id)
              
              return isCollapsed ? (
                <Tooltip key={guild.id}>
                  <TooltipTrigger asChild>
                    <Link
                      href={`/guild/${guild.id}`}
                      className={cn(
                        "relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 overflow-hidden",
                        active ? "rounded-lg" : "hover:rounded-lg"
                      )}
                    >
                      {active && (
                        <div className="absolute -left-3 w-1 h-8 rounded-r-full bg-green-500" />
                      )}
                      <div
                        className={cn(
                          "h-full w-full rounded-xl overflow-hidden transition-all duration-200",
                          active ? "rounded-lg ring-2 ring-green-500" : "hover:rounded-lg"
                        )}
                      >
                        <img 
                          src={guild.icon} 
                          alt={guild.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-zinc-900 border-zinc-700">
                    <p className="font-medium">{guild.name}</p>
                    <p className="text-xs text-zinc-500">{guild.onlineMembers.toLocaleString()} online</p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Link
                  key={guild.id}
                  href={`/guild/${guild.id}`}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-2 py-2 transition-all duration-200",
                    active 
                      ? "bg-green-500/10 text-white" 
                      : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                  )}
                >
                  <div className={cn(
                    "h-8 w-8 rounded-lg overflow-hidden flex-shrink-0",
                    active && "ring-2 ring-green-500"
                  )}>
                    <img 
                      src={guild.icon} 
                      alt={guild.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{guild.name}</p>
                    <p className="text-xs text-zinc-500">{guild.activeCampaigns} campaigns</p>
                  </div>
                </Link>
              )
            })}

            {/* Add Guild Button */}
            {isCollapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800/50 text-green-500 hover:bg-zinc-800 transition-colors">
                    <Plus className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-zinc-900 border-zinc-700">
                  <p>Join Guild</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <button className="flex items-center gap-3 rounded-lg px-2 py-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800">
                  <Plus className="h-4 w-4 text-green-500" />
                </div>
                <span className="text-sm font-medium">Join Guild</span>
              </button>
            )}
          </div>
        </ScrollArea>
      </div>

      <Separator className="bg-zinc-800/50" />

      {/* Profile Section */}
      <div className={cn("py-3", isCollapsed ? "px-3" : "px-3")}>
        {isCollapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/profile"
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 overflow-hidden mx-auto",
                  isActive('/profile') ? "ring-2 ring-green-500" : "hover:ring-2 hover:ring-zinc-600"
                )}
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatar} alt={user.username} />
                  <AvatarFallback className="bg-zinc-800">
                    <User className="h-5 w-5 text-zinc-400" />
                  </AvatarFallback>
                </Avatar>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-zinc-900 border-zinc-700">
              <p className="font-medium">@{user.username}</p>
              <p className="text-xs text-green-500">${user.walletBalance.toLocaleString()}</p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <Link
            href="/profile"
            className={cn(
              "flex items-center gap-3 rounded-lg px-2 py-2 transition-all duration-200",
              isActive('/profile') 
                ? "bg-green-500/10 text-white" 
                : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
            )}
          >
            <Avatar className={cn(
              "h-9 w-9",
              isActive('/profile') && "ring-2 ring-green-500"
            )}>
              <AvatarImage src={user.avatar} alt={user.username} />
              <AvatarFallback className="bg-zinc-800">
                <User className="h-4 w-4 text-zinc-400" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">@{user.username}</p>
              <p className="text-xs text-green-500">${user.walletBalance.toLocaleString()}</p>
            </div>
          </Link>
        )}
      </div>

    </div>
  )
}
