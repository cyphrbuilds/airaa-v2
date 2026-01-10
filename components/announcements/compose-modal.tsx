'use client'

import { useState } from 'react'
import { X, Pin, Eye, Edit3, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Markdown } from '@/components/ui/markdown'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

interface ComposeAnnouncementModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (announcement: { title: string; content: string; pinned: boolean }) => void
  accentColor: string
}

export function ComposeAnnouncementModal({
  isOpen,
  onClose,
  onSubmit,
  accentColor,
}: ComposeAnnouncementModalProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [pinned, setPinned] = useState(false)
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit')

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return
    
    onSubmit({
      title: title.trim(),
      content: content.trim(),
      pinned,
    })
    
    // Reset form
    setTitle('')
    setContent('')
    setPinned(false)
    setActiveTab('edit')
    onClose()
  }

  const handleClose = () => {
    setTitle('')
    setContent('')
    setPinned(false)
    setActiveTab('edit')
    onClose()
  }

  const isValid = title.trim().length > 0 && content.trim().length > 0

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-2xl p-0 gap-0" hideCloseButton>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <DialogTitle className="text-lg font-semibold text-zinc-100">
            New Announcement
          </DialogTitle>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-md text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter announcement title..."
              className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-700"
            />
          </div>

          {/* Content with Tabs */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-zinc-400">
                Content
              </label>
              <div className="flex items-center gap-1 p-1 bg-zinc-900 rounded-lg">
                <button
                  onClick={() => setActiveTab('edit')}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                    activeTab === 'edit'
                      ? "bg-zinc-800 text-zinc-100"
                      : "text-zinc-500 hover:text-zinc-300"
                  )}
                >
                  <Edit3 className="h-3 w-3" />
                  Edit
                </button>
                <button
                  onClick={() => setActiveTab('preview')}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                    activeTab === 'preview'
                      ? "bg-zinc-800 text-zinc-100"
                      : "text-zinc-500 hover:text-zinc-300"
                  )}
                >
                  <Eye className="h-3 w-3" />
                  Preview
                </button>
              </div>
            </div>

            {activeTab === 'edit' ? (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your announcement using **markdown** formatting..."
                className="w-full h-48 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700 resize-none font-mono text-sm"
              />
            ) : (
              <div className="w-full h-48 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg overflow-auto">
                {content.trim() ? (
                  <Markdown>{content}</Markdown>
                ) : (
                  <p className="text-zinc-600 text-sm italic">
                    Nothing to preview yet. Start writing in the Edit tab.
                  </p>
                )}
              </div>
            )}

            <p className="mt-2 text-xs text-zinc-600">
              Supports markdown: **bold**, *italic*, `code`, [links](url), lists, and more.
            </p>
          </div>

          {/* Pin Option */}
          <label className="flex items-center gap-3 cursor-pointer group">
            <div
              className={cn(
                "h-5 w-5 rounded border-2 flex items-center justify-center transition-colors",
                pinned
                  ? "border-transparent"
                  : "border-zinc-700 group-hover:border-zinc-600"
              )}
              style={pinned ? { backgroundColor: accentColor } : undefined}
            >
              {pinned && <Pin className="h-3 w-3 text-white" />}
            </div>
            <span className="text-sm text-zinc-300">Pin this announcement</span>
          </label>
          <input
            type="checkbox"
            checked={pinned}
            onChange={(e) => setPinned(e.target.checked)}
            className="sr-only"
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-zinc-800">
          <Button
            variant="ghost"
            onClick={handleClose}
            className="text-zinc-400 hover:text-zinc-100"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValid}
            className="gap-2 text-white"
            style={{ backgroundColor: isValid ? accentColor : undefined }}
          >
            <Send className="h-4 w-4" />
            Post Announcement
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
