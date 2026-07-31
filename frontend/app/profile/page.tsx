'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/lib/store/authStore'
import { usersApi, UserProfile } from '@/lib/users'
import { submissionsApi } from '@/lib/submissions'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { 
  User as UserIcon, 
  Mail, 
  Crown, 
  ShieldCheck, 
  CalendarDays,
  LayoutDashboard,
  ArrowLeft,
  Settings,
  Activity,
  Sparkles,
  Trophy,
  Target,
  Zap,
  TrendingUp,
  Award,
  Clock,
  ChevronRight,
  Brain,
  FileCheck2,
  Rocket,
  type LucideIcon
} from 'lucide-react'

interface ActivityItem {
  action: string
  detail: string
  time: string
  score?: number
  icon: LucideIcon
  color: 'emerald' | 'blue' | 'orange' | 'purple'
}

interface SubmissionActivity {
  id: number
  challengeTitle: string
  challengeSlug: string
  status: string
  score?: number
  submittedAt?: string
  reviewedAt?: string
  startedAt?: string
}

function timeAgo(dateStr?: string): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const diffMs = Date.now() - date.getTime()
  const minutes = Math.floor(diffMs / 60000)
  if (minutes < 1) return "À l'instant"
  if (minutes < 60) return `Il y a ${minutes} min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `Il y a ${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 30) return `Il y a ${days} jour${days > 1 ? 's' : ''}`
  const months = Math.floor(days / 30)
  return `Il y a ${months} mois`
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}min`
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return rest > 0 ? `${hours}h${rest}` : `${hours}h`
}

// Score Ring Component pour le niveau
function LevelRing({ level, progress }: { level: number; progress: number }) {
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className="relative flex items-center justify-center">
      <svg width="140" height="140" className="transform -rotate-90">
        <circle
          cx="70" cy="70" r={radius}
          strokeWidth="6"
          stroke="currentColor"
          className="text-[var(--border-pink)]"
          fill="transparent"
        />
        <circle
          cx="70" cy="70" r={radius}
          strokeWidth="6"
          stroke="currentColor"
          className="text-[var(--blue)] transition-all duration-1000 ease-out"
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xs font-bold uppercase tracking-widest text-[var(--gray)]">Lvl</span>
        <span className="text-5xl font-black tabular-nums text-[var(--navy)] -mt-1">{level}</span>
      </div>
    </div>
  )
}

// Styles d'animation
const customStyles = `
  @keyframes slideIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
  .animate-slide-in { animation: slideIn 0.5s ease-out forwards; }
  .animate-scale-in { animation: scaleIn 0.4s ease-out forwards; }
`

export default function ProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [activity, setActivity] = useState<ActivityItem[]>([])
  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsVisible(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  useEffect(() => {
    const loadData = async () => {
      if (!isAuthenticated) return
      try {
        const [prof, submissions] = await Promise.all([
          usersApi.getMyProfile(),
          submissionsApi.getMyActivity(),
        ])
        setProfile(prof)

        const items: ActivityItem[] = (submissions as unknown as SubmissionActivity[])
          .slice()
          .sort((a, b) => {
            const ta = new Date(b.reviewedAt || b.submittedAt || b.startedAt || 0).getTime()
            const tb = new Date(a.reviewedAt || a.submittedAt || a.startedAt || 0).getTime()
            return ta - tb
          })
          .slice(0, 5)
          .map((s) => {
            const status = s.status
            if (status === 'REVIEWED') {
              return {
                action: 'Défi complété',
                detail: s.challengeTitle,
                time: timeAgo(s.reviewedAt || s.submittedAt),
                score: s.score,
                icon: Trophy,
                color: 'emerald' as const,
              }
            }
            if (status === 'SUBMITTED') {
              return {
                action: 'Challenge soumis',
                detail: s.challengeTitle,
                time: timeAgo(s.submittedAt),
                icon: Rocket,
                color: 'blue' as const,
              }
            }
            return {
              action: 'Challenge démarré',
              detail: s.challengeTitle,
              time: timeAgo(s.startedAt),
              icon: FileCheck2,
              color: 'orange' as const,
            }
          })
        setActivity(items)
      } catch (err) {
        console.error('Erreur lors du chargement du profil:', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [isAuthenticated])

  const displayUser = profile ?? user

  if (!displayUser) {
    return (
      <div className="min-h-screen bg-[var(--cream)]">
        <div className="max-w-[1200px] mx-auto px-6 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-12 w-48 rounded-xl bg-[var(--border-pink)]" />
            <div className="h-56 rounded-2xl bg-[var(--navy)] opacity-90" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-6">
                <CardSkeleton />
                <CardSkeleton />
              </div>
              <div className="lg:col-span-2 space-y-6">
                <CardSkeleton />
                <CardSkeleton />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const joinDate = displayUser.createdAt
    ? new Date(displayUser.createdAt).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Inconnue'

  const pointsEarned = profile?.pointsEarned ?? displayUser.points ?? 0
  const userLevel = Math.floor(pointsEarned / 100) + 1
  const progressToNextLevel = pointsEarned % 100
  const pointsToNextLevel = 100 - progressToNextLevel

  const userRole = user?.role || 'USER'

  const challengesCompleted = profile?.challengesCompleted ?? 0
  const successRate = profile?.successRate ?? 0
  const totalTimeMinutes = profile?.totalTimeMinutes ?? 0
  const totalChallenges = profile?.totalChallenges ?? 0
  const analysesCount = profile?.challengesCompleted ?? 0
  const averageScore = profile?.averageScore ?? 0
  const activeDays = profile?.activeDays ?? 0

  const badges = [
    { icon: Trophy, label: "Débutant", color: "emerald", unlocked: totalChallenges >= 1 },
    { icon: Zap, label: "Rapide", color: "amber", unlocked: challengesCompleted >= 1 },
    { icon: Target, label: "Précis", color: "blue", unlocked: averageScore >= 50 },
    { icon: Crown, label: "Expert", color: "purple", unlocked: challengesCompleted >= 5 },
    { icon: Award, label: "Maître", color: "orange", unlocked: challengesCompleted >= 10 },
    { icon: ShieldCheck, label: "Vétéran", color: "indigo", unlocked: activeDays >= 30 },
  ]

  const heroStats = [
    { icon: Target, label: "Défis complétés", value: String(challengesCompleted), color: "emerald", trend: `${totalChallenges} au total` },
    { icon: TrendingUp, label: "Taux de réussite", value: `${Math.round(successRate)}%`, color: "blue", trend: "sur tous les défis" },
    { icon: Clock, label: "Temps total", value: formatDuration(totalTimeMinutes), color: "purple", trend: "d'analyse cumulée" },
  ]

  const detailStats = [
    { label: "Défis totaux", value: String(totalChallenges), icon: Target, color: "blue" },
    { label: "Analyses IA", value: String(analysesCount), icon: Brain, color: "purple" },
    { label: "Score moyen", value: `${Math.round(averageScore)}/100`, icon: TrendingUp, color: "emerald" },
    { label: "Jours actifs", value: String(activeDays), icon: CalendarDays, color: "orange" },
  ]

  return (
    <>
      <style>{customStyles}</style>
      
      <div className="min-h-screen bg-[var(--cream)]">
        <div className="max-w-[1200px] mx-auto px-6 py-8 md:py-12">
          
          {/* Navigation Bar */}
          <div className={`flex items-center justify-between mb-8 transition-all duration-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <Link 
              href="/home" 
              className="group inline-flex items-center gap-2 rounded-full border border-[var(--border-pink)] bg-white px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-[var(--navy)] transition-all hover:border-[var(--navy)] hover:shadow-md"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Retour à l&apos;Atelier
            </Link>
            
            <button className="group inline-flex items-center gap-2 rounded-full border border-[var(--border-pink)] bg-white px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-[var(--navy)] transition-all hover:border-[var(--navy)] hover:shadow-md">
              <Settings className="h-4 w-4 transition-transform group-hover:rotate-90 duration-300" />
              Paramètres
            </button>
          </div>

          {/* Hero Profile Card */}
          <div className={`animate-scale-in relative bg-[var(--navy)] rounded-2xl p-8 md:p-12 text-white overflow-hidden transition-all duration-500 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--blue)] blur-[150px] opacity-20 -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[var(--purple)] blur-[120px] opacity-10 translate-y-1/2 -translate-x-1/4" />

            <div className="relative z-10">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="relative h-28 w-28 overflow-hidden rounded-2xl border-4 border-white/20 bg-white/10 backdrop-blur-sm shadow-2xl">
                    {displayUser.avatarUrl ? (
                      <img src={displayUser.avatarUrl} alt={displayUser.username} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[var(--blue)]">
                        <span className="text-5xl font-black text-white">
                          {displayUser.username?.[0]?.toUpperCase() || 'U'}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Badge Premium */}
                  {displayUser.isPremium && (
                    <div className="absolute -bottom-2 -right-2 rounded-lg bg-[var(--yellow)] p-1.5 shadow-lg">
                      <Crown className="h-5 w-5 text-[var(--navy)]" />
                    </div>
                  )}
                </div>

                {/* Info utilisateur */}
                <div className="flex-1">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-sm px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white border border-white/20">
                      <UserIcon className="h-3 w-3" />
                      {userRole}
                    </span>
                    {displayUser.isPremium && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--yellow)] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--navy)]">
                        <Crown className="h-3 w-3" />
                        Premium
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--blue)]/30 backdrop-blur-sm px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white border border-[var(--blue)]/50">
                      <ShieldCheck className="h-3 w-3" />
                      Vérifié
                    </span>
                  </div>
                  
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-3 break-words">
                    {displayUser.username}
                  </h1>
                  
                  <div className="flex flex-wrap items-center gap-3 text-sm text-white/60 font-medium">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 shrink-0 text-[var(--blue)]" />
                      <span className="break-all">{displayUser.email}</span>
                    </div>
                    <div className="hidden md:block h-1 w-1 rounded-md bg-white/30" />
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 shrink-0 text-[var(--blue)]" />
                      <span>Inscrit le {joinDate}</span>
                    </div>
                  </div>
                </div>

                {/* Points Card */}
                <div className="rounded-2xl bg-white/5 border border-white/15 backdrop-blur-md p-6 text-center shadow-xl min-w-[120px] md:min-w-[150px]">
                  <div className="mb-2 flex items-center justify-center gap-2">
                    <Trophy className="h-4 w-4 text-[var(--yellow)]" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-white/70">
                      Points
                    </span>
                  </div>
                  <div className="text-3xl md:text-4xl font-black tabular-nums text-white">
                    {pointsEarned}
                  </div>
                  <div className="mt-1 text-[9px] font-bold uppercase tracking-widest text-white/50">
                    Total accumulé
                  </div>
                </div>
              </div>

              {/* Stats rapides */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/10">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-20 rounded-xl bg-white/5 border border-white/10 animate-pulse" />
                  ))
                ) : (
                  heroStats.map((stat, idx) => (
                    <div 
                      key={idx}
                      className="group flex items-center justify-between rounded-xl bg-white/5 border border-white/10 p-4 transition-all hover:bg-white/10"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`rounded-lg p-2 group-hover:scale-110 transition-transform ${
                          stat.color === 'emerald' ? 'bg-emerald-500/15 text-emerald-400' :
                          stat.color === 'blue' ? 'bg-[var(--blue)]/15 text-[var(--blue)]' :
                          'bg-[var(--purple)]/15 text-[var(--purple)]'
                        }`}>
                          <stat.icon className="h-4 w-4 md:h-5 md:w-5" />
                        </div>
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-wider text-white/50">
                            {stat.label}
                          </p>
                          <p className="text-xl md:text-2xl font-black tabular-nums text-white">
                            {stat.value}
                          </p>
                        </div>
                      </div>
                      <span className="rounded-full bg-white/10 px-2.5 py-1 text-[9px] font-bold text-white/70">
                        {stat.trend}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            
            {/* Colonne gauche - Niveau et Progression */}
            <div className={`lg:col-span-1 space-y-6 transition-all duration-500 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              
              {/* Level Card */}
              <div className="bg-white border border-[var(--border-pink)] rounded-xl sm:rounded-2xl p-6 hover:shadow-xl transition-all">
                <h3 className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[var(--gray)]">
                  <Award className="h-4 w-4 text-[var(--blue)]" />
                  Niveau & Progression
                </h3>
                
                <div className="flex justify-center">
                  <LevelRing level={userLevel} progress={progressToNextLevel} />
                </div>
                
                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--gray)]">
                      Progression Niveau {userLevel + 1}
                    </span>
                    <span className="text-sm font-bold text-[var(--blue)]">
                      {progressToNextLevel}%
                    </span>
                  </div>
                  
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--border-pink)]">
                    <div 
                      className="h-full bg-gradient-to-r from-[var(--blue)] to-[var(--purple)] transition-all duration-1000"
                      style={{ width: `${progressToNextLevel}%` }}
                    />
                  </div>
                  
                  <p className="text-center text-[10px] font-bold text-[var(--gray)]">
                    Plus que <span className="text-[var(--navy)]">{pointsToNextLevel} points</span> pour le niveau {userLevel + 1}
                  </p>
                </div>

                {!displayUser.isPremium && (
                  <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[var(--yellow)] px-6 py-3 text-[10px] font-extrabold uppercase tracking-wider text-[var(--navy)] shadow-lg shadow-[var(--yellow)]/20 transition-all hover:brightness-105">
                    <Crown className="h-4 w-4" />
                    Passer Premium
                    <ChevronRight className="h-3 w-3" />
                  </button>
                )}
              </div>

              {/* Badges Card */}
              <div className="bg-white border border-[var(--border-pink)] rounded-xl sm:rounded-2xl p-6 hover:shadow-xl transition-all">
                <h3 className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[var(--gray)]">
                  <Sparkles className="h-4 w-4 text-[var(--orange)]" />
                  Badges débloqués
                </h3>
                
                <div className="grid grid-cols-3 gap-3">
                  {badges.map((badge, idx) => (
                    <div 
                      key={idx}
                      className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 transition-all ${
                        badge.unlocked 
                          ? badge.color === 'emerald' ? 'border-emerald-200 bg-emerald-50/50' :
                            badge.color === 'amber' ? 'border-amber-200 bg-amber-50/50' :
                            badge.color === 'blue' ? 'border-[var(--blue)]/20 bg-[var(--blue)]/5' :
                            badge.color === 'purple' ? 'border-[var(--purple)]/20 bg-[var(--purple)]/5' :
                            badge.color === 'orange' ? 'border-[var(--orange)]/20 bg-[var(--orange)]/5' :
                            'border-indigo-200 bg-indigo-50/50'
                          : 'border-[var(--border-pink)] bg-[var(--cream)] opacity-50 grayscale'
                      }`}
                    >
                      <badge.icon className={`h-5 w-5 md:h-6 md:w-6 ${
                        badge.unlocked 
                          ? badge.color === 'emerald' ? 'text-emerald-500' :
                            badge.color === 'amber' ? 'text-amber-500' :
                            badge.color === 'blue' ? 'text-[var(--blue)]' :
                            badge.color === 'purple' ? 'text-[var(--purple)]' :
                            badge.color === 'orange' ? 'text-[var(--orange)]' :
                            'text-indigo-500'
                          : 'text-[var(--gray)]'
                      }`} />
                      <span className={`text-[8px] font-bold uppercase tracking-wider text-center ${
                        badge.unlocked 
                          ? badge.color === 'emerald' ? 'text-emerald-600' :
                            badge.color === 'amber' ? 'text-amber-600' :
                            badge.color === 'blue' ? 'text-[var(--blue)]' :
                            badge.color === 'purple' ? 'text-[var(--purple)]' :
                            badge.color === 'orange' ? 'text-[var(--orange)]' :
                            'text-indigo-500'
                          : 'text-[var(--gray)]'
                      }`}>
                        {badge.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Colonne droite - Activité et Stats */}
            <div className={`lg:col-span-2 space-y-6 transition-all duration-500 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              
              {/* Activité Récente */}
              <div className="bg-white border border-[var(--border-pink)] rounded-xl sm:rounded-2xl p-6 hover:shadow-xl transition-all">
                <h3 className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[var(--gray)]">
                  <Activity className="h-4 w-4 text-emerald-500" />
                  Activité Récente
                </h3>
                
                <div className="space-y-3">
                  {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="h-16 rounded-xl bg-[var(--cream)] border border-[var(--border-pink)] animate-pulse" />
                    ))
                  ) : activity.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-[var(--border-pink)] p-8 text-center">
                      <Activity className="h-6 w-6 text-[var(--border-pink)] mx-auto mb-3" />
                      <p className="text-[11px] font-bold text-[var(--gray)]">
                        Aucune activité pour le moment. Lancez un défi !
                      </p>
                    </div>
                  ) : (
                    activity.map((act, idx) => (
                      <div 
                        key={idx}
                        className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-[var(--border-pink)] bg-[var(--cream)] p-4 transition-all hover:border-[var(--navy)]/20 hover:shadow-md gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`rounded-lg p-2 ${
                            act.color === 'emerald' ? 'bg-emerald-50 text-emerald-500' :
                            act.color === 'blue' ? 'bg-[var(--blue)]/10 text-[var(--blue)]' :
                            act.color === 'purple' ? 'bg-[var(--purple)]/10 text-[var(--purple)]' :
                            'bg-[var(--orange)]/10 text-[var(--orange)]'
                          }`}>
                            <act.icon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[var(--navy)]">{act.action}</p>
                            <p className="text-[10px] font-bold text-[var(--gray)]">{act.detail}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end sm:text-right gap-4">
                          {act.score != null && (
                            <p className="text-sm font-extrabold text-emerald-600">{act.score}/100</p>
                          )}
                          <p className="text-[10px] font-bold text-[var(--gray)]">{act.time}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Statistiques Détaillées */}
              <div className="bg-white border border-[var(--border-pink)] rounded-xl sm:rounded-2xl p-6 hover:shadow-xl transition-all">
                <h3 className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[var(--gray)]">
                  <LayoutDashboard className="h-4 w-4 text-[var(--purple)]" />
                  Statistiques Détaillées
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  {isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="h-24 rounded-xl bg-[var(--cream)] border border-[var(--border-pink)] animate-pulse" />
                    ))
                  ) : (
                    detailStats.map((stat, idx) => (
                      <div key={idx} className="rounded-xl border border-[var(--border-pink)] bg-[var(--cream)] p-4 transition-all hover:shadow-md">
                        <div className="mb-2 flex items-center gap-2">
                          <stat.icon className={`h-4 w-4 ${
                            stat.color === 'blue' ? 'text-[var(--blue)]' :
                            stat.color === 'purple' ? 'text-[var(--purple)]' :
                            stat.color === 'emerald' ? 'text-emerald-500' :
                            'text-[var(--orange)]'
                          }`} />
                          <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--gray)]">
                            {stat.label}
                          </span>
                        </div>
                        <p className="text-2xl md:text-3xl font-black tabular-nums text-[var(--navy)]">{stat.value}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Message de statut */}
                <div className="mt-6 rounded-xl border border-[var(--blue)]/15 bg-[var(--blue)]/5 p-5">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="h-5 w-5 text-[var(--blue)] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-[var(--navy)]">Compte sécurisé et actif</p>
                      <p className="mt-1 text-[11px] font-bold text-[var(--gray)]">
                        Votre compte est en règle. Continuez à relever des défis pour débloquer plus de récompenses !
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
