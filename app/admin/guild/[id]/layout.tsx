'use client'

import { useParams } from 'next/navigation'
import { GuildSidebar } from '@/components/layout/guild-sidebar'
import { GuildProvider } from '@/lib/guild-context'
import { getGuildById, getGuildMembers, getUserRoleInGuild } from '@/lib/mock-data'

export default function AdminGuildLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const params = useParams()
  const guildId = params.id as string
  
  const guild = getGuildById(guildId)
  const members = getGuildMembers(guildId)

  if (!guild) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0a0a0a]">
        <p className="text-zinc-500">Guild not found</p>
      </div>
    )
  }

  // Determine user role (mock - in real app would come from auth)
  const userRole = getUserRoleInGuild(guildId)
  
  // Check if user has admin/mod access
  if (userRole !== 'admin' && userRole !== 'moderator') {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0a0a0a]">
        <div className="text-center">
          <p className="text-zinc-500 mb-2">Access Denied</p>
          <p className="text-zinc-600 text-sm">You need admin or moderator permissions to view this page.</p>
        </div>
      </div>
    )
  }

  return (
    <GuildProvider guild={guild} members={members} userRole={userRole}>
      <div className="flex h-screen overflow-hidden">
        <GuildSidebar guild={guild} />
        <main className="flex-1 overflow-hidden bg-[#111111]">
          {children}
        </main>
      </div>
    </GuildProvider>
  )
}
