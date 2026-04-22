import { useEffect, useState } from 'react'
import { submissionsApi } from '@/lib/submissions'

export interface Submission {
  id: number
  challengeId: number
  challengeTitle: string
  challengeSlug: string
  githubUrl: string
  score: number
  status: string
  aiFeedback: string
  submittedAt: string
  reviewedAt: string
  startedAt: string
  userId: number
  username: string
}

export function useSubmissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await submissionsApi.getAllCompleted()
        setSubmissions(response as Submission[])
        setError(null)
      } catch (err) {
        console.error('Erreur lors du chargement:', err)
        setError('Impossible de charger les submissions')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { submissions, loading, error }
}
