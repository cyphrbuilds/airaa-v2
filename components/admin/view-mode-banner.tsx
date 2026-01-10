'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Eye, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ViewModeBannerProps {
  guildId: string
  appType: string
  isAdminOrMod: boolean
  accentColor?: string
}

export function ViewModeBanner({ 
  guildId, 
  appType, 
  isAdminOrMod,
  accentColor = '#f59e0b'
}: ViewModeBannerProps) {
  const pathname = usePathname()
  
  // Determine current view mode based on route
  const isAdminView = pathname.startsWith('/admin/guild/')
  
  // Only show banner if user is admin/mod
  if (!isAdminOrMod) return null
  
  if (isAdminView) {
    // On admin view - show option to switch to member view
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800/50 border border-zinc-700/50 rounded-lg">
        <div className="flex items-center gap-1.5 text-xs text-zinc-400">
          <Settings className="h-3 w-3" />
          <span>Admin View</span>
        </div>
        <div className="w-px h-3 bg-zinc-700" />
        <Link
          href={`/guild/${guildId}/apps/${appType}`}
          className="flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white transition-colors"
        >
          <Eye className="h-3 w-3" />
          <span>Switch to Member View</span>
        </Link>
      </div>
    )
  }
  
  // On member view - show option to switch to admin view
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800/50 border border-zinc-700/50 rounded-lg">
      <div className="flex items-center gap-1.5 text-xs text-zinc-400">
        <Eye className="h-3 w-3" />
        <span>Member View</span>
      </div>
      <div className="w-px h-3 bg-zinc-700" />
      <Link
        href={`/admin/guild/${guildId}/apps/${appType}`}
        className={cn(
          "flex items-center gap-1.5 text-xs transition-colors"
        )}
        style={{ color: accentColor }}
      >
        <Settings className="h-3 w-3" />
        <span>Switch to Admin View</span>
      </Link>
    </div>
  )
}
