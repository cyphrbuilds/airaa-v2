'use client'

import { Check } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  SocialCampaignTaskType,
  SocialCampaignTask,
  SOCIAL_TASK_TYPE_LABELS,
} from '@/types'

interface TaskConfiguratorProps {
  selectedTypes: SocialCampaignTaskType[]
  tasks: SocialCampaignTask[]
  onChange: (tasks: SocialCampaignTask[]) => void
}

export function TaskConfigurator({ selectedTypes, tasks, onChange }: TaskConfiguratorProps) {
  const updateTask = (index: number, updates: Partial<SocialCampaignTask>) => {
    const newTasks = [...tasks]
    newTasks[index] = { ...newTasks[index], ...updates }
    onChange(newTasks)
  }

  const getTaskByType = (type: SocialCampaignTaskType) => tasks.find(t => t.type === type)
  const getTaskIndex = (type: SocialCampaignTaskType) => tasks.findIndex(t => t.type === type)

  const isTaskValid = (task: SocialCampaignTask): boolean => {
    if (task.type === 'follow') return !!task.targetAccount?.trim()
    if (task.type === 'comment' || task.type === 'quote') return !!task.targetPostUrl?.trim() && !!task.guidelines?.trim()
    if (task.type === 'post') return !!task.guidelines?.trim()
    return false
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-1">Configure Tasks</h2>
      <p className="text-sm text-zinc-500 mb-6">Set up details for each task.</p>

      <div className="space-y-6">
        {selectedTypes.map((type) => {
          const task = getTaskByType(type)
          const index = getTaskIndex(type)
          if (!task) return null

          const valid = isTaskValid(task)

          return (
            <div key={type} className="space-y-3">
              {/* Task Header */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-200">
                  {SOCIAL_TASK_TYPE_LABELS[type]}
                </span>
                {valid && (
                  <span className="flex items-center gap-1 text-xs text-emerald-400">
                    <Check className="h-3 w-3" /> Ready
                  </span>
                )}
              </div>

              {/* Follow: Target Account */}
              {type === 'follow' && (
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">@</span>
                  <Input
                    placeholder="username"
                    value={task.targetAccount || ''}
                    onChange={(e) => updateTask(index, { targetAccount: e.target.value.replace('@', '') })}
                    className="pl-7 h-10 bg-zinc-900/50 border-zinc-800 focus:border-zinc-600"
                  />
                </div>
              )}

              {/* Comment/Quote: Target URL */}
              {(type === 'comment' || type === 'quote') && (
                <>
                  <Input
                    placeholder="https://twitter.com/username/status/..."
                    value={task.targetPostUrl || ''}
                    onChange={(e) => updateTask(index, { targetPostUrl: e.target.value })}
                    className="h-10 bg-zinc-900/50 border-zinc-800 focus:border-zinc-600"
                  />
                  <textarea
                    placeholder={`Guidelines for ${type === 'comment' ? 'comments' : 'quote tweets'}...`}
                    value={task.guidelines || ''}
                    onChange={(e) => updateTask(index, { guidelines: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-zinc-900/50 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 resize-none"
                  />
                </>
              )}

              {/* Post: Guidelines only */}
              {type === 'post' && (
                <textarea
                  placeholder="Describe what users should post about..."
                  value={task.guidelines || ''}
                  onChange={(e) => updateTask(index, { guidelines: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-zinc-900/50 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 resize-none"
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
