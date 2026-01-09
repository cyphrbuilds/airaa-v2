'use client'

import { format, isToday, isYesterday } from 'date-fns'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { SupportMessage } from '@/types'
import { cn } from '@/lib/utils'

/**
 * Props for the SupportMessageComponent
 */
export interface SupportMessageProps {
  /** The message data to display */
  message: SupportMessage
  /** Whether this message was sent by the current user */
  isCurrentUser: boolean
  /** Whether to show the avatar (default: true) */
  showAvatar?: boolean
  /** Accent color for current user's message bubble (default: '#3b82f6') */
  accentColor?: string
}

export function SupportMessageComponent({
  message,
  isCurrentUser,
  showAvatar = true,
  accentColor = '#3b82f6'
}: SupportMessageProps) {
  const formatTimestamp = (date: Date) => {
    if (isToday(date)) {
      return format(date, 'h:mm a')
    }
    if (isYesterday(date)) {
      return `Yesterday at ${format(date, 'h:mm a')}`
    }
    return format(date, 'MMM d, h:mm a')
  }

  return (
    <div
      className={cn(
        "flex gap-3 px-4 py-2",
        isCurrentUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      {showAvatar && (
        <Avatar className="h-9 w-9 flex-shrink-0">
          <AvatarImage src={message.senderAvatar} alt={message.senderUsername} />
          <AvatarFallback className="bg-zinc-800 text-zinc-300 text-sm">
            {message.senderUsername[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}

      {/* Content */}
      <div
        className={cn(
          "flex flex-col max-w-[70%]",
          isCurrentUser ? "items-end" : "items-start"
        )}
      >
        {/* Header - only show for non-current user */}
        {!isCurrentUser && (
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-zinc-200">
              {message.senderUsername}
            </span>
            <span className="text-xs text-zinc-500">
              {formatTimestamp(message.timestamp)}
            </span>
          </div>
        )}

        {/* Message bubble */}
        <div
          className={cn(
            "px-4 py-2.5 rounded-2xl text-sm leading-relaxed",
            isCurrentUser
              ? "rounded-tr-md"
              : "bg-zinc-800 text-zinc-100 rounded-tl-md"
          )}
          style={isCurrentUser ? {
            backgroundColor: accentColor,
            color: '#ffffff'
          } : undefined}
        >
          {message.content}
        </div>

        {/* Timestamp for current user */}
        {isCurrentUser && (
          <span className="text-xs text-zinc-500 mt-1">
            {formatTimestamp(message.timestamp)}
          </span>
        )}
      </div>
    </div>
  )
}

/**
 * Props for the DateSeparator component
 */
export interface DateSeparatorProps {
  /** The date to display */
  date: Date
}

export function DateSeparator({ date }: DateSeparatorProps) {
  const formatDate = (d: Date) => {
    if (isToday(d)) return 'TODAY'
    if (isYesterday(d)) return 'YESTERDAY'
    return format(d, 'MMMM d, yyyy').toUpperCase()
  }

  return (
    <div className="flex items-center justify-center py-4">
      <span className="text-xs font-medium text-zinc-500 tracking-wide">
        {formatDate(date)}
      </span>
    </div>
  )
}
