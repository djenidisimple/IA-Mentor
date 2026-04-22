import React from 'react'
import { Challenge } from '@/types/challenge.types'
import ChallengeOverview from './ChallengeOverview'
import ChallengeObjectives from './ChallengeObjectives'
import ChallengeRequirements from './ChallengeRequirements'
import { DEFAULT_OBJECTIVES, DEFAULT_REQUIREMENTS } from '@/lib/challenge-defaults'

interface ChallengeDetailContentProps {
  challenge: Challenge
}

/**
 * Composant principal pour afficher le contenu détaillé d'un challenge
 * Combine Overview, Objectives et Requirements en un seul endroit
 */
export default function ChallengeDetailContent({ challenge }: ChallengeDetailContentProps) {
  return (
    <div className="lg:col-span-2 space-y-6">
      <ChallengeOverview challenge={challenge} />
      <ChallengeObjectives objectives={DEFAULT_OBJECTIVES} />
      <ChallengeRequirements requirements={DEFAULT_REQUIREMENTS} />
    </div>
  )
}
