import { apiFetch } from './api'

export interface UserProfile {
  id: number
  username: string
  githubUsername?: string | null
  email: string
  avatarUrl?: string
  points: number
  pointsEarned: number
  isPremium: boolean
  challengesInProgress: number
  challengesSubmitted: number
  challengesCompleted: number
  totalChallenges: number
  averageScore: number
  successRate: number
  totalTimeMinutes: number
  activeDays: number
  createdAt: string
}

export const usersApi = {
  getMyProfile: () =>
    apiFetch<UserProfile>('/api/users/profile'),
}
