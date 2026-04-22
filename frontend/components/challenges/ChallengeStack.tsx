import React from 'react'
import { Package } from 'lucide-react'
import { Challenge } from '@/types/challenge.types'

interface ChallengeStackProps {
  challenge: Challenge
}

/**
 * Section "Tech Stack" - Affiche les technologies utilisées
 */
export default function ChallengeStack({ challenge }: ChallengeStackProps) {
  return (
    <div className="spec-card rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Package size={16} className="text-gray-400" />
        <h3 className="font-mono text-xs font-bold text-gray-600 uppercase tracking-wider">
          Technologies
        </h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {challenge.technologies?.map((tech, i) => (
          <span
            key={i}
            className="px-3 py-2 font-mono text-xs bg-gray-50 text-gray-700 rounded-lg border border-gray-200"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  )
}
