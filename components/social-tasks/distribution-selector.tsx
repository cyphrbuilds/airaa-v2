'use client'

import { Check } from 'lucide-react'
import {
  SocialDistributionMethod,
  DISTRIBUTION_METHOD_LABELS,
} from '@/types'

const METHODS: { id: SocialDistributionMethod; desc: string }[] = [
  { id: 'fcfs', desc: 'First N eligible users win' },
  { id: 'raffle', desc: 'Random selection after campaign ends' },
  { id: 'customized', desc: 'Invite specific KOLs with fixed rewards' },
]

interface DistributionSelectorProps {
  selected: SocialDistributionMethod | null
  onChange: (method: SocialDistributionMethod) => void
}

export function DistributionSelector({ selected, onChange }: DistributionSelectorProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-1">Distribution Method</h2>
      <p className="text-sm text-zinc-500 mb-6">How will rewards be distributed?</p>

      <div className="space-y-2">
        {METHODS.map(({ id, desc }) => {
          const isSelected = selected === id
          
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className={`w-full flex items-center justify-between p-4 rounded-lg border transition-all text-left ${
                isSelected
                  ? 'border-blue-500 bg-blue-500/5'
                  : 'border-zinc-800 bg-zinc-900/30 hover:border-zinc-700'
              }`}
            >
              <div>
                <p className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-zinc-300'}`}>
                  {DISTRIBUTION_METHOD_LABELS[id]}
                </p>
                <p className="text-xs text-zinc-500 mt-0.5">{desc}</p>
              </div>
              <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                isSelected ? 'bg-blue-500 border-blue-500' : 'border-zinc-600'
              }`}>
                {isSelected && <Check className="h-3 w-3 text-white" />}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
