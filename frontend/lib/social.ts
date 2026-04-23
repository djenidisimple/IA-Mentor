import { apiFetch } from './api'
import { CommunityPost, SuggestedUser, TrendingTopic, Comment } from '@/types/social.types'

export const socialApi = {
  /**
   * Récupère le flux d'actualité de la communauté
   */
  getFeed: () => 
    apiFetch<CommunityPost[]>('/api/social/posts'),

  /**
   * Récupère les tags et sujets qui font le buzz
   */
  getTrending: () => 
    apiFetch<TrendingTopic[]>('/api/social/trending'),

  /**
   * Récupère des suggestions d'utilisateurs à suivre
   */
  getSuggestions: () => 
    apiFetch<SuggestedUser[]>('/api/social/suggestions'),

  /**
   * Like ou Unlike une soumission
   */
  toggleLike: (submissionId: number) => 
    apiFetch<void>(`/api/social/like/${submissionId}`, { 
      method: 'POST' 
    }),

  /**
   * Ajoute un commentaire à une soumission
   */
  addCommentToSubmission: (submissionId: number, content: string) => 
    apiFetch<Comment>(`/api/social/comment/submission/${submissionId}`, {
      method: 'POST',
      body: JSON.stringify({ content }),
      headers: { 'Content-Type': 'application/json' }
    }),

  /**
   * Ajoute un commentaire à un challenge (endpoint existant)
   */
  addCommentToChallenge: (challengeId: number, content: string) => 
    apiFetch<Comment>(`/api/social/comment/challenge/${challengeId}`, {
      method: 'POST',
      body: JSON.stringify({ content }),
      headers: { 'Content-Type': 'application/json' }
    }),

  /**
   * Suit un autre développeur
   */
  followUser: (userId: number) => 
    apiFetch<void>(`/api/social/follow/${userId}`, { 
      method: 'POST' 
    }),
}