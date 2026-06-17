import React from 'react'
import { Target, CheckCircle2 } from 'lucide-react'

interface ChallengeObjectivesProps {
  objectives: string[]
}

export default function ChallengeObjectives({ objectives }: ChallengeObjectivesProps) {
  return (
    <div className="bg-white border border-[var(--border-pink)] rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Target size={16} className="text-[var(--gray)]" />
        <h3 className="text-xs font-bold text-[var(--gray)] uppercase tracking-wider">
          Objectifs d&apos;apprentissage
        </h3>
      </div>

      <div className="space-y-3">
        {objectives.map((obj, i) => (
          <div key={i} className="flex items-start gap-3">
            <CheckCircle2 size={16} className="text-green-500 mt-0.5 shrink-0" />
            <span className="text-sm text-[var(--gray)]">{obj}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
