import React from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { ChallengeType } from '@/types/challenge.types'
import { MODULE_CONFIG, DEFAULT_MODULE_CONFIG } from '@/lib/challenge-constants'

export interface RelatedChallenge {
  title: string
  type: ChallengeType
  points: number
}

interface RelatedChallengeItemProps {
  challenge: RelatedChallenge
}

/**
 * Composant pour afficher un challenge lié
 */
function RelatedChallengeItem({ challenge }: RelatedChallengeItemProps) {
  const moduleConfig = MODULE_CONFIG[challenge.type] || DEFAULT_MODULE_CONFIG

  return (
    <Link
      href={`/challenges/${challenge.title.toLowerCase().replace(/\s+/g, '-')}`}
      className="block group p-3 hover:bg-gray-50 rounded-lg transition-colors"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="font-mono text-sm font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
            {challenge.title}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span
              className="font-mono text-[9px] font-medium px-2 py-0.5 rounded"
              style={{
                color: moduleConfig.color,
                backgroundColor: `${moduleConfig.color}10`,
              }}
            >
              {challenge.type}
            </span>
            <span className="font-mono text-[9px] text-gray-400">{challenge.points} XP</span>
          </div>
        </div>
        <ChevronRight
          size={14}
          className="text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all"
        />
      </div>
    </Link>
  )
}

interface RelatedChallengesProps {
  challenges: RelatedChallenge[]
}

/**
 * Section "Related Challenges" - Affiche les challenges recommandés
 */
export default function RelatedChallenges({ challenges }: RelatedChallengesProps) {
  return (
    <div className="spec-card rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        {/* Link icon */}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-400">
          <path
            d="M6 10L10 6M10 10H6M6 10C6 6.13401 8.68629 3 12 3C15.3137 3 18 5.68629 18 9C18 12.3137 15.3137 15 12 15C8.68629 15 6 12.3137 6 9"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <h3 className="font-mono text-xs font-bold text-gray-600 uppercase tracking-wider">
          Related
        </h3>
      </div>

      <div className="space-y-1">
        {challenges.map((item, i) => (
          <RelatedChallengeItem key={i} challenge={item} />
        ))}
      </div>
    </div>
  )
}
