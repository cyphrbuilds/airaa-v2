'use client'

import { useState, useRef, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { MessageCircle, Users } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChatMessageComponent, ChatInput } from '@/components/chat'
import { ChatMessage, ChatReaction } from '@/types'
import {
  getGuildById,
  getGuildMembers,
  getGuildChatMessages,
  currentUser,
} from '@/lib/mock-data'
import { cn } from '@/lib/utils'

export default function GuildChatPage() {
  const params = useParams()
  const guildId = params.id as string

  const guild = getGuildById(guildId)
  const members = getGuildMembers(guildId)
  const initialMessages = getGuildChatMessages(guildId)

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  if (!guild) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-zinc-500">Guild not found</p>
      </div>
    )
  }

  const handleSendMessage = (content: string, mentions: string[]) => {
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      guildId: guild.id,
      content,
      authorId: currentUser.id,
      authorUsername: currentUser.username,
      authorAvatar: currentUser.avatar,
      authorRole: 'admin', // In a real app, this would come from user's role in the guild
      timestamp: new Date(),
      reactions: [],
      mentions,
      replyToId: replyTo?.id,
      replyToUsername: replyTo?.authorUsername,
    }

    setMessages((prev) => [...prev, newMessage])
    setReplyTo(null)
  }

  const handleReaction = (messageId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id !== messageId) return msg

        const existingReaction = msg.reactions.find((r) => r.emoji === emoji)

        if (existingReaction) {
          // Check if user already reacted
          if (existingReaction.userIds.includes(currentUser.id)) {
            // Remove user's reaction
            const newUserIds = existingReaction.userIds.filter(
              (id) => id !== currentUser.id
            )
            if (newUserIds.length === 0) {
              // Remove reaction entirely if no users left
              return {
                ...msg,
                reactions: msg.reactions.filter((r) => r.emoji !== emoji),
              }
            }
            return {
              ...msg,
              reactions: msg.reactions.map((r) =>
                r.emoji === emoji
                  ? { ...r, count: r.count - 1, userIds: newUserIds }
                  : r
              ),
            }
          } else {
            // Add user to existing reaction
            return {
              ...msg,
              reactions: msg.reactions.map((r) =>
                r.emoji === emoji
                  ? {
                      ...r,
                      count: r.count + 1,
                      userIds: [...r.userIds, currentUser.id],
                    }
                  : r
              ),
            }
          }
        } else {
          // Add new reaction
          const newReaction: ChatReaction = {
            emoji,
            count: 1,
            userIds: [currentUser.id],
          }
          return {
            ...msg,
            reactions: [...msg.reactions, newReaction],
          }
        }
      })
    )
  }

  const handleReply = (message: ChatMessage) => {
    setReplyTo(message)
  }

  // Group messages - replies are shown inline with their parent
  const parentMessages = messages.filter((msg) => !msg.replyToId)
  const repliesByParent = messages
    .filter((msg) => msg.replyToId)
    .reduce<Record<string, ChatMessage[]>>((acc, msg) => {
      const parentId = msg.replyToId!
      if (!acc[parentId]) acc[parentId] = []
      acc[parentId].push(msg)
      return acc
    }, {})

  const onlineCount = members.filter((m) => m.isOnline).length

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-zinc-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-lg flex items-center justify-center text-2xl"
              style={{ backgroundColor: `${guild.accentColor}20` }}
            >
              💬
            </div>
            <div>
              <h1 className="text-lg font-semibold text-zinc-100">Chat</h1>
              <p className="text-sm text-zinc-500">
                Community discussion for {guild.name}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <Users className="h-4 w-4" />
              <span>{members.length} members</span>
              <span className="text-zinc-600">•</span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                {onlineCount} online
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div
              className="h-16 w-16 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: `${guild.accentColor}20` }}
            >
              <MessageCircle
                className="h-8 w-8"
                style={{ color: guild.accentColor }}
              />
            </div>
            <h3 className="text-lg font-semibold text-zinc-200 mb-2">
              No messages yet
            </h3>
            <p className="text-zinc-500 max-w-sm">
              Be the first to start the conversation! Say hello to the{' '}
              {guild.name} community.
            </p>
          </div>
        ) : (
          <div className="py-4">
            {/* Messages */}
            {parentMessages.map((message) => (
              <div key={message.id}>
                <ChatMessageComponent
                  message={message}
                  guild={guild}
                  members={members}
                  currentUserId={currentUser.id}
                  onReply={handleReply}
                  onReaction={handleReaction}
                />
                {/* Replies */}
                {repliesByParent[message.id]?.map((reply) => (
                  <ChatMessageComponent
                    key={reply.id}
                    message={reply}
                    guild={guild}
                    members={members}
                    currentUserId={currentUser.id}
                    onReply={handleReply}
                    onReaction={handleReaction}
                    isReply
                  />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input Area */}
      <ChatInput
        members={members}
        accentColor={guild.accentColor}
        replyTo={replyTo}
        onCancelReply={() => setReplyTo(null)}
        onSend={handleSendMessage}
      />
    </div>
  )
}
