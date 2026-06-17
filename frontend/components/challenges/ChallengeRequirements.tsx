import React from 'react'
import { CheckCircle2 } from 'lucide-react'

interface ChallengeRequirementsProps {
  requirements: string[]
}

export default function ChallengeRequirements({ requirements }: ChallengeRequirementsProps) {
  return (
    <div className="bg-white border border-[var(--border-pink)] rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle2 size={16} className="text-[var(--gray)]" />
        <h3 className="text-xs font-bold text-[var(--gray)] uppercase tracking-wider">
          Pré-requis
        </h3>
      </div>

      <div className="space-y-3">
        {requirements.map((req, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--blue)] mt-2 shrink-0" />
            <span className="text-sm text-[var(--gray)]">{req}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
