'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Code, 
  Star, 
  GitBranch,
  Loader2,
  Clock,
  Terminal,
  Zap,
  Shield,
  Users
} from 'lucide-react'
import Link from 'next/link'
import LoadingScreen from '@/components/ui/LoadingScreen'
import { Button } from '@/components/ui/Button'

interface ChallengeSubmission {
  id: number
  challengeId: number
  challenge: {
    id: number
    title: string
    description: string
    language: string
    difficulty: string
    duration: string
    points: number
  }
  userId: number
  user: {
    id: number
    username: string
    avatarUrl: string
    points: number
  }
  repositoryUrl: string
  score: number
  feedback: string
  likes: number
  comments: Array<{
    id: number
    username: string
    content: string
    createdAt: string
  }>
  isLikedByCurrentUser: boolean
  createdAt: string
}

// 📦 DONNÉES MOCKÉES POUR LE PROTOTYPE
const mockSubmissions: ChallengeSubmission[] = [
  {
    id: 1,
    challengeId: 1,
    challenge: {
      id: 1,
      title: "API REST Sécurisée avec JWT",
      description: "Implémente une API REST complète avec authentification JWT, gestion des rôles et validation des données. Utilise Spring Boot et PostgreSQL.",
      language: "Java • Spring Boot",
      difficulty: "INTERMÉDIAIRE",
      duration: "3-5h",
      points: 500
    },
    userId: 1,
    user: {
      id: 1,
      username: "dev_master",
      avatarUrl: "",
      points: 2450
    },
    repositoryUrl: "https://github.com/dev_master/secure-api",
    score: 94,
    feedback: "Excellent travail ! L'architecture est propre et la sécurité bien implémentée.",
    likes: 42,
    comments: [
      {
        id: 1,
        username: "code_warrior",
        content: "Impressionnant ! J'apprends beaucoup de ton code.",
        createdAt: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 2,
        username: "tech_guru",
        content: "La gestion des erreurs est très bien faite.",
        createdAt: new Date(Date.now() - 7200000).toISOString()
      }
    ],
    isLikedByCurrentUser: false,
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 2,
    challengeId: 2,
    challenge: {
      id: 2,
      title: "Architecture Hexagonale avec Spring Boot",
      description: "Implémente une architecture hexagonale (ports & adapters) avec des tests unitaires et d'intégration.",
      language: "Java • Spring Boot",
      difficulty: "AVANCÉ",
      duration: "5-8h",
      points: 800
    },
    userId: 2,
    user: {
      id: 2,
      username: "clean_coder",
      avatarUrl: "",
      points: 3120
    },
    repositoryUrl: "https://github.com/clean_coder/hexagonal-arch",
    score: 88,
    feedback: "Bonne séparation des couches. Quelques améliorations sur les tests à prévoir.",
    likes: 27,
    comments: [
      {
        id: 3,
        username: "architect_dev",
        content: "Très belle implémentation du DDD !",
        createdAt: new Date(Date.now() - 18000000).toISOString()
      }
    ],
    isLikedByCurrentUser: true,
    createdAt: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: 3,
    challengeId: 3,
    challenge: {
      id: 3,
      title: "API Asynchrone avec .NET 8",
      description: "Crée une API performante avec async/await, pattern Repository et caching Redis.",
      language: "C# • .NET 8",
      difficulty: "AVANCÉ",
      duration: "4-6h",
      points: 600
    },
    userId: 3,
    user: {
      id: 3,
      username: "dotnet_expert",
      avatarUrl: "",
      points: 1890
    },
    repositoryUrl: "https://github.com/dotnet_expert/async-api",
    score: 96,
    feedback: "Performance exceptionnelle ! Le caching est parfaitement implémenté.",
    likes: 56,
    comments: [
      {
        id: 4,
        username: "performance_nerd",
        content: "Les temps de réponse sont incroyables !",
        createdAt: new Date(Date.now() - 43200000).toISOString()
      },
      {
        id: 5,
        username: "csharp_master",
        content: "Excellente gestion des deadlocks.",
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ],
    isLikedByCurrentUser: false,
    createdAt: new Date(Date.now() - 259200000).toISOString()
  },
  {
    id: 4,
    challengeId: 4,
    challenge: {
      id: 4,
      title: "API REST avec Laravel et Passport",
      description: "Développe une API REST avec Laravel, authentication OAuth2 avec Passport et documentation Swagger.",
      language: "PHP • Laravel",
      difficulty: "INTERMÉDIAIRE",
      duration: "3-5h",
      points: 450
    },
    userId: 4,
    user: {
      id: 4,
      username: "php_artisan",
      avatarUrl: "",
      points: 1670
    },
    repositoryUrl: "https://github.com/php_artisan/laravel-api",
    score: 82,
    feedback: "Bon travail ! Pense à ajouter plus de tests unitaires.",
    likes: 18,
    comments: [],
    isLikedByCurrentUser: false,
    createdAt: new Date(Date.now() - 345600000).toISOString()
  },
  {
    id: 5,
    challengeId: 5,
    challenge: {
      id: 5,
      title: "Application FullStack avec React et Node.js",
      description: "Crée une application fullstack avec React, Node.js, Express et MongoDB.",
      language: "JavaScript • MERN",
      difficulty: "DÉBUTANT",
      duration: "6-8h",
      points: 400
    },
    userId: 5,
    user: {
      id: 5,
      username: "react_enthusiast",
      avatarUrl: "",
      points: 920
    },
    repositoryUrl: "https://github.com/react_enthusiast/mern-app",
    score: 76,
    feedback: "Bon début ! Travaille sur la gestion d'état avec Redux.",
    likes: 12,
    comments: [],
    isLikedByCurrentUser: false,
    createdAt: new Date(Date.now() - 432000000).toISOString()
  }
]

// Génère 15 éléments mockés supplémentaires pour le scroll infini
const generateMoreSubmissions = (startId: number, count: number): ChallengeSubmission[] => {
  const languages = ["Java • Spring Boot", "PHP • Laravel", "C# • .NET 8", "Python • Django", "Go • Gin", "Rust • Actix"]
  const difficulties = ["DÉBUTANT", "INTERMÉDIAIRE", "AVANCÉ"]
  const usernames = ["code_ninja", "bug_hunter", "refactor_master", "algo_wizard", "dev_hero", "tech_legend"]
  const titles = [
    "Microservices avec Docker", "GraphQL API", "WebSocket Real-time", "Cache Redis", "Message Queue RabbitMQ",
    "CI/CD Pipeline", "Security Best Practices", "Database Optimization", "RESTful API Design", "Unit Testing Mastery"
  ]
  
  return Array.from({ length: count }, (_, i) => ({
    id: startId + i,
    challengeId: startId + i,
    challenge: {
      id: startId + i,
      title: titles[i % titles.length],
      description: `Challenge complet sur ${titles[i % titles.length].toLowerCase()} avec des bonnes pratiques et tests unitaires.`,
      language: languages[i % languages.length],
      difficulty: difficulties[i % difficulties.length],
      duration: `${3 + (i % 5)}-${5 + (i % 4)}h`,
      points: 300 + (i % 5) * 100
    },
    userId: 100 + i,
    user: {
      id: 100 + i,
      username: usernames[i % usernames.length],
      avatarUrl: "",
      points: 1000 + (i % 10) * 200
    },
    repositoryUrl: `https://github.com/${usernames[i % usernames.length]}/project-${i}`,
    score: 65 + (i % 35),
    feedback: "Bon travail, continue comme ça !",
    likes: 5 + (i % 50),
    comments: i % 3 === 0 ? [{
      id: i,
      username: usernames[(i + 1) % usernames.length],
      content: "Super projet !",
      createdAt: new Date(Date.now() - (i * 3600000)).toISOString()
    }] : [],
    isLikedByCurrentUser: i % 4 === 0,
    createdAt: new Date(Date.now() - (i * 86400000)).toISOString()
  }))
}

export default function HomePage() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuthStore()
  const [submissions, setSubmissions] = useState<ChallengeSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [likingSubmissionId, setLikingSubmissionId] = useState<number | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const lastElementRef = useRef<HTMLDivElement | null>(null)

  // Vérifier l'authentification
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  // Charger les submissions (mockées)
  const fetchSubmissions = useCallback(async (pageNum: number) => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Simuler le chargement de 5 éléments par page
    const pageSize = 5
    const allMockSubmissions = [...mockSubmissions, ...generateMoreSubmissions(100, 50)]
    const start = pageNum * pageSize
    const end = start + pageSize
    const newSubmissions = allMockSubmissions.slice(start, end)
    
    setSubmissions(prev => pageNum === 0 ? newSubmissions : [...prev, ...newSubmissions])
    setHasMore(end < allMockSubmissions.length)
    setPage(pageNum)
    setLoading(false)
    setLoadingMore(false)
  }, [])

  // Initial load
  useEffect(() => {
    fetchSubmissions(0)
  }, [fetchSubmissions])

  // Infinite scroll
  useEffect(() => {
    if (loadingMore || !hasMore) return
    
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          setLoadingMore(true)
          fetchSubmissions(page + 1)
        }
      },
      { threshold: 0.5 }
    )
    
    if (lastElementRef.current) {
      observerRef.current.observe(lastElementRef.current)
    }
    
    return () => observerRef.current?.disconnect()
  }, [hasMore, loadingMore, page, fetchSubmissions])

  const handleLike = async (submissionId: number) => {
    setLikingSubmissionId(submissionId)
    // Simuler un appel API
    await new Promise(resolve => setTimeout(resolve, 300))
    
    setSubmissions(prev => prev.map(sub => 
      sub.id === submissionId 
        ? { 
            ...sub, 
            likes: sub.isLikedByCurrentUser ? sub.likes - 1 : sub.likes + 1,
            isLikedByCurrentUser: !sub.isLikedByCurrentUser
          }
        : sub
    ))
    setLikingSubmissionId(null)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'DÉBUTANT': return 'text-[#27C93F] border-[#27C93F]/30'
      case 'INTERMÉDIAIRE': return 'text-[#E8C547] border-[#E8C547]/30'
      case 'AVANCÉ': return 'text-[#FF6B6B] border-[#FF6B6B]/30'
      default: return 'text-[#666] border-[#666]/30'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000 / 60)
    
    if (diff < 60) return `il y a ${diff} min`
    if (diff < 1440) return `il y a ${Math.floor(diff / 60)}h`
    if (diff < 43200) return `il y a ${Math.floor(diff / 1440)}j`
    return `le ${date.toLocaleDateString()}`
  }

  const handleShare = async (submission: ChallengeSubmission) => {
    const shareText = `🔥 Découvrez mon challenge "${submission.challenge.title}" sur DevReview ! Score: ${submission.score}%`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'DevReview - Challenge',
          text: shareText,
          url: submission.repositoryUrl
        })
      } catch (err) {
        console.log('Partage annulé')
      }
    } else {
      // Fallback: copier dans le presse-papier
      await navigator.clipboard.writeText(`${shareText}\n${submission.repositoryUrl}`)
      alert('Lien copié dans le presse-papier !')
    }
  }

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <div className="min-h-screen bg-[#1A1919] text-[#F2E9E2]">
      <div className="max-w-3xl mx-auto px-4 py-8 pt-20">
        
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex border-l-4 border-[#D64933] pl-4 py-1 mb-4">
            <span className="text-[#E8C547] text-xs font-mono font-bold tracking-[2px]">
              FEED SOCIAL
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-[-2px]">
            DERNIERS <span className="text-[#D64933]">CHALLENGES</span>
          </h1>
          <p className="text-[#B8B0A0] font-mono text-sm mt-2 flex items-center gap-2">
            <Users className="h-4 w-4" />
            {submissions.length} réalisations partagées par la communauté
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-[#0F0E0E] border-l-4 border-[#D64933] p-3">
            <div className="text-2xl font-black text-[#D64933]">128</div>
            <div className="text-[10px] font-mono text-[#666]">CHALLENGES COMPLÉTÉS</div>
          </div>
          <div className="bg-[#0F0E0E] border-l-4 border-[#E8C547] p-3">
            <div className="text-2xl font-black text-[#E8C547]">45</div>
            <div className="text-[10px] font-mono text-[#666]">DÉVELOPPEURS ACTIFS</div>
          </div>
          <div className="bg-[#0F0E0E] border-l-4 border-[#4ECDC4] p-3">
            <div className="text-2xl font-black text-[#4ECDC4]">892</div>
            <div className="text-[10px] font-mono text-[#666]">LIKES DONNÉS</div>
          </div>
        </div>

        {/* Feed */}
        <div className="space-y-6">
          {submissions.map((submission, index) => (
            <div
              key={submission.id}
              ref={index === submissions.length - 1 ? lastElementRef : null}
              className="bg-[#0F0E0E] border-l-4 border-[#D64933] hover:translate-x-1 transition-all duration-300"
            >
              {/* Header - User Info */}
              <div className="p-5 pb-3">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D64933]/20 to-[#D64933]/5 border border-[#D64933] flex items-center justify-center">
                      <span className="text-[#D64933] font-mono font-bold text-lg">
                        {submission.user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <Link 
                        href={`/profile/${submission.user.id}`}
                        className="font-mono font-bold text-[#F2E9E2] hover:text-[#D64933] transition-colors"
                      >
                        {submission.user.username}
                      </Link>
                      <div className="flex items-center gap-2 text-xs font-mono text-[#666]">
                        <Clock className="h-3 w-3" />
                        <span>{formatDate(submission.createdAt)}</span>
                        <span className="text-[#444]">•</span>
                        <span className="flex items-center gap-1">
                          <Zap className="h-3 w-3" />
                          {submission.user.points} pts
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className={`text-xs font-mono px-2 py-1 border ${getDifficultyColor(submission.challenge.difficulty)}`}>
                    {submission.challenge.difficulty}
                  </div>
                </div>

                {/* Challenge Info */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Code className="h-4 w-4 text-[#D64933]" />
                    <span className="text-xs font-mono text-[#D64933]">{submission.challenge.language}</span>
                    <Shield className="h-3 w-3 text-[#666] ml-2" />
                    <span className="text-[10px] font-mono text-[#666]">{submission.challenge.duration}</span>
                  </div>
                  <Link 
                    href={`/challenges/${submission.challengeId}`}
                    className="text-xl font-bold hover:text-[#D64933] transition-colors"
                  >
                    {submission.challenge.title}
                  </Link>
                  <p className="text-[#B8B0A0] font-mono text-sm mt-2 line-clamp-2">
                    {submission.challenge.description}
                  </p>
                </div>

                {/* Score & Stats */}
                <div className="flex items-center gap-4 mb-4 pb-3 border-b border-[#333]">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-[#E8C547]" />
                    <span className="text-sm font-mono text-[#F2E9E2] font-bold">{submission.score}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <GitBranch className="h-4 w-4 text-[#666]" />
                    <a 
                      href={submission.repositoryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-[#666] hover:text-[#D64933] transition-colors"
                    >
                      Voir le repo
                    </a>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-6">
                  <button
                    onClick={() => handleLike(submission.id)}
                    disabled={likingSubmissionId === submission.id}
                    className={`flex items-center gap-2 text-sm font-mono transition-all duration-300
                      ${submission.isLikedByCurrentUser 
                        ? 'text-[#FF6B6B]' 
                        : 'text-[#666] hover:text-[#FF6B6B]'
                      } ${likingSubmissionId === submission.id ? 'opacity-50' : ''}`}
                  >
                    <Heart className={`h-5 w-5 ${submission.isLikedByCurrentUser ? 'fill-[#FF6B6B]' : ''}`} />
                    <span>{submission.likes}</span>
                  </button>
                  <button className="flex items-center gap-2 text-sm font-mono text-[#666] hover:text-[#4ECDC4] transition-colors">
                    <MessageCircle className="h-5 w-5" />
                    <span>{submission.comments?.length || 0}</span>
                  </button>
                  <button 
                    onClick={() => handleShare(submission)}
                    className="flex items-center gap-2 text-sm font-mono text-[#666] hover:text-[#E8C547] transition-colors"
                  >
                    <Share2 className="h-5 w-5" />
                    <span>Partager</span>
                  </button>
                </div>

                {/* Comments preview */}
                {submission.comments && submission.comments.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-[#333]">
                    <div className="flex items-center gap-2 text-xs font-mono text-[#666] mb-2">
                      <MessageCircle className="h-3 w-3" />
                      <span>{submission.comments.length} commentaire(s)</span>
                    </div>
                    <div className="space-y-2">
                      {submission.comments.slice(0, 2).map((comment) => (
                        <div key={comment.id} className="flex items-start gap-2">
                          <span className="text-xs font-mono text-[#D64933]">{comment.username}</span>
                          <span className="text-xs font-mono text-[#B8B0A0]">{comment.content}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Loading more indicator */}
          {loadingMore && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 text-[#D64933] animate-spin" />
              <span className="ml-2 text-xs font-mono text-[#666]">CHARGEMENT...</span>
            </div>
          )}

          {/* No more posts */}
          {!hasMore && submissions.length > 0 && (
            <div className="text-center py-8">
              <Terminal className="h-8 w-8 text-[#666] mx-auto mb-2" />
              <p className="text-xs font-mono text-[#666]">
                C'EST TOUT POUR L'INSTANT — REVIENS PLUS TARD
              </p>
            </div>
          )}

          {/* Empty state */}
          {submissions.length === 0 && !loading && (
            <div className="text-center py-16 bg-[#0F0E0E] border-l-4 border-[#D64933]">
              <Code className="h-12 w-12 text-[#666] mx-auto mb-4" />
              <p className="text-[#B8B0A0] font-mono">Aucun challenge partagé pour le moment</p>
              <Link href="/challenges">
                <Button className="mt-4 bg-[#D64933] hover:bg-[#B33A22] text-[#1A1919]">
                  COMMENCER UN CHALLENGE
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
