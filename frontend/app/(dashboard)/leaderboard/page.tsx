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
  Zap,
  ArrowUpRight
} from "lucide-react"
import { leaderboardApi, LeaderboardEntry } from "@/lib/leaderboard"

export default function LeaderboardPage() {
  const [users, setUsers] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    leaderboardApi.getAll()
      .then(data => {
        setUsers(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const getRankChange = (current: number, previous: number | null) => {
    if (previous == null) return { icon: Minus, color: "text-[var(--gray)]", text: "" }
    if (current < previous) return { icon: TrendingUp, color: "text-green-500", text: `${previous - current}` }
    if (current > previous) return { icon: TrendingDown, color: "text-red-500", text: `${current - previous}` }
    return { icon: Minus, color: "text-[var(--gray)]", text: "" }
  }

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--cream)]">
        <div className="max-w-[1000px] mx-auto px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`p-6 bg-white border border-[var(--border-pink)] rounded-xl ${i === 0 ? 'md:-translate-y-4' : ''}`}>
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-[var(--border-pink)] via-gray-200 to-[var(--border-pink)] bg-[length:200%_100%] animate-shimmer mb-4" />
                <div className="h-4 w-24 mx-auto rounded-full bg-gradient-to-r from-[var(--border-pink)] via-gray-200 to-[var(--border-pink)] bg-[length:200%_100%] animate-shimmer mb-2" />
                <div className="h-3 w-16 mx-auto rounded-full bg-gradient-to-r from-[var(--border-pink)] via-gray-200 to-[var(--border-pink)] bg-[length:200%_100%] animate-shimmer mb-4" />
                <div className="border-t border-[var(--border-pink)] pt-4 flex justify-around">
                  <div className="h-8 w-16 rounded-full bg-gradient-to-r from-[var(--border-pink)] via-gray-200 to-[var(--border-pink)] bg-[length:200%_100%] animate-shimmer" />
                  <div className="h-8 w-16 rounded-full bg-gradient-to-r from-[var(--border-pink)] via-gray-200 to-[var(--border-pink)] bg-[length:200%_100%] animate-shimmer" />
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-white border border-[var(--border-pink)] rounded-xl">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[var(--border-pink)] via-gray-200 to-[var(--border-pink)] bg-[length:200%_100%] animate-shimmer" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 rounded-full bg-gradient-to-r from-[var(--border-pink)] via-gray-200 to-[var(--border-pink)] bg-[length:200%_100%] animate-shimmer" />
                  <div className="h-3 w-24 rounded-full bg-gradient-to-r from-[var(--border-pink)] via-gray-200 to-[var(--border-pink)] bg-[length:200%_100%] animate-shimmer" />
                </div>
                <div className="h-6 w-20 rounded-full bg-gradient-to-r from-[var(--border-pink)] via-gray-200 to-[var(--border-pink)] bg-[length:200%_100%] animate-shimmer" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--cream)]">
      <header className="bg-white border-b border-[var(--border-pink)]">
        <div className="max-w-[1000px] mx-auto px-6 py-8 sm:py-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 bg-[var(--orange)] rounded-full" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--orange)]">
                  Hall of Fame
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--navy)] tracking-tight mb-3">
                Classement
              </h1>
              <p className="text-[var(--gray)] text-sm max-w-md leading-relaxed">
                Rejoignez l&apos;élite et comparez vos performances avec les meilleurs développeurs.
              </p>
            </div>

            <div className="flex gap-4">
              <div className="bg-[var(--cream)] border border-[var(--border-pink)] p-4 rounded-xl min-w-[120px]">
                <p className="text-[10px] font-bold text-[var(--gray)] uppercase mb-1">Participants</p>
                <p className="text-xl font-bold text-[var(--navy)]">{users.length}</p>
              </div>
              <div className="bg-[var(--blue)]/5 border border-[var(--blue)]/10 p-4 rounded-xl min-w-[120px]">
                <p className="text-[10px] font-bold text-[var(--blue)] uppercase mb-1">XP Distribués</p>
                <p className="text-xl font-bold text-[var(--blue)]">{users.reduce((sum, u) => sum + u.points, 0).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-[var(--border-pink)]">
        <div className="max-w-[1000px] mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--gray)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un membre..."
                className="w-full bg-transparent pl-7 py-2 text-sm focus:outline-none border-b border-transparent focus:border-[var(--blue)] transition-colors"
              />
            </div>

            <div className="flex items-center gap-2 p-1 bg-[var(--cream)] rounded-xl border border-[var(--border-pink)]">
              <span className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--gray)]">
                {users.length} membres
              </span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-[1000px] mx-auto px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {users.slice(0, 3).map((user, idx) => (
            <div
              key={user.id}
              className={`relative p-6 bg-white border rounded-xl sm:rounded-2xl flex flex-col items-center text-center transition-all duration-300 hover:shadow-xl ${
                idx === 0
                ? 'border-[var(--orange)] bg-gradient-to-b from-[var(--orange)]/5 to-white md:-translate-y-4'
                : 'border-[var(--border-pink)]'
              }`}
            >
              {idx === 0 && <Trophy className="absolute -top-4 text-[var(--orange)]" size={32} />}

              <div className="w-16 h-16 bg-[var(--navy)] text-white rounded-xl flex items-center justify-center text-xl font-bold mb-4 border-4 border-white shadow-md">
                {user.username[0]}
              </div>

              <h3 className="font-bold text-lg text-[var(--navy)] flex items-center gap-2">
                {user.username}
                {user.isPremium && <Sparkles size={14} className="text-[var(--blue)]" />}
              </h3>
              <p className="text-[var(--gray)] text-xs font-bold uppercase tracking-widest mb-4">Rang #{user.rank}</p>

              <div className="mt-auto w-full pt-4 border-t border-[var(--border-pink)] flex justify-around">
                <div>
                  <p className="text-xs font-bold text-[var(--gray)] uppercase">Points</p>
                  <p className="font-bold text-[var(--navy)]">{user.points.toLocaleString()}</p>
                </div>
                <div className="w-px bg-[var(--border-pink)]" />
                <div>
                  <p className="text-xs font-bold text-[var(--gray)] uppercase">Défis</p>
                  <p className="font-bold text-[var(--blue)]">{user.challengesCompleted}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          {filteredUsers.map((user, idx) => {
            const change = getRankChange(user.rank, user.previousRank);
            const ChangeIcon = change.icon;

            return (
              <div
                key={user.id}
                className="group flex items-center gap-4 p-4 bg-white border border-[var(--border-pink)] rounded-xl hover:border-[var(--blue)] hover:shadow-md transition-all"
              >
                <div className="w-12 flex flex-col items-center">
                  <span className="text-lg font-bold text-[var(--navy)]">{user.rank}</span>
                  <div className={`flex items-center text-[10px] font-bold ${change.color}`}>
                    <ChangeIcon size={10} />
                    {change.text}
                  </div>
                </div>

                <div className="flex items-center gap-4 flex-1">
                  <div className="w-10 h-10 bg-[var(--cream)] border border-[var(--border-pink)] rounded-xl flex items-center justify-center font-bold text-[var(--gray)]">
                    {user.username[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[var(--navy)]">{user.username}</span>
                      {user.challengesCompleted >= 10 && <Flame size={14} className="text-red-500" />}
                    </div>
                    <span className="text-xs text-[var(--gray)] font-medium">{user.challengesCompleted} défis réussis</span>
                  </div>
                </div>

                <div className="hidden md:flex items-center gap-12 mr-8">
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-[var(--gray)] uppercase tracking-tighter">Précision</p>
                    <p className="text-sm font-bold text-[var(--navy)]">{Math.round(user.averageScore)}%</p>
                  </div>
                  <div className="text-right min-w-[80px]">
                    <p className="text-[10px] font-bold text-[var(--gray)] uppercase tracking-tighter">Points XP</p>
                    <p className="text-sm font-bold text-[var(--blue)]">{user.points.toLocaleString()}</p>
                  </div>
                </div>

                <button className="p-2 text-[var(--gray)] group-hover:text-[var(--blue)] transition-colors">
                  <ArrowUpRight size={20} />
                </button>
              </div>
            )
          })}
        </div>
      </main>

      <footer className="border-t border-[var(--border-pink)] bg-white py-8 mt-12">
        <div className="max-w-[1000px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-[var(--blue)]" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--gray)]">Mise à jour : Temps réel</span>
          </div>
          <p className="text-[11px] font-bold text-[var(--gray)] uppercase tracking-widest">
            Propulsé par ton moteur de jeu
          </p>
        </div>
      </footer>
    </div>
  )
}
