'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils'

interface MarkdownProps {
  children: string
  className?: string
}

export function Markdown({ children, className }: MarkdownProps) {
  return (
    <div
      className={cn(
        "prose prose-sm prose-invert max-w-none",
        // Headings
        "prose-headings:text-zinc-100 prose-headings:font-semibold",
        "prose-h1:text-xl prose-h2:text-lg prose-h3:text-base",
        "prose-h1:mt-4 prose-h1:mb-2 prose-h2:mt-3 prose-h2:mb-2 prose-h3:mt-2 prose-h3:mb-1",
        // Paragraphs
        "prose-p:text-zinc-300 prose-p:leading-relaxed prose-p:my-2",
        // Links
        "prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline",
        // Lists
        "prose-ul:my-2 prose-ol:my-2 prose-li:text-zinc-300 prose-li:my-0.5",
        // Code
        "prose-code:text-emerald-400 prose-code:bg-zinc-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none",
        "prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800 prose-pre:rounded-lg prose-pre:my-3",
        // Blockquotes
        "prose-blockquote:border-l-zinc-600 prose-blockquote:text-zinc-400 prose-blockquote:not-italic",
        // Strong/Bold
        "prose-strong:text-zinc-100 prose-strong:font-semibold",
        // Emphasis/Italic
        "prose-em:text-zinc-200",
        // Horizontal rule
        "prose-hr:border-zinc-800 prose-hr:my-4",
        // Tables (GFM)
        "prose-table:border-collapse prose-table:my-3",
        "prose-th:border prose-th:border-zinc-700 prose-th:bg-zinc-800/50 prose-th:px-3 prose-th:py-2 prose-th:text-zinc-200",
        "prose-td:border prose-td:border-zinc-800 prose-td:px-3 prose-td:py-2 prose-td:text-zinc-300",
        className
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {children}
      </ReactMarkdown>
    </div>
  )
}
