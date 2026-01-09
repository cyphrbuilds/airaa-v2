'use client'

import { useEffect, useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Crown, Shield } from 'lucide-react'
import { GuildMember } from '@/types'
import { cn } from '@/lib/utils'

interface MentionPopoverProps {
  members: GuildMember[]
  searchQuery: string
  selectedIndex: number
  onSelect: (member: GuildMember) => void
  onClose: () => void
  position: { top: number; left: number }
  accentColor: string
}

export function MentionPopover({
  members,
  searchQuery,
  selectedIndex,
  onSelect,
  onClose,
  position,
  accentColor,
}: MentionPopoverProps) {
  const ref = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])

  // Filter members based on search query
  const filteredMembers = members.filter((member) =>
    member.username.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5) // Limit to 5 suggestions

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  // Scroll selected item into view
  useEffect(() => {
    if (itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex]?.scrollIntoView({ block: 'nearest' })
    }
  }, [selectedIndex])

  if (filteredMembers.length === 0) {
    return null
  }

  const getRoleBadge = (role: GuildMember['role']) => {
    if (role === 'admin') {
      return (
        <Badge
          className="text-[10px] px-1 py-0 h-4 gap-0.5"
          style={{
            backgroundColor: `${accentColor}20`,
            color: accentColor,
          }}
        >
          <Crown className="h-2.5 w-2.5" />
        </Badge>
      )
    }
    if (role === 'moderator') {
      return (
        <Badge
          className="text-[10px] px-1 py-0 h-4 gap-0.5"
          style={{
            backgroundColor: '#3b82f620',
            color: '#3b82f6',
          }}
        >
          <Shield className="h-2.5 w-2.5" />
        </Badge>
      )
    }
    return null
  }

  return (
    <div
      ref={ref}
      className="absolute bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl z-50 overflow-hidden min-w-[200px] max-w-[280px]"
      style={{
        bottom: '100%',
        left: position.left,
        marginBottom: '8px',
      }}
    >
      <div className="px-3 py-2 border-b border-zinc-800">
        <p className="text-xs text-zinc-500 font-medium">Members matching @{searchQuery || '...'}</p>
      </div>
      <div className="max-h-[200px] overflow-y-auto py-1">
        {filteredMembers.map((member, index) => (
          <button
            key={member.id}
            ref={(el) => { itemRefs.current[index] = el }}
            onClick={() => onSelect(member)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 text-left transition-colors",
              index === selectedIndex ? "bg-zinc-800" : "hover:bg-zinc-800/50"
            )}
          >
            <Avatar className="h-7 w-7">
              <AvatarImage src={member.avatar} alt={member.username} />
              <AvatarFallback className="bg-zinc-700 text-xs">
                {member.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-medium text-zinc-100 truncate">
                  {member.username}
                </span>
                {getRoleBadge(member.role)}
              </div>
            </div>
            {member.isOnline && (
              <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
