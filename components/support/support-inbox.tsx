'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { isSameDay } from 'date-fns'
import { Settings, Bell, Eye } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Guild, SupportConversation, SupportMessage } from '@/types'
import { ConversationList } from './conversation-list'
import { SupportMessageComponent, DateSeparator } from './support-message'
import { SupportChatInput } from './support-chat-input'
import { useAuth } from '@/lib/auth-context'
import { api } from '@/lib/api'

/**
 * Props for the SupportInbox component
 */
export interface SupportInboxProps {
  /** The guild this inbox belongs to */
  guild: Guild
  /** Array of support conversations to display */
  conversations: SupportConversation[]
  /** Callback when an admin sends a message */
  onSendMessage: (conversationId: string, content: string) => void
}

export function SupportInbox({ guild, conversations, onSendMessage }: SupportInboxProps) {
  const { user } = useAuth()
  const [selectedConversation, setSelectedConversation] = useState<SupportConversation | null>(null)
  const [conversationMessages, setConversationMessages] = useState<SupportMessage[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)

  // Load messages when conversation is selected
  useEffect(() => {
    const loadMessages = async () => {
      if (selectedConversation) {
        try {
          const messages = await api.support.getMessages(selectedConversation.id)
          setConversationMessages(messages)
          // Mark as read when opened
          await api.support.markAsRead(selectedConversation.id)
        } catch (error) {
          console.error('Error loading messages:', error)
          setConversationMessages([])
        }
      } else {
        setConversationMessages([])
      }
    }

    loadMessages()
  }, [selectedConversation])

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [conversationMessages])

  // Group messages by date
  const messagesWithDates = useMemo(() => {
    const result: { type: 'date' | 'message'; date?: Date; message?: SupportMessage }[] = []
    let lastDate: Date | null = null

    conversationMessages.forEach((msg) => {
      const msgDate = new Date(msg.timestamp)
      if (!lastDate || !isSameDay(lastDate, msgDate)) {
        result.push({ type: 'date', date: msgDate })
        lastDate = msgDate
      }
      result.push({ type: 'message', message: msg })
    })

    return result
  }, [conversationMessages])

  const handleSelectConversation = (conversation: SupportConversation) => {
    setSelectedConversation(conversation)
  }

  const handleSendMessage = (content: string) => {
    if (!selectedConversation) return

    // Add message locally for instant feedback
    const newMessage: SupportMessage = {
      id: `smsg-admin-${Date.now()}`,
      conversationId: selectedConversation.id,
      senderId: user.id,
      senderUsername: user.username,
      senderAvatar: user.avatar,
      senderType: 'admin',
      content,
      timestamp: new Date(),
      isRead: true
    }
    setConversationMessages(prev => [...prev, newMessage])
    onSendMessage(selectedConversation.id, content)
  }

  const unreadCount = conversations.reduce((sum, c) => sum + c.unreadCount, 0)

  return (
    <div className="flex h-full bg-[#0a0a0a]">
      {/* Left panel - Conversation list */}
      <div className="w-[380px] border-r border-zinc-800 flex flex-col bg-[#0f0f0f]">
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <div>
            <h1 className="text-lg font-semibold text-zinc-100">Support chats</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-zinc-500">{unreadCount} unread message{unreadCount > 1 ? 's' : ''}</p>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-zinc-400 hover:text-zinc-200">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-zinc-400 hover:text-zinc-200">
              <Bell className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <ConversationList
          conversations={conversations}
          selectedId={selectedConversation?.id || null}
          onSelect={handleSelectConversation}
          accentColor={guild.accentColor}
        />
      </div>

      {/* Right panel - Chat or empty state */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-[#0f0f0f]">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage 
                    src={selectedConversation.memberAvatar} 
                    alt={selectedConversation.memberUsername} 
                  />
                  <AvatarFallback className="bg-zinc-800 text-zinc-300">
                    {selectedConversation.memberUsername[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-base font-semibold text-zinc-100">
                    {selectedConversation.memberUsername}
                  </h2>
                  <p className="text-sm text-zinc-500">
                    {selectedConversation.status === 'active' ? 'Active' : 'Resolved'}
                  </p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-zinc-400 hover:text-zinc-200"
              >
                <Eye className="h-4 w-4 mr-2" />
                View profile
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1" ref={scrollRef}>
              <div className="py-4">
                {messagesWithDates.map((item, index) => {
                  if (item.type === 'date' && item.date) {
                    return <DateSeparator key={`date-${index}`} date={item.date} />
                  }
                  if (item.type === 'message' && item.message) {
                    return (
                      <SupportMessageComponent
                        key={item.message.id}
                        message={item.message}
                        isCurrentUser={item.message.senderType === 'admin'}
                        accentColor={guild.accentColor}
                      />
                    )
                  }
                  return null
                })}
              </div>
            </ScrollArea>

            {/* Input */}
            <SupportChatInput
              accentColor={guild.accentColor}
              onSend={handleSendMessage}
              placeholder={`Reply to ${selectedConversation.memberUsername}...`}
            />
          </>
        ) : (
          /* Empty state */
          <div className="flex-1 flex items-center justify-center bg-[#0f0f0f]">
            <div className="text-center p-8 max-w-md">
              <div className="inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-zinc-800/50 mb-6">
                <span className="text-4xl">👀</span>
              </div>
              <h3 className="text-xl font-semibold text-zinc-100 mb-2">
                Select a message
              </h3>
              <p className="text-zinc-500">
                Choose from your existing conversations, start a new one, or just keep swimming.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
