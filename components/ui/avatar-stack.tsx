'use client'

import { cn } from '@/lib/utils'

interface AvatarStackProps {
  avatars: { src: string; alt?: string }[]
  maxDisplay?: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: 'h-6 w-6',
  md: 'h-8 w-8',
  lg: 'h-10 w-10',
}

const overlapClasses = {
  sm: '-ml-2',
  md: '-ml-2.5',
  lg: '-ml-3',
}

export function AvatarStack({ 
  avatars, 
  maxDisplay = 4, 
  size = 'md',
  className 
}: AvatarStackProps) {
  const displayAvatars = avatars.slice(0, maxDisplay)
  const remaining = avatars.length - maxDisplay

  return (
    <div className={cn("flex items-center", className)}>
      {displayAvatars.map((avatar, index) => (
        <div
          key={index}
          className={cn(
            "relative rounded-full border-2 border-zinc-900 overflow-hidden bg-zinc-800",
            sizeClasses[size],
            index > 0 && overlapClasses[size]
          )}
          style={{ zIndex: displayAvatars.length - index }}
        >
          <img
            src={avatar.src}
            alt={avatar.alt || `Avatar ${index + 1}`}
            className="h-full w-full object-cover"
          />
        </div>
      ))}
      {remaining > 0 && (
        <div
          className={cn(
            "relative rounded-full border-2 border-zinc-900 bg-zinc-800 flex items-center justify-center",
            sizeClasses[size],
            overlapClasses[size]
          )}
          style={{ zIndex: 0 }}
        >
          <span className="text-xs font-medium text-zinc-400">
            +{remaining}
          </span>
        </div>
      )}
    </div>
  )
}
