import { apiFetch } from './api'
import { Challenge, Category } from '@/types/challenge.types'

export const challengesApi = {

  getAll: () =>
    apiFetch<Challenge[]>('/api/challenges'),

  getBySlug: (slug: string) =>
    apiFetch<Challenge>(`/api/challenges/${slug}`),

  getByCategory: (categorySlug: string) =>
    apiFetch<Challenge[]>(`/api/challenges/category/${categorySlug}`),

  getAllCategories: () =>
    apiFetch<Category[]>('/api/categories'),

  review: (slug: string) =>
    apiFetch<Challenge>(`/api/challenges/${slug}/review`, {
      method: 'POST',
    }),

  test: () =>
    apiFetch<string>('/api/groq/test-analysis/1'),
}