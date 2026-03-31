export type SubmissionStatus = 'IN_PROGRESS' | 'SUBMITTED' | 'REVIEWED'

export interface Submission {
  id: number
  userId: number
  username: string
  challengeId: number
  challengeTitle: string
  challengeSlug: string
  githubUrl?: string
  status: SubmissionStatus
  aiFeedback?: string
  score?: number
  startedAt: string
  submittedAt?: string
  reviewedAt?: string
}

export interface StartChallengeRequest {
  challengeId: number
}

export interface SubmitChallengeRequest {
  challengeId: number
  githubUrl: string
}