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

function RelatedChallengeItem({ challenge }: { challenge: RelatedChallenge }) {
  const moduleConfig = MODULE_CONFIG[challenge.type] || DEFAULT_MODULE_CONFIG

  return (
    <Link
      href={`/challenges/${challenge.title.toLowerCase().replace(/\s+/g, '-')}`}
      className="block group p-3 hover:bg-[var(--cream)] rounded-lg transition-colors"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-bold text-[var(--navy)] group-hover:text-[var(--blue)] transition-colors">
            {challenge.title}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{
                color: moduleConfig.color,
                backgroundColor: `${moduleConfig.color}15`,
              }}
            >
              {challenge.type}
            </span>
            <span className="text-[10px] font-bold text-[var(--gray)]">{challenge.points} XP</span>
          </div>
        </div>
        <ChevronRight
          size={14}
          className="text-[var(--gray)] group-hover:text-[var(--blue)] group-hover:translate-x-1 transition-all"
        />
      </div>
    </Link>
  )
}

interface RelatedChallengesProps {
  challenges: RelatedChallenge[]
}

export default function RelatedChallenges({ challenges }: RelatedChallengesProps) {
  return (
    <div className="bg-white border border-[var(--border-pink)] rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-[var(--gray)]">
          <path
            d="M6 10L10 6M10 10H6M6 10C6 6.13401 8.68629 3 12 3C15.3137 3 18 5.68629 18 9C18 12.3137 15.3137 15 12 15C8.68629 15 6 12.3137 6 9"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <h3 className="text-xs font-bold text-[var(--gray)] uppercase tracking-wider">
          Défis liés
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
