import React from 'react'
import { CheckCircle2 } from 'lucide-react'

interface RequirementItemProps {
  text: string
}

interface ChallengeRequirementsProps {
  requirements: string[]
}

/**
 * Composant pour afficher une seule requirement
 */
function RequirementItem({ text }: RequirementItemProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-1.5 h-1.5 rounded-md bg-blue-400 mt-2 shrink-0" />
      <span className="text-sm text-gray-600">{text}</span>
    </div>
  )
}

/**
 * Section "Requirements" - Pré-requis et critères d'acceptation
 */
export default function ChallengeRequirements({ requirements }: ChallengeRequirementsProps) {
  return (
    <div className="spec-card rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle2 size={16} className="text-gray-400" />
        <h3 className="font-mono text-xs font-bold text-gray-600 uppercase tracking-wider">
          Requirements
        </h3>
      </div>

      <div className="space-y-3">
        {requirements.map((req, i) => (
          <RequirementItem key={i} text={req} />
        ))}
      </div>
    </div>
  )
}
