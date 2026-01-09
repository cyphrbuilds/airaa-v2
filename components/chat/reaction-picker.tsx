'use client'

import { useEffect, useRef } from 'react'
import { CHAT_REACTIONS } from '@/types'

interface ReactionPickerProps {
  onSelect: (emoji: string) => void
  onClose: () => void
}

export function ReactionPicker({ onSelect, onClose }: ReactionPickerProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  return (
    <div
      ref={ref}
      className="absolute bottom-full right-0 mb-2 bg-zinc-900 border border-zinc-700 rounded-lg p-2 shadow-xl z-50"
    >
      <div className="flex gap-1">
        {CHAT_REACTIONS.map((emoji) => (
          <button
            key={emoji}
            onClick={() => onSelect(emoji)}
            className="w-8 h-8 flex items-center justify-center text-lg rounded-md hover:bg-zinc-800 transition-colors"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  )
}
