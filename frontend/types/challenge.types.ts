export type ChallengeLevel = 'DEBUTANT' | 'INTERMEDIAIRE' | 'AVANCE'
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
  createdAt: string
}

export interface Category {
  id: number
  name: string
  slug: string
  description: string
  challengeCount: number
  createdAt: string
}