'use client'

import { formatDistanceToNow } from 'date-fns'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { SupportConversation } from '@/types'
import { cn } from '@/lib/utils'

/**
 * Props for the ConversationItem component
 */
export interface ConversationItemProps {
  /** The conversation data to display */
  conversation: SupportConversation
  /** Whether this conversation is currently selected */
  isSelected: boolean
  /** Callback when the conversation is clicked */
  onClick: () => void
  /** Optional accent color for selection highlight (default: '#3b82f6') */
  accentColor?: string
}

export function ConversationItem({
  conversation,
  isSelected,
  onClick,
  accentColor = '#3b82f6'
}: ConversationItemProps) {
  const timeAgo = formatDistanceToNow(conversation.lastMessageAt, { addSuffix: false })
  
  // Format time to be more compact
  const formatTime = () => {
    const now = new Date()
    const diff = now.getTime() - conversation.lastMessageAt.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (minutes < 60) return `${minutes}m`
    if (hours < 24) return `${hours}h`
    if (days < 7) return `${days}d`
    return timeAgo
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-start gap-3 p-3 rounded-lg text-left transition-all",
        isSelected 
          ? "bg-zinc-800" 
          : "hover:bg-zinc-800/50"
      )}
      style={isSelected ? {
        backgroundColor: `${accentColor}15`,
        borderLeft: `3px solid ${accentColor}`
      } : undefined}
    >
      {/* Avatar with online indicator */}
      <div className="relative flex-shrink-0">
        <Avatar className="h-10 w-10">
          <AvatarImage src={conversation.memberAvatar} alt={conversation.memberUsername} />
          <AvatarFallback className="bg-zinc-700 text-zinc-300">
            {conversation.memberUsername[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {conversation.status === 'active' && (
          <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-zinc-900" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 overflow-hidden">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <span className={cn(
            "text-sm font-medium truncate",
            conversation.unreadCount > 0 ? "text-white" : "text-zinc-200"
          )}>
            {conversation.memberUsername}
          </span>
          <span className="text-xs text-zinc-500 flex-shrink-0">
            {formatTime()}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <p className={cn(
            "text-sm truncate flex-1",
            conversation.unreadCount > 0 ? "text-zinc-300" : "text-zinc-500"
          )}>
            {conversation.lastMessage || 'No messages yet'}
          </p>
          
          {/* Unread badge */}
          {conversation.unreadCount > 0 && (
            <Badge 
              className="h-5 min-w-[20px] px-1.5 text-[10px] font-bold flex-shrink-0"
              style={{ backgroundColor: accentColor }}
            >
              {conversation.unreadCount}
            </Badge>
          )}
        </div>
      </div>
    </button>
  )
}
