import React from 'react'
import { BookOpen } from 'lucide-react'
import { Challenge } from '@/types/challenge.types'

interface ChallengeOverviewProps {
  challenge: Challenge
}

/**
 * Section "Overview" - Présentation globale du challenge
 */
export default function ChallengeOverview({ challenge }: ChallengeOverviewProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
        <BookOpen size={16} className="text-gray-400" />
        <h2 className="font-mono text-sm font-bold text-gray-600 uppercase tracking-wider">
          Overview
        </h2>
      </div>

      <p className="text-gray-600 leading-relaxed">
        This challenge tests your ability to design and implement production-ready solutions
        using {challenge.technologies?.slice(0, 3).join(', ')} and more.
      </p>
    </div>
  )
}
