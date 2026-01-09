'use client'

import { useState, useEffect, useCallback } from 'react'
import { api } from '@/lib/api'
import { SupportConversation, SupportMessage } from '@/types'

/**
 * Hook for managing support conversations (admin use)
 * 
 * Fetches all support conversations for a guild and provides
 * methods to refresh the list.
 * 
 * @param guildId - The guild to fetch conversations for
 * @returns Object containing conversations, loading state, error, and refresh method
 * 
 * @example
 * ```tsx
 * const { conversations, isLoading, error, refresh } = useSupportConversations('guild-1')
 * ```
 */
export function useSupportConversations(guildId: string) {
  const [conversations, setConversations] = useState<SupportConversation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchConversations = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await api.support.getConversations(guildId)
      setConversations(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch conversations'))
    } finally {
      setIsLoading(false)
    }
  }, [guildId])

  useEffect(() => {
    fetchConversations()
  }, [fetchConversations])

  // Calculate total unread count
  const totalUnreadCount = conversations.reduce((sum, c) => sum + c.unreadCount, 0)

  return {
    conversations,
    isLoading,
    error,
    totalUnreadCount,
    refresh: fetchConversations,
  }
}

/**
 * Hook for managing support messages in a conversation
 * 
 * Fetches messages for a specific conversation and provides
 * methods to send new messages and refresh the list.
 * 
 * @param conversationId - The conversation to fetch messages for (null to skip fetching)
 * @returns Object containing messages, loading state, error, and mutation methods
 * 
 * @example
 * ```tsx
 * const { messages, isLoading, sendMessage } = useSupportMessages('conv-1')
 * 
 * // Send a message
 * await sendMessage({
 *   senderId: 'user-1',
 *   senderUsername: 'John',
 *   senderAvatar: '/avatar.png',
 *   senderType: 'member',
 *   content: 'Hello!'
 * })
 * ```
 */
export function useSupportMessages(conversationId: string | null) {
  const [messages, setMessages] = useState<SupportMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchMessages = useCallback(async () => {
    if (!conversationId) {
      setMessages([])
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      const data = await api.support.getMessages(conversationId)
      setMessages(data)
      
      // Mark as read when fetched
      await api.support.markAsRead(conversationId)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch messages'))
    } finally {
      setIsLoading(false)
    }
  }, [conversationId])

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  /**
   * Send a new message in the conversation
   * Optimistically adds the message to local state
   */
  const sendMessage = useCallback(async (params: {
    senderId: string
    senderUsername: string
    senderAvatar: string
    senderType: 'member' | 'admin'
    content: string
  }) => {
    if (!conversationId) return

    // Optimistic update
    const optimisticMessage: SupportMessage = {
      id: `temp-${Date.now()}`,
      conversationId,
      senderId: params.senderId,
      senderUsername: params.senderUsername,
      senderAvatar: params.senderAvatar,
      senderType: params.senderType,
      content: params.content,
      timestamp: new Date(),
      isRead: true,
    }

    setMessages(prev => [...prev, optimisticMessage])

    try {
      const newMessage = await api.support.sendMessage(
        conversationId,
        params.senderId,
        params.senderUsername,
        params.senderAvatar,
        params.senderType,
        params.content
      )

      // Replace optimistic message with real one
      setMessages(prev => prev.map(m => 
        m.id === optimisticMessage.id ? newMessage : m
      ))
    } catch (err) {
      // Remove optimistic message on error
      setMessages(prev => prev.filter(m => m.id !== optimisticMessage.id))
      throw err
    }
  }, [conversationId])

  /**
   * Add a message to local state (for optimistic updates from parent)
   */
  const addLocalMessage = useCallback((message: SupportMessage) => {
    setMessages(prev => [...prev, message])
  }, [])

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    addLocalMessage,
    refresh: fetchMessages,
  }
}

/**
 * Hook for managing a member's support conversation
 * 
 * Gets or creates a support conversation for a member and provides
 * access to messages and send functionality.
 * 
 * @param guildId - The guild the conversation belongs to
 * @param user - The current user's info
 * @returns Object containing conversation, messages, loading state, and send method
 * 
 * @example
 * ```tsx
 * const { conversation, messages, isLoading, sendMessage } = useMemberSupportChat(
 *   'guild-1',
 *   { id: 'user-1', username: 'John', avatar: '/avatar.png' }
 * )
 * ```
 */
export function useMemberSupportChat(
  guildId: string,
  user: { id: string; username: string; avatar: string }
) {
  const [conversation, setConversation] = useState<SupportConversation | null>(null)
  const [messages, setMessages] = useState<SupportMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Initialize conversation
  useEffect(() => {
    const initConversation = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Get or create the member's conversation
        const conv = await api.support.getOrCreateConversation(
          guildId,
          user.id,
          user.username,
          user.avatar
        )
        setConversation(conv)

        // Load messages
        const msgs = await api.support.getMessages(conv.id)
        setMessages(msgs)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to initialize chat'))
      } finally {
        setIsLoading(false)
      }
    }

    initConversation()
  }, [guildId, user.id, user.username, user.avatar])

  // Send a message
  const sendMessage = useCallback(async (content: string) => {
    if (!conversation) return

    // Optimistic update
    const optimisticMessage: SupportMessage = {
      id: `temp-${Date.now()}`,
      conversationId: conversation.id,
      senderId: user.id,
      senderUsername: user.username,
      senderAvatar: user.avatar,
      senderType: 'member',
      content,
      timestamp: new Date(),
      isRead: false,
    }

    setMessages(prev => [...prev, optimisticMessage])

    try {
      const newMessage = await api.support.sendMessage(
        conversation.id,
        user.id,
        user.username,
        user.avatar,
        'member',
        content
      )

      // Replace optimistic message with real one
      setMessages(prev => prev.map(m => 
        m.id === optimisticMessage.id ? newMessage : m
      ))
    } catch (err) {
      // Remove optimistic message on error
      setMessages(prev => prev.filter(m => m.id !== optimisticMessage.id))
      throw err
    }
  }, [conversation, user.id, user.username, user.avatar])

  return {
    conversation,
    messages,
    isLoading,
    error,
    sendMessage,
  }
}
