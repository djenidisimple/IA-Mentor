import React from 'react'
import Link from 'next/link'
import {
  CheckCircle2,
  XCircle,
  GitBranch,
  ExternalLink,
  Brain,
  Heart,
  MessageCircle,
  Bookmark,
  ChevronDown,
  Trophy,
} from 'lucide-react'
import { Submission } from '@/hooks/useSubmissions'
import { formatRelativeDate, getRandomFromHash } from '@/lib/formatters'

interface SubmissionCardProps {
  submission: Submission
  isLiked: boolean
  isSaved: boolean
  isCommentingOn: boolean
  comment: string
  isFeedbackExpanded: boolean
  onLike: (id: number) => void
  onSave: (id: number) => void
  onComment: (id: number) => void
  onToggleFeedback: (id: number) => void
  onSetComment: (text: string) => void
  onSetCommentingOn: (id: number | null) => void
}

export default function SubmissionCard({
  submission,
  isLiked,
  isSaved,
  isCommentingOn,
  comment,
  isFeedbackExpanded,
  onLike,
  onSave,
  onComment,
  onToggleFeedback,
  onSetComment,
  onSetCommentingOn,
}: SubmissionCardProps) {
  const isSuccessful = submission.status === 'APPROVED'
  const randomLikes = getRandomFromHash(submission.id, 7, 50, 15)
  const randomComments = getRandomFromHash(submission.id, 13, 20, 3)

  return (
    <div className="bg-white rounded-xl border border-[var(--border-pink)] hover:shadow-md transition-all duration-300 overflow-hidden">
      <div className="flex items-center gap-4 p-4 border-b border-[var(--border-pink)]">
        <div className="w-12 h-12 bg-gradient-to-br from-[var(--blue)] to-[var(--purple)] rounded-xl flex items-center justify-center text-white font-bold">
          {submission.username.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-[var(--navy)]">{submission.username}</h3>
          <p className="text-sm text-[var(--gray)]">il y a {formatRelativeDate(submission.submittedAt)}</p>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-start gap-2">
          <Trophy size={18} className="text-[var(--yellow)] mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-bold text-[var(--navy)]">{submission.challengeTitle}</h4>
            <p className="text-sm text-[var(--gray)]">Score: {submission.score}%</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isSuccessful ? (
            <>
              <CheckCircle2 size={16} className="text-green-500" />
              <span className="text-sm font-bold text-green-700 bg-green-50 px-2 py-1 rounded-full">
                Acceptée
              </span>
            </>
          ) : (
            <>
              <XCircle size={16} className="text-red-500" />
              <span className="text-sm font-bold text-red-700 bg-red-50 px-2 py-1 rounded-full">
                En révision
              </span>
            </>
          )}
        </div>

        <a
          href={submission.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-[var(--blue)] hover:text-[var(--navy)] text-sm font-bold transition-colors"
        >
          <GitBranch size={14} />
          Voir le code
          <ExternalLink size={14} />
        </a>
      </div>

      {submission.aiFeedback && (
        <div className="px-4 py-3 bg-[var(--blue)]/5 border-t border-b border-[var(--blue)]/10">
          <button
            onClick={() => onToggleFeedback(submission.id)}
            className="flex items-center gap-2 text-[var(--blue)] font-bold text-sm hover:text-[var(--navy)] transition-colors"
          >
            <Brain size={16} />
            Feedback IA
            <ChevronDown
              size={16}
              className={`transition-transform ${isFeedbackExpanded ? 'rotate-180' : ''}`}
            />
          </button>

          {isFeedbackExpanded && (
            <div className="mt-2 p-3 bg-white rounded-xl border border-[var(--border-pink)] text-sm text-[var(--gray)] leading-relaxed">
              {submission.aiFeedback}
            </div>
          )}
        </div>
      )}

      <div className="px-4 py-3 bg-[var(--cream)] border-t border-[var(--border-pink)] space-y-3">
        <div className="flex items-center justify-between text-[var(--gray)] text-sm">
          <div className="flex gap-4">
            <span className="flex items-center gap-1 font-bold">
              <Heart size={14} /> {randomLikes}
            </span>
            <span className="flex items-center gap-1 font-bold">
              <MessageCircle size={14} /> {randomComments}
            </span>
          </div>
          <button
            onClick={() => onSave(submission.id)}
            className={`transition-colors ${
              isSaved ? 'text-[var(--yellow)]' : 'text-[var(--gray)] hover:text-[var(--navy)]'
            }`}
          >
            <Bookmark size={16} fill={isSaved ? 'currentColor' : 'none'} />
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onLike(submission.id)}
            className={`flex-1 py-2 px-3 rounded-full font-bold text-sm transition-all ${
              isLiked
                ? 'bg-red-100 text-red-600 hover:bg-red-200'
                : 'bg-white text-[var(--gray)] border border-[var(--border-pink)] hover:border-[var(--navy)]'
            }`}
          >
            <Heart size={16} className="inline mr-1" />
            {isLiked ? 'Aimé' : 'Aimer'}
          </button>
          <button
            onClick={() => onSetCommentingOn(isCommentingOn ? null : submission.id)}
            className="flex-1 py-2 px-3 rounded-full font-bold text-sm bg-white text-[var(--gray)] border border-[var(--border-pink)] hover:border-[var(--navy)] transition-all"
          >
            <MessageCircle size={16} className="inline mr-1" />
            Commenter
          </button>
        </div>

        {isCommentingOn && (
          <div className="flex gap-2 pt-2 border-t border-[var(--border-pink)]">
            <input
              type="text"
              placeholder="Votre commentaire..."
              value={comment}
              onChange={(e) => onSetComment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onComment(submission.id)
              }}
              className="flex-1 px-3 py-2 border border-[var(--border-pink)] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[var(--blue)] bg-white"
            />
            <button
              onClick={() => onComment(submission.id)}
              className="px-4 py-2 bg-[var(--navy)] text-white rounded-full hover:bg-[#2A3050] transition-colors text-sm font-bold"
            >
              Envoyer
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
