'use client'

import { Check } from 'lucide-react'
import {
  SocialCampaignFormState,
  SOCIAL_TASK_TYPE_LABELS,
  DISTRIBUTION_METHOD_LABELS,
  SOCIAL_CAMPAIGN_SERVICE_FEE
} from '@/types'

interface RewardsSummaryProps {
  formState: SocialCampaignFormState
  totals: {
    rewardPool: number
    winners: number
    perWinner: number
    serviceFee: number
    totalPayable: number
  }
}

export function RewardsSummary({ formState, totals }: RewardsSummaryProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-1">Summary</h2>
      <p className="text-sm text-zinc-500 mb-6">Review before publishing.</p>

      <div className="space-y-4">
        {/* Tasks */}
        <div className="space-y-2">
          <p className="text-xs text-zinc-500 uppercase tracking-wider">Tasks</p>
          <div className="flex flex-wrap gap-1.5">
            {formState.tasks.map((task, i) => (
              <span key={i} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-800 text-sm text-zinc-300">
                <Check className="h-3 w-3 text-emerald-400" />
                {SOCIAL_TASK_TYPE_LABELS[task.type]}
              </span>
            ))}
          </div>
        </div>

        {/* Distribution */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <p className="text-xs text-zinc-500 mb-1">Method</p>
            <p className="text-sm font-medium text-white">
              {formState.distributionMethod ? DISTRIBUTION_METHOD_LABELS[formState.distributionMethod] : '-'}
            </p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 mb-1">Chain</p>
            <p className="text-sm font-medium text-white capitalize">{formState.blockchain}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 mb-1">Token</p>
            <p className="text-sm font-medium text-white">{formState.token}</p>
          </div>
        </div>

        {/* KOLs (if customized) */}
        {formState.distributionMethod === 'customized' && formState.kolList.length > 0 && (
          <div>
            <p className="text-xs text-zinc-500 mb-2">KOLs ({formState.kolList.length})</p>
            <div className="flex flex-wrap gap-1">
              {formState.kolList.slice(0, 8).map(kol => (
                <span key={kol} className="px-2 py-0.5 rounded bg-zinc-800 text-xs text-zinc-400">@{kol}</span>
              ))}
              {formState.kolList.length > 8 && (
                <span className="px-2 py-0.5 rounded bg-zinc-800 text-xs text-zinc-500">+{formState.kolList.length - 8}</span>
              )}
            </div>
          </div>
        )}

        {/* Rewards */}
        <div className="rounded-lg bg-zinc-900/50 border border-zinc-800 p-4">
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <p className="text-xs text-zinc-500">Pool</p>
              <p className="text-xl font-bold text-white">${totals.rewardPool.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500">Per Winner</p>
              <p className="text-xl font-bold text-emerald-400">${totals.perWinner.toFixed(2)}</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm pt-3 border-t border-zinc-800">
            <span className="text-zinc-500">Service Fee ({(SOCIAL_CAMPAIGN_SERVICE_FEE * 100).toFixed(0)}%)</span>
            <span className="text-zinc-300">${totals.serviceFee.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-zinc-500">Total Payable</span>
            <span className="font-semibold text-white">${totals.totalPayable.toFixed(2)}</span>
          </div>
        </div>

        {/* Eligibility */}
        {formState.distributionMethod !== 'customized' && Object.keys(formState.eligibilityFilters).some(k => (formState.eligibilityFilters as Record<string, any>)[k]) && (
          <div>
            <p className="text-xs text-zinc-500 mb-2">Eligibility</p>
            <div className="flex flex-wrap gap-2 text-xs">
              {formState.eligibilityFilters.minFollowers && (
                <span className="px-2 py-1 rounded bg-zinc-800 text-zinc-400">Min {formState.eligibilityFilters.minFollowers} followers</span>
              )}
              {formState.eligibilityFilters.minAccountAge && (
                <span className="px-2 py-1 rounded bg-zinc-800 text-zinc-400">{formState.eligibilityFilters.minAccountAge}+ days old</span>
              )}
              {formState.eligibilityFilters.verifiedOnly && (
                <span className="px-2 py-1 rounded bg-zinc-800 text-zinc-400">Verified only</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
