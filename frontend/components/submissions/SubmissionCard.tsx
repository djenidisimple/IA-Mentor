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
  MoreHorizontal,
  Send,
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
    <div
      className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden animate-fadeIn"
      style={{ animationDelay: `${submission.id * 0.05}s` }}
    >
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b border-gray-100">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-md flex items-center justify-center text-white font-bold">
          {submission.username.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{submission.username}</h3>
          <p className="text-sm text-gray-500">il y a {formatRelativeDate(submission.submittedAt)}</p>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="flex items-start gap-2">
          <Trophy size={18} className="text-yellow-500 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-gray-900">{submission.challengeTitle}</h4>
            <p className="text-sm text-gray-600">Score: {submission.score}%</p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          {isSuccessful ? (
            <>
              <CheckCircle2 size={16} className="text-green-500" />
              <span className="text-sm font-medium text-green-700 bg-green-50 px-2 py-1 rounded">
                Acceptée
              </span>
            </>
          ) : (
            <>
              <XCircle size={16} className="text-red-500" />
              <span className="text-sm font-medium text-red-700 bg-red-50 px-2 py-1 rounded">
                En révision
              </span>
            </>
          )}
        </div>

        {/* GitHub Link */}
        <a
          href={submission.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          <GitBranch size={14} />
          Voir le code
          <ExternalLink size={14} />
        </a>
      </div>

      {/* AI Feedback */}
      {submission.aiFeedback && (
        <div className="px-4 py-3 bg-blue-50 border-t border-b border-blue-100">
          <button
            onClick={() => onToggleFeedback(submission.id)}
            className="flex items-center gap-2 text-blue-700 font-medium text-sm hover:text-blue-800"
          >
            <Brain size={16} />
            Feedback IA
            <ChevronDown
              size={16}
              className={`transition-transform ${isFeedbackExpanded ? 'rotate-180' : ''}`}
            />
          </button>

          {isFeedbackExpanded && (
            <div className="mt-2 p-2 bg-white rounded text-sm text-gray-700 leading-relaxed">
              {submission.aiFeedback}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 space-y-3">
        <div className="flex items-center justify-between text-gray-600 text-sm">
          <div className="flex gap-4">
            <span className="flex items-center gap-1">
              <Heart size={14} /> {randomLikes} likes
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle size={14} /> {randomComments} commentaires
            </span>
          </div>
          <button
            onClick={() => onSave(submission.id)}
            className={`transition-colors ${
              isSaved ? 'text-yellow-500' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Bookmark size={16} fill={isSaved ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Interaction Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onLike(submission.id)}
            className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-all ${
              isLiked
                ? 'bg-red-100 text-red-600 hover:bg-red-200'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
            }`}
          >
            <Heart size={16} className="inline mr-1" />
            {isLiked ? 'Aimé' : 'Aimer'}
          </button>
          <button
            onClick={() => onSetCommentingOn(isCommentingOn ? null : submission.id)}
            className="flex-1 py-2 px-3 rounded-lg font-medium text-sm bg-white text-gray-700 border border-gray-300 hover:border-gray-400 transition-all"
          >
            <MessageCircle size={16} className="inline mr-1" />
            Commenter
          </button>
        </div>

        {/* Comment Input */}
        {isCommentingOn && (
          <div className="flex gap-2 pt-2 border-t border-gray-200">
            <input
              type="text"
              placeholder="Votre commentaire..."
              value={comment}
              onChange={(e) => onSetComment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onComment(submission.id)
              }}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => onComment(submission.id)}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
