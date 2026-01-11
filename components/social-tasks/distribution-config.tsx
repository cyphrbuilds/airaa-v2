'use client'

import { useState } from 'react'
import { Plus, X, ChevronDown } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  SocialDistributionMethod,
  SocialCampaignFormState,
  SocialCampaignEligibility,
  SUPPORTED_BLOCKCHAINS,
  SUPPORTED_TOKENS
} from '@/types'

interface DistributionConfigProps {
  method: SocialDistributionMethod
  formState: SocialCampaignFormState
  onChange: (config: Partial<SocialCampaignFormState>) => void
}

export function DistributionConfig({ method, formState, onChange }: DistributionConfigProps) {
  const [showFilters, setShowFilters] = useState(false)
  const [kolInput, setKolInput] = useState('')

  const handleAddKol = () => {
    if (kolInput.trim() && !formState.kolList.includes(kolInput.trim())) {
      onChange({ kolList: [...formState.kolList, kolInput.trim().replace('@', '')] })
      setKolInput('')
    }
  }

  const handleRemoveKol = (kol: string) => {
    onChange({ kolList: formState.kolList.filter(k => k !== kol) })
  }

  const handleFilterChange = (key: keyof SocialCampaignEligibility, value: any) => {
    onChange({ eligibilityFilters: { ...formState.eligibilityFilters, [key]: value } })
  }

  const perWinnerReward = method === 'customized'
    ? formState.kolRewardPerUser
    : formState.totalWinners > 0 ? formState.rewardPool / formState.totalWinners : 0

  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-1">Configure Rewards</h2>
      <p className="text-sm text-zinc-500 mb-6">Set up reward distribution.</p>

      <div className="space-y-5">
        {/* Blockchain & Token */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-zinc-500 mb-1.5">Blockchain</label>
            <div className="relative">
              <select
                value={formState.blockchain}
                onChange={(e) => onChange({ blockchain: e.target.value })}
                className="w-full h-10 px-3 pr-8 rounded-lg bg-zinc-900/50 border border-zinc-800 text-sm text-white appearance-none focus:outline-none focus:border-zinc-600"
              >
                {SUPPORTED_BLOCKCHAINS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-zinc-500 mb-1.5">Token</label>
            <div className="relative">
              <select
                value={formState.token}
                onChange={(e) => onChange({ token: e.target.value })}
                className="w-full h-10 px-3 pr-8 rounded-lg bg-zinc-900/50 border border-zinc-800 text-sm text-white appearance-none focus:outline-none focus:border-zinc-600"
              >
                {SUPPORTED_TOKENS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* FCFS / Raffle Config */}
        {(method === 'fcfs' || method === 'raffle') && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-zinc-500 mb-1.5">Reward Pool ({formState.token})</label>
                <Input
                  type="number"
                  placeholder="1000"
                  value={formState.rewardPool || ''}
                  onChange={(e) => onChange({ rewardPool: parseFloat(e.target.value) || 0 })}
                  className="h-10 bg-zinc-900/50 border-zinc-800"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1.5">Winners</label>
                <Input
                  type="number"
                  placeholder="100"
                  value={formState.totalWinners || ''}
                  onChange={(e) => onChange({ totalWinners: parseInt(e.target.value) || 0 })}
                  className="h-10 bg-zinc-900/50 border-zinc-800"
                />
              </div>
            </div>

            {/* Per Winner */}
            <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
              <span className="text-sm text-zinc-400">Per Winner</span>
              <span className="text-lg font-semibold text-emerald-400">${perWinnerReward.toFixed(2)}</span>
            </div>

            {/* Eligibility Filters Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-between w-full py-2 text-sm text-zinc-400 hover:text-zinc-200"
            >
              <span>Eligibility Filters (optional)</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            {showFilters && (
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1">Min Followers</label>
                    <Input
                      type="number"
                      placeholder="1000"
                      value={formState.eligibilityFilters.minFollowers || ''}
                      onChange={(e) => handleFilterChange('minFollowers', parseInt(e.target.value) || undefined)}
                      className="h-9 text-sm bg-zinc-900/50 border-zinc-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1">Min Account Age (days)</label>
                    <Input
                      type="number"
                      placeholder="30"
                      value={formState.eligibilityFilters.minAccountAge || ''}
                      onChange={(e) => handleFilterChange('minAccountAge', parseInt(e.target.value) || undefined)}
                      className="h-9 text-sm bg-zinc-900/50 border-zinc-800"
                    />
                  </div>
                </div>
                <div className="flex gap-4 text-sm">
                  <label className="flex items-center gap-2 cursor-pointer text-zinc-400">
                    <input
                      type="checkbox"
                      checked={formState.eligibilityFilters.verifiedOnly || false}
                      onChange={(e) => handleFilterChange('verifiedOnly', e.target.checked || undefined)}
                      className="h-4 w-4 rounded border-zinc-700 bg-zinc-900"
                    />
                    Verified only
                  </label>
                </div>
              </div>
            )}
          </>
        )}

        {/* Customized (KOL) Config */}
        {method === 'customized' && (
          <>
            <div>
              <label className="block text-xs text-zinc-500 mb-1.5">Add KOLs</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">@</span>
                  <Input
                    placeholder="username"
                    value={kolInput}
                    onChange={(e) => setKolInput(e.target.value.replace('@', ''))}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddKol()}
                    className="pl-7 h-10 bg-zinc-900/50 border-zinc-800"
                  />
                </div>
                <Button onClick={handleAddKol} variant="outline" size="sm" className="h-10 px-3">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {formState.kolList.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {formState.kolList.map((kol) => (
                  <span key={kol} className="flex items-center gap-1.5 px-2 py-1 rounded bg-zinc-800 text-xs text-zinc-300">
                    @{kol}
                    <button onClick={() => handleRemoveKol(kol)} className="text-zinc-500 hover:text-zinc-300">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div>
              <label className="block text-xs text-zinc-500 mb-1.5">Reward per KOL ({formState.token})</label>
              <Input
                type="number"
                placeholder="100"
                value={formState.kolRewardPerUser || ''}
                onChange={(e) => onChange({ kolRewardPerUser: parseFloat(e.target.value) || 0 })}
                className="h-10 bg-zinc-900/50 border-zinc-800"
              />
            </div>

            {formState.kolList.length > 0 && formState.kolRewardPerUser > 0 && (
              <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                <span className="text-sm text-zinc-400">Total Pool ({formState.kolList.length} KOLs)</span>
                <span className="text-lg font-semibold text-emerald-400">
                  ${(formState.kolList.length * formState.kolRewardPerUser).toLocaleString()}
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
