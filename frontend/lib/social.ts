import { apiFetch } from './api' // Importe ton client fetch personnalisé
import { CommunityPost, SuggestedUser, TrendingTopic, Comment } from '@/types/social.types'

export const socialApi = {
  /**
   * Récupère le flux d'actualité de la communauté
   * (Soumissions récentes, partages, etc.)
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
   * basé sur les technologies ou les amis communs
   */
  getSuggestions: () => 
    apiFetch<SuggestedUser[]>('/api/social/suggestions'),

  /**
   * Like ou Unlike une publication/soumission
   */
  toggleLike: (postId: number) => 
    apiFetch<void>(`/api/social/like/${postId}`, { 
      method: 'POST' 
    }),

  /**
   * Ajoute un commentaire à un post
   */
  addComment: (postId: number, content: string) => 
    apiFetch<Comment>(`/api/social/comment/${postId}`, {
      method: 'POST',
      body: JSON.stringify({ content }), // On envoie un objet JSON
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