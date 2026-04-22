import { apiFetch } from './api'
import { SubmissionResponse } from '@/types/challenge.types'
import { axiosInstance } from './axios';

export const submissionsApi = {

  start: (challengeId: number) =>
    apiFetch<SubmissionResponse>('/api/submissions/start', {
      method: 'POST',
      body: JSON.stringify({ challengeId }),
    }),

  submit: (challengeId: number, githubUrl: string) =>
    apiFetch<SubmissionResponse>('/api/submissions/submit', {
      method: 'POST',
      body: JSON.stringify({ challengeId, githubUrl }),
    }),

  getMyActivity: () =>
    apiFetch<SubmissionResponse[]>('/api/submissions/user/me'),

  getMyInProgress: () =>
    apiFetch<SubmissionResponse[]>('/api/submissions/user/me/in-progress'),

  getMyCompleted: () =>
    apiFetch<SubmissionResponse[]>('/api/submissions/user/me/completed'),

  getAllCompleted: () => 
    apiFetch<SubmissionResponse[]>('/api/submissions/completed'),

  getSubmission: (id: number) =>
    apiFetch<SubmissionResponse>(`/api/submissions/${id}`),

  // Admin: trigger review for a submission (ADMIN role required)
  review: (id: number) =>
    apiFetch<SubmissionResponse>(`/api/admin/submissions/${id}/review`, {
      method: 'POST',
    }),

  // Admin: list all submissions
  listAll: () => apiFetch<SubmissionResponse[]>('/api/admin/submissions'),
}