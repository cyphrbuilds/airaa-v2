'use client'

import { LucideIcon, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  label: string
  value: string | number
  icon?: LucideIcon
  trend?: {
    value: number
    positive: boolean
  }
  valueClassName?: string
  className?: string
  accentColor?: string
}

export function StatsCard({ 
  label, 
  value, 
  icon: Icon, 
  trend, 
  valueClassName, 
  className,
}: StatsCardProps) {
  return (
    <div 
      className={cn(
        "relative rounded-xl border border-zinc-800/50 bg-transparent p-5",
        "hover:border-zinc-700/70 transition-all duration-300",
        className
      )}
    >
      <div className="flex items-start gap-4">
        {/* Icon on left */}
        {Icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800/50 flex-shrink-0">
            <Icon className="h-5 w-5 text-zinc-400" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          {/* Label */}
          <p className="text-sm text-zinc-500 mb-1">
            {label}
          </p>
          
          {/* Value */}
          <p 
            className={cn(
              "text-2xl font-bold tracking-tight text-zinc-100",
              valueClassName
            )}
          >
            {value}
          </p>
        </div>
      </div>
      
      {/* Trend indicator */}
      {trend && (
        <div className="flex items-center gap-1.5 mt-3">
          <TrendingUp 
            className={cn(
              "h-3.5 w-3.5",
              trend.positive ? "text-emerald-500" : "text-red-500 rotate-180"
            )} 
          />
          <span className={cn(
            "text-sm font-medium",
            trend.positive ? "text-emerald-500" : "text-red-500"
          )}>
            {trend.positive ? "+" : "-"}{trend.value}%
          </span>
          <span className="text-xs text-zinc-600">vs last period</span>
        </div>
      )}
    </div>
  )
}
