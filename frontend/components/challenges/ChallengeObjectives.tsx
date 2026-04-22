import React from 'react'
import { Target, CheckCircle2 } from 'lucide-react'

interface ListItemProps {
  text: string
  icon?: React.ReactNode
}

interface ChallengeObjectivesProps {
  objectives: string[]
}

/**
 * Composant pour afficher un seul objectif
 */
function ObjectiveItem({ text, icon }: ListItemProps) {
  return (
    <div className="flex items-start gap-3">
      {icon || <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />}
      <span className="text-sm text-gray-600">{text}</span>
    </div>
  )
}

/**
 * Section "Learning Objectives" - Objectifs pédagogiques
 */
export default function ChallengeObjectives({ objectives }: ChallengeObjectivesProps) {
  return (
    <div className="spec-card rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Target size={16} className="text-gray-400" />
        <h3 className="font-mono text-xs font-bold text-gray-600 uppercase tracking-wider">
          Learning Objectives
        </h3>
      </div>

      <div className="space-y-3">
        {objectives.map((obj, i) => (
          <ObjectiveItem key={i} text={obj} />
        ))}
      </div>
    </div>
  )
}
