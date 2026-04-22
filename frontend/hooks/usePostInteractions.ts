import { useState, useCallback } from 'react'

export function usePostInteractions() {
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set())
  const [savedPosts, setSavedPosts] = useState<Set<number>>(new Set())
  const [commentingOn, setCommentingOn] = useState<number | null>(null)
  const [comments, setComments] = useState<Record<number, string>>({})
  const [expandedFeedback, setExpandedFeedback] = useState<Set<number>>(new Set())

  const handleLike = useCallback((id: number) => {
    setLikedPosts((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }, [])

  const handleSave = useCallback((id: number) => {
    setSavedPosts((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }, [])

  const handleComment = useCallback((id: number) => {
    if (comments[id]?.trim()) {
      console.log('Commentaire:', comments[id])
      setComments((prev) => ({ ...prev, [id]: '' }))
      setCommentingOn(null)
    }
  }, [comments])

  const toggleFeedback = useCallback((id: number) => {
    setExpandedFeedback((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }, [])

  return {
    likedPosts,
    savedPosts,
    commentingOn,
    comments,
    expandedFeedback,
    handleLike,
    handleSave,
    handleComment,
    toggleFeedback,
    setComments,
    setCommentingOn,
  }
}
