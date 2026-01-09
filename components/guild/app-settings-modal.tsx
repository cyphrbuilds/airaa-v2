'use client'

import { useState, useEffect } from 'react'
import { Settings, Pencil } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { InstalledApp } from '@/types'

// Common emojis for app icons
const EMOJI_OPTIONS = [
  '📚', '🎬', '✂️', '⚡', '🎯', '🏆', '💰', '🎮', 
  '🎨', '📊', '🔥', '💎', '🚀', '⭐', '🎪', '🎭',
  '📱', '💡', '🎵', '📸', '🎁', '🏅', '👑', '🌟'
]

export interface AppCustomization {
  appId: string
  customIcon?: string
  customName?: string
  customDescription?: string
}

interface AppSettingsModalProps {
  app: InstalledApp
  customization?: AppCustomization
  isOpen: boolean
  onClose: () => void
  onSave: (customization: AppCustomization) => void
  accentColor?: string
}

export function AppSettingsModal({
  app,
  customization,
  isOpen,
  onClose,
  onSave,
  accentColor = '#22c55e',
}: AppSettingsModalProps) {
  const [icon, setIcon] = useState(customization?.customIcon || app.icon)
  const [name, setName] = useState(customization?.customName || app.name)
  const [description, setDescription] = useState(customization?.customDescription || app.description)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  // Reset form when modal opens with new app
  useEffect(() => {
    if (isOpen) {
      setIcon(customization?.customIcon || app.icon)
      setName(customization?.customName || app.name)
      setDescription(customization?.customDescription || app.description)
      setShowEmojiPicker(false)
    }
  }, [isOpen, app, customization])

  const handleSave = () => {
    onSave({
      appId: app.id,
      customIcon: icon !== app.icon ? icon : undefined,
      customName: name !== app.name ? name : undefined,
      customDescription: description !== app.description ? description : undefined,
    })
    onClose()
  }

  const handleReset = () => {
    setIcon(app.icon)
    setName(app.name)
    setDescription(app.description)
  }

  const hasChanges = 
    icon !== (customization?.customIcon || app.icon) ||
    name !== (customization?.customName || app.name) ||
    description !== (customization?.customDescription || app.description)

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-lg font-semibold text-zinc-100">
            App settings
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-5">
          {/* Icon and Name Row */}
          <div className="flex items-start gap-4">
            {/* Icon Selector */}
            <div className="relative">
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="relative h-24 w-24 rounded-2xl flex items-center justify-center text-4xl transition-all hover:ring-2 hover:ring-zinc-600"
                style={{ backgroundColor: `${app.color || accentColor}30` }}
              >
                {icon}
                <div 
                  className="absolute bottom-1 right-1 h-7 w-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center"
                >
                  <Pencil className="h-3.5 w-3.5 text-zinc-400" />
                </div>
              </button>

              {/* Emoji Picker Dropdown */}
              {showEmojiPicker && (
                <div className="absolute top-full left-0 mt-2 p-3 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl z-50 w-[240px]">
                  <div className="grid grid-cols-6 gap-1">
                    {EMOJI_OPTIONS.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => {
                          setIcon(emoji)
                          setShowEmojiPicker(false)
                        }}
                        className={`h-9 w-9 rounded-lg flex items-center justify-center text-xl hover:bg-zinc-800 transition-colors ${
                          icon === emoji ? 'bg-zinc-800 ring-2 ring-zinc-600' : ''
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-zinc-800">
                    <Input
                      placeholder="Or type an emoji..."
                      value={icon}
                      onChange={(e) => setIcon(e.target.value.slice(0, 2))}
                      className="h-9 text-center text-lg bg-zinc-800/50 border-zinc-700"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Name Input */}
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium text-zinc-300">Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value.slice(0, 30))}
                placeholder="App name"
                className="h-11 bg-zinc-800/50 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
              />
            </div>
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-300">Description</label>
              <span className="text-xs text-zinc-500">{description.length} / 90</span>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 90))}
              placeholder="e.g. A simple app to browse and share photos."
              rows={3}
              className="w-full px-3 py-2.5 rounded-lg bg-zinc-800/50 border border-zinc-700 text-zinc-100 placeholder:text-zinc-500 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-zinc-400 hover:text-zinc-200"
            >
              Reset to default
            </Button>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={onClose}
                className="text-zinc-300 hover:text-zinc-100"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={!name.trim()}
                className="text-white"
                style={{ backgroundColor: accentColor }}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
