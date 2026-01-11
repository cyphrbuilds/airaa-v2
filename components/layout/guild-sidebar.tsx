'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ChevronDown, ChevronRight, CheckCircle, MoreVertical, Settings, BarChart3, PlusCircle, Users, Trash2 } from 'lucide-react'
import { Guild, InstalledApp } from '@/types'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useGuild } from '@/lib/guild-context'
import { AppSettingsModal, AppCustomization } from '@/components/guild/app-settings-modal'

interface GuildSidebarProps {
  guild: Guild
}

export function GuildSidebar({ guild }: GuildSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set())
  const [hoveredAppId, setHoveredAppId] = useState<string | null>(null)
  const [openMenuAppId, setOpenMenuAppId] = useState<string | null>(null) // Track which app's dropdown is open
  const [settingsModalApp, setSettingsModalApp] = useState<InstalledApp | null>(null)
  
  const { getAppCustomization, setAppCustomization, getCustomizedApp, userRole, allInstalledApps, deleteApp, isMockApp } = useGuild()
  const installedApps = allInstalledApps
  
  const isAdmin = userRole === 'admin'

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
  // Check both member route and admin route for app highlighting
  const isAppActive = (appType: string) => 
    pathname.startsWith(`/guild/${guild.id}/apps/${appType}`) ||
    pathname.startsWith(`/admin/guild/${guild.id}/apps/${appType}`)
  const isAdminActive = (path: string) => pathname.startsWith(`/guild/${guild.id}/admin/${path}`)

  const handleAppSettingsSave = (customization: AppCustomization) => {
    setAppCustomization(customization)
  }

  const handleDeleteApp = (app: InstalledApp) => {
    if (window.confirm(`Are you sure you want to delete "${app.name}"? This will also delete all campaigns created with this app. This action cannot be undone.`)) {
      deleteApp(app.id, app.type)
      setOpenMenuAppId(null)
      // Navigate to guild home if currently on the deleted app's page
      if (pathname.startsWith(`/guild/${guild.id}/apps/${app.type}`)) {
        router.push(`/guild/${guild.id}`)
      }
    }
  }

  return (
    <>
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
            {/* Admin Area Section - Only visible to admins, positioned at top */}
            {isAdmin && (
              <div className="mb-3 p-2 rounded-lg bg-gradient-to-r from-zinc-800/80 to-zinc-800/40 border border-zinc-700/50">
                <div className="flex items-center gap-2 px-1 pb-2">
                  <div 
                    className="h-5 w-5 rounded flex items-center justify-center"
                    style={{ backgroundColor: `${guild.accentColor}30` }}
                  >
                    <Settings className="h-3 w-3" style={{ color: guild.accentColor }} />
                  </div>
                  <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                    Admin Area
                  </span>
                </div>
                <div className="space-y-0.5">
                  <Link
                    href={`/guild/${guild.id}/admin/dashboard`}
                    className={cn(
                      "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-all",
                      isAdminActive('dashboard')
                        ? "text-white" 
                        : "text-zinc-300 hover:text-white hover:bg-zinc-700/50"
                    )}
                    style={isAdminActive('dashboard') ? { 
                      backgroundColor: `${guild.accentColor}25`,
                      color: guild.accentColor
                    } : undefined}
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    href={`/guild/${guild.id}/admin/members`}
                    className={cn(
                      "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-all",
                      isAdminActive('members')
                        ? "text-white" 
                        : "text-zinc-300 hover:text-white hover:bg-zinc-700/50"
                    )}
                    style={isAdminActive('members') ? { 
                      backgroundColor: `${guild.accentColor}25`,
                      color: guild.accentColor
                    } : undefined}
                  >
                    <Users className="h-4 w-4" />
                    <span>Members</span>
                  </Link>
                  <Link
                    href={`/guild/${guild.id}/admin/app-store`}
                    className={cn(
                      "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-all",
                      isAdminActive('app-store')
                        ? "text-white" 
                        : "text-zinc-300 hover:text-white hover:bg-zinc-700/50"
                    )}
                    style={isAdminActive('app-store') ? { 
                      backgroundColor: `${guild.accentColor}25`,
                      color: guild.accentColor
                    } : undefined}
                  >
                    <PlusCircle className="h-4 w-4" />
                    <span>App Store</span>
                  </Link>
                </div>
              </div>
            )}

          {/* Support Section */}
          <div className="mb-1">
            <div className="px-2 py-1.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Support
            </div>
            <div className="space-y-0.5">
              <Link
                  href={`/guild/${guild.id}/support`}
                  className={cn(
                    "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-all",
                    isActive(`/guild/${guild.id}/support`)
                      ? "text-white" 
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                  )}
                  style={isActive(`/guild/${guild.id}/support`) ? { 
                    backgroundColor: `${guild.accentColor}20`,
                    color: guild.accentColor
                  } : undefined}
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
                      const customizedApp = getCustomizedApp(app)
                    const active = isAppActive(app.type)
                      const isHovered = hoveredAppId === app.id
                      
                      const showMenu = isHovered || openMenuAppId === app.id
                    
                    return (
                        <div
                          key={app.id}
                          className="relative group"
                          onMouseEnter={() => setHoveredAppId(app.id)}
                          onMouseLeave={() => setHoveredAppId(null)}
                        >
                      <Link
                        href={`/guild/${guild.id}/apps/${app.type}`}
                        className={cn(
                              "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-all pr-8",
                          active 
                            ? "text-white" 
                            : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                        )}
                        style={active ? { 
                          backgroundColor: `${app.color}20`,
                          color: app.color
                        } : undefined}
                      >
                            <span>{customizedApp.icon}</span>
                            <span className="truncate">{customizedApp.name}</span>
                      </Link>
                          
                          {/* Three-dot menu - shows on hover or when dropdown is open */}
                          <div 
                            className={cn(
                              "absolute right-1 top-1/2 -translate-y-1/2 transition-opacity z-10",
                              showMenu ? "opacity-100" : "opacity-0 pointer-events-none"
                            )}
                          >
                            <DropdownMenu 
                              onOpenChange={(open) => setOpenMenuAppId(open ? app.id : null)}
                            >
                              <DropdownMenuTrigger asChild>
                                <button 
                                  className="h-6 w-6 flex items-center justify-center rounded hover:bg-zinc-700/50 text-zinc-400 hover:text-zinc-200"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent 
                                align="end" 
                                className="w-40 bg-zinc-900 border-zinc-800"
                                onCloseAutoFocus={(e) => e.preventDefault()}
                              >
                                <DropdownMenuItem 
                                  onClick={() => {
                                    setSettingsModalApp(app)
                                    setOpenMenuAppId(null)
                                  }}
                                  className="text-zinc-300 focus:text-zinc-100 focus:bg-zinc-800 cursor-pointer"
                                >
                                  <Settings className="h-4 w-4 mr-2" />
                                  App settings
                                </DropdownMenuItem>
                                {!isMockApp(app.id) && (
                                  <DropdownMenuItem 
                                    onClick={() => handleDeleteApp(app)}
                                    className="text-red-400 focus:text-red-300 focus:bg-zinc-800 cursor-pointer"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete app
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

        </div>
      </ScrollArea>
    </div>

      {/* App Settings Modal */}
      {settingsModalApp && (
        <AppSettingsModal
          app={settingsModalApp}
          customization={getAppCustomization(settingsModalApp.id)}
          isOpen={!!settingsModalApp}
          onClose={() => setSettingsModalApp(null)}
          onSave={handleAppSettingsSave}
          accentColor={guild.accentColor}
        />
      )}
    </>
  )
}
