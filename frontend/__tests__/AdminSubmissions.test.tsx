import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Mock next/navigation router
jest.mock('next/navigation', () => ({ useRouter: () => ({ replace: jest.fn(), push: jest.fn() }) }))

// Mock auth store to simulate ADMIN user
jest.mock('@/lib/store/authStore', () => ({
  useAuthStore: () => ({ isAuthenticated: true, user: { id: 1, username: 'admin', role: 'ADMIN' }, token: 'tok' })
}))

// Mock submissions API
const sample = { id: 1, username: 'alice', challengeTitle: 'Test Challenge', status: 'SUBMITTED', githubUrl: 'https://github.com/alice/repo' }
const reviewed = { ...sample, status: 'REVIEWED', aiFeedback: 'OK' }

jest.mock('@/lib/submissions', () => ({
  submissionsApi: {
    listAll: jest.fn().mockResolvedValue([sample]),
    review: jest.fn().mockImplementation(async (id: number) => {
      if (id === sample.id) return reviewed
      throw new Error('Not found')
    })
  }
}))

import AdminSubmissionsPage from '@/app/(dashboard)/admin/submissions/page'

test('admin can list and review a submission', async () => {
  render(<AdminSubmissionsPage />)

  // Wait for the sample to appear
  expect(await screen.findByText(/Test Challenge/i)).toBeInTheDocument()

  const reviewBtn = screen.getByRole('button', { name: /Review/i })
  userEvent.click(reviewBtn)

  // After clicking, await the updated status to appear
  await waitFor(() => expect(screen.getByText(/REVIEWED/)).toBeInTheDocument())
})
