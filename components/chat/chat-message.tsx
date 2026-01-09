'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Reply, Smile, Shield, Crown } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ChatMessage as ChatMessageType, GuildMember, CHAT_REACTIONS } from '@/types'
import { cn } from '@/lib/utils'
import { ReactionPicker } from './reaction-picker'

interface ChatMessageProps {
  message: ChatMessageType
  guild: { accentColor: string }
  members: GuildMember[]
  currentUserId: string
  onReply: (message: ChatMessageType) => void
  onReaction: (messageId: string, emoji: string) => void
  isReply?: boolean
}

export function ChatMessageComponent({
  message,
  guild,
  members,
  currentUserId,
  onReply,
  onReaction,
  isReply = false,
}: ChatMessageProps) {
  const [showReactionPicker, setShowReactionPicker] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // Parse mentions in content and highlight them
  const renderContent = (content: string) => {
    const mentionRegex = /@(\w+)/g
    const parts = content.split(mentionRegex)
    
    return parts.map((part, index) => {
      // Check if this part is a username (odd indices after split)
      if (index % 2 === 1) {
        const mentionedMember = members.find(m => m.username === part)
        if (mentionedMember) {
          return (
            <span
              key={index}
              className="px-1 py-0.5 rounded text-sm font-medium"
              style={{
                backgroundColor: `${guild.accentColor}30`,
                color: guild.accentColor,
              }}
            >
              @{part}
            </span>
          )
        }
      }
      return part
    })
  }

  const getRoleBadge = () => {
    if (message.authorRole === 'admin') {
      return (
        <Badge
          className="text-[10px] px-1.5 py-0 h-4 gap-0.5"
          style={{
            backgroundColor: `${guild.accentColor}20`,
            color: guild.accentColor,
          }}
        >
          <Crown className="h-2.5 w-2.5" />
          Admin
        </Badge>
      )
    }
    if (message.authorRole === 'moderator') {
      return (
        <Badge
          className="text-[10px] px-1.5 py-0 h-4 gap-0.5"
          style={{
            backgroundColor: '#3b82f620',
            color: '#3b82f6',
          }}
        >
          <Shield className="h-2.5 w-2.5" />
          Mod
        </Badge>
      )
    }
    return null
  }

  const hasUserReacted = (emoji: string) => {
    const reaction = message.reactions.find(r => r.emoji === emoji)
    return reaction?.userIds.includes(currentUserId)
  }

  return (
    <div
      className={cn(
        "group relative px-4 py-2 transition-colors",
        isHovered && "bg-zinc-800/30",
        isReply && "ml-12 border-l-2 border-zinc-700 pl-4"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setShowReactionPicker(false)
      }}
    >
      {/* Reply indicator */}
      {message.replyToId && message.replyToUsername && (
        <div className="flex items-center gap-2 mb-1 text-xs text-zinc-500">
          <Reply className="h-3 w-3 rotate-180" />
          <span>Replying to</span>
          <span className="font-medium text-zinc-400">@{message.replyToUsername}</span>
        </div>
      )}

      <div className="flex gap-3">
        {/* Avatar */}
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarImage src={message.authorAvatar} alt={message.authorUsername} />
          <AvatarFallback className="bg-zinc-800 text-zinc-300">
            {message.authorUsername[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-semibold text-zinc-100">{message.authorUsername}</span>
            {getRoleBadge()}
            <span className="text-xs text-zinc-500">
              {format(message.timestamp, 'h:mm a')}
            </span>
            {message.isEdited && (
              <span className="text-xs text-zinc-600">(edited)</span>
            )}
          </div>

          {/* Message content */}
          <p className="text-zinc-300 text-sm leading-relaxed break-words">
            {renderContent(message.content)}
          </p>

          {/* Reactions */}
          {message.reactions.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {message.reactions.map((reaction) => (
                <TooltipProvider key={reaction.emoji}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => onReaction(message.id, reaction.emoji)}
                        className={cn(
                          "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-all",
                          hasUserReacted(reaction.emoji)
                            ? "bg-zinc-700 ring-1 ring-[var(--ring-color)]"
                            : "bg-zinc-800 hover:bg-zinc-700"
                        )}
                        style={{
                          '--ring-color': guild.accentColor,
                        } as React.CSSProperties}
                      >
                        <span>{reaction.emoji}</span>
                        <span className="text-zinc-400">{reaction.count}</span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-zinc-900 text-zinc-100 border-zinc-700">
                      <p className="text-xs">
                        {reaction.userIds.length} {reaction.userIds.length === 1 ? 'person' : 'people'} reacted
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          )}
        </div>

        {/* Hover actions */}
        {isHovered && (
          <div className="absolute right-4 -top-3 flex items-center gap-1 bg-zinc-900 border border-zinc-700 rounded-lg p-1 shadow-lg">
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
                onClick={() => setShowReactionPicker(!showReactionPicker)}
              >
                <Smile className="h-4 w-4" />
              </Button>
              {showReactionPicker && (
                <ReactionPicker
                  onSelect={(emoji) => {
                    onReaction(message.id, emoji)
                    setShowReactionPicker(false)
                  }}
                  onClose={() => setShowReactionPicker(false)}
                />
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
              onClick={() => onReply(message)}
            >
              <Reply className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
