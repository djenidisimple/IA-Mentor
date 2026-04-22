"use client"

import { submissionsApi } from "@/lib/submissions"
import { useEffect, useState } from "react"
import { 
  Trophy, 
  CheckCircle2, 
  XCircle, 
  GitBranch, 
  ExternalLink,
  Brain,
  Code2,
  Clock,
  AlertCircle,
  Heart,
  MessageCircle,
  Bookmark,
  MoreHorizontal,
  Send
} from "lucide-react"
import Link from "next/link"

interface Submission {
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

export default function Home() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(false)
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set())
  const [savedPosts, setSavedPosts] = useState<Set<number>>(new Set())
  const [commentingOn, setCommentingOn] = useState<number | null>(null)
  const [comments, setComments] = useState<Record<number, string>>({})
  const [expandedFeedback, setExpandedFeedback] = useState<Set<number>>(new Set())

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await submissionsApi.getAllCompleted()
        setSubmissions(response as Submission[])
      } catch (error) {
        console.error("Erreur lors du chargement:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor(diff / (1000 * 60))

    if (days > 7) {
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
    } else if (days > 0) {
      return `il y a ${days} j`
    } else if (hours > 0) {
      return `il y a ${hours} h`
    } else if (minutes > 0) {
      return `il y a ${minutes} min`
    } else {
      return "à l'instant"
    }
  }

  const handleLike = (id: number) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const handleSave = (id: number) => {
    setSavedPosts(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const handleComment = (id: number) => {
    if (comments[id]?.trim()) {
      console.log('Commentaire:', comments[id])
      setComments(prev => ({ ...prev, [id]: '' }))
      setCommentingOn(null)
    }
  }

  const toggleFeedback = (id: number) => {
    setExpandedFeedback(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const getRandomLikes = (id: number) => {
    const hash = id * 7
    return Math.floor((hash % 50) + 15)
  }

  const getRandomComments = (id: number) => {
    const hash = id * 13
    return Math.floor((hash % 20) + 3)
  }

  const customStyles = `
    @keyframes slideIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes likeAnimation {
      0% { transform: scale(1); }
      50% { transform: scale(1.3); }
      100% { transform: scale(1); }
    }
    .animate-slide-in {
      animation: slideIn 0.5s ease-out forwards;
    }
    .animate-fade-in {
      animation: fadeIn 0.3s ease-out forwards;
    }
    .like-animation {
      animation: likeAnimation 0.3s ease-out;
    }
  `

  if (loading) {
    return (
      <>
        <style>{customStyles}</style>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
          <div className="max-w-[600px] mx-auto px-4 py-8">
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <div className="relative mb-6 flex h-20 w-20 mx-auto items-center justify-center">
                  <div className="absolute inset-0 animate-ping rounded-full bg-blue-400/20"></div>
                  <div className="absolute inset-2 animate-pulse rounded-full bg-blue-500/30"></div>
                  <Brain className="h-10 w-10 text-blue-500 relative z-10" />
                </div>
                <h2 className="text-lg font-semibold text-slate-700">Chargement du feed...</h2>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <style>{customStyles}</style>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <div className="max-w-[600px] mx-auto px-4 py-6">
          
          {/* Feed Principal */}
          <div className="space-y-4">
            {submissions.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
                <AlertCircle className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">Aucune soumission pour le moment</p>
              </div>
            ) : (
              submissions.map((submission, idx) => {
                const likeCount = getRandomLikes(submission.id)
                const commentCount = getRandomComments(submission.id)
                const isLiked = likedPosts.has(submission.id)
                const isSaved = savedPosts.has(submission.id)
                const isCommenting = commentingOn === submission.id
                const isExpanded = expandedFeedback.has(submission.id)

                return (
                  <div
                    key={submission.id}
                    className={`rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all ${
                      isVisible ? 'animate-slide-in' : 'opacity-0'
                    }`}
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    {/* Post Header */}
                    <div className="p-4 pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          {/* Avatar */}
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            {submission.username[0].toUpperCase()}
                          </div>
                          
                          {/* User Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-slate-900 hover:underline cursor-pointer">
                                {submission.username}
                              </span>
                              <span className="text-xs text-slate-500">
                                @{submission.username.toLowerCase()}
                              </span>
                              <span className="text-xs text-slate-400">·</span>
                              <span className="text-xs text-slate-500 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatDate(submission.submittedAt)}
                              </span>
                            </div>
                            <p className="text-sm text-slate-600 mt-0.5">
                              a complété un défi
                            </p>
                          </div>
                        </div>
                        
                        <button className="p-1.5 hover:bg-slate-100 rounded-full transition-colors">
                          <MoreHorizontal className="h-4 w-4 text-slate-500" />
                        </button>
                      </div>
                    </div>

                    {/* Post Content - Challenge Card */}
                    <div className="px-4 pb-3">
                      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="rounded-lg bg-blue-50 p-2">
                            <Trophy className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-slate-800 mb-1">
                              {submission.challengeTitle}
                            </h3>
                            <div className="flex items-center gap-3">
                              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                submission.score >= 80 ? 'bg-emerald-50 text-emerald-700' :
                                submission.score >= 60 ? 'bg-amber-50 text-amber-700' :
                                'bg-rose-50 text-rose-700'
                              }`}>
                                {submission.score >= 80 ? <CheckCircle2 className="h-3 w-3" /> :
                                 submission.score >= 60 ? <CheckCircle2 className="h-3 w-3" /> :
                                 <XCircle className="h-3 w-3" />}
                                Score: {submission.score}/100
                              </div>
                              <Link
                                href={submission.githubUrl}
                                target="_blank"
                                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
                              >
                                <GitBranch className="h-3 w-3" />
                                Voir le code
                                <ExternalLink className="h-3 w-3" />
                              </Link>
                            </div>
                          </div>
                        </div>

                        {/* AI Feedback */}
                        <div className="bg-white rounded-lg p-3 border border-slate-100">
                          <div className="flex items-start gap-2">
                            <div className="rounded-full bg-gradient-to-br from-purple-400 to-pink-500 p-1.5 flex-shrink-0">
                              <Brain className="h-3 w-3 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className={`text-xs text-slate-600 ${!isExpanded ? 'line-clamp-3' : ''}`}>
                                {submission.aiFeedback}
                              </p>
                              {submission.aiFeedback.length > 150 && (
                                <button
                                  onClick={() => toggleFeedback(submission.id)}
                                  className="text-xs text-blue-600 hover:text-blue-700 mt-1 font-medium"
                                >
                                  {isExpanded ? 'Voir moins' : 'Voir plus'}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Post Actions */}
                    <div className="px-4 pb-2">
                      <div className="flex items-center gap-6 py-2 border-t border-slate-100">
                        {/* Like Button */}
                        <button
                          onClick={() => handleLike(submission.id)}
                          className={`flex items-center gap-2 transition-all ${
                            isLiked 
                              ? 'text-rose-500 hover:text-rose-600' 
                              : 'text-slate-500 hover:text-slate-700'
                          }`}
                        >
                          <Heart 
                            className={`h-5 w-5 transition-transform ${isLiked ? 'fill-current like-animation' : ''}`} 
                          />
                          <span className="text-sm font-medium">
                            {likeCount + (isLiked ? 1 : 0)}
                          </span>
                        </button>

                        {/* Comment Button */}
                        <button
                          onClick={() => setCommentingOn(isCommenting ? null : submission.id)}
                          className="flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-all"
                        >
                          <MessageCircle className="h-5 w-5" />
                          <span className="text-sm font-medium">{commentCount}</span>
                        </button>

                        {/* Save Button */}
                        <button
                          onClick={() => handleSave(submission.id)}
                          className={`transition-all ${
                            isSaved 
                              ? 'text-blue-500 hover:text-blue-600' 
                              : 'text-slate-500 hover:text-slate-700'
                          }`}
                        >
                          <Bookmark className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {/* Comment Input */}
                    {isCommenting && (
                      <div className="px-4 pb-4 animate-fade-in">
                        <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            M
                          </div>
                          <div className="flex-1 flex items-center gap-2">
                            <input
                              type="text"
                              placeholder="Ajouter un commentaire..."
                              value={comments[submission.id] || ''}
                              onChange={(e) => setComments(prev => ({ ...prev, [submission.id]: e.target.value }))}
                              onKeyPress={(e) => e.key === 'Enter' && handleComment(submission.id)}
                              className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                              autoFocus
                            />
                            <button
                              onClick={() => handleComment(submission.id)}
                              disabled={!comments[submission.id]?.trim()}
                              className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              <Send className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Comments Preview */}
                    {commentCount > 0 && !isCommenting && (
                      <div className="px-4 pb-3">
                        <button 
                          onClick={() => setCommentingOn(submission.id)}
                          className="text-xs text-slate-500 hover:text-slate-700"
                        >
                          Voir les {commentCount} commentaires
                        </button>
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>

          {/* Bottom Spacer */}
          <div className="h-8" />
        </div>
      </div>
    </>
  )
}