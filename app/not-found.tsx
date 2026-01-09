'use client'

import Link from 'next/link'
import { Home, ArrowLeft, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {/* 404 Visual */}
        <div className="relative mb-8">
          <div className="text-[180px] font-bold text-zinc-900 leading-none select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-24 w-24 rounded-full bg-green-500/10 flex items-center justify-center">
              <Search className="h-12 w-12 text-green-500" />
            </div>
          </div>
        </div>

        {/* Message */}
        <h1 className="text-2xl font-bold text-zinc-100 mb-3">
          Page Not Found
        </h1>
        <p className="text-zinc-400 mb-8">
          The page you're looking for doesn't exist or has been moved. 
          Let's get you back on track.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/discover">
            <Button className="gap-2 bg-green-500 hover:bg-green-600 text-white">
              <Home className="h-4 w-4" />
              Go to Discover
            </Button>
          </Link>
          <Button 
            variant="outline" 
            className="gap-2 border-zinc-700 hover:bg-zinc-800"
            onClick={() => typeof window !== 'undefined' && window.history.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
        </div>

        {/* Quick Links */}
        <div className="mt-12 pt-8 border-t border-zinc-800">
          <p className="text-sm text-zinc-500 mb-4">Popular destinations</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Link 
              href="/campaigns" 
              className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 text-sm hover:bg-zinc-700 transition-colors"
            >
              Campaigns
            </Link>
            <Link 
              href="/leaderboard" 
              className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 text-sm hover:bg-zinc-700 transition-colors"
            >
              Leaderboard
            </Link>
            <Link 
              href="/profile" 
              className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 text-sm hover:bg-zinc-700 transition-colors"
            >
              Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
