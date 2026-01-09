'use client'

import Link from 'next/link'
import { Download, CheckCircle } from 'lucide-react'
import { StoreApp } from '@/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

/**
 * Props for the StoreAppCard component
 */
export interface StoreAppCardProps {
  /** The app data to display */
  app: StoreApp
  /** ID of the guild viewing the app store */
  guildId: string
  /** Whether this app is already installed in the guild */
  isInstalled: boolean
  /** Callback when the install button is clicked */
  onInstall: (appId: string) => void
}

export function StoreAppCard({ app, guildId, isInstalled, onInstall }: StoreAppCardProps) {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  return (
    <Link 
      href={`/guild/${guildId}/admin/app-store/${app.slug}`}
      className="group block relative rounded-xl border border-zinc-800/50 bg-zinc-900/50 p-5 hover:border-zinc-700 hover:bg-zinc-900 transition-all cursor-pointer"
    >
      <div className="flex gap-4">
        {/* App Icon */}
        <div className="flex-shrink-0">
          <div 
            className="h-14 w-14 rounded-xl overflow-hidden ring-1 ring-zinc-800"
            style={{ boxShadow: `0 0 20px ${app.color}15` }}
          >
            <img 
              src={app.icon} 
              alt={app.name}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-zinc-100 group-hover:text-white transition-colors truncate">
                  {app.name}
                </h3>
                {app.isNew && (
                  <Badge 
                    variant="outline" 
                    className="text-[10px] px-1.5 py-0 border-emerald-500/50 text-emerald-400"
                  >
                    New
                  </Badge>
                )}
              </div>
            </div>
            
            {/* Install Button */}
            {isInstalled ? (
              <Button
                size="sm"
                variant="outline"
                disabled
                className="h-7 px-3 text-xs border-zinc-700 text-zinc-500 cursor-default"
                onClick={(e) => e.preventDefault()}
              >
                <CheckCircle className="h-3 w-3 mr-1.5" />
                Installed
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onInstall(app.id)
                }}
                className="h-7 px-3 text-xs relative z-10"
                style={{ backgroundColor: app.color }}
              >
                Add
              </Button>
            )}
          </div>

          {/* Developer info */}
          <div className="flex items-center gap-1.5 mb-2">
            {app.developer.verified && (
              <span className="flex items-center justify-center h-4 w-4 rounded bg-blue-500/20">
                <CheckCircle className="h-2.5 w-2.5 text-blue-400" />
              </span>
            )}
            <span className="text-xs text-zinc-500">
              {app.developer.name} • Free to install
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-zinc-400 line-clamp-2 mb-3">
            {app.shortDescription}
          </p>

          {/* Install Stats */}
          <div className="flex items-center gap-1 text-xs text-zinc-500">
            <Download className="h-3 w-3" />
            <span>{formatNumber(app.stats.weeklyInstalls)} installs in last 7 days</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
