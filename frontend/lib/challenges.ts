import { apiFetch } from './api'
import { Challenge, Category } from '@/types/challenge.types'
import { axiosInstance } from './axios'

export const challengesApi = {

  getAll: () =>
    apiFetch<Challenge[]>('/api/challenges'),

  getBySlug: (slug: string) =>
    apiFetch<Challenge>(`/api/challenges/${slug}`),

  getByCategory: (categorySlug: string) =>
    apiFetch<Challenge[]>(`/api/challenges/category/${categorySlug}`),

  getAllCategories: () =>
    apiFetch<Category[]>('/api/categories'),
}