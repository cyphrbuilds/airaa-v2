'use client'

import { useState, useRef, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { MessageCircle } from 'lucide-react'
import { ChatMessageComponent, ChatInput } from '@/components/chat'
import { AppContainer } from '@/components/app-container'
import { useGuild } from '@/lib/guild-context'
import { useAuth } from '@/lib/auth-context'
import { ChatMessage, ChatReaction } from '@/types'
import { getGuildChatMessages } from '@/lib/mock-data'

export default function GuildChatPage() {
  const params = useParams()
  const guildId = params.id as string
  const { guild, members } = useGuild()
  const { user } = useAuth()

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

  const handleSendMessage = (content: string, mentions: string[]) => {
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      guildId: guild.id,
      content,
      authorId: user.id,
      authorUsername: user.username,
      authorAvatar: user.avatar,
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
          if (existingReaction.userIds.includes(user.id)) {
            // Remove user's reaction
            const newUserIds = existingReaction.userIds.filter(
              (id) => id !== user.id
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
                      userIds: [...r.userIds, user.id],
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
            userIds: [user.id],
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

  return (
    <AppContainer
      appId="chat"
      appName="Chat"
      appIcon="💬"
      appDescription={`Community discussion for ${guild.name}`}
      noPadding
    >
      <div className="flex flex-col h-full">
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
                    currentUserId={user.id}
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
                      currentUserId={user.id}
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
    </AppContainer>
  )
}
