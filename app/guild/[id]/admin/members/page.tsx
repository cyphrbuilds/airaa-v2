'use client'

import { useState, useMemo, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  ChevronUp, 
  ChevronDown,
  Shield,
  ShieldOff,
  UserX,
  X,
  Users,
  ChevronDownIcon,
  Send,
  Check,
  UserPlus
} from 'lucide-react'
import Image from 'next/image'
import { AppContainer } from '@/components/app-container'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useGuild } from '@/lib/guild-context'
import { getAdminMembersByGuild } from '@/lib/mock-data'
import { cn, formatNumber, formatCurrencyCompact } from '@/lib/utils'
import { 
  AdminMember, 
  MemberPersona, 
  WalletCategory,
  PERSONA_COLORS,
  WALLET_CATEGORY_COLORS
} from '@/types'

type SortField = 'posts' | 'impressions' | 'engagement' | 'volume' | 'fees' | 'referrals'
type SortDirection = 'asc' | 'desc'
type PlatformFilter = 'my-guild' | 'airaa' | 'x'

interface Filters {
  personas: MemberPersona[]
  roles: ('member' | 'moderator')[]
  walletCategories: WalletCategory[]
  minPosts: number | null
  minImpressions: number | null
  minEngagement: number | null
  hasReferrals: 'any' | 'yes' | 'no'
}

const ALL_PERSONAS: MemberPersona[] = ['Creator', 'Power Creator', 'Trader', 'DeFi Native', 'Referrer', 'Passive']
const ALL_WALLET_CATEGORIES: WalletCategory[] = ['<$1k', '$1k-$10k', '$10k-$100k', '$100k+']

const PLATFORM_OPTIONS: { value: PlatformFilter; label: string }[] = [
  { value: 'my-guild', label: 'Guild' },
  { value: 'airaa', label: 'AIRA' },
  { value: 'x', label: 'X' },
]

export default function AdminMembersPage() {
  const params = useParams()
  const guildId = params.id as string
  const { guild, userRole } = useGuild()

  // State
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [sortField, setSortField] = useState<SortField | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [showFilters, setShowFilters] = useState(false)
  const [platformFilter, setPlatformFilter] = useState<PlatformFilter>('my-guild')
  const [filters, setFilters] = useState<Filters>({
    personas: [],
    roles: [],
    walletCategories: [],
    minPosts: null,
    minImpressions: null,
    minEngagement: null,
    hasReferrals: 'any'
  })
  
  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    type: 'remove' | 'makeMod' | 'removeMod' | 'bulkRemove' | 'bulkMakeMod' | 'bulkRemoveMod'
    member?: AdminMember
    count?: number
  }>({ open: false, type: 'remove' })

  // Invite modal state
  const [inviteModal, setInviteModal] = useState<{
    open: boolean
    count: number
  }>({ open: false, count: 0 })
  const [inviteMessage, setInviteMessage] = useState('')
  const [showToast, setShowToast] = useState(false)

  // Data
  const allMembers = getAdminMembersByGuild(guildId)
  
  // Mock data for other platforms - first 15 members are "already in guild"
  const guildMemberIds = useMemo(() => new Set(allMembers.slice(0, 15).map(m => m.id)), [allMembers])

  // Check if viewing external platform (not current guild)
  const isExternalPlatform = platformFilter !== 'my-guild'
  const isXPlatform = platformFilter === 'x'
  const isAiraPlatform = platformFilter === 'airaa'
  
  // Computed booleans for table behavior
  const showRoleColumn = platformFilter === 'my-guild'
  const showInGuildColumn = isExternalPlatform
  const allowRowSelection = !isXPlatform

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [showToast])

  // Calculate top 10% engagement threshold for highlighting
  const engagementThreshold = useMemo(() => {
    const sorted = [...allMembers].sort((a, b) => b.engagement - a.engagement)
    const topIndex = Math.ceil(sorted.length * 0.1)
    return sorted[topIndex - 1]?.engagement || 0
  }, [allMembers])

  // Filter and sort members
  const filteredMembers = useMemo(() => {
    let result = allMembers

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(m => 
        m.name.toLowerCase().includes(query) ||
        m.username.toLowerCase().includes(query) ||
        m.wallet.toLowerCase().includes(query)
      )
    }

    // Persona filter
    if (filters.personas.length > 0) {
      result = result.filter(m => filters.personas.includes(m.persona))
    }

    // Role filter
    if (filters.roles.length > 0) {
      result = result.filter(m => filters.roles.includes(m.role as 'member' | 'moderator'))
    }

    // Wallet category filter
    if (filters.walletCategories.length > 0) {
      result = result.filter(m => filters.walletCategories.includes(m.walletCategory))
    }

    // Min posts filter
    if (filters.minPosts !== null) {
      result = result.filter(m => m.posts >= filters.minPosts!)
    }

    // Min impressions filter
    if (filters.minImpressions !== null) {
      result = result.filter(m => m.impressions >= filters.minImpressions!)
    }

    // Min engagement filter
    if (filters.minEngagement !== null) {
      result = result.filter(m => m.engagement >= filters.minEngagement!)
    }

    // Has referrals filter
    if (filters.hasReferrals === 'yes') {
      result = result.filter(m => m.referrals > 0)
    } else if (filters.hasReferrals === 'no') {
      result = result.filter(m => m.referrals === 0)
    }

    // Sort
    if (sortField) {
      result = [...result].sort((a, b) => {
        const aVal = a[sortField]
        const bVal = b[sortField]
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal
      })
    }

    return result
  }, [allMembers, searchQuery, filters, sortField, sortDirection])

  // Handlers
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const handleSelectAll = () => {
    if (selectedIds.size === filteredMembers.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredMembers.map(m => m.id)))
    }
  }

  const handleSelectRow = (id: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  const toggleFilterValue = <T,>(array: T[], value: T): T[] => {
    return array.includes(value) 
      ? array.filter(v => v !== value)
      : [...array, value]
  }

  const hasActiveFilters = 
    filters.personas.length > 0 ||
    filters.roles.length > 0 ||
    filters.walletCategories.length > 0 ||
    filters.minPosts !== null ||
    filters.minImpressions !== null ||
    filters.minEngagement !== null ||
    filters.hasReferrals !== 'any'

  const clearFilters = () => {
    setFilters({
      personas: [],
      roles: [],
      walletCategories: [],
      minPosts: null,
      minImpressions: null,
      minEngagement: null,
      hasReferrals: 'any'
    })
  }

  const handleConfirmAction = () => {
    // In a real app, this would call an API
    // For mock purposes, just close the dialog
    setConfirmDialog({ open: false, type: 'remove' })
    setSelectedIds(new Set())
  }

  const handleSendInvites = () => {
    // In a real app, this would call an API to send invites
    // For mock purposes, just close the modal and show toast
    setInviteModal({ open: false, count: 0 })
    setInviteMessage('')
    setSelectedIds(new Set())
    setShowToast(true)
  }

  const handleOpenInviteModal = () => {
    setInviteModal({ open: true, count: selectedIds.size })
  }

  // Only admins should see this page
  if (userRole !== 'admin') {
    return (
      <AppContainer
        appId="admin-members"
        appName="Members"
        appIcon={<Users className="h-5 w-5" />}
        appDescription="Member management"
        showMembersToggle={false}
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
      appId="admin-members"
      appName="Members"
      appIcon={<Users className="h-5 w-5" />}
      appDescription="All-time contribution and member management for this guild"
      showMembersToggle={false}
      noPadding
    >
      <div className="flex flex-col h-full">
        {/* Hero Search Section */}
        <div className="px-6 py-8 border-b border-zinc-800/50 bg-gradient-to-b from-zinc-900/50 to-transparent">
          <div className="max-w-3xl mx-auto">
            {/* Search Bar with Scope Dropdown */}
            <div className="flex gap-3">
              {/* Main Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
                <Input
                  placeholder="Search creators by name, audience, activity, or protocol"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-14 pr-4 h-14 text-lg bg-zinc-900/80 border-zinc-700 rounded-xl placeholder:text-zinc-500 focus:border-zinc-500 focus:ring-zinc-500/20"
                />
              </div>

              {/* Scope Selector - Minimal Logo Pills */}
              <div className="flex items-center gap-1 p-1 bg-zinc-900/80 border border-zinc-700 rounded-xl">
                {/* Guild */}
                <button
                  onClick={() => {
                    setPlatformFilter('my-guild')
                    setSelectedIds(new Set())
                  }}
                  className={cn(
                    "relative h-10 w-10 rounded-lg flex items-center justify-center transition-all",
                    platformFilter === 'my-guild'
                      ? "bg-zinc-700 ring-2 ring-zinc-500"
                      : "hover:bg-zinc-800"
                  )}
                  title="Guild"
                >
                  {guild?.icon ? (
                    <img 
                      src={guild.icon} 
                      alt="Guild" 
                      className="h-6 w-6 rounded-md object-cover"
                    />
                  ) : (
                    <Users className="h-5 w-5 text-zinc-400" />
                  )}
                </button>

                {/* AIRA */}
                <button
                  onClick={() => {
                    setPlatformFilter('airaa')
                    setSelectedIds(new Set())
                  }}
                  className={cn(
                    "relative h-10 w-10 rounded-lg flex items-center justify-center transition-all",
                    platformFilter === 'airaa'
                      ? "bg-zinc-700 ring-2 ring-zinc-500"
                      : "hover:bg-zinc-800"
                  )}
                  title="AIRA"
                >
                  <Image 
                    src="/logo.png" 
                    alt="AIRA" 
                    width={24}
                    height={24}
                    className="rounded-md"
                  />
                </button>

                {/* X */}
                <button
                  onClick={() => {
                    setPlatformFilter('x')
                    setSelectedIds(new Set())
                  }}
                  className={cn(
                    "relative h-10 w-10 rounded-lg flex items-center justify-center transition-all",
                    platformFilter === 'x'
                      ? "bg-zinc-700 ring-2 ring-zinc-500"
                      : "hover:bg-zinc-800"
                  )}
                  title="X"
                >
                  <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Filter Controls Row */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-3">
                {/* Filters Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className={cn(
                    "gap-2 border-zinc-700 bg-zinc-900/50",
                    hasActiveFilters && "border-green-500/50 text-green-500"
                  )}
                >
                  <Filter className="h-4 w-4" />
                  Filters
                  {hasActiveFilters && (
                    <span className="ml-1 h-5 w-5 rounded-full bg-green-500/20 text-green-500 text-xs flex items-center justify-center">
                      {filters.personas.length + filters.roles.length + filters.walletCategories.length + 
                       (filters.minPosts !== null ? 1 : 0) + (filters.minImpressions !== null ? 1 : 0) + 
                       (filters.minEngagement !== null ? 1 : 0) + (filters.hasReferrals !== 'any' ? 1 : 0)}
                    </span>
                  )}
                </Button>

                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-zinc-400 hover:text-zinc-200"
                  >
                    Clear all
                  </Button>
                )}
              </div>

              <p className="text-sm text-zinc-500">All-time stats</p>
            </div>

          </div>
        </div>

        {/* Filters Panel - Modern Pill-Based Design */}
        {showFilters && (
          <div className="border-b border-zinc-800/50 bg-zinc-900/20 px-4 py-5">
            <div className="space-y-4">
              {/* Persona Pills */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider w-20 flex-shrink-0">Persona</span>
                <div className="flex flex-wrap gap-2">
                  {ALL_PERSONAS.map(persona => {
                    const isActive = filters.personas.includes(persona)
                    const color = PERSONA_COLORS[persona]
                    return (
                      <button
                        key={persona}
                        onClick={() => setFilters(f => ({ ...f, personas: toggleFilterValue(f.personas, persona) }))}
                        className={cn(
                          "px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200",
                          isActive
                            ? "scale-105"
                            : "bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                        )}
                        style={isActive ? {
                          backgroundColor: `${color}25`,
                          color: color,
                          boxShadow: `0 0 0 1px ${color}40`
                        } : {}}
                      >
                        {persona}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Role Pills */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider w-20 flex-shrink-0">Role</span>
                <div className="flex gap-2">
                  {(['member', 'moderator'] as const).map(role => {
                    const isActive = filters.roles.includes(role)
                    const colors = {
                      member: '#71717a',
                      moderator: '#3b82f6'
                    }
                    return (
                      <button
                        key={role}
                        onClick={() => setFilters(f => ({ ...f, roles: toggleFilterValue(f.roles, role) }))}
                        className={cn(
                          "px-3 py-1.5 text-xs font-medium rounded-full capitalize transition-all duration-200",
                          isActive
                            ? "scale-105"
                            : "bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                        )}
                        style={isActive ? {
                          backgroundColor: `${colors[role]}25`,
                          color: colors[role],
                          boxShadow: `0 0 0 1px ${colors[role]}40`
                        } : {}}
                      >
                        {role}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Wallet Category Pills */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider w-20 flex-shrink-0">Wallet</span>
                <div className="flex gap-2">
                  {ALL_WALLET_CATEGORIES.map(cat => {
                    const isActive = filters.walletCategories.includes(cat)
                    const color = WALLET_CATEGORY_COLORS[cat]
                    return (
                      <button
                        key={cat}
                        onClick={() => setFilters(f => ({ ...f, walletCategories: toggleFilterValue(f.walletCategories, cat) }))}
                        className={cn(
                          "px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200",
                          isActive
                            ? "scale-105"
                            : "bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                        )}
                        style={isActive ? {
                          backgroundColor: `${color}25`,
                          color: color,
                          boxShadow: `0 0 0 1px ${color}40`
                        } : {}}
                      >
                        {cat}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Numeric Filters & Referrals - Compact Row */}
              <div className="flex items-center gap-6 pt-2 border-t border-zinc-800/50">
                {/* Min Posts */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-500">Posts</span>
                  <span className="text-xs text-zinc-600">&ge;</span>
                  <Input
                    type="number"
                    placeholder="0"
                    value={filters.minPosts ?? ''}
                    onChange={(e) => setFilters(f => ({ ...f, minPosts: e.target.value ? parseInt(e.target.value) : null }))}
                    className="w-20 h-7 text-xs bg-zinc-800/50 border-zinc-700/50 rounded-lg px-2"
                  />
                </div>

                {/* Min Impressions */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-500">Impressions</span>
                  <span className="text-xs text-zinc-600">&ge;</span>
                  <Input
                    type="number"
                    placeholder="0"
                    value={filters.minImpressions ?? ''}
                    onChange={(e) => setFilters(f => ({ ...f, minImpressions: e.target.value ? parseInt(e.target.value) : null }))}
                    className="w-20 h-7 text-xs bg-zinc-800/50 border-zinc-700/50 rounded-lg px-2"
                  />
                </div>

                {/* Min Engagement */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-500">Engagement</span>
                  <span className="text-xs text-zinc-600">&ge;</span>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="0"
                    value={filters.minEngagement ?? ''}
                    onChange={(e) => setFilters(f => ({ ...f, minEngagement: e.target.value ? parseFloat(e.target.value) : null }))}
                    className="w-16 h-7 text-xs bg-zinc-800/50 border-zinc-700/50 rounded-lg px-2"
                  />
                  <span className="text-xs text-zinc-600">%</span>
                </div>

                {/* Referrals Toggle */}
                <div className="flex items-center gap-2 ml-auto">
                  <span className="text-xs text-zinc-500">Referrals</span>
                  <div className="flex bg-zinc-800/50 rounded-lg p-0.5">
                    {(['any', 'yes', 'no'] as const).map(value => (
                      <button
                        key={value}
                        onClick={() => setFilters(f => ({ ...f, hasReferrals: value }))}
                        className={cn(
                          "px-2.5 py-1 text-xs rounded-md transition-all capitalize",
                          filters.hasReferrals === value
                            ? "bg-zinc-700 text-white shadow-sm"
                            : "text-zinc-500 hover:text-zinc-300"
                        )}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Actions Bar - only shown when items selected and not on X platform */}
        {selectedIds.size > 0 && allowRowSelection && (
          <div className="flex items-center gap-4 px-4 py-3 bg-zinc-900/50 border-b border-zinc-800/50">
            <span className="text-sm font-medium text-white">
              {selectedIds.size} selected
            </span>
            <div className="flex items-center gap-2">
              {isAiraPlatform ? (
                /* AIRA: Invite to Guild button */
                <Button
                  size="sm"
                  className="gap-2 bg-green-600 hover:bg-green-700 text-white"
                  onClick={handleOpenInviteModal}
                >
                  <UserPlus className="h-4 w-4" />
                  Invite to Guild
                </Button>
              ) : (
                /* Guild: full management actions */
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 border-zinc-700"
                    onClick={() => setConfirmDialog({ open: true, type: 'bulkMakeMod', count: selectedIds.size })}
                  >
                    <Shield className="h-4 w-4" />
                    Make Moderator
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 border-zinc-700"
                    onClick={() => setConfirmDialog({ open: true, type: 'bulkRemoveMod', count: selectedIds.size })}
                  >
                    <ShieldOff className="h-4 w-4" />
                    Remove Moderator
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 border-red-500/50 text-red-500 hover:bg-red-500/10"
                    onClick={() => setConfirmDialog({ open: true, type: 'bulkRemove', count: selectedIds.size })}
                  >
                    <UserX className="h-4 w-4" />
                    Remove Users
                  </Button>
                </>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedIds(new Set())}
              className="ml-auto text-zinc-400"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm">
            {/* Sticky Header */}
            <thead className="sticky top-0 bg-zinc-900/95 backdrop-blur z-10">
              <tr className="border-b border-zinc-800/50">
                {/* Checkbox column - hidden for X platform */}
                {allowRowSelection ? (
                  <th className="w-10 px-3 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === filteredMembers.length && filteredMembers.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-zinc-700 bg-zinc-800 text-green-500 focus:ring-green-500/20"
                    />
                  </th>
                ) : (
                  <th className="w-10 px-3 py-3" />
                )}
                <th className="px-3 py-3 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider min-w-[200px]">
                  User
                </th>
                {/* Role column - only shown for Guild scope */}
                {showRoleColumn && (
                  <th className="px-3 py-3 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider w-24">
                    Role
                  </th>
                )}
                {/* In Guild column - shown for external platforms */}
                {showInGuildColumn && (
                  <th className="px-3 py-3 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider w-24">
                    In Guild
                  </th>
                )}
                <th className="px-3 py-3 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider w-28">
                  Persona
                </th>
                <SortableHeader field="posts" label="Posts" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                <SortableHeader field="impressions" label="Impressions" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                <SortableHeader field="engagement" label="Engagement" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                <SortableHeader field="volume" label="Volume" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                <SortableHeader field="fees" label="Fees" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                <SortableHeader field="referrals" label="Referrals" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                <th className="px-3 py-3 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider min-w-[150px]">
                  Top Protocols
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider w-28">
                  Wallet
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider w-16">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/30">
              {filteredMembers.map((member) => {
                const isHighContributor = member.engagement >= engagementThreshold
                const isSelected = selectedIds.has(member.id)
                const isAlreadyInGuild = isExternalPlatform && guildMemberIds.has(member.id)
                
                return (
                  <tr 
                    key={member.id}
                    className={cn(
                      "hover:bg-zinc-800/30 transition-colors",
                      isHighContributor && !isExternalPlatform && "bg-green-500/5",
                      isSelected && "bg-zinc-800/50"
                    )}
                  >
                    {/* Checkbox - only if row selection is allowed */}
                    <td className="px-3 py-2">
                      {allowRowSelection ? (
                        /* Don't allow selecting users already in guild when on external platform */
                        isExternalPlatform && isAlreadyInGuild ? (
                          <div className="w-4 h-4" />
                        ) : (
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectRow(member.id)}
                            className="rounded border-zinc-700 bg-zinc-800 text-green-500 focus:ring-green-500/20"
                          />
                        )
                      ) : (
                        <div className="w-4 h-4" />
                      )}
                    </td>

                    {/* User */}
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-3">
                        <img 
                          src={member.avatar} 
                          alt={member.name}
                          className="h-8 w-8 rounded-full bg-zinc-800"
                        />
                        <div className="min-w-0">
                          <p className="font-medium text-white truncate">{member.name}</p>
                          <p className="text-xs text-zinc-500 truncate">@{member.username}</p>
                        </div>
                      </div>
                    </td>

                    {/* Role - only shown for Guild scope */}
                    {showRoleColumn && (
                      <td className="px-3 py-2">
                        <RoleBadge role={member.role} />
                      </td>
                    )}

                    {/* In Guild - shown for external platforms */}
                    {showInGuildColumn && (
                      <td className="px-3 py-2">
                        {isAlreadyInGuild ? (
                          <span className="px-2 py-1 text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30 rounded">
                            Joined
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-medium bg-zinc-800 text-zinc-400 border border-zinc-700 rounded">
                            Not Joined
                          </span>
                        )}
                      </td>
                    )}

                    {/* Persona */}
                    <td className="px-3 py-2">
                      <PersonaBadge persona={member.persona} />
                    </td>

                    {/* Posts */}
                    <td className="px-3 py-2 text-zinc-300 tabular-nums">
                      {member.posts.toLocaleString()}
                    </td>

                    {/* Impressions */}
                    <td className="px-3 py-2 text-zinc-300 tabular-nums">
                      {formatNumber(member.impressions)}
                    </td>

                    {/* Engagement */}
                    <td className="px-3 py-2 tabular-nums">
                      <span className={cn(
                        isHighContributor && !isExternalPlatform ? "text-green-500 font-medium" : "text-zinc-300"
                      )}>
                        {member.engagement.toFixed(1)}%
                      </span>
                    </td>

                    {/* Volume */}
                    <td className="px-3 py-2 text-zinc-300 tabular-nums">
                      {formatCurrencyCompact(member.volume)}
                    </td>

                    {/* Fees */}
                    <td className="px-3 py-2 text-zinc-300 tabular-nums">
                      {formatCurrencyCompact(member.fees)}
                    </td>

                    {/* Referrals */}
                    <td className="px-3 py-2 text-zinc-300 tabular-nums">
                      {member.referrals.toLocaleString()}
                    </td>

                    {/* Top Protocols */}
                    <td className="px-3 py-2">
                      <div className="flex flex-wrap gap-1">
                        {member.topProtocols.slice(0, 3).map(protocol => (
                          <span 
                            key={protocol}
                            className="px-1.5 py-0.5 text-xs bg-zinc-800 text-zinc-400 rounded"
                          >
                            {protocol}
                          </span>
                        ))}
                        {member.topProtocols.length > 3 && (
                          <span className="px-1.5 py-0.5 text-xs text-zinc-500">
                            +{member.topProtocols.length - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Wallet Category */}
                    <td className="px-3 py-2">
                      <WalletCategoryBadge category={member.walletCategory} />
                    </td>

                    {/* Actions */}
                    <td className="px-3 py-2">
                      {isXPlatform ? (
                        /* X platform: no actions available */
                        <span className="text-zinc-600">—</span>
                      ) : isAiraPlatform ? (
                        /* AIRA platform: show invite button if not already in guild */
                        !isAlreadyInGuild && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-green-500 hover:text-green-400 hover:bg-green-500/10"
                            onClick={() => {
                              setSelectedIds(new Set([member.id]))
                              handleOpenInviteModal()
                            }}
                          >
                            <UserPlus className="h-4 w-4" />
                          </Button>
                        )
                      ) : (
                        /* Guild: show full management actions */
                        member.role !== 'admin' && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="h-8 w-8 p-0 text-zinc-400 hover:text-zinc-200"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 bg-zinc-900 border-zinc-800">
                              {member.role === 'member' && (
                                <DropdownMenuItem 
                                  onClick={() => setConfirmDialog({ open: true, type: 'makeMod', member })}
                                  className="text-zinc-300 focus:text-zinc-100 focus:bg-zinc-800 cursor-pointer"
                                >
                                  <Shield className="h-4 w-4 mr-2" />
                                  Make Moderator
                                </DropdownMenuItem>
                              )}
                              {member.role === 'moderator' && (
                                <DropdownMenuItem 
                                  onClick={() => setConfirmDialog({ open: true, type: 'removeMod', member })}
                                  className="text-zinc-300 focus:text-zinc-100 focus:bg-zinc-800 cursor-pointer"
                                >
                                  <ShieldOff className="h-4 w-4 mr-2" />
                                  Remove Moderator
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator className="bg-zinc-800" />
                              <DropdownMenuItem 
                                onClick={() => setConfirmDialog({ open: true, type: 'remove', member })}
                                className="text-red-500 focus:text-red-400 focus:bg-red-500/10 cursor-pointer"
                              >
                                <UserX className="h-4 w-4 mr-2" />
                                Remove User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {filteredMembers.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Users className="h-12 w-12 text-zinc-700 mb-4" />
              <h3 className="text-lg font-semibold text-zinc-200 mb-2">No members found</h3>
              <p className="text-zinc-500 max-w-sm">
                {searchQuery || hasActiveFilters 
                  ? "Try adjusting your search or filters"
                  : "No members in this guild yet"}
              </p>
            </div>
          )}
        </div>

        {/* Footer with count */}
        <div className="px-4 py-3 border-t border-zinc-800/50 text-sm text-zinc-500">
          Showing {filteredMembers.length} of {allMembers.length} members
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, open }))}>
        <DialogContent className="bg-zinc-950 border-zinc-800 max-w-md">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle className="text-zinc-100">
              {confirmDialog.type === 'remove' && 'Remove User'}
              {confirmDialog.type === 'makeMod' && 'Make Moderator'}
              {confirmDialog.type === 'removeMod' && 'Remove Moderator'}
              {confirmDialog.type === 'bulkRemove' && 'Remove Users'}
              {confirmDialog.type === 'bulkMakeMod' && 'Make Moderators'}
              {confirmDialog.type === 'bulkRemoveMod' && 'Remove Moderators'}
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              {confirmDialog.type === 'remove' && (
                <>Are you sure you want to remove <span className="text-zinc-200">@{confirmDialog.member?.username}</span> from this guild? This action cannot be undone.</>
              )}
              {confirmDialog.type === 'makeMod' && (
                <>Are you sure you want to make <span className="text-zinc-200">@{confirmDialog.member?.username}</span> a moderator? They will gain moderation privileges.</>
              )}
              {confirmDialog.type === 'removeMod' && (
                <>Are you sure you want to remove moderator status from <span className="text-zinc-200">@{confirmDialog.member?.username}</span>?</>
              )}
              {confirmDialog.type === 'bulkRemove' && (
                <>Are you sure you want to remove <span className="text-zinc-200">{confirmDialog.count} users</span> from this guild? This action cannot be undone.</>
              )}
              {confirmDialog.type === 'bulkMakeMod' && (
                <>Are you sure you want to make <span className="text-zinc-200">{confirmDialog.count} users</span> moderators?</>
              )}
              {confirmDialog.type === 'bulkRemoveMod' && (
                <>Are you sure you want to remove moderator status from <span className="text-zinc-200">{confirmDialog.count} users</span>?</>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="px-6 pb-6 pt-4">
            <Button
              variant="outline"
              onClick={() => setConfirmDialog({ open: false, type: 'remove' })}
              className="border-zinc-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmAction}
              className={cn(
                (confirmDialog.type === 'remove' || confirmDialog.type === 'bulkRemove')
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-green-600 hover:bg-green-700 text-white"
              )}
            >
              {confirmDialog.type === 'remove' && 'Remove User'}
              {confirmDialog.type === 'makeMod' && 'Make Moderator'}
              {confirmDialog.type === 'removeMod' && 'Remove Moderator'}
              {confirmDialog.type === 'bulkRemove' && 'Remove Users'}
              {confirmDialog.type === 'bulkMakeMod' && 'Make Moderators'}
              {confirmDialog.type === 'bulkRemoveMod' && 'Remove Moderators'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invite Modal */}
      <Dialog open={inviteModal.open} onOpenChange={(open) => {
        setInviteModal({ ...inviteModal, open })
        if (!open) setInviteMessage('')
      }}>
        <DialogContent className="bg-zinc-950 border-zinc-800 max-w-md">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle className="text-zinc-100">
              Invite to {guild?.name || 'Guild'}
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              Send an invitation to <span className="text-zinc-200">{inviteModal.count} user{inviteModal.count !== 1 ? 's' : ''}</span> to join your guild.
            </DialogDescription>
          </DialogHeader>
          <div className="px-6 py-4">
            <label className="text-sm font-medium text-zinc-300 mb-2 block">
              Personal message (optional)
            </label>
            <textarea
              value={inviteMessage}
              onChange={(e) => setInviteMessage(e.target.value)}
              placeholder="Add a personal message to your invitation..."
              className="w-full h-24 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-md text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 resize-none"
            />
          </div>
          <DialogFooter className="px-6 pb-6 pt-2">
            <Button
              variant="outline"
              onClick={() => {
                setInviteModal({ open: false, count: 0 })
                setInviteMessage('')
              }}
              className="border-zinc-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendInvites}
              className="gap-2 bg-green-600 hover:bg-green-700 text-white"
            >
              <Send className="h-4 w-4" />
              Send Invite{inviteModal.count !== 1 ? 's' : ''}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div className="flex items-center gap-3 px-4 py-3 bg-zinc-900 border border-green-500/30 rounded-lg shadow-lg">
            <div className="flex items-center justify-center w-8 h-8 bg-green-500/20 rounded-full">
              <Check className="h-4 w-4 text-green-500" />
            </div>
            <p className="text-sm font-medium text-zinc-200">Invites sent successfully</p>
            <button
              onClick={() => setShowToast(false)}
              className="ml-2 text-zinc-500 hover:text-zinc-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </AppContainer>
  )
}

// Helper Components

function SortableHeader({ 
  field, 
  label, 
  sortField, 
  sortDirection, 
  onSort 
}: { 
  field: SortField
  label: string
  sortField: SortField | null
  sortDirection: SortDirection
  onSort: (field: SortField) => void 
}) {
  const isActive = sortField === field
  
  return (
    <th 
      className="px-3 py-3 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider cursor-pointer hover:text-zinc-200 transition-colors w-24"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-1">
        {label}
        <span className={cn("transition-opacity", isActive ? "opacity-100" : "opacity-0")}>
          {sortDirection === 'asc' ? (
            <ChevronUp className="h-3 w-3" />
          ) : (
            <ChevronDown className="h-3 w-3" />
          )}
        </span>
      </div>
    </th>
  )
}

function RoleBadge({ role }: { role: 'admin' | 'moderator' | 'member' }) {
  const styles = {
    admin: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    moderator: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    member: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30'
  }
  
  return (
    <span className={cn(
      "px-2 py-0.5 text-xs font-medium rounded border capitalize",
      styles[role]
    )}>
      {role}
    </span>
  )
}

function PersonaBadge({ persona }: { persona: MemberPersona }) {
  const color = PERSONA_COLORS[persona]
  
  return (
    <span 
      className="px-2 py-0.5 text-xs font-medium rounded border whitespace-nowrap inline-block"
      style={{
        backgroundColor: `${color}20`,
        color: color,
        borderColor: `${color}30`
      }}
    >
      {persona}
    </span>
  )
}

function WalletCategoryBadge({ category }: { category: WalletCategory }) {
  const color = WALLET_CATEGORY_COLORS[category]
  
  return (
    <span 
      className="px-2 py-0.5 text-xs font-medium rounded"
      style={{
        backgroundColor: `${color}20`,
        color: color
      }}
    >
      {category}
    </span>
  )
}
