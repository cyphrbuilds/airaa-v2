'use client'

import { X, Crown, Shield } from 'lucide-react'
import { GuildMember, Guild } from '@/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

interface MembersPanelProps {
  members: GuildMember[]
  guild: Guild
  isOpen: boolean
  onClose: () => void
}

export function MembersPanel({ members, guild, isOpen, onClose }: MembersPanelProps) {
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
    <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-800/50 transition-colors cursor-pointer">
      <Avatar className="h-8 w-8">
        <AvatarImage src={member.avatar} alt={member.username} />
        <AvatarFallback className="bg-zinc-800 text-xs">
          {member.username[0].toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-sm truncate text-zinc-200">
            {member.username}
          </span>
          {getRoleIcon(member.role)}
        </div>
        {getRoleBadge(member.role)}
      </div>
    </div>
  )

  return (
    <div 
      className={cn(
        "flex-shrink-0 h-full border-l border-zinc-800/50 bg-[#0f0f0f] transition-all duration-300 ease-in-out overflow-hidden",
        isOpen ? "w-[280px]" : "w-0"
      )}
    >
      <div className="w-[280px] h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/50">
          <h3 className="font-semibold text-zinc-200">Members</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-7 w-7 p-0 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Members List */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            {members.map((member) => (
              <MemberItem key={member.id} member={member} />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
