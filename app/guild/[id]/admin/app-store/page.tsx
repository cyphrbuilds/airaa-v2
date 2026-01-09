'use client'

import { useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { AppContainer } from '@/components/app-container'
import { StoreAppCard, AppStoreHeader, SortOption } from '@/components/admin'
import { useGuild } from '@/lib/guild-context'
import { useAuth } from '@/lib/auth-context'
import { getStoreApps } from '@/lib/mock-data'
import { StoreAppCategory } from '@/types'

export default function AppStorePage() {
  const params = useParams()
  const router = useRouter()
  const guildId = params.id as string
  const { guild, isAppInstalled, installApp, userRole } = useGuild()
  const { user } = useAuth()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<StoreAppCategory | 'All'>('All')
  const [sortBy, setSortBy] = useState<SortOption>('weekly_installs')

  const allApps = getStoreApps()

  // Filter and sort apps
  const filteredApps = useMemo(() => {
    let apps = [...allApps]

    // Filter by category
    if (selectedCategory !== 'All') {
      apps = apps.filter(app => app.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      apps = apps.filter(app => 
        app.name.toLowerCase().includes(query) ||
        app.shortDescription.toLowerCase().includes(query) ||
        app.category.toLowerCase().includes(query)
      )
    }

    // Sort
    switch (sortBy) {
      case 'weekly_installs':
        apps.sort((a, b) => b.stats.weeklyInstalls - a.stats.weeklyInstalls)
        break
      case 'reviews':
        apps.sort((a, b) => b.stats.reviews - a.stats.reviews)
        break
      case 'newest':
        apps.sort((a, b) => {
          if (a.isNew && !b.isNew) return -1
          if (!a.isNew && b.isNew) return 1
          return 0
        })
        break
    }

    return apps
  }, [allApps, selectedCategory, searchQuery, sortBy])

  const handleInstall = (appId: string) => {
    const installedApp = installApp(appId, user.id)
    if (installedApp) {
      // Navigate to the app's page after installation
      router.push(`/guild/${guildId}/apps/${installedApp.type}`)
    }
  }

  // Only admins should see this page
  if (userRole !== 'admin') {
    return (
      <AppContainer
        appId="app-store"
        appName="App Store"
        appIcon="📦"
        appDescription="Install apps for your guild"
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
      appId="app-store"
      appName="App Store"
      appIcon="📦"
      appDescription="Install apps for your guild"
    >
      <div className="p-6">
        {/* Header with search and filters */}
        <AppStoreHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {/* Apps Grid */}
        <div className="mt-6">
          {filteredApps.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredApps.map((app) => (
                <StoreAppCard
                  key={app.id}
                  app={app}
                  guildId={guildId}
                  isInstalled={isAppInstalled(app.id)}
                  onInstall={handleInstall}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="h-16 w-16 rounded-xl bg-zinc-800/50 flex items-center justify-center text-4xl mb-4">
                🔍
              </div>
              <h3 className="text-lg font-semibold text-zinc-200 mb-2">No apps found</h3>
              <p className="text-zinc-500 max-w-sm">
                {searchQuery 
                  ? `No apps match "${searchQuery}". Try a different search term.`
                  : `No apps available in the ${selectedCategory} category.`
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </AppContainer>
  )
}
