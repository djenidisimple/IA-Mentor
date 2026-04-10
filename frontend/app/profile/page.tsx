'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/lib/store/authStore'
import { 
  User, 
  Mail, 
  Crown, 
  ShieldCheck, 
  CalendarDays,
  LayoutDashboard,
  ArrowLeft,
  Settings,
  Activity
} from 'lucide-react'

export default function ProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  if (!user) {
    return null
  }

  const joinDate = user.createdAt 
    ? new Date(user.createdAt).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Inconnue'

  return (
    <div className="min-h-screen text-gray-900 relative font-inter overflow-x-hidden pt-24 pb-12">
      <div className="max-w-[1000px] mx-auto px-5 md:px-8 relative z-10">
        
        {/* Navigation Bar */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/home" 
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-mono text-[11px] font-bold uppercase tracking-widest transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Retour à l&apos;Atelier
          </Link>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border-1.5 border-gray-200 hover:border-gray-300 rounded-xl font-mono text-[10px] font-bold uppercase tracking-widest text-gray-600 transition-all shadow-sm">
            <Settings className="w-3.5 h-3.5" />
            Paramètres
          </button>
        </div>

        {/* Profile Card Header */}
        <div className="bg-white/80 backdrop-blur-xl border-1.5 border-gray-200 rounded-3xl p-8 md:p-10 shadow-xl mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 diagonal-pattern text-gray-900 opacity-[0.02] w-64 h-64 pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8 relative z-10">
            {/* Avatar Frame */}
            <div className="relative group shrink-0">
              <div className="w-28 h-28 md:w-32 md:h-32 bg-gray-50 flex items-center justify-center text-gray-400 border-2 border-gray-200 overflow-hidden shadow-inner transition-transform group-hover:scale-105 duration-500"
                   style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' }}>
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.username} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl md:text-5xl font-['Syne'] font-bold text-gray-300">
                    {user.username?.[0]?.toUpperCase() || 'U'}
                  </span>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center shadow-md">
                <ShieldCheck className="w-4 h-4 text-white" />
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider border border-blue-100 flex items-center gap-1.5">
                  <User className="w-3 h-3" />
                  {user.role}
                </span>
                {user.isPremium && (
                  <span className="bg-amber-50 text-amber-600 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider border border-amber-100 flex items-center gap-1.5">
                    <Crown className="w-3 h-3" />
                    Premium
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-['Syne'] font-black tracking-tighter text-gray-900 mb-2 uppercase">
                {user.username}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-500 mt-2">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  {user.email}
                </div>
                <div className="hidden md:block w-1 h-1 bg-gray-300 rounded-full" />
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-gray-400" />
                  Inscrit le {joinDate}
                </div>
              </div>
            </div>

            {/* Top Level Stats */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 md:min-w-[160px] text-center shadow-sm">
              <div className="flex items-center gap-2 justify-center mb-1">
                <Crown className="w-4 h-4 text-amber-500" />
                <span className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  Points
                </span>
              </div>
              <div className="text-3xl font-['Syne'] font-black text-gray-900 tracking-tighter">
                {user.points || 0}
              </div>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/60 backdrop-blur-md border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
            <h3 className="flex items-center gap-3 text-lg font-['Syne'] font-bold text-gray-900 mb-6 uppercase tracking-tight">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <LayoutDashboard className="w-5 h-5" />
              </div>
              Activité
            </h3>
            
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-xl">
                <span className="font-mono text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Défis complétés
                </span>
                <span className="font-['Syne'] font-bold text-xl text-gray-900">
                  En cours
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-xl">
                <span className="font-mono text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Dernière connexion
                </span>
                <span className="font-['Syne'] font-bold text-base text-gray-900">
                  Aujourd&apos;hui
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-md border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
            <h3 className="flex items-center gap-3 text-lg font-['Syne'] font-bold text-gray-900 mb-6 uppercase tracking-tight">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <Activity className="w-5 h-5" />
              </div>
              Statut du compte
            </h3>
            
            <div className="space-y-5">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    Niveau Utilisateur
                  </span>
                  <span className="font-mono text-xs font-bold text-blue-600">
                    Lvl {Math.floor((user.points || 0) / 100) + 1}
                  </span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-1000 ease-out"
                    style={{ width: `${((user.points || 0) % 100)}%` }}
                  />
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-100">
                <p className="text-sm font-medium text-gray-500 leading-relaxed">
                  Votre compte est actif et sécurisé. Vous pouvez mettre à niveau votre abonnement pour débloquer les fonctionnalités premium de devReview AI.
                </p>
                {!user.isPremium && (
                  <button className="mt-4 px-5 py-2.5 bg-gray-900 text-white hover:bg-gray-800 rounded-xl font-mono text-[11px] font-bold uppercase tracking-widest transition-colors w-full sm:w-auto">
                    Passer Premium
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
