/**
 * Contenu par défaut pour les challenges
 * À remplacer par des données dynamiques du backend
 */

export const DEFAULT_OBJECTIVES = [
  'Design scalable and maintainable system architecture',
  'Implement efficient algorithms with optimal complexity',
  'Write clean, testable, and well-documented code',
  'Handle edge cases and error scenarios gracefully',
]

export const DEFAULT_REQUIREMENTS = [
  'Implement all specified features completely',
  'Achieve optimal performance (< 100ms response)',
  'Maintain > 90% test coverage',
  'Follow consistent code style and conventions',
]

/**
 * Les détails des challenges par type
 */
export const CHALLENGE_DETAILS = {
  BACKEND: {
    color: '#3B82F6',
    icon: 'server',
  },
  FRONTEND: {
    color: '#8B5CF6',
    icon: 'layout',
  },
  FULLSTACK: {
    color: '#EC4899',
    icon: 'layers',
  },
} as const
