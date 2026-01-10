'use client'

import { cn } from '@/lib/utils'
import { EarningsSummary as EarningsSummaryType } from '@/types'
import { DollarSign, Clock, CheckCircle2 } from 'lucide-react'

interface EarningsSummaryProps {
  earnings: EarningsSummaryType
  className?: string
}

export function EarningsSummary({ earnings, className }: EarningsSummaryProps) {
  return (
    <div className={cn(
      "flex items-center gap-6 px-4 py-3 rounded-xl bg-gradient-to-r from-green-500/10 via-green-500/5 to-transparent border border-green-500/20",
      className
    )}>
      {/* Today's earnings - primary */}
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-green-500/20 flex items-center justify-center">
          <DollarSign className="h-4 w-4 text-green-400" />
        </div>
        <div>
          <p className="text-xs text-zinc-500">Earned today</p>
          <p className="text-lg font-bold text-green-400">${earnings.earnedToday}</p>
        </div>
      </div>

      <div className="h-8 w-px bg-zinc-800" />

      {/* Pending */}
      {earnings.pendingAmount > 0 && (
        <>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <Clock className="h-4 w-4 text-amber-400" />
            </div>
            <div>
              <p className="text-xs text-zinc-500">Pending</p>
              <p className="text-sm font-semibold text-amber-400">${earnings.pendingAmount}</p>
            </div>
          </div>

          <div className="h-8 w-px bg-zinc-800" />
        </>
      )}

      {/* Tasks completed */}
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-zinc-800 flex items-center justify-center">
          <CheckCircle2 className="h-4 w-4 text-zinc-400" />
        </div>
        <div>
          <p className="text-xs text-zinc-500">Tasks today</p>
          <p className="text-sm font-semibold text-zinc-300">{earnings.tasksCompletedToday}</p>
        </div>
      </div>

      {/* Weekly earnings */}
      <div className="ml-auto text-right">
        <p className="text-xs text-zinc-500">This week</p>
        <p className="text-sm font-semibold text-zinc-300">${earnings.earnedThisWeek}</p>
      </div>
    </div>
  )
}
