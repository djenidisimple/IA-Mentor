import React from 'react'
import { Package } from 'lucide-react'
import { Challenge } from '@/types/challenge.types'

interface ChallengeStackProps {
  challenge: Challenge
}

export default function ChallengeStack({ challenge }: ChallengeStackProps) {
  return (
    <div className="bg-white border border-[var(--border-pink)] rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Package size={16} className="text-[var(--gray)]" />
        <h3 className="text-xs font-bold text-[var(--gray)] uppercase tracking-wider">
          Technologies
        </h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {challenge.technologies?.map((tech, i) => (
          <span
            key={i}
            className="px-3 py-1.5 text-xs font-bold bg-[var(--cream)] text-[var(--navy)] rounded-full border border-[var(--border-pink)]"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  )
}
