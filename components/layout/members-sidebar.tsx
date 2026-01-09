'use client'

import { Crown, Shield, User } from 'lucide-react'
import { GuildMember, Guild } from '@/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

interface MembersSidebarProps {
  members: GuildMember[]
  guild: Guild
}

export function MembersSidebar({ members, guild }: MembersSidebarProps) {
  const onlineMembers = members.filter(m => m.isOnline)
  const offlineMembers = members.filter(m => !m.isOnline)

  const getRoleIcon = (role: GuildMember['role']) => {
    if (role === 'admin') return <Crown className="h-3 w-3" style={{ color: guild.accentColor }} />
    if (role === 'moderator') return <Shield className="h-3 w-3 text-blue-400" />
    return null
  }

  const getRoleBadge = (role: GuildMember['role']) => {
    if (role === 'admin') {
      return (
        <span 
          className="text-[10px] font-semibold uppercase"
          style={{ color: guild.accentColor }}
        >
          Admin
        </span>
      )
    }
    if (role === 'moderator') {
      return (
        <span className="text-[10px] font-semibold uppercase text-blue-400">
          Moderator
        </span>
      )
    }
    return null
  }

  const MemberItem = ({ member }: { member: GuildMember }) => (
    <div className="flex items-center gap-3 px-3 py-1.5 rounded-md hover:bg-zinc-800/50 transition-colors cursor-pointer">
      <div className="relative">
        <Avatar className="h-8 w-8">
          <AvatarImage src={member.avatar} alt={member.username} />
          <AvatarFallback className="bg-zinc-800 text-xs">
            {member.username[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {member.isOnline && (
          <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-[#0f0f0f]" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className={cn(
            "text-sm truncate",
            member.isOnline ? "text-zinc-200" : "text-zinc-500"
          )}>
            {member.username}
          </span>
          {getRoleIcon(member.role)}
        </div>
        {getRoleBadge(member.role)}
      </div>
    </div>
  )

  return (
    <div className="w-[220px] border-l border-zinc-800/50 bg-[#0f0f0f] flex flex-col">
      <div className="p-4 border-b border-zinc-800/50">
        <h3 className="font-semibold text-zinc-200">Members</h3>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-2">
          {/* Online Section */}
          {onlineMembers.length > 0 && (
            <div className="mb-4">
              <div className="px-2 py-1 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Online — {onlineMembers.length}
              </div>
              {onlineMembers.map((member) => (
                <MemberItem key={member.id} member={member} />
              ))}
            </div>
          )}

          {/* Offline Section */}
          {offlineMembers.length > 0 && (
            <div>
              <div className="px-2 py-1 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Offline — {offlineMembers.length}
              </div>
              {offlineMembers.map((member) => (
                <MemberItem key={member.id} member={member} />
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
