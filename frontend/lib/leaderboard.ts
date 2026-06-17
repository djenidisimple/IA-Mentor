import { apiFetch } from './api'

export interface LeaderboardEntry {
  id: number
  username: string
  avatarUrl: string
  points: number
  rank: number
  previousRank: number | null
  challengesCompleted: number
  averageScore: number
  isPremium: boolean
}

export const leaderboardApi = {
  getAll: () => apiFetch<LeaderboardEntry[]>('/api/leaderboard'),
  getMyRank: () => apiFetch<LeaderboardEntry>('/api/leaderboard/me'),
}
