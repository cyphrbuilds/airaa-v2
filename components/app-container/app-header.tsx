'use client'

import Link from 'next/link'
import { Users, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

/**
 * Props for the AppHeader component
 */
export interface AppHeaderProps {
  /** App display name */
  appName: string
  /** App icon (emoji string or React node) */
  appIcon: string | React.ReactNode
  /** Optional description shown below the name */
  appDescription?: string
  /** Theme color for icon background (default: '#22c55e') */
  appColor?: string
  
  // Navigation
  /** Optional back link for navigation */
  backLink?: {
    href: string
    label: string
  }
  
  // Members panel
  /** Whether to show the members toggle (default: true) */
  showMembersToggle?: boolean
  /** Total number of members */
  membersCount?: number
  /** Number of online members */
  onlineCount?: number
  /** Whether members panel is currently open */
  isMembersPanelOpen?: boolean
  /** Callback when members toggle is clicked */
  onToggleMembersPanel?: () => void
  
  // Custom actions
  /** Additional actions to render in the header */
  headerActions?: React.ReactNode
}

export function AppHeader({
  appName,
  appIcon,
  appDescription,
  appColor = '#22c55e',
  backLink,
  showMembersToggle = true,
  membersCount = 0,
  onlineCount = 0,
  isMembersPanelOpen = false,
  onToggleMembersPanel,
  headerActions,
}: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex-shrink-0 border-b border-zinc-800/50 bg-[#111111]/95 backdrop-blur-sm">
      <div className="flex items-center justify-between h-14 px-6">
        {/* Left side - App info */}
        <div className="flex items-center gap-3">
          {/* Back link */}
          {backLink && (
            <Link 
              href={backLink.href}
              className="flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-200 transition-colors mr-2"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">{backLink.label}</span>
            </Link>
          )}
          
          <div 
            className="h-9 w-9 rounded-lg flex items-center justify-center text-lg"
            style={{ backgroundColor: `${appColor}20` }}
          >
            {typeof appIcon === 'string' ? appIcon : appIcon}
          </div>
          <div>
            <h1 className="text-base font-semibold text-zinc-100">{appName}</h1>
            {appDescription && (
              <p className="text-xs text-zinc-500 line-clamp-1 max-w-md">{appDescription}</p>
            )}
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2">
          {headerActions}
          
          {showMembersToggle && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleMembersPanel}
              className={cn(
                "h-9 gap-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800",
                isMembersPanelOpen && "bg-zinc-800 text-zinc-100"
              )}
            >
              <Users className="h-4 w-4" />
              <span className="text-sm font-medium">{membersCount}</span>
              {onlineCount > 0 && (
                <Badge 
                  variant="secondary" 
                  className="h-5 px-1.5 text-[10px] bg-green-500/20 text-green-400 border-0"
                >
                  {onlineCount} online
                </Badge>
              )}
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
