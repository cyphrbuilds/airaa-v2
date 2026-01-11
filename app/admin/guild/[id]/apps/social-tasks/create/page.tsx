'use client'

import { useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useGuild } from '@/lib/guild-context'
import { createCampaign } from '@/lib/campaign-store'
import { 
  TaskTypeSelector,
  TaskConfigurator,
  DistributionSelector,
  DistributionConfig,
  RewardsSummary,
  PreviewPublish
} from '@/components/social-tasks'
import {
  SocialCampaignFormState,
  SocialCampaignTaskType,
  SocialCampaignTask,
  SocialDistributionMethod,
  DEFAULT_SOCIAL_CAMPAIGN_FORM,
  SOCIAL_CAMPAIGN_SERVICE_FEE
} from '@/types'

const STEPS = ['Tasks', 'Configure', 'Distribution', 'Rewards', 'Summary', 'Publish']

export default function AdminCreateSocialCampaignPage() {
  const params = useParams()
  const router = useRouter()
  const guildId = params.id as string
  const { guild } = useGuild()
  
  const [currentStep, setCurrentStep] = useState(1)
  const [formState, setFormState] = useState<SocialCampaignFormState>(DEFAULT_SOCIAL_CAMPAIGN_FORM)
  const [isPublishing, setIsPublishing] = useState(false)
  const [isPublished, setIsPublished] = useState(false)

  const totals = useMemo(() => {
    const rewardPool = formState.distributionMethod === 'customized' 
      ? formState.kolList.length * formState.kolRewardPerUser
      : formState.rewardPool
    const winners = formState.distributionMethod === 'customized'
      ? formState.kolList.length
      : formState.totalWinners
    const perWinner = winners > 0 ? rewardPool / winners : 0
    const serviceFee = rewardPool * SOCIAL_CAMPAIGN_SERVICE_FEE
    const totalPayable = rewardPool + serviceFee

    return { rewardPool, winners, perWinner, serviceFee, totalPayable }
  }, [formState])

  const canProceed = useMemo(() => {
    switch (currentStep) {
      case 1: return formState.selectedTaskTypes.length > 0
      case 2: return formState.tasks.length === formState.selectedTaskTypes.length &&
        formState.tasks.every(task => {
          if (task.type === 'follow') return !!task.targetAccount
          if (task.type === 'comment' || task.type === 'quote') return !!task.targetPostUrl && !!task.guidelines
          if (task.type === 'post') return !!task.guidelines
          return false
        })
      case 3: return !!formState.distributionMethod
      case 4:
        if (formState.distributionMethod === 'customized') {
          return formState.kolList.length > 0 && formState.kolRewardPerUser > 0
        }
        return formState.rewardPool > 0 && formState.totalWinners > 0
      case 5: return true
      case 6: return !!formState.name.trim()
      default: return false
    }
  }, [currentStep, formState])

  const handleTaskTypesChange = (types: SocialCampaignTaskType[]) => {
    setFormState(prev => ({
      ...prev,
      selectedTaskTypes: types,
      tasks: types.map(type => ({ type, targetAccount: '', targetPostUrl: '', guidelines: '', aiValidation: true }))
    }))
  }

  const handleTasksChange = (tasks: SocialCampaignTask[]) => {
    setFormState(prev => ({ ...prev, tasks }))
  }

  const handleDistributionMethodChange = (method: SocialDistributionMethod) => {
    setFormState(prev => ({ ...prev, distributionMethod: method }))
  }

  const handleDistributionConfigChange = (config: Partial<SocialCampaignFormState>) => {
    setFormState(prev => ({ ...prev, ...config }))
  }

  const handleNameChange = (name: string) => {
    setFormState(prev => ({ ...prev, name }))
  }

  const handlePublish = async () => {
    setIsPublishing(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    createCampaign({
      guildId,
      appType: 'social-tasks',
      name: formState.name,
      description: `Social tasks campaign with ${formState.tasks.length} task(s)`,
      rewardPool: totals.rewardPool,
      perWinnerReward: totals.perWinner,
      totalWinners: totals.winners,
      token: formState.token,
      blockchain: formState.blockchain,
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      config: {
        tasks: formState.tasks,
        distributionMethod: formState.distributionMethod,
        eligibilityFilters: formState.distributionMethod !== 'customized' ? formState.eligibilityFilters : undefined,
        kolList: formState.distributionMethod === 'customized' ? formState.kolList : undefined,
        kolRewardPerUser: formState.distributionMethod === 'customized' ? formState.kolRewardPerUser : undefined,
        serviceFee: totals.serviceFee,
        totalPayable: totals.totalPayable,
      }
    })
    
    setIsPublishing(false)
    setIsPublished(true)
  }

  if (isPublished) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="h-16 w-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-5">
            <Check className="h-8 w-8 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Campaign Published!</h1>
          <p className="text-zinc-400 mb-6">"{formState.name}" is now live.</p>
          <div className="flex gap-3 justify-center">
            <Link href={`/admin/guild/${guildId}/apps/social-tasks`}>
              <Button variant="outline">View Campaigns</Button>
            </Link>
            <Button 
              style={{ backgroundColor: guild.accentColor }}
              onClick={() => {
                setFormState(DEFAULT_SOCIAL_CAMPAIGN_FORM)
                setCurrentStep(1)
                setIsPublished(false)
              }}
            >
              Create Another
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-zinc-800/50">
        <div className="max-w-4xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href={`/admin/guild/${guildId}/apps/social-tasks`}>
                <Button variant="ghost" size="sm" className="gap-1.5 text-zinc-400 hover:text-white h-8 px-2">
                  <X className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-base font-semibold text-white">Create Campaign</h1>
                <p className="text-xs text-zinc-500">Step {currentStep} of 6</p>
              </div>
            </div>
            
            {/* Step Pills */}
            <div className="flex items-center gap-1">
              {STEPS.map((step, i) => (
                <div
                  key={step}
                  className={`h-1.5 w-6 rounded-full transition-all ${
                    i + 1 < currentStep ? 'bg-emerald-500' : i + 1 === currentStep ? 'bg-blue-500' : 'bg-zinc-800'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6">
        {/* Step Content */}
        <div className="mb-6">
          {currentStep === 1 && <TaskTypeSelector selectedTypes={formState.selectedTaskTypes} onChange={handleTaskTypesChange} />}
          {currentStep === 2 && <TaskConfigurator selectedTypes={formState.selectedTaskTypes} tasks={formState.tasks} onChange={handleTasksChange} />}
          {currentStep === 3 && <DistributionSelector selected={formState.distributionMethod} onChange={handleDistributionMethodChange} />}
          {currentStep === 4 && <DistributionConfig method={formState.distributionMethod!} formState={formState} onChange={handleDistributionConfigChange} />}
          {currentStep === 5 && <RewardsSummary formState={formState} totals={totals} />}
          {currentStep === 6 && <PreviewPublish formState={formState} totals={totals} campaignName={formState.name} onNameChange={handleNameChange} onPublish={handlePublish} isPublishing={isPublishing} accentColor={guild.accentColor} />}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50">
          <Button variant="ghost" onClick={() => setCurrentStep(s => s - 1)} disabled={currentStep === 1} className="gap-1.5">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          {currentStep < 6 && (
            <Button onClick={() => setCurrentStep(s => s + 1)} disabled={!canProceed} className="gap-1.5" style={{ backgroundColor: canProceed ? guild.accentColor : undefined }}>
              Continue <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
