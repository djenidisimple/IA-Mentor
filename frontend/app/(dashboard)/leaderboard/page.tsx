"use client"

import { useEffect, useState } from "react"
import { 
  Trophy, 
  Crown, 
  Medal, 
  TrendingUp, 
  TrendingDown,
  Minus,
  User,
  Star,
  Zap,
  Award,
  Target,
  Flame,
  Sparkles,
  Search,
  Filter
} from "lucide-react"

interface LeaderboardUser {
  id: number
  username: string
  avatarUrl?: string
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
  const [isVisible, setIsVisible] = useState(false)
  const [timeFilter, setTimeFilter] = useState<'all' | 'month' | 'week'>('all')
  const [searchQuery, setSearchQuery] = useState("")
  const [topThree, setTopThree] = useState<LeaderboardUser[]>([])

  useEffect(() => {
    // Simuler des données (à remplacer par votre API)
    const mockUsers: LeaderboardUser[] = [
      { id: 1, username: "CodeMaster", points: 12500, rank: 1, previousRank: 2, challengesCompleted: 45, averageScore: 94, streak: 15, badges: ["🏆", "⚡", "🎯"], isPremium: true },
      { id: 2, username: "DevQueen", points: 11200, rank: 2, previousRank: 1, challengesCompleted: 42, averageScore: 91, streak: 12, badges: ["👑", "💎"], isPremium: true },
      { id: 3, username: "AlgoPro", points: 10800, rank: 3, previousRank: 4, challengesCompleted: 38, averageScore: 89, streak: 8, badges: ["🚀", "💡"], isPremium: false },
      { id: 4, username: "ReactNinja", points: 9500, rank: 4, previousRank: 3, challengesCompleted: 35, averageScore: 87, streak: 10, badges: ["⚛️"], isPremium: true },
      { id: 5, username: "Pythonista", points: 8900, rank: 5, previousRank: 5, challengesCompleted: 32, averageScore: 85, streak: 6, badges: ["🐍"], isPremium: false },
      { id: 6, username: "JavaGuru", points: 8200, rank: 6, previousRank: 8, challengesCompleted: 30, averageScore: 83, streak: 4, badges: ["☕"], isPremium: false },
      { id: 7, username: "CppWizard", points: 7800, rank: 7, previousRank: 6, challengesCompleted: 28, averageScore: 81, streak: 7, badges: [], isPremium: false },
      { id: 8, username: "Rustacean", points: 7200, rank: 8, previousRank: 9, challengesCompleted: 25, averageScore: 88, streak: 5, badges: ["🦀"], isPremium: true },
      { id: 9, username: "GoDeveloper", points: 6800, rank: 9, previousRank: 7, challengesCompleted: 22, averageScore: 79, streak: 3, badges: [], isPremium: false },
      { id: 10, username: "SwiftCoder", points: 6200, rank: 10, previousRank: 12, challengesCompleted: 20, averageScore: 82, streak: 2, badges: [], isPremium: false },
    ]

    setUsers(mockUsers)
    setTopThree(mockUsers.slice(0, 3))
    setLoading(false)
    setIsVisible(true)
  }, [])

  const getRankChange = (current: number, previous?: number) => {
    if (!previous) return { icon: Minus, color: "text-slate-400", text: "-" }
    if (current < previous) return { icon: TrendingUp, color: "text-emerald-500", text: `+${previous - current}` }
    if (current > previous) return { icon: TrendingDown, color: "text-rose-500", text: `-${current - previous}` }
    return { icon: Minus, color: "text-slate-400", text: "-" }
  }

  const getMedalColor = (rank: number) => {
    if (rank === 1) return "from-yellow-400 to-amber-500 text-yellow-700"
    if (rank === 2) return "from-slate-300 to-slate-400 text-slate-600"
    if (rank === 3) return "from-amber-600 to-amber-700 text-amber-700"
    return ""
  }

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const customStyles = `
    @keyframes slideIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }
    .animate-slide-in {
      animation: slideIn 0.5s ease-out forwards;
    }
    .animate-scale-in {
      animation: scaleIn 0.4s ease-out forwards;
    }
    .animate-float {
      animation: float 3s ease-in-out infinite;
    }
  `

  if (loading) {
    return (
      <>
        <style>{customStyles}</style>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
          <div className="max-w-[800px] mx-auto px-4 py-8">
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <div className="relative mb-6 flex h-20 w-20 mx-auto items-center justify-center">
                  <div className="absolute inset-0 animate-ping rounded-md bg-blue-400/20"></div>
                  <div className="absolute inset-2 animate-pulse rounded-md bg-blue-500/30"></div>
                  <Trophy className="h-10 w-10 text-blue-500 relative z-10" />
                </div>
                <h2 className="text-lg font-semibold text-slate-700">Chargement du classement...</h2>
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
        <div className="max-w-[800px] mx-auto px-4 py-6">
          
          {/* Header */}
          <div className={`mb-6 transition-all duration-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 p-2.5 text-white shadow-lg shadow-amber-500/20">
                <Trophy className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tighter text-slate-800">
                  Classement
                </h1>
                <p className="text-sm text-slate-500">
                  Les meilleurs développeurs de la communauté
                </p>
              </div>
            </div>

            {/* Search & Filters */}
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher un développeur..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-300 focus:ring-2 focus:ring-amber-100"
                />
              </div>
              <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1">
                {[
                  { value: 'all', label: 'Global' },
                  { value: 'month', label: 'Mois' },
                  { value: 'week', label: 'Semaine' },
                ].map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setTimeFilter(filter.value as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      timeFilter === filter.value
                        ? 'bg-amber-500 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Top 3 Podium */}
          <div className={`grid grid-cols-3 gap-3 mb-8 transition-all duration-500 delay-100 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            {topThree.map((user, idx) => {
              const position = idx + 1
              const medalColor = getMedalColor(position)
              
              return (
                <div
                  key={user.id}
                  className={`relative animate-scale-in`}
                  style={{ 
                    animationDelay: `${idx * 100}ms`,
                    marginTop: position === 2 ? '20px' : position === 3 ? '30px' : '0'
                  }}
                >
                  {/* Podium Base */}
                  <div className={`absolute -bottom-2 left-0 right-0 h-2 rounded-b-xl ${
                    position === 1 ? 'bg-gradient-to-r from-yellow-400 to-amber-500' :
                    position === 2 ? 'bg-gradient-to-r from-slate-300 to-slate-400' :
                    'bg-gradient-to-r from-amber-600 to-amber-700'
                  }`} />
                  
                  <div className="relative bg-white rounded-2xl border border-slate-200 p-4 text-center shadow-lg">
                    {/* Crown for 1st place */}
                    {position === 1 && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <div className="bg-gradient-to-r from-yellow-400 to-amber-500 p-1.5 rounded-md shadow-lg">
                          <Crown className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    )}

                    {/* Medal Number */}
                    <div className={`inline-flex items-center justify-center w-10 h-10 rounded-md bg-gradient-to-br ${medalColor} text-white font-black text-lg mb-3 mx-auto`}>
                      {position}
                    </div>

                    {/* Avatar */}
                    <div className="w-16 h-16 mx-auto mb-2 rounded-md bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-xl">
                      {user.username[0].toUpperCase()}
                    </div>

                    {/* Info */}
                    <h3 className="font-bold text-slate-800 mb-0.5 flex items-center justify-center gap-1">
                      {user.username}
                      {user.isPremium && (
                        <Sparkles className="h-3 w-3 text-amber-500 fill-current" />
                      )}
                    </h3>
                    <p className="text-xs text-slate-500 mb-2">@{user.username.toLowerCase()}</p>

                    {/* Stats */}
                    <div className="flex items-center justify-center gap-3 text-xs">
                      <div className="text-center">
                        <p className="font-black text-slate-700">{user.points.toLocaleString()}</p>
                        <p className="text-[9px] text-slate-400 uppercase">Pts</p>
                      </div>
                      <div className="w-px h-4 bg-slate-200" />
                      <div className="text-center">
                        <p className="font-black text-slate-700">{user.challengesCompleted}</p>
                        <p className="text-[9px] text-slate-400 uppercase">Défis</p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Leaderboard Table */}
          <div className={`space-y-2 transition-all duration-500 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-2 px-4 py-2 text-xs font-medium text-slate-500 uppercase tracking-wider">
              <div className="col-span-2">Rang</div>
              <div className="col-span-4">Développeur</div>
              <div className="col-span-2 text-right">Points</div>
              <div className="col-span-2 text-right">Score</div>
              <div className="col-span-2 text-right">Série</div>
            </div>

            {/* Table Body */}
            {filteredUsers.map((user, idx) => {
              const rankChange = getRankChange(user.rank, user.previousRank)
              const ChangeIcon = rankChange.icon
              const isTopThree = user.rank <= 3

              return (
                <div
                  key={user.id}
                  className={`grid grid-cols-12 gap-2 items-center p-4 rounded-xl border transition-all ${
                    isTopThree 
                      ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200' 
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                  }`}
                  style={{ animationDelay: `${idx * 30}ms` }}
                >
                  {/* Rank */}
                  <div className="col-span-2 flex items-center gap-2">
                    {isTopThree ? (
                      <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${getMedalColor(user.rank)} flex items-center justify-center text-white font-bold text-xs`}>
                        {user.rank}
                      </div>
                    ) : (
                      <span className="font-mono text-sm font-bold text-slate-600 w-6 text-center">
                        {user.rank}
                      </span>
                    )}
                    <div className={`flex items-center gap-0.5 ${rankChange.color}`}>
                      <ChangeIcon className="h-3 w-3" />
                      <span className="text-[10px] font-medium">{rankChange.text}</span>
                    </div>
                  </div>

                  {/* Developer */}
                  <div className="col-span-4 flex items-center gap-3">
                    <div className="relative">
                      <div className="w-9 h-9 rounded-md bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                        {user.username[0].toUpperCase()}
                      </div>
                      {user.streak >= 7 && (
                        <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-orange-400 to-red-500 rounded-md p-0.5">
                          <Flame className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-slate-800 text-sm truncate">
                          {user.username}
                        </span>
                        {user.isPremium && (
                          <Sparkles className="h-3 w-3 text-amber-500 fill-current flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {user.badges.slice(0, 2).map((badge, i) => (
                          <span key={i} className="text-xs">{badge}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Points */}
                  <div className="col-span-2 text-right">
                    <span className="font-black text-slate-800 text-sm">
                      {user.points.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400 ml-0.5">pts</span>
                  </div>

                  {/* Average Score */}
                  <div className="col-span-2 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <div className="w-10 h-1.5 bg-slate-100 rounded-md overflow-hidden">
                        <div 
                          className={`h-full rounded-md ${
                            user.averageScore >= 90 ? 'bg-emerald-500' :
                            user.averageScore >= 80 ? 'bg-blue-500' :
                            'bg-amber-500'
                          }`}
                          style={{ width: `${user.averageScore}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-slate-700">
                        {user.averageScore}%
                      </span>
                    </div>
                  </div>

                  {/* Streak */}
                  <div className="col-span-2 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Flame className={`h-3.5 w-3.5 ${
                        user.streak >= 7 ? 'text-orange-500' : 'text-slate-400'
                      }`} />
                      <span className="text-sm font-medium text-slate-700">
                        {user.streak}j
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Stats Summary */}
          <div className={`mt-8 grid grid-cols-3 gap-3 transition-all duration-500 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
              <Trophy className="h-5 w-5 text-amber-500 mx-auto mb-1" />
              <p className="text-2xl font-black text-slate-800">{users.length}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Participants</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
              <Target className="h-5 w-5 text-blue-500 mx-auto mb-1" />
              <p className="text-2xl font-black text-slate-800">
                {users.reduce((acc, u) => acc + u.challengesCompleted, 0)}
              </p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Défis complétés</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
              <Award className="h-5 w-5 text-purple-500 mx-auto mb-1" />
              <p className="text-2xl font-black text-slate-800">
                {Math.round(users.reduce((acc, u) => acc + u.averageScore, 0) / users.length)}%
              </p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Score moyen</p>
            </div>
          </div>

          {/* Bottom Spacer */}
          <div className="h-8" />
        </div>
      </div>
    </>
  )
}