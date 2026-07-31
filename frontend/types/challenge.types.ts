export type ChallengeLevel = 'DEBUTANT' | 'INTERMEDIAIRE' | 'AVANCE' | 'EASY' | 'MEDIUM' | 'HARD'
export type ChallengeType = 'FRONTEND' | 'BACKEND' | 'FULLSTACK'

export interface Challenge {
  id: number
  title: string
  slug: string
  description: string
  level: ChallengeLevel
  type: ChallengeType
  categoryName: string
  categorySlug: string
  technologies: string[]
  criteresIA: string[]
  points: number
  isPremium: boolean
  reviewed: boolean
  averageScore?: number
  createdAt: string,
  comments?: Comment[]
}

export interface Category {
  id: number
  name: string
  slug: string
  description: string
  challengeCount: number
  createdAt: string
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  timestamp: string
}

export type SubmissionStatus = 'IN_PROGRESS' | 'SUBMITTED' | 'REVIEWED'

export interface SubmissionResponse {
  id: number
  userId: number
  challengeId: number
  githubUrl?: string
  status: SubmissionStatus
  score?: number
  aiFeedback?: string
  startedAt: string
  submittedAt?: string
  completedAt?: string
}