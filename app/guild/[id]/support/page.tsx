'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { useGuild } from '@/lib/guild-context'
import { useAuth } from '@/lib/auth-context'
import { SupportChatView, SupportInbox } from '@/components/support'
import { api } from '@/lib/api'
import { SupportConversation, SupportMessage } from '@/types'

export default function SupportPage() {
  const params = useParams()
  const guildId = params.id as string
  const { guild, userRole } = useGuild()
  const { user } = useAuth()

  const isAdmin = userRole === 'admin'

  // State for conversations and messages
  const [conversations, setConversations] = useState<SupportConversation[]>([])
  const [memberMessages, setMemberMessages] = useState<SupportMessage[]>([])
  const [memberConversation, setMemberConversation] = useState<SupportConversation | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load data based on role
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        if (isAdmin) {
          // Admin: load all conversations
          const convos = await api.support.getConversations(guildId)
          setConversations(convos)
        } else {
          // Member: get or create their conversation
          const conversation = await api.support.getOrCreateConversation(
            guildId,
            user.id,
            user.username,
            user.avatar
          )
          setMemberConversation(conversation)
          
          // Load messages for the conversation
          const messages = await api.support.getMessages(conversation.id)
          setMemberMessages(messages)
        }
      } catch (error) {
        console.error('Error loading support data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [guildId, isAdmin, user.id, user.username, user.avatar])

  // Handle sending messages as member
  const handleMemberSendMessage = useCallback(async (content: string) => {
    if (!memberConversation) return

    try {
      await api.support.sendMessage(
        memberConversation.id,
        user.id,
        user.username,
        user.avatar,
        'member',
        content
      )
      // Note: Local optimistic update is handled in the SupportChatView component
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }, [memberConversation, user.id, user.username, user.avatar])

  // Handle sending messages as admin
  const handleAdminSendMessage = useCallback(async (conversationId: string, content: string) => {
    try {
      await api.support.sendMessage(
        conversationId,
        user.id,
        user.username,
        user.avatar,
        'admin',
        content
      )
      // Note: Local optimistic update is handled in the SupportInbox component
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }, [user.id, user.username, user.avatar])

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-[#0f0f0f]">
        <div className="animate-pulse text-zinc-500">Loading support...</div>
      </div>
    )
  }

  // Render based on role
  if (isAdmin) {
    return (
      <SupportInbox
        guild={guild}
        conversations={conversations}
        onSendMessage={handleAdminSendMessage}
      />
    )
  }

  return (
    <SupportChatView
      guild={guild}
      messages={memberMessages}
      onSendMessage={handleMemberSendMessage}
    />
  )
}
