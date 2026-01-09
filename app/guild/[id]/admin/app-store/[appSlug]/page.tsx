'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Star, Download, Users, CheckCircle } from 'lucide-react'
import { AppContainer } from '@/components/app-container'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { useGuild } from '@/lib/guild-context'
import { useAuth } from '@/lib/auth-context'
import { getStoreAppBySlug } from '@/lib/mock-data'
import { STORE_APP_CATEGORY_COLORS } from '@/types'

export default function AppDetailPage() {
  const params = useParams()
  const router = useRouter()
  const guildId = params.id as string
  const appSlug = params.appSlug as string
  
  const { guild, isAppInstalled, installApp, userRole } = useGuild()
  const { user } = useAuth()
  
  const app = getStoreAppBySlug(appSlug)
  
  if (!app) {
    return (
      <AppContainer
        appId="app-detail"
        appName="App Not Found"
        appIcon="❓"
        appDescription="This app could not be found"
      >
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-zinc-400 mb-4">The app you're looking for doesn't exist.</p>
          <Button onClick={() => router.back()} variant="outline">
            Go Back
          </Button>
        </div>
      </AppContainer>
    )
  }

  const isInstalled = isAppInstalled(app.id)
  const categoryColor = STORE_APP_CATEGORY_COLORS[app.category]

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  const handleInstall = () => {
    const installedApp = installApp(app.id, user.id)
    if (installedApp) {
      // Navigate to the app's page after installation
      router.push(`/guild/${guildId}/apps/${installedApp.type}`)
    }
  }

  // Render stars for rating
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-3.5 w-3.5 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-zinc-600'}`}
      />
    ))
  }

  // Only admins should see this page
  if (userRole !== 'admin') {
    return (
      <AppContainer
        appId="app-detail"
        appName="Access Denied"
        appIcon="🔒"
        appDescription="You don't have permission"
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-zinc-400">You don't have permission to access this page.</p>
          </div>
        </div>
      </AppContainer>
    )
  }

  return (
    <AppContainer
      appId={`app-detail-${app.slug}`}
      appName={app.name}
      appIcon="📦"
      appDescription={app.shortDescription}
      backLink={{
        href: `/guild/${guildId}/admin/app-store`,
        label: 'Back to App Store'
      }}
    >
      <div className="p-6">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="flex items-start gap-6">
            {/* App Icon */}
            <div 
              className="h-24 w-24 rounded-2xl overflow-hidden flex-shrink-0 ring-1 ring-zinc-800"
              style={{ boxShadow: `0 0 40px ${app.color}20` }}
            >
              <img 
                src={app.icon} 
                alt={app.name}
                className="h-full w-full object-cover"
              />
            </div>

            {/* App Info */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white mb-1">{app.name}</h1>
              <p className="text-zinc-400 mb-4">{app.shortDescription}</p>
              
              {/* Install Button */}
              {isInstalled ? (
                <Button
                  size="lg"
                  variant="outline"
                  disabled
                  className="border-zinc-700 text-zinc-500 cursor-default"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Installed
                </Button>
              ) : (
                <Button
                  size="lg"
                  onClick={handleInstall}
                  style={{ backgroundColor: app.color }}
                  className="text-white font-semibold"
                >
                  Add
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
          {/* Reviews */}
          <div className="text-center">
            <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">
              {app.stats.reviews} Reviews
            </div>
            <div className="text-xl font-bold text-white mb-1">
              {app.stats.rating.toFixed(1)}
            </div>
            <div className="flex items-center justify-center gap-0.5">
              {renderStars(app.stats.rating)}
            </div>
          </div>

          {/* Installs */}
          <div className="text-center">
            <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">
              Installs
            </div>
            <div className="text-xl font-bold text-white">
              {formatNumber(app.stats.totalInstalls)}
            </div>
            <div className="text-xs text-zinc-500">Weekly</div>
          </div>

          {/* Users */}
          <div className="text-center">
            <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">
              Users
            </div>
            <div className="text-xl font-bold text-white">
              {formatNumber(app.stats.monthlyActiveUsers)}
            </div>
            <div className="text-xs text-zinc-500">Monthly</div>
          </div>

          {/* Developer */}
          <div className="text-center">
            <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">
              Developer
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="h-6 w-6 rounded-full overflow-hidden bg-zinc-800">
                <img 
                  src={app.developer.icon} 
                  alt={app.developer.name}
                  className="h-full w-full object-cover"
                />
              </div>
              {app.developer.verified && (
                <CheckCircle className="h-3.5 w-3.5 text-blue-400" />
              )}
            </div>
            <div className="text-xs text-zinc-400 mt-1">{app.developer.name}</div>
          </div>

          {/* Category */}
          <div className="text-center">
            <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">
              Category
            </div>
            <Badge 
              className="text-xs"
              style={{ 
                backgroundColor: `${categoryColor}20`,
                color: categoryColor,
              }}
            >
              {app.category}
            </Badge>
          </div>
        </div>

        {/* Screenshots */}
        {app.screenshots.length > 0 && (
          <div className="mb-8">
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex gap-4 pb-4">
                {app.screenshots.map((screenshot, index) => (
                  <div 
                    key={index}
                    className="flex-shrink-0 w-[400px] h-[250px] rounded-xl overflow-hidden border border-zinc-800"
                  >
                    <img 
                      src={screenshot} 
                      alt={`${app.name} screenshot ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        )}

        {/* Description */}
        <div className="mb-8">
          <div className="prose prose-invert prose-zinc max-w-none">
            <div className="whitespace-pre-wrap text-zinc-300 leading-relaxed">
              {app.fullDescription}
            </div>
          </div>
        </div>

        {/* Features List */}
        {app.features.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Key features:</h3>
            <ul className="space-y-2">
              {app.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span 
                    className="flex-shrink-0 mt-1 h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: app.color }}
                  />
                  <span className="text-zinc-300">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </AppContainer>
  )
}
