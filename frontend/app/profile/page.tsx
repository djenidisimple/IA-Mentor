'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/lib/store/authStore'
import Skeleton, { CardSkeleton, FormSkeleton } from '@/components/ui/Skeleton'
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
  Brain
} from 'lucide-react'

export default function ProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    setIsVisible(true)
  }, [])

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-8 md:py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-12 w-48 rounded-xl bg-slate-200" />
            <div className="rounded-3xl border border-slate-200 bg-white p-8">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="h-28 w-28 rounded-2xl bg-slate-200" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 w-32 rounded bg-slate-200" />
                  <div className="h-8 w-64 rounded bg-slate-200" />
                  <div className="h-4 w-48 rounded bg-slate-200" />
                </div>
                <div className="h-32 w-36 rounded-2xl bg-slate-200" />
              </div>
            </div>
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

  const joinDate = user.createdAt 
    ? new Date(user.createdAt).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Inconnue'

  const userLevel = Math.floor((user.points || 0) / 100) + 1
  const progressToNextLevel = ((user.points || 0) % 100)
  const pointsToNextLevel = 100 - progressToNextLevel

  // Score Ring Component pour le niveau
  const LevelRing = ({ level, progress }: { level: number, progress: number }) => {
    const radius = 54
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (progress / 100) * circumference

    return (
      <div className="relative flex items-center justify-center">
        <svg width="140" height="140" className="transform -rotate-90">
          <circle
            cx="70" cy="70" r={radius}
            strokeWidth="5"
            stroke="currentColor"
            className="text-slate-100"
            fill="transparent"
          />
          <circle
            cx="70" cy="70" r={radius}
            strokeWidth="5"
            stroke="currentColor"
            className="text-blue-500 transition-all duration-1000 ease-out"
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black tabular-nums text-blue-600">Lvl</span>
          <span className="text-5xl font-black tabular-nums text-blue-600 -mt-1">{level}</span>
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
    @keyframes shimmer {
      0% { background-position: -1000px 0; }
      100% { background-position: 1000px 0; }
    }
    .animate-slide-in {
      animation: slideIn 0.5s ease-out forwards;
    }
    .animate-scale-in {
      animation: scaleIn 0.4s ease-out forwards;
    }
    .shimmer {
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent);
      background-size: 1000px 100%;
      animation: shimmer 3s infinite;
    }
  `

  return (
    <>
      <style>{customStyles}</style>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-8 md:py-12">
          
          {/* Navigation Bar - Design premium */}
          <div className={`flex items-center justify-between mb-8 transition-all duration-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <Link 
              href="/home" 
              className="group flex items-center gap-2 rounded-xl border border-slate-200 bg-white/80 backdrop-blur-sm px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm transition-all hover:border-slate-300 hover:bg-white hover:shadow-md"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider">Retour à l&apos;Atelier</span>
            </Link>
            
            <button className="group flex items-center gap-2 rounded-xl border border-slate-200 bg-white/80 backdrop-blur-sm px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm transition-all hover:border-slate-300 hover:bg-white hover:shadow-md">
              <Settings className="h-4 w-4 transition-transform group-hover:rotate-90 duration-300" />
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider">Paramètres</span>
            </button>
          </div>

          {/* Hero Profile Card */}
          <div className={`animate-scale-in mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/20 transition-all duration-500 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}>
            
            {/* Header avec gradient */}
            <div className="relative bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 px-6 md:px-8 py-6">
              <div className="absolute inset-0 opacity-10">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>
              
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="relative h-28 w-28 overflow-hidden rounded-2xl border-4 border-white/30 bg-white/10 backdrop-blur-sm shadow-2xl">
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.username} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-400 to-indigo-500">
                        <span className="text-5xl font-black text-white">
                          {user.username?.[0]?.toUpperCase() || 'U'}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Badge Premium */}
                  {user.isPremium && (
                    <div className="absolute -bottom-2 -right-2 rounded-md bg-gradient-to-r from-amber-400 to-yellow-500 p-1.5 shadow-lg">
                      <Crown className="h-5 w-5 text-white" />
                    </div>
                  )}
                </div>

                {/* Info utilisateur */}
                <div className="flex-1 text-white">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-white/20 backdrop-blur-sm px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white border border-white/30">
                      <UserIcon className="h-3 w-3" />
                      {user.role}
                    </span>
                    {user.isPremium && (
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-400/30 backdrop-blur-sm px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white border border-amber-300/50">
                        <Crown className="h-3 w-3" />
                        Premium
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-400/30 backdrop-blur-sm px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white border border-emerald-300/50">
                      <ShieldCheck className="h-3 w-3" />
                      Vérifié
                    </span>
                  </div>
                  
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter text-white mb-3 break-words">
                    {user.username}
                  </h1>
                  
                  <div className="flex flex-wrap items-center gap-3 text-sm text-white/80">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 shrink-0" />
                      <span className="break-all">{user.email}</span>
                    </div>
                    <div className="hidden md:block h-1 w-1 rounded-md bg-white/40" />
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 shrink-0" />
                      <span>Inscrit le {joinDate}</span>
                    </div>
                  </div>
                </div>

                {/* Points Card */}
                <div className="rounded-2xl bg-white/15 backdrop-blur-md p-5 md:p-6 text-center border border-white/30 shadow-xl min-w-[120px] md:min-w-[140px]">
                  <div className="mb-2 flex items-center justify-center gap-2">
                    <Trophy className="h-4 w-4 text-yellow-300" />
                    <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-white/90">
                      Points
                    </span>
                  </div>
                  <div className="text-3xl md:text-4xl font-black tabular-nums text-white">
                    {user.points || 0}
                  </div>
                  <div className="mt-1 font-mono text-[10px] text-white/70">
                    Total accumulé
                  </div>
                </div>
              </div>
            </div>

            {/* Stats rapides */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 p-4 md:p-6 bg-slate-50/50">
              {[
                { 
                  icon: Target, 
                  label: "Défis complétés", 
                  value: "12", 
                  color: "emerald",
                  trend: "+3 ce mois"
                },
                { 
                  icon: TrendingUp, 
                  label: "Taux de réussite", 
                  value: "94%", 
                  color: "blue",
                  trend: "Top 10%"
                },
                { 
                  icon: Clock, 
                  label: "Temps total", 
                  value: "48h", 
                  color: "purple",
                  trend: "Cette année"
                },
              ].map((stat, idx) => (
                <div 
                  key={idx}
                  className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 md:p-4 shadow-sm transition-all hover:shadow-md"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className={`rounded-lg p-2 group-hover:scale-110 transition-transform ${
                      stat.color === 'emerald' ? 'bg-emerald-50' :
                      stat.color === 'blue' ? 'bg-blue-50' :
                      'bg-purple-50'
                    }`}>
                      <stat.icon className={`h-4 w-4 md:h-5 md:w-5 ${
                        stat.color === 'emerald' ? 'text-emerald-500' :
                        stat.color === 'blue' ? 'text-blue-500' :
                        'text-purple-500'
                      }`} />
                    </div>
                    <div>
                      <p className="font-mono text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        {stat.label}
                      </p>
                      <p className="text-xl md:text-2xl font-black tabular-nums text-slate-800">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 md:px-2.5 md:py-1 font-mono text-[8px] md:text-[9px] font-medium text-slate-600">
                    {stat.trend}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Colonne gauche - Niveau et Progression */}
            <div className={`lg:col-span-1 space-y-6 transition-all duration-500 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              
              {/* Level Card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-lg shadow-slate-200/20">
                <h3 className="mb-4 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-slate-600">
                  <Award className="h-4 w-4 text-blue-500" />
                  Niveau & Progression
                </h3>
                
                <div className="flex justify-center">
                  <LevelRing level={userLevel} progress={progressToNextLevel} />
                </div>
                
                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] md:text-[11px] font-medium text-slate-600">
                      Progression Niveau {userLevel + 1}
                    </span>
                    <span className="font-mono text-sm font-bold text-blue-600">
                      {progressToNextLevel}%
                    </span>
                  </div>
                  
                  <div className="h-2 w-full overflow-hidden rounded-md bg-slate-100">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-1000"
                      style={{ width: `${progressToNextLevel}%` }}
                    />
                  </div>
                  
                  <p className="text-center font-mono text-[10px] md:text-[11px] text-slate-500">
                    Plus que <span className="font-bold text-slate-700">{pointsToNextLevel} points</span> pour le niveau {userLevel + 1}
                  </p>
                </div>

                {!user.isPremium && (
                  <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 p-3 font-mono text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] hover:shadow-amber-500/30">
                    <Crown className="h-4 w-4" />
                    Passer Premium
                    <ChevronRight className="h-3 w-3" />
                  </button>
                )}
              </div>

              {/* Badges Card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-lg shadow-slate-200/20">
                <h3 className="mb-4 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-slate-600">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  Badges débloqués
                </h3>
                
                <div className="grid grid-cols-3 gap-2 md:gap-3">
                  {[
                    { icon: Trophy, label: "Débutant", color: "emerald", unlocked: true },
                    { icon: Zap, label: "Rapide", color: "amber", unlocked: true },
                    { icon: Target, label: "Précis", color: "blue", unlocked: true },
                    { icon: Crown, label: "Expert", color: "purple", unlocked: false },
                    { icon: Award, label: "Maître", color: "rose", unlocked: false },
                    { icon: ShieldCheck, label: "Vétéran", color: "indigo", unlocked: false },
                  ].map((badge, idx) => (
                    <div 
                      key={idx}
                      className={`flex flex-col items-center gap-1 rounded-xl border p-2 md:p-3 transition-all ${
                        badge.unlocked 
                          ? badge.color === 'emerald' ? 'border-emerald-200 bg-emerald-50/50' :
                            badge.color === 'amber' ? 'border-amber-200 bg-amber-50/50' :
                            badge.color === 'blue' ? 'border-blue-200 bg-blue-50/50' :
                            badge.color === 'purple' ? 'border-purple-200 bg-purple-50/50' :
                            badge.color === 'rose' ? 'border-rose-200 bg-rose-50/50' :
                            'border-indigo-200 bg-indigo-50/50'
                          : 'border-slate-200 bg-slate-50 opacity-50 grayscale'
                      }`}
                    >
                      <badge.icon className={`h-5 w-5 md:h-6 md:w-6 ${
                        badge.unlocked 
                          ? badge.color === 'emerald' ? 'text-emerald-500' :
                            badge.color === 'amber' ? 'text-amber-500' :
                            badge.color === 'blue' ? 'text-blue-500' :
                            badge.color === 'purple' ? 'text-purple-500' :
                            badge.color === 'rose' ? 'text-rose-500' :
                            'text-indigo-500'
                          : 'text-slate-400'
                      }`} />
                      <span className={`font-mono text-[8px] md:text-[9px] font-bold uppercase text-center ${
                        badge.unlocked 
                          ? badge.color === 'emerald' ? 'text-emerald-600' :
                            badge.color === 'amber' ? 'text-amber-600' :
                            badge.color === 'blue' ? 'text-blue-600' :
                            badge.color === 'purple' ? 'text-purple-600' :
                            badge.color === 'rose' ? 'text-rose-600' :
                            'text-indigo-600'
                          : 'text-slate-400'
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
              <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-lg shadow-slate-200/20">
                <h3 className="mb-4 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-slate-600">
                  <Activity className="h-4 w-4 text-emerald-500" />
                  Activité Récente
                </h3>
                
                <div className="space-y-3">
                  {[
                    { 
                      action: "Défi complété", 
                      detail: "Algorithmes Avancés", 
                      time: "Il y a 2h",
                      points: 150,
                      icon: Trophy,
                      color: "emerald"
                    },
                    { 
                      action: "Analyse IA terminée", 
                      detail: "Projet React Dashboard", 
                      time: "Hier",
                      points: 75,
                      icon: Brain,
                      color: "blue"
                    },
                    { 
                      action: "Badge débloqué", 
                      detail: "Code Rapide", 
                      time: "Il y a 2 jours",
                      points: 50,
                      icon: Award,
                      color: "amber"
                    },
                  ].map((activity, idx) => (
                    <div 
                      key={idx}
                      className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-3 md:p-4 transition-all hover:bg-slate-50 gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`rounded-lg p-2 ${
                          activity.color === 'emerald' ? 'bg-emerald-50' :
                          activity.color === 'blue' ? 'bg-blue-50' :
                          'bg-amber-50'
                        }`}>
                          <activity.icon className={`h-4 w-4 ${
                            activity.color === 'emerald' ? 'text-emerald-500' :
                            activity.color === 'blue' ? 'text-blue-500' :
                            'text-amber-500'
                          }`} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{activity.action}</p>
                          <p className="font-mono text-[10px] md:text-[11px] text-slate-500">{activity.detail}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end sm:text-right gap-4">
                        <p className="text-sm font-bold text-emerald-600">+{activity.points}</p>
                        <p className="font-mono text-[10px] text-slate-400">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Statistiques Détaillées */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-lg shadow-slate-200/20">
                <h3 className="mb-4 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-slate-600">
                  <LayoutDashboard className="h-4 w-4 text-purple-500" />
                  Statistiques Détaillées
                </h3>
                
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  {[
                    { label: "Défis totaux", value: "24", icon: Target, color: "blue" },
                    { label: "Analyses IA", value: "18", icon: Brain, color: "purple" },
                    { label: "Score moyen", value: "87%", icon: TrendingUp, color: "emerald" },
                    { label: "Jours actifs", value: "45", icon: CalendarDays, color: "amber" },
                  ].map((stat, idx) => (
                    <div key={idx} className="rounded-xl border border-slate-100 bg-slate-50 p-3 md:p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <stat.icon className={`h-4 w-4 ${
                          stat.color === 'blue' ? 'text-blue-500' :
                          stat.color === 'purple' ? 'text-purple-500' :
                          stat.color === 'emerald' ? 'text-emerald-500' :
                          'text-amber-500'
                        }`} />
                        <span className="font-mono text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          {stat.label}
                        </span>
                      </div>
                      <p className="text-2xl md:text-3xl font-black tabular-nums text-slate-800">{stat.value}</p>
                    </div>
                  ))}
                </div>

                {/* Message de statut */}
                <div className="mt-6 rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-blue-900">Compte sécurisé et actif</p>
                      <p className="mt-1 font-mono text-[10px] md:text-[11px] text-blue-700">
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