'use client'

import { useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useGuild } from '@/lib/guild-context'
import { isUserAdminOrMod } from '@/lib/mock-data'
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
  SocialCampaignEligibility,
  DEFAULT_SOCIAL_CAMPAIGN_FORM,
  SOCIAL_CAMPAIGN_SERVICE_FEE
} from '@/types'

const WIZARD_STEPS = [
  { id: 1, title: 'Select Tasks', description: 'Choose task types' },
  { id: 2, title: 'Configure', description: 'Set up each task' },
  { id: 3, title: 'Distribution', description: 'Select method' },
  { id: 4, title: 'Rewards', description: 'Configure payout' },
  { id: 5, title: 'Summary', description: 'Review details' },
  { id: 6, title: 'Publish', description: 'Deploy campaign' }
]

export default function CreateSocialCampaignPage() {
  const params = useParams()
  const router = useRouter()
  const guildId = params.id as string
  const { guild } = useGuild()
  const isAdminOrMod = isUserAdminOrMod(guildId)
  
  // Wizard state
  const [currentStep, setCurrentStep] = useState(1)
  const [formState, setFormState] = useState<SocialCampaignFormState>(DEFAULT_SOCIAL_CAMPAIGN_FORM)
  const [isPublishing, setIsPublishing] = useState(false)
  const [isPublished, setIsPublished] = useState(false)

  // Calculate totals for display
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

  // Validation for each step
  const canProceed = useMemo(() => {
    switch (currentStep) {
      case 1: // Task selection
        return formState.selectedTaskTypes.length > 0
      case 2: // Task configuration
        return formState.tasks.length === formState.selectedTaskTypes.length &&
          formState.tasks.every(task => {
            if (task.type === 'follow') return !!task.targetAccount
            if (task.type === 'comment' || task.type === 'quote') {
              return !!task.targetPostUrl && !!task.guidelines
            }
            if (task.type === 'post') return !!task.guidelines
            return false
          })
      case 3: // Distribution selection
        return !!formState.distributionMethod
      case 4: // Distribution config
        if (formState.distributionMethod === 'customized') {
          return formState.kolList.length > 0 && formState.kolRewardPerUser > 0
        }
        return formState.rewardPool > 0 && formState.totalWinners > 0
      case 5: // Summary (always allow to proceed)
        return true
      case 6: // Publish (requires name)
        return !!formState.name.trim()
      default:
        return false
    }
  }, [currentStep, formState])

  // Handlers
  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleTaskTypesChange = (types: SocialCampaignTaskType[]) => {
    setFormState(prev => ({
      ...prev,
      selectedTaskTypes: types,
      // Reset tasks when types change
      tasks: types.map(type => ({
        type,
        targetAccount: '',
        targetPostUrl: '',
        guidelines: '',
        aiValidation: true
      }))
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
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Create the campaign using unified campaign store
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
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
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

  // If not admin/mod, redirect
  if (!isAdminOrMod) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-zinc-400 mb-4">You don't have permission to create campaigns.</p>
          <Link href={`/guild/${guildId}/apps/social-tasks`}>
            <Button>Go Back</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Published success state
  if (isPublished) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="h-20 w-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
            <Check className="h-10 w-10 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Campaign Published!</h1>
          <p className="text-zinc-400 mb-6">
            Your campaign "{formState.name}" is now live and accepting participants.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href={`/guild/${guildId}/apps/social-tasks`}>
              <Button variant="outline">View All Campaigns</Button>
            </Link>
            <Link href={`/guild/${guildId}/apps/social-tasks/create`}>
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
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-zinc-800/50">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/guild/${guildId}/apps/social-tasks`}>
                <Button variant="ghost" size="sm" className="gap-2 text-zinc-400 hover:text-zinc-100">
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
              </Link>
              <div className="h-6 w-px bg-zinc-800" />
              <div>
                <h1 className="text-lg font-semibold text-white">Create Social Campaign</h1>
                <p className="text-sm text-zinc-500">Step {currentStep} of 6</p>
              </div>
            </div>
            
            {/* Mini Progress Indicator */}
            <div className="flex items-center gap-1">
              {WIZARD_STEPS.map((step) => (
                <div
                  key={step.id}
                  className={`h-2 w-8 rounded-full transition-all ${
                    step.id < currentStep 
                      ? 'bg-emerald-500' 
                      : step.id === currentStep 
                        ? 'bg-blue-500' 
                        : 'bg-zinc-800'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Step Progress Bar */}
      <div className="max-w-5xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-8">
          {WIZARD_STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                    step.id < currentStep
                      ? 'bg-emerald-500 text-white'
                      : step.id === currentStep
                        ? 'bg-blue-500 text-white'
                        : 'bg-zinc-800 text-zinc-500'
                  }`}
                >
                  {step.id < currentStep ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    step.id
                  )}
                </div>
                <span className={`mt-2 text-xs font-medium ${
                  step.id <= currentStep ? 'text-zinc-200' : 'text-zinc-600'
                }`}>
                  {step.title}
                </span>
                <span className="text-xs text-zinc-600">{step.description}</span>
              </div>
              {index < WIZARD_STEPS.length - 1 && (
                <div
                  className={`h-0.5 w-16 mx-2 ${
                    step.id < currentStep ? 'bg-emerald-500' : 'bg-zinc-800'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-zinc-900/30 rounded-2xl border border-zinc-800/50 p-8 mb-6">
          {currentStep === 1 && (
            <TaskTypeSelector
              selectedTypes={formState.selectedTaskTypes}
              onChange={handleTaskTypesChange}
            />
          )}
          
          {currentStep === 2 && (
            <TaskConfigurator
              selectedTypes={formState.selectedTaskTypes}
              tasks={formState.tasks}
              onChange={handleTasksChange}
            />
          )}
          
          {currentStep === 3 && (
            <DistributionSelector
              selected={formState.distributionMethod}
              onChange={handleDistributionMethodChange}
            />
          )}
          
          {currentStep === 4 && (
            <DistributionConfig
              method={formState.distributionMethod!}
              formState={formState}
              onChange={handleDistributionConfigChange}
            />
          )}
          
          {currentStep === 5 && (
            <RewardsSummary
              formState={formState}
              totals={totals}
            />
          )}
          
          {currentStep === 6 && (
            <PreviewPublish
              formState={formState}
              totals={totals}
              campaignName={formState.name}
              onNameChange={handleNameChange}
              onPublish={handlePublish}
              isPublishing={isPublishing}
              accentColor={guild.accentColor}
            />
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          {currentStep < 6 ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed}
              className="gap-2"
              style={{ backgroundColor: canProceed ? guild.accentColor : undefined }}
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
