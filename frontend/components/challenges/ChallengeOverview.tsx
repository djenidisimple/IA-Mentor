import React from 'react'
import { BookOpen } from 'lucide-react'
import { Challenge } from '@/types/challenge.types'

interface ChallengeOverviewProps {
  challenge: Challenge
}

export default function ChallengeOverview({ challenge }: ChallengeOverviewProps) {
  return (
    <div className="bg-white border border-[var(--border-pink)] rounded-xl p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[var(--border-pink)]">
        <BookOpen size={16} className="text-[var(--gray)]" />
        <h2 className="text-xs font-bold text-[var(--gray)] uppercase tracking-wider">
          Aperçu
        </h2>
      </div>

      <p className="text-sm text-[var(--gray)] leading-relaxed">
        Ce défi teste votre capacité à concevoir et implémenter des solutions de niveau production
        en utilisant {challenge.technologies?.slice(0, 3).join(', ')}.
      </p>
    </div>
  )
}
