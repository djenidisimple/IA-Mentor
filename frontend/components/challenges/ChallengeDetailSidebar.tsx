import React from 'react'
import { Challenge } from '@/types/challenge.types'
import ChallengeStack from './ChallengeStack'
import RelatedChallenges, { RelatedChallenge } from './RelatedChallenges'
import { Lightbulb } from 'lucide-react'

interface ChallengeDetailSidebarProps {
  challenge: Challenge
}

export default function ChallengeDetailSidebar({ challenge }: ChallengeDetailSidebarProps) {
  const related: RelatedChallenge[] = [
    { title: 'API Rate Limiter', type: 'BACKEND', points: 350 },
    { title: 'Caching Strategy', type: 'BACKEND', points: 280 },
    { title: 'Database Sharding', type: 'FULLSTACK', points: 520 },
  ]

  return (
    <div className="space-y-6">
      <ChallengeStack challenge={challenge} />
      <RelatedChallenges challenges={related} />

      <div className="bg-[var(--yellow)]/10 border border-[var(--yellow)]/20 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <Lightbulb size={16} className="text-[var(--yellow)] mt-0.5 shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-[var(--navy)] uppercase tracking-wider mb-1">
              Pro Tip
            </h4>
            <p className="text-xs text-[var(--gray)]">
              Décomposez le problème en composants plus petits et itérez.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
