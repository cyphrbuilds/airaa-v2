'use client'

import { useState, useRef, useEffect, KeyboardEvent, ChangeEvent } from 'react'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/**
 * Props for the SupportChatInput component
 */
export interface SupportChatInputProps {
  /** Accent color for the send button and focus ring */
  accentColor: string
  /** Callback when a message is sent */
  onSend: (content: string) => void
  /** Placeholder text for the input (default: "Type a message...") */
  placeholder?: string
}

export function SupportChatInput({
  accentColor,
  onSend,
  placeholder = "Type a message..."
}: SupportChatInputProps) {
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 150)}px`
    }
  }, [value])

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSend = () => {
    if (!value.trim()) return
    onSend(value.trim())
    setValue('')
    
    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
    }
  }

  return (
    <div className="border-t border-zinc-800 bg-zinc-900/50 p-4">
      <div className="relative flex items-end gap-2">
        <textarea
          ref={inputRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            "flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm text-zinc-100",
            "placeholder:text-zinc-500 resize-none",
            "focus:outline-none focus:ring-1 focus:ring-[var(--ring-color)]",
            "min-h-[48px] max-h-[150px]"
          )}
          style={{
            '--ring-color': accentColor,
          } as React.CSSProperties}
          rows={1}
        />
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
