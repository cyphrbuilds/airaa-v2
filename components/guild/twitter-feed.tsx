'use client'

import { formatDistanceToNow } from 'date-fns'
import { Heart, Repeat2, MessageCircle, ExternalLink } from 'lucide-react'
import { TwitterPost, Guild } from '@/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'

interface TwitterFeedProps {
  posts: TwitterPost[]
  guild: Guild
  maxPosts?: number
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }
  return num.toString()
}

export function TwitterFeed({ posts, guild, maxPosts = 3 }: TwitterFeedProps) {
  const displayPosts = posts.slice(0, maxPosts)

  if (displayPosts.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-6">
        <div className="flex items-center gap-2 mb-4">
          <svg className="h-5 w-5 text-zinc-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span className="font-semibold text-zinc-200">Latest from X</span>
        </div>
        <p className="text-zinc-500 text-sm">No posts to display yet.</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/50">
        <div className="flex items-center gap-2">
          <svg className="h-5 w-5 text-zinc-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span className="font-semibold text-zinc-200">Latest from X</span>
        </div>
        <a 
          href={`https://twitter.com/${guild.name.toLowerCase().replace(/\s/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1 transition-colors"
        >
          View all
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
      
      <ScrollArea className="max-h-[400px]">
        <div className="divide-y divide-zinc-800/50">
          {displayPosts.map((post) => (
            <div 
              key={post.id} 
              className="p-4 hover:bg-zinc-800/30 transition-colors cursor-pointer"
            >
              <div className="flex gap-3">
                <Avatar className="h-10 w-10 flex-shrink-0">
                  <AvatarImage src={post.avatar} alt={post.author} />
                  <AvatarFallback className="bg-zinc-800 text-sm">
                    {post.author[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-zinc-100 text-sm truncate">
                      {post.author}
                    </span>
                    <span className="text-zinc-500 text-sm truncate">
                      @{post.handle}
                    </span>
                    <span className="text-zinc-600 text-sm">·</span>
                    <span className="text-zinc-500 text-sm flex-shrink-0">
                      {formatDistanceToNow(post.timestamp, { addSuffix: false })}
                    </span>
                  </div>
                  <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">
                    {post.content}
                  </p>
                  <div className="flex items-center gap-6 mt-3">
                    <button className="flex items-center gap-1.5 text-zinc-500 hover:text-blue-400 transition-colors group">
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-xs">{formatNumber(post.replies)}</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-zinc-500 hover:text-green-400 transition-colors group">
                      <Repeat2 className="h-4 w-4" />
                      <span className="text-xs">{formatNumber(post.retweets)}</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-zinc-500 hover:text-pink-400 transition-colors group">
                      <Heart className="h-4 w-4" />
                      <span className="text-xs">{formatNumber(post.likes)}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
