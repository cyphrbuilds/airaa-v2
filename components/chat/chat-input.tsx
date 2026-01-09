'use client'

import { useState, useRef, useEffect, KeyboardEvent, ChangeEvent } from 'react'
import { Send, X, Reply } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GuildMember, ChatMessage } from '@/types'
import { cn } from '@/lib/utils'
import { MentionPopover } from './mention-popover'

interface ChatInputProps {
  members: GuildMember[]
  accentColor: string
  replyTo: ChatMessage | null
  onCancelReply: () => void
  onSend: (content: string, mentions: string[]) => void
}

export function ChatInput({
  members,
  accentColor,
  replyTo,
  onCancelReply,
  onSend,
}: ChatInputProps) {
  const [value, setValue] = useState('')
  const [showMentions, setShowMentions] = useState(false)
  const [mentionQuery, setMentionQuery] = useState('')
  const [mentionStartIndex, setMentionStartIndex] = useState(-1)
  const [selectedMentionIndex, setSelectedMentionIndex] = useState(0)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 150)}px`
    }
  }, [value])

  // Focus input when reply changes
  useEffect(() => {
    if (replyTo && inputRef.current) {
      inputRef.current.focus()
    }
  }, [replyTo])

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setValue(newValue)

    // Detect @ mentions
    const cursorPos = e.target.selectionStart || 0
    const textBeforeCursor = newValue.slice(0, cursorPos)
    const lastAtIndex = textBeforeCursor.lastIndexOf('@')

    if (lastAtIndex !== -1) {
      const textAfterAt = textBeforeCursor.slice(lastAtIndex + 1)
      // Check if there's a space in the text after @ (meaning mention is complete)
      if (!textAfterAt.includes(' ')) {
        setMentionQuery(textAfterAt)
        setMentionStartIndex(lastAtIndex)
        setShowMentions(true)
        setSelectedMentionIndex(0)
        return
      }
    }

    setShowMentions(false)
    setMentionQuery('')
    setMentionStartIndex(-1)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (showMentions) {
      const filteredMembers = members.filter((m) =>
        m.username.toLowerCase().includes(mentionQuery.toLowerCase())
      ).slice(0, 5)

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedMentionIndex((prev) =>
          prev < filteredMembers.length - 1 ? prev + 1 : prev
        )
        return
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedMentionIndex((prev) => (prev > 0 ? prev - 1 : prev))
        return
      }

      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault()
        if (filteredMembers[selectedMentionIndex]) {
          handleMentionSelect(filteredMembers[selectedMentionIndex])
        }
        return
      }

      if (e.key === 'Escape') {
        setShowMentions(false)
        return
      }
    }

    // Send on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey && !showMentions) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleMentionSelect = (member: GuildMember) => {
    const beforeMention = value.slice(0, mentionStartIndex)
    const afterMention = value.slice(
      mentionStartIndex + mentionQuery.length + 1
    )
    const newValue = `${beforeMention}@${member.username} ${afterMention}`
    setValue(newValue)
    setShowMentions(false)
    setMentionQuery('')
    setMentionStartIndex(-1)
    inputRef.current?.focus()
  }

  const handleSend = () => {
    if (!value.trim()) return

    // Extract mentions from content
    const mentionRegex = /@(\w+)/g
    const mentions: string[] = []
    let match

    while ((match = mentionRegex.exec(value)) !== null) {
      const username = match[1]
      const member = members.find(
        (m) => m.username.toLowerCase() === username.toLowerCase()
      )
      if (member && !mentions.includes(member.id)) {
        mentions.push(member.id)
      }
    }

    onSend(value.trim(), mentions)
    setValue('')
    
    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
    }
  }

  return (
    <div className="border-t border-zinc-800 bg-zinc-900/50 p-4">
      {/* Reply indicator */}
      {replyTo && (
        <div className="flex items-center gap-2 mb-2 px-3 py-2 bg-zinc-800/50 rounded-lg">
          <Reply className="h-4 w-4 text-zinc-500 rotate-180" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-zinc-500">
              Replying to{' '}
              <span className="font-medium text-zinc-300">
                @{replyTo.authorUsername}
              </span>
            </p>
            <p className="text-xs text-zinc-600 truncate">{replyTo.content}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-zinc-500 hover:text-zinc-300"
            onClick={onCancelReply}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Input area */}
      <div className="relative flex items-end gap-2">
        <div className="relative flex-1">
          {showMentions && (
            <MentionPopover
              members={members}
              searchQuery={mentionQuery}
              selectedIndex={selectedMentionIndex}
              onSelect={handleMentionSelect}
              onClose={() => setShowMentions(false)}
              position={{ top: 0, left: 0 }}
              accentColor={accentColor}
            />
          )}
          <textarea
            ref={inputRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message... (use @ to mention)"
            className={cn(
              "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm text-zinc-100",
              "placeholder:text-zinc-500 resize-none",
              "focus:outline-none focus:ring-1 focus:ring-[var(--ring-color)]",
              "min-h-[48px] max-h-[150px]"
            )}
            style={{
              '--ring-color': accentColor,
            } as React.CSSProperties}
            rows={1}
          />
        </div>
        <Button
          onClick={handleSend}
          disabled={!value.trim()}
          className="h-12 w-12 p-0 rounded-lg"
          style={{
            backgroundColor: value.trim() ? accentColor : undefined,
          }}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
