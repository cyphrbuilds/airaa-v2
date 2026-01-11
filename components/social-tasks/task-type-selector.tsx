'use client'

import { Check } from 'lucide-react'
import {
  SocialCampaignTaskType,
  SOCIAL_TASK_TYPE_LABELS,
} from '@/types'

const TASK_TYPES: SocialCampaignTaskType[] = ['follow', 'comment', 'quote', 'post']

interface TaskTypeSelectorProps {
  selectedTypes: SocialCampaignTaskType[]
  onChange: (types: SocialCampaignTaskType[]) => void
}

export function TaskTypeSelector({ selectedTypes, onChange }: TaskTypeSelectorProps) {
  const toggleType = (type: SocialCampaignTaskType) => {
    if (selectedTypes.includes(type)) {
      onChange(selectedTypes.filter(t => t !== type))
    } else {
      onChange([...selectedTypes, type])
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-1">Select Tasks</h2>
      <p className="text-sm text-zinc-500 mb-6">
        Users must complete all selected tasks to earn the reward.
      </p>

      <div className="flex flex-wrap gap-2">
        {TASK_TYPES.map((type) => {
          const isSelected = selectedTypes.includes(type)
          
          return (
            <button
              key={type}
              onClick={() => toggleType(type)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all ${
                isSelected
                  ? 'border-blue-500 bg-blue-500/10 text-white'
                  : 'border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
              }`}
            >
              <div className={`h-4 w-4 rounded border flex items-center justify-center ${
                isSelected ? 'bg-blue-500 border-blue-500' : 'border-zinc-600'
              }`}>
                {isSelected && <Check className="h-3 w-3 text-white" />}
              </div>
              <span className="text-sm font-medium">{SOCIAL_TASK_TYPE_LABELS[type]}</span>
            </button>
          )
        })}
      </div>

      {selectedTypes.length > 0 && (
        <p className="mt-4 text-xs text-zinc-500">
          {selectedTypes.length} selected: {selectedTypes.map(t => SOCIAL_TASK_TYPE_LABELS[t]).join(' + ')}
        </p>
      )}

      {selectedTypes.length === 0 && (
        <p className="mt-4 text-xs text-amber-400">
          Select at least one task type
        </p>
      )}
    </div>
  )
}
