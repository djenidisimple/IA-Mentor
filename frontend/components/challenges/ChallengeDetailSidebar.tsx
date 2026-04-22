import React from 'react'
import { Challenge } from '@/types/challenge.types'
import ChallengeStack from './ChallengeStack'
import RelatedChallenges, { RelatedChallenge } from './RelatedChallenges'
import { AlertCircle } from 'lucide-react'

interface ChallengeDetailSidebarProps {
  challenge: Challenge
}

/**
 * Barre latérale pour afficher les technologies et challenges liés
 */
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

      {/* Pro Tip */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <AlertCircle size={16} className="text-blue-600 mt-0.5 shrink-0" />
          <div>
            <h4 className="font-mono text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">
              Pro Tip
            </h4>
            <p className="text-xs text-blue-700">
              Break down the problem into smaller components and iterate.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
