import React from 'react'
import { Submission } from '@/hooks/useSubmissions'
import SubmissionCard from './SubmissionCard'

interface SubmissionsListProps {
  submissions: Submission[]
  likedPosts: Set<number>
  savedPosts: Set<number>
  commentingOn: number | null
  comments: Record<number, string>
  expandedFeedback: Set<number>
  onLike: (id: number) => void
  onSave: (id: number) => void
  onComment: (id: number) => void
  onToggleFeedback: (id: number) => void
  onSetComment: (text: string) => void
  onSetCommentingOn: (id: number | null) => void
}

export default function SubmissionsList({
  submissions,
  likedPosts,
  savedPosts,
  commentingOn,
  comments,
  expandedFeedback,
  onLike,
  onSave,
  onComment,
  onToggleFeedback,
  onSetComment,
  onSetCommentingOn,
}: SubmissionsListProps) {
  if (submissions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Aucune submission pour le moment</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {submissions.map((submission) => (
        <SubmissionCard
          key={submission.id}
          submission={submission}
          isLiked={likedPosts.has(submission.id)}
          isSaved={savedPosts.has(submission.id)}
          isCommentingOn={commentingOn === submission.id}
          comment={comments[submission.id] || ''}
          isFeedbackExpanded={expandedFeedback.has(submission.id)}
          onLike={onLike}
          onSave={onSave}
          onComment={onComment}
          onToggleFeedback={onToggleFeedback}
          onSetComment={(text) => onSetComment(text)}
          onSetCommentingOn={onSetCommentingOn}
        />
      ))}
    </div>
  )
}
