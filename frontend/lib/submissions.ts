import { apiFetch } from './api'
import {
  Submission,
  StartChallengeRequest,
  SubmitChallengeRequest
} from '@/types/submission.types'

export const submissionsApi = {

  start: (data: StartChallengeRequest) =>
    apiFetch<Submission>('/api/submissions/start', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  submit: (data: SubmitChallengeRequest) =>
    apiFetch<Submission>('/api/submissions/submit', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getMyActivity: () =>
    apiFetch<Submission[]>('/api/submissions/user/me'),

  getMyInProgress: () =>
    apiFetch<Submission[]>('/api/submissions/user/me/in-progress'),

  getMyCompleted: () =>
    apiFetch<Submission[]>('/api/submissions/user/me/completed'),
}