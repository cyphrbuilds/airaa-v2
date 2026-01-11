'use client'

import { useState, useEffect, useCallback } from 'react'
import { AppHeader } from './app-header'
import { MembersPanel } from './members-panel'
import { ViewModeBanner } from '@/components/admin/view-mode-banner'
import { useGuild } from '@/lib/guild-context'
import { isUserAdminOrMod } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

/**
 * Props for the AppContainer component
 */
export interface AppContainerProps {
  // App metadata
  /** Unique identifier for the app */
  appId: string
  /** Display name for the app */
  appName: string
  /** Icon (emoji string or React node) */
  appIcon: string | React.ReactNode
  /** Optional description shown in header */
  appDescription?: string
  /** Theme color for the app (defaults to guild accent color) */
  appColor?: string
  
  // Guild context for admin/member toggle
  /** Guild ID - if provided, auto-shows admin/member view toggle for admins */
  guildId?: string
  
  // Navigation
  /** Optional back link for navigation */
  backLink?: {
    href: string
    label: string
  }
  
  // Features
  /** Whether to show the members toggle button (default: true) */
  showMembersToggle?: boolean
  /** Whether members panel is open by default (default: false) */
  defaultMembersPanelOpen?: boolean
  /** Additional actions to render in the header */
  headerActions?: React.ReactNode
  
  // Content
  /** Child content to render */
  children: React.ReactNode
  
  // Styling
  /** Additional class name for the container */
  className?: string
  /** Additional class name for the content area */
  contentClassName?: string
  /** Whether to remove default padding from content (default: false) */
  noPadding?: boolean
}

const MEMBERS_PANEL_KEY = 'members-panel-open'

export function AppContainer({
  appId,
  appName,
  appIcon,
  appDescription,
  appColor,
  guildId,
  backLink,
  showMembersToggle = true,
  defaultMembersPanelOpen = false,
  headerActions,
  children,
  className,
  contentClassName,
  noPadding = false,
}: AppContainerProps) {
  const { guild, members } = useGuild()
  const [isMembersPanelOpen, setIsMembersPanelOpen] = useState(defaultMembersPanelOpen)
  
  // Check if user is admin/mod for auto-showing view toggle
  const isAdminOrMod = guildId ? isUserAdminOrMod(guildId) : false

  // Load persisted state
  useEffect(() => {
    const saved = localStorage.getItem(MEMBERS_PANEL_KEY)
    if (saved !== null) {
      setIsMembersPanelOpen(saved === 'true')
    }
  }, [])

  // Toggle handler with persistence
  const toggleMembersPanel = useCallback(() => {
    setIsMembersPanelOpen(prev => {
      const newState = !prev
      localStorage.setItem(MEMBERS_PANEL_KEY, String(newState))
      return newState
    })
  }, [])

  // Keyboard shortcut - 'M' to toggle members panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input/textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return
      }

      if (e.key === 'm' || e.key === 'M') {
        e.preventDefault()
        toggleMembersPanel()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [toggleMembersPanel])

  const onlineCount = members.filter(m => m.isOnline).length
  const effectiveColor = appColor || guild.accentColor

  // Combine auto-generated ViewModeBanner with custom headerActions
  const combinedHeaderActions = (
    <>
      {guildId && isAdminOrMod && (
        <ViewModeBanner 
          guildId={guildId} 
          appType={appId} 
          isAdminOrMod={true}
          accentColor={effectiveColor}
        />
      )}
      {headerActions}
    </>
  )

  return (
    <div className={cn("flex h-full flex-col", className)}>
      {/* Fixed Header */}
      <AppHeader
        appName={appName}
        appIcon={appIcon}
        appDescription={appDescription}
        appColor={effectiveColor}
        backLink={backLink}
        showMembersToggle={showMembersToggle}
        membersCount={members.length}
        onlineCount={onlineCount}
        isMembersPanelOpen={isMembersPanelOpen}
        onToggleMembersPanel={toggleMembersPanel}
        headerActions={combinedHeaderActions}
      />

      {/* Content Area with Members Panel */}
      <div className="flex flex-1 overflow-hidden">
        {/* Main Content */}
        <div 
          className={cn(
            "flex-1 overflow-y-auto transition-all duration-300",
            !noPadding && "p-6",
            contentClassName
          )}
        >
          {children}
        </div>

        {/* Members Panel */}
        {showMembersToggle && (
          <MembersPanel
            members={members}
            guild={guild}
            isOpen={isMembersPanelOpen}
            onClose={() => {
              setIsMembersPanelOpen(false)
              localStorage.setItem(MEMBERS_PANEL_KEY, 'false')
            }}
          />
        )}
      </div>
    </div>
  )
}
