export interface UserSummary {
  id: number
  username: string
  avatarUrl: string
}

export interface Comment {
  id: number
  content: string
  user: UserSummary
  createdAt: string
  likeCount: number
}
export interface CommunityPost {
  id: number
  author: {
    id: number
    username: string
    avatar?: string
    isPremium?: boolean
    role?: string
  }
  content: string
  code?: {
    language: string
    snippet: string
  }
  tags: string[]
  likes: number      // Total calculé par le back
  comments: number   // Total calculé par le back
  shares: number
  createdAt: string
  isLiked: boolean   // Vérifié par le back pour l'utilisateur actuel
}
/**
 * Représente un sujet ou un tag populaire actuellement
 */
export interface TrendingTopic {
  id: number
  tag: string        // Le nom du tag (ex: "React", "Spring")
  posts: number      // Nombre total de posts/soumissions utilisant ce tag
  category: string   // Catégorie (ex: "Framework", "Language", "Architecture")
  growthRate?: number // Optionnel : pourcentage de progression pour l'icône "HOT"
}

/**
 * Représente un utilisateur suggéré par l'algorithme
 */
export interface SuggestedUser {
  id: number
  username: string
  avatar?: string      // URL de l'image de profil
  isPremium: boolean   // Statut du compte (PRO/Premium)
  mutualFriends?: number // Nombre d'amis en commun (si applicable)
  reason: string       // La raison de la suggestion (ex: "Aime les mêmes défis", "Populaire")
  role?: string        // Titre professionnel (ex: "Senior Dev", "Java Expert")
}

/**
 * Rappel : Interface Post pour la cohérence globale
 */
export interface CommunityPost {
  id: number
  author: {
    id: number
    username: string
    avatar?: string
    isPremium?: boolean
    role?: string
  }
  content: string
  code?: {
    language: string
    snippet: string
  }
  tags: string[]
  likes: number
  comments: number
  shares: number
  createdAt: string
  isLiked: boolean
}