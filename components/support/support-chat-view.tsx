'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { format, isSameDay } from 'date-fns'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Guild, SupportMessage } from '@/types'
import { SupportMessageComponent, DateSeparator } from './support-message'
import { SupportChatInput } from './support-chat-input'
import { useAuth } from '@/lib/auth-context'

/**
 * Props for the SupportChatView component
 */
export interface SupportChatViewProps {
  /** The guild this chat belongs to */
  guild: Guild
  /** Initial messages to display */
  messages: SupportMessage[]
  /** Callback when a message is sent */
  onSendMessage: (content: string) => void
}

export function SupportChatView({ guild, messages, onSendMessage }: SupportChatViewProps) {
  const { user } = useAuth()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [localMessages, setLocalMessages] = useState<SupportMessage[]>(messages)

  // Update local messages when prop changes
  useEffect(() => {
    setLocalMessages(messages)
  }, [messages])

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [localMessages])

  // Group messages by date
  const messagesWithDates = useMemo(() => {
    const result: { type: 'date' | 'message'; date?: Date; message?: SupportMessage }[] = []
    let lastDate: Date | null = null

    localMessages.forEach((msg) => {
      const msgDate = new Date(msg.timestamp)
      if (!lastDate || !isSameDay(lastDate, msgDate)) {
        result.push({ type: 'date', date: msgDate })
        lastDate = msgDate
      }
      result.push({ type: 'message', message: msg })
    })

    return result
  }, [localMessages])

  const handleSend = (content: string) => {
    // Add message locally for instant feedback
    const newMessage: SupportMessage = {
      id: `smsg-new-${Date.now()}`,
      conversationId: 'local',
      senderId: user.id,
      senderUsername: user.username,
      senderAvatar: user.avatar,
      senderType: 'member',
      content,
      timestamp: new Date(),
      isRead: false
    }
    setLocalMessages(prev => [...prev, newMessage])
    onSendMessage(content)
  }

  return (
    <div className="flex flex-col h-full bg-[#0f0f0f]">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-zinc-800">
        <Avatar className="h-10 w-10">
          <AvatarImage src={guild.icon} alt={guild.name} />
          <AvatarFallback className="bg-zinc-800 text-zinc-300">
            {guild.name[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-base font-semibold text-zinc-100">
            {user.username}&apos;s support chat
          </h1>
          <p className="text-sm text-zinc-500">
            Chat with {guild.name} team
          </p>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1" ref={scrollRef}>
        <div className="py-4">
          {messagesWithDates.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center px-8">
              <Avatar className="h-16 w-16 mb-4">
                <AvatarImage src={guild.icon} alt={guild.name} />
                <AvatarFallback 
                  className="text-xl"
                  style={{ backgroundColor: `${guild.accentColor}30`, color: guild.accentColor }}
                >
                  {guild.name[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-lg font-semibold text-zinc-200 mb-2">
                Welcome to {guild.name} support
              </h3>
              <p className="text-zinc-500 max-w-sm">
                If you have any questions about our campaigns or need help, feel free to message us here!
              </p>
            </div>
          ) : (
            messagesWithDates.map((item, index) => {
              if (item.type === 'date' && item.date) {
                return <DateSeparator key={`date-${index}`} date={item.date} />
              }
              if (item.type === 'message' && item.message) {
                return (
                  <SupportMessageComponent
                    key={item.message.id}
                    message={item.message}
                    isCurrentUser={item.message.senderId === user.id}
                    accentColor={guild.accentColor}
                  />
                )
              }
              return null
            })
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <SupportChatInput
        accentColor={guild.accentColor}
        onSend={handleSend}
        placeholder="Send a message..."
      />
    </div>
  )
}
