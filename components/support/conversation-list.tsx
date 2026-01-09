'use client'

import { useState, useMemo } from 'react'
import { Search, ChevronDown } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import { SupportConversation } from '@/types'
import { ConversationItem } from './conversation-item'

/** Sort options for the conversation list */
export type ConversationSortOption = 'recent' | 'unread' | 'oldest'

/**
 * Props for the ConversationList component
 */
export interface ConversationListProps {
  /** Array of conversations to display */
  conversations: SupportConversation[]
  /** ID of the currently selected conversation (null if none) */
  selectedId: string | null
  /** Callback when a conversation is selected */
  onSelect: (conversation: SupportConversation) => void
  /** Optional accent color for UI elements (default: '#3b82f6') */
  accentColor?: string
}

const SORT_LABELS: Record<ConversationSortOption, string> = {
  recent: 'Last activity',
  unread: 'Unread first',
  oldest: 'Oldest first'
}

/**
 * Displays a searchable, sortable list of support conversations
 * 
 * @example
 * ```tsx
 * <ConversationList
 *   conversations={conversations}
 *   selectedId={selectedConv?.id ?? null}
 *   onSelect={(conv) => setSelectedConv(conv)}
 *   accentColor="#3b82f6"
 * />
 * ```
 */
export function ConversationList({
  conversations,
  selectedId,
  onSelect,
  accentColor = '#3b82f6'
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<ConversationSortOption>('recent')

  const filteredAndSorted = useMemo(() => {
    let result = [...conversations]
    
    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(conv => 
        conv.memberUsername.toLowerCase().includes(query) ||
        conv.lastMessage.toLowerCase().includes(query)
      )
    }
    
    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return b.lastMessageAt.getTime() - a.lastMessageAt.getTime()
        case 'unread':
          if (a.unreadCount !== b.unreadCount) {
            return b.unreadCount - a.unreadCount
          }
          return b.lastMessageAt.getTime() - a.lastMessageAt.getTime()
        case 'oldest':
          return a.lastMessageAt.getTime() - b.lastMessageAt.getTime()
        default:
          return 0
      }
    })
    
    return result
  }, [conversations, searchQuery, sortBy])

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="p-3 border-b border-zinc-800/50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-zinc-800/50 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 h-9"
          />
        </div>
      </div>

      {/* Sort */}
      <div className="px-3 py-2 border-b border-zinc-800/50">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 px-2 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
            >
              {SORT_LABELS[sortBy]}
              <ChevronDown className="ml-1 h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="bg-zinc-900 border-zinc-800">
            {Object.entries(SORT_LABELS).map(([key, label]) => (
              <DropdownMenuItem
                key={key}
                onClick={() => setSortBy(key as ConversationSortOption)}
                className={`text-sm cursor-pointer ${sortBy === key ? 'text-white bg-zinc-800' : 'text-zinc-400'}`}
              >
                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Conversation list */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredAndSorted.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-zinc-500 text-sm">
                {searchQuery ? 'No conversations found' : 'No support conversations yet'}
              </p>
            </div>
          ) : (
            filteredAndSorted.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isSelected={selectedId === conversation.id}
                onClick={() => onSelect(conversation)}
                accentColor={accentColor}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
