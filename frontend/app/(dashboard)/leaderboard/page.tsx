"use client"

import { useEffect, useState } from "react"
import { 
  Trophy, 
  TrendingUp, 
  TrendingDown,
  Minus,
  Sparkles,
  Search,
  Flame,
  Target,
  Award,
  Zap,
  ArrowUpRight
} from "lucide-react"

interface LeaderboardUser {
  id: number
  username: string
  points: number
  rank: number
  previousRank?: number
  challengesCompleted: number
  averageScore: number
  streak: number
  badges: string[]
  isPremium?: boolean
}

export default function LeaderboardPage() {
  const [users, setUsers] = useState<LeaderboardUser[]>([])
  const [loading, setLoading] = useState(true)
  const [timeFilter, setTimeFilter] = useState<'all' | 'month' | 'week'>('all')
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const mockUsers: LeaderboardUser[] = [
      { id: 1, username: "CodeMaster", points: 12500, rank: 1, previousRank: 2, challengesCompleted: 45, averageScore: 94, streak: 15, badges: ["🏆", "⚡"], isPremium: true },
      { id: 2, username: "DevQueen", points: 11200, rank: 2, previousRank: 1, challengesCompleted: 42, averageScore: 91, streak: 12, badges: ["👑"], isPremium: true },
      { id: 3, username: "AlgoPro", points: 10800, rank: 3, previousRank: 4, challengesCompleted: 38, averageScore: 89, streak: 8, badges: ["🚀"], isPremium: false },
      { id: 4, username: "ReactNinja", points: 9500, rank: 4, previousRank: 3, challengesCompleted: 35, averageScore: 87, streak: 10, badges: ["⚛️"], isPremium: true },
      { id: 5, username: "Pythonista", points: 8900, rank: 5, previousRank: 5, challengesCompleted: 32, averageScore: 85, streak: 6, badges: ["🐍"], isPremium: false },
    ]
    setUsers(mockUsers)
    setLoading(false)
  }, [])

  const getRankChange = (current: number, previous?: number) => {
    if (!previous) return { icon: Minus, color: "text-slate-400", text: "" }
    if (current < previous) return { icon: TrendingUp, color: "text-[#10B981]", text: `${previous - current}` }
    if (current > previous) return { icon: TrendingDown, color: "text-[#EF4444]", text: `${current - previous}` }
    return { icon: Minus, color: "text-slate-400", text: "" }
  }

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center font-['Outfit']">
        <div className="w-8 h-8 border-2 border-slate-200 border-t-[#0052FF] animate-spin mb-4" />
        <p className="text-[13px] font-bold uppercase tracking-widest text-slate-400">Calcul des rangs...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white font-['Outfit']">
      {/* ── Header (Ajusté : pt-0) ── */}
      <header className="border-b border-slate-100">
        <div className="max-w-[1000px] mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 bg-[#F97316] rotate-45" />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#F97316]">
                  Hall of Fame
                </span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-[#0D0D0D] mb-4">
                Classement <span className="text-slate-200">/</span> Top Devs
              </h1>
              <p className="text-slate-500 max-w-md text-[15px] leading-relaxed">
                Rejoignez l'élite et comparez vos performances avec les meilleurs développeurs du monde.
              </p>
            </div>

            {/* Stats Globales - Style Bento */}
            <div className="flex gap-4">
              <div className="bg-slate-50 border border-slate-100 p-4 min-w-[120px]">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Participants</p>
                <p className="text-xl font-bold text-[#0D0D0D]">{users.length * 124}</p>
              </div>
              <div className="bg-[#0052FF]/5 border border-[#0052FF]/10 p-4 min-w-[120px]">
                <p className="text-[10px] font-bold text-[#0052FF] uppercase mb-1">XP Distribués</p>
                <p className="text-xl font-bold text-[#0052FF]">12.4M</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Filtres & Recherche ── */}
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-[1000px] mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un membre..."
                className="w-full bg-transparent pl-7 py-2 text-sm focus:outline-none border-b border-transparent focus:border-[#0052FF] transition-colors"
              />
            </div>
            
            <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-lg">
              {['all', 'month', 'week'].map((f) => (
                <button
                  key={f}
                  onClick={() => setTimeFilter(f as any)}
                  className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${
                    timeFilter === f ? 'bg-white text-[#0D0D0D] shadow-sm' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {f === 'all' ? 'Global' : f === 'month' ? 'Mensuel' : 'Hebdo'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-[1000px] mx-auto px-6 py-12">
        {/* ── Podium (Top 3) ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {users.slice(0, 3).map((user, idx) => (
            <div 
              key={user.id}
              className={`relative p-6 border-2 flex flex-col items-center text-center transition-all duration-300 ${
                idx === 0 
                ? 'border-[#F97316] bg-[#F97316]/5 md:-translate-y-4 shadow-[0_20px_40px_-15px_rgba(249,115,22,0.1)]' 
                : 'border-slate-900 bg-white'
              }`}
            >
              {idx === 0 && <Trophy className="absolute -top-4 text-[#F97316] fill-[#F97316]" size={32} />}
              
              <div className="w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center text-xl font-black mb-4 border-4 border-white shadow-md">
                {user.username[0]}
              </div>
              
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                {user.username}
                {user.isPremium && <Sparkles size={14} className="text-[#0052FF]" />}
              </h3>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">Rang #{user.rank}</p>
              
              <div className="mt-auto w-full pt-4 border-t border-slate-100 flex justify-around">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Points</p>
                  <p className="font-black text-[#0D0D0D]">{user.points.toLocaleString()}</p>
                </div>
                <div className="w-px bg-slate-100" />
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Série</p>
                  <p className="font-black text-[#EF4444]">{user.streak}j</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Liste Complète ── */}
        <div className="space-y-3">
          {filteredUsers.map((user, idx) => {
            const change = getRankChange(user.rank, user.previousRank);
            const ChangeIcon = change.icon;

            return (
              <div 
                key={user.id}
                className="group flex items-center gap-4 p-4 bg-white border border-slate-100 hover:border-[#0052FF] transition-all"
              >
                {/* Rang & Evolution */}
                <div className="w-12 flex flex-col items-center">
                   <span className="text-lg font-black text-slate-900">{user.rank}</span>
                   <div className={`flex items-center text-[10px] font-bold ${change.color}`}>
                      <ChangeIcon size={10} />
                      {change.text}
                   </div>
                </div>

                {/* Avatar & Nom */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-10 h-10 bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-600">
                    {user.username[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{user.username}</span>
                      {user.streak >= 10 && <Flame size={14} className="text-[#EF4444]" />}
                    </div>
                    <span className="text-xs text-slate-400 font-medium">{user.challengesCompleted} défis réussis</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="hidden md:flex items-center gap-12 mr-8">
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Précision</p>
                    <p className="text-sm font-bold text-slate-900">{user.averageScore}%</p>
                  </div>
                  <div className="text-right min-w-[80px]">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Points XP</p>
                    <p className="text-sm font-black text-[#0052FF]">{user.points.toLocaleString()}</p>
                  </div>
                </div>

                <button className="p-2 text-slate-300 group-hover:text-[#0052FF] transition-colors">
                  <ArrowUpRight size={20} />
                </button>
              </div>
            )
          })}
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-100 py-10 bg-slate-50/30 mt-20">
        <div className="max-w-[1000px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-[#0052FF]" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Mise à jour : Temps réel</span>
            </div>
          </div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            Propulsé par ton moteur de jeu
          </p>
        </div>
      </footer>
    </div>
  )
}