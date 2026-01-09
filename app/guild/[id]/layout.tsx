'use client'

import { useParams } from 'next/navigation'
import { GuildSidebar } from '@/components/layout/guild-sidebar'
import { MembersSidebar } from '@/components/layout/members-sidebar'
import { getGuildById, getGuildMembers } from '@/lib/mock-data'

export default function GuildLayout({
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
      <div className="flex items-center justify-center h-screen">
        <p className="text-zinc-500">Guild not found</p>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <GuildSidebar guild={guild} />
      <main className="flex-1 overflow-y-auto bg-[#111111]">
        {children}
      </main>
      <MembersSidebar members={members} guild={guild} />
    </div>
  )
}
