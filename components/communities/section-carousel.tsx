'use client'

import { useRef, ReactNode } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SectionCarouselProps {
  title: string
  icon?: ReactNode
  seeAllHref?: string
  children: ReactNode
  className?: string
}

export function SectionCarousel({ 
  title, 
  icon,
  seeAllHref,
  children, 
  className 
}: SectionCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 260
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  return (
    <section className={cn("mb-8", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {icon && <span className="text-lg">{icon}</span>}
          <h2 className="text-lg font-semibold text-zinc-100">{title}</h2>
        </div>
        
        <div className="flex items-center gap-2">
          {seeAllHref && (
            <Link 
              href={seeAllHref}
              className="flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-200 transition-colors mr-2"
            >
              See all
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800"
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800"
            onClick={() => scroll('right')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Carousel */}
      <div
        ref={carouselRef}
        className="flex gap-4 overflow-x-auto scrollbar-thin pb-2 -mx-2 px-2"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {children}
      </div>
    </section>
  )
}
