'use client'

import { HowItWorksModal } from '@/components/how-it-works'
import { useGuild } from '@/lib/guild-context'

/**
 * InfoFi-specific How It Works modal
 * Uses the shared HowItWorksModal component with infofi content
 */
export function InfoFiHowItWorksModal() {
  const { guild } = useGuild()
  
  return (
    <HowItWorksModal 
      appSlug="infofi" 
      communityName={guild.name} 
    />
  )
}

export default InfoFiHowItWorksModal
