'use client'

import { useState } from 'react'
import { Wallet, Check, AlertCircle, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SocialCampaignFormState, SOCIAL_TASK_TYPE_LABELS } from '@/types'

interface PreviewPublishProps {
  formState: SocialCampaignFormState
  totals: {
    rewardPool: number
    winners: number
    perWinner: number
    serviceFee: number
    totalPayable: number
  }
  campaignName: string
  onNameChange: (name: string) => void
  onPublish: () => void
  isPublishing: boolean
  accentColor: string
}

export function PreviewPublish({
  formState,
  totals,
  campaignName,
  onNameChange,
  onPublish,
  isPublishing,
  accentColor
}: PreviewPublishProps) {
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [mockBalance] = useState(25000)

  const hasEnoughBalance = mockBalance >= totals.totalPayable
  const canPublish = isWalletConnected && hasEnoughBalance && campaignName.trim().length > 0

  const handleConnectWallet = async () => {
    await new Promise(resolve => setTimeout(resolve, 600))
    setIsWalletConnected(true)
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-1">Publish</h2>
      <p className="text-sm text-zinc-500 mb-6">Name your campaign and fund it.</p>

      <div className="space-y-5">
        {/* Campaign Name */}
        <div>
          <label className="block text-xs text-zinc-500 mb-1.5">Campaign Name</label>
          <Input
            placeholder="e.g., Community Growth Sprint"
            value={campaignName}
            onChange={(e) => onNameChange(e.target.value)}
            className="h-11 bg-zinc-900/50 border-zinc-800 text-base"
          />
        </div>

        {/* Preview */}
        <div className="rounded-lg bg-zinc-900/50 border border-zinc-800 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-zinc-400">Preview</span>
          </div>
          <p className="text-lg font-semibold text-white mb-1">{campaignName || 'Untitled Campaign'}</p>
          <p className="text-sm text-zinc-500">
            {formState.tasks.map(t => SOCIAL_TASK_TYPE_LABELS[t.type]).join(' + ')}
          </p>
          <div className="flex items-center gap-4 mt-3 text-sm">
            <span className="text-emerald-400 font-medium">${totals.perWinner.toFixed(0)}/winner</span>
            <span className="text-zinc-500">{totals.winners} winners</span>
          </div>
        </div>

        {/* Wallet */}
        <div className="rounded-lg bg-zinc-900/50 border border-zinc-800 p-4">
          {!isWalletConnected ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Wallet className="h-5 w-5 text-zinc-500" />
                <span className="text-sm text-zinc-400">Connect wallet to publish</span>
              </div>
              <Button size="sm" onClick={handleConnectWallet} style={{ backgroundColor: accentColor }}>
                Connect
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 text-sm">
                <Check className="h-4 w-4" />
                <span>Wallet connected</span>
                <span className="text-zinc-500 ml-auto">${mockBalance.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500">Required</span>
                <span className={`font-medium ${hasEnoughBalance ? 'text-white' : 'text-red-400'}`}>
                  ${totals.totalPayable.toFixed(2)}
                </span>
              </div>
              {!hasEnoughBalance && (
                <div className="flex items-center gap-1.5 text-red-400 text-xs">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>Insufficient balance</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Publish Button */}
        <Button
          onClick={onPublish}
          disabled={!canPublish || isPublishing}
          className="w-full h-12"
          style={{ backgroundColor: canPublish ? accentColor : undefined }}
        >
          {isPublishing ? (
            <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Publishing...</>
          ) : (
            'Publish Campaign'
          )}
        </Button>

        {!canPublish && !isPublishing && (
          <p className="text-center text-xs text-zinc-500">
            {!campaignName.trim() ? 'Enter a name' : !isWalletConnected ? 'Connect wallet' : 'Add funds'}
          </p>
        )}
      </div>
    </div>
  )
}
