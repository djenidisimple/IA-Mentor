'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/lib/store/authStore'
import { 
  Trophy, 
  Medal, 
  TrendingUp, 
  Code, 
  Star, 
  Zap,
  Award,
  Flame,
  Target,
  ChevronUp,
  ChevronDown,
  User,
  Calendar,
  GitBranch,
  Crown
} from 'lucide-react'
import LoadingScreen from '@/components/ui/LoadingScreen'

interface LeaderboardUser {
  id: number
  rank: number
  username: string
  avatarUrl: string
  points: number
  challengesCompleted: number
  totalScore: number
  streak: number
  badges: string[]
  trend: 'up' | 'down' | 'stable'
  language: string
  joinDate: string
}

// 📦 DONNÉES MOCKÉES
const mockLeaderboard: LeaderboardUser[] = [
  {
    id: 1,
    rank: 1,
    username: "code_master",
    avatarUrl: "",
    points: 12500,
    challengesCompleted: 47,
    totalScore: 94,
    streak: 15,
    badges: ["👑 Champion", "⚡ Speedster", "🔒 Security Expert"],
    trend: 'up',
    language: "Java",
    joinDate: "2024-01-15"
  },
  {
    id: 2,
    rank: 2,
    username: "clean_coder",
    avatarUrl: "",
    points: 11200,
    challengesCompleted: 42,
    totalScore: 91,
    streak: 12,
    badges: ["🏆 Elite", "📐 Architect"],
    trend: 'up',
    language: "C#",
    joinDate: "2024-02-01"
  },
  {
    id: 3,
    rank: 3,
    username: "bug_hunter",
    avatarUrl: "",
    points: 9800,
    challengesCompleted: 38,
    totalScore: 88,
    streak: 8,
    badges: ["🐛 Bug Hunter", "⚡ Performance"],
    trend: 'stable',
    language: "JavaScript",
    joinDate: "2024-01-20"
  },
  {
    id: 4,
    rank: 4,
    username: "dev_warrior",
    avatarUrl: "",
    points: 8900,
    challengesCompleted: 35,
    totalScore: 85,
    streak: 6,
    badges: ["🔥 Warrior"],
    trend: 'up',
    language: "PHP",
    joinDate: "2024-02-10"
  },
  {
    id: 5,
    rank: 5,
    username: "alchemist",
    avatarUrl: "",
    points: 8200,
    challengesCompleted: 32,
    totalScore: 83,
    streak: 10,
    badges: ["✨ Alchemist", "🎯 Precision"],
    trend: 'down',
    language: "Rust",
    joinDate: "2024-01-05"
  },
  {
    id: 6,
    rank: 6,
    username: "tech_guru",
    avatarUrl: "",
    points: 7800,
    challengesCompleted: 30,
    totalScore: 81,
    streak: 5,
    badges: ["📚 Guru"],
    trend: 'stable',
    language: "Python",
    joinDate: "2024-02-15"
  },
  {
    id: 7,
    rank: 7,
    username: "performance_nerd",
    avatarUrl: "",
    points: 7200,
    challengesCompleted: 28,
    totalScore: 79,
    streak: 7,
    badges: ["⚡ Performance"],
    trend: 'up',
    language: "Go",
    joinDate: "2024-01-25"
  },
  {
    id: 8,
    rank: 8,
    username: "security_freak",
    avatarUrl: "",
    points: 6800,
    challengesCompleted: 26,
    totalScore: 76,
    streak: 4,
    badges: ["🔒 Security"],
    trend: 'stable',
    language: "Java",
    joinDate: "2024-02-20"
  },
  {
    id: 9,
    rank: 9,
    username: "fullstack_hero",
    avatarUrl: "",
    points: 6200,
    challengesCompleted: 24,
    totalScore: 74,
    streak: 3,
    badges: ["🌐 Fullstack"],
    trend: 'up',
    language: "JavaScript",
    joinDate: "2024-02-05"
  },
  {
    id: 10,
    rank: 10,
    username: "refactor_master",
    avatarUrl: "",
    points: 5800,
    challengesCompleted: 22,
    totalScore: 72,
    streak: 6,
    badges: ["♻️ Refactor"],
    trend: 'down',
    language: "C#",
    joinDate: "2024-01-30"
  },
  {
    id: 11,
    rank: 11,
    username: "api_wizard",
    avatarUrl: "",
    points: 5400,
    challengesCompleted: 20,
    totalScore: 69,
    streak: 2,
    badges: [],
    trend: 'stable',
    language: "Python",
    joinDate: "2024-02-25"
  },
  {
    id: 12,
    rank: 12,
    username: "database_ninja",
    avatarUrl: "",
    points: 4900,
    challengesCompleted: 18,
    totalScore: 67,
    streak: 1,
    badges: ["🗄️ SQL Master"],
    trend: 'up',
    language: "Java",
    joinDate: "2024-03-01"
  }
]

const timeFilters = ["TOUS LES TEMPS", "CE MOIS", "CETTE SEMAINE", "AUJOURD'HUI"]
const languageFilters = ["Tous", "Java", "JavaScript", "Python", "C#", "PHP", "Rust", "Go"]

export default function LeaderboardPage() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuthStore()
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([])
  const [loading, setLoading] = useState(true)
  const [timeFilter, setTimeFilter] = useState("TOUS LES TEMPS")
  const [languageFilter, setLanguageFilter] = useState("Tous")
  const [hoveredUser, setHoveredUser] = useState<number | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    const loadLeaderboard = async () => {
      await new Promise(resolve => setTimeout(resolve, 600))
      setLeaderboard(mockLeaderboard)
      setLoading(false)
    }
    loadLeaderboard()
  }, [])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-8 w-8 text-[#E8C547] drop-shadow-glow" />
      case 2:
        return <Medal className="h-7 w-7 text-[#C0C0C0]" />
      case 3:
        return <Medal className="h-7 w-7 text-[#CD7F32]" />
      default:
        return <div className="w-8 h-8 flex items-center justify-center text-xl font-black text-[#666]">{rank}</div>
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <ChevronUp className="h-4 w-4 text-[#27C93F]" />
      case 'down':
        return <ChevronDown className="h-4 w-4 text-[#FF6B6B]" />
      default:
        return <div className="w-4 h-0.5 bg-[#666]" />
    }
  }

  const getLanguageColor = (language: string) => {
    switch (language) {
      case "Java": return "text-[#D64933]"
      case "JavaScript": return "text-[#E8C547]"
      case "Python": return "text-[#4ECDC4]"
      case "C#": return "text-[#9B59B6]"
      case "PHP": return "text-[#3498DB]"
      case "Rust": return "text-[#E67E22]"
      case "Go": return "text-[#1ABC9C]"
      default: return "text-[#666]"
    }
  }

  if (loading) return <LoadingScreen />

  return (
    <div className="min-h-screen bg-[#1A1919] text-[#F2E9E2]">
      <div className="max-w-7xl mx-auto px-4 py-8 pt-20">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#D64933]/10 border-l-4 border-[#D64933] px-4 py-2 mb-4">
            <Trophy className="h-3 w-3 text-[#D64933]" />
            <span className="text-[#E8C547] text-[10px] font-mono font-bold tracking-[2px]">CLASSEMENT</span>
          </div>
          <h1 className="text-5xl font-black tracking-[-3px]">
            LEADER<span className="text-[#D64933]">BOARD</span>
          </h1>
          <p className="text-[#B8B0A0] font-mono text-sm mt-2">
            Les meilleurs développeurs de la communauté
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { value: "342", label: "DÉVELOPPEURS", icon: User, color: "#D64933" },
            { value: "1,247", label: "CHALLENGES COMPLÉTÉS", icon: Code, color: "#E8C547" },
            { value: "98.4k", label: "POINTS TOTAL", icon: Star, color: "#4ECDC4" },
            { value: "156", label: "STREAK MAX", icon: Flame, color: "#FF6B6B" }
          ].map((stat, i) => (
            <div key={i} className="bg-[#0F0E0E] border border-[#333] p-4 text-center hover:border-[#D64933]/50 transition-all duration-300">
              <stat.icon className="h-6 w-6 mx-auto mb-2" style={{ color: stat.color }} />
              <div className="text-2xl font-black text-[#F2E9E2]">{stat.value}</div>
              <div className="text-[9px] font-mono text-[#666] tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-4 justify-between items-center">
          <div className="flex flex-wrap gap-2">
            {timeFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={`px-4 py-2 text-xs font-mono tracking-wider transition-all duration-300
                  ${timeFilter === filter 
                    ? 'bg-[#D64933] text-[#1A1919]' 
                    : 'border border-[#333] text-[#666] hover:text-[#F2E9E2] hover:border-[#D64933]'
                  }`}
              >
                {filter}
              </button>
            ))}
          </div>
          <select
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
            className="bg-[#0F0E0E] border border-[#333] text-[#F2E9E2] font-mono text-sm px-4 py-2 outline-none focus:border-[#D64933]/50"
          >
            {languageFilters.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>

        {/* Leaderboard - Podium style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* 2nd Place */}
          {leaderboard[1] && (
            <div className="order-2 md:order-1">
              <div className="bg-[#0F0E0E] border border-[#333] p-6 text-center relative overflow-hidden group hover:border-[#C0C0C0] transition-all duration-300">
                <div className="absolute top-0 left-0 w-24 h-24 opacity-10">
                  <div className="absolute top-0 left-0 w-0 h-0 border-t-[96px] border-l-[96px] border-t-transparent border-l-[#C0C0C0]" />
                </div>
                <Medal className="h-12 w-12 mx-auto mb-3 text-[#C0C0C0]" />
                <div className="text-4xl font-black text-[#C0C0C0] mb-1">2</div>
                <div className="text-xl font-bold mb-1">{leaderboard[1].username}</div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Star className="h-4 w-4 text-[#E8C547]" />
                  <span className="text-2xl font-black text-[#E8C547]">{leaderboard[1].points}</span>
                  <span className="text-xs font-mono text-[#666]">pts</span>
                </div>
                <div className="flex items-center justify-center gap-4 text-xs font-mono text-[#666]">
                  <span>{leaderboard[1].challengesCompleted} challenges</span>
                  <span className="flex items-center gap-1">
                    <Flame className="h-3 w-3" />
                    {leaderboard[1].streak}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 1st Place */}
          {leaderboard[0] && (
            <div className="order-1 md:order-2 transform scale-105">
              <div className="bg-gradient-to-b from-[#D64933]/20 to-transparent border-2 border-[#E8C547] p-6 text-center relative overflow-hidden group hover:scale-105 transition-all duration-500">
                <div className="absolute top-0 right-0 w-32 h-32 opacity-20">
                  <div className="absolute top-0 right-0 w-0 h-0 border-t-[128px] border-r-[128px] border-t-transparent border-r-[#E8C547]" />
                </div>
                <Crown className="h-14 w-14 mx-auto mb-2 text-[#E8C547] drop-shadow-glow animate-pulse" />
                <div className="text-5xl font-black text-[#E8C547] mb-1">1</div>
                <div className="text-2xl font-bold mb-1">{leaderboard[0].username}</div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Star className="h-5 w-5 text-[#E8C547]" />
                  <span className="text-3xl font-black text-[#E8C547]">{leaderboard[0].points}</span>
                  <span className="text-xs font-mono text-[#666]">pts</span>
                </div>
                <div className="flex items-center justify-center gap-4 text-sm font-mono text-[#666]">
                  <span>{leaderboard[0].challengesCompleted} challenges</span>
                  <span className="flex items-center gap-1">
                    <Flame className="h-3 w-3 text-[#FF6B6B]" />
                    {leaderboard[0].streak}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap justify-center gap-1">
                  {leaderboard[0].badges.slice(0, 2).map((badge, i) => (
                    <span key={i} className="text-[8px] font-mono bg-[#E8C547]/20 text-[#E8C547] px-2 py-0.5 rounded-full">
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 3rd Place */}
          {leaderboard[2] && (
            <div className="order-3">
              <div className="bg-[#0F0E0E] border border-[#333] p-6 text-center relative overflow-hidden group hover:border-[#CD7F32] transition-all duration-300">
                <div className="absolute bottom-0 right-0 w-24 h-24 opacity-10">
                  <div className="absolute bottom-0 right-0 w-0 h-0 border-b-[96px] border-r-[96px] border-b-transparent border-r-[#CD7F32]" />
                </div>
                <Medal className="h-12 w-12 mx-auto mb-3 text-[#CD7F32]" />
                <div className="text-4xl font-black text-[#CD7F32] mb-1">3</div>
                <div className="text-xl font-bold mb-1">{leaderboard[2].username}</div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Star className="h-4 w-4 text-[#E8C547]" />
                  <span className="text-2xl font-black text-[#E8C547]">{leaderboard[2].points}</span>
                  <span className="text-xs font-mono text-[#666]">pts</span>
                </div>
                <div className="flex items-center justify-center gap-4 text-xs font-mono text-[#666]">
                  <span>{leaderboard[2].challengesCompleted} challenges</span>
                  <span className="flex items-center gap-1">
                    <Flame className="h-3 w-3" />
                    {leaderboard[2].streak}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Full Leaderboard Table */}
        <div className="bg-[#0F0E0E] border border-[#333] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#333]">
                  <th className="text-left py-4 px-4 text-xs font-mono text-[#666] tracking-wider">RANG</th>
                  <th className="text-left py-4 px-4 text-xs font-mono text-[#666] tracking-wider">DÉVELOPPEUR</th>
                  <th className="text-left py-4 px-4 text-xs font-mono text-[#666] tracking-wider">POINTS</th>
                  <th className="text-left py-4 px-4 text-xs font-mono text-[#666] tracking-wider">CHALLENGES</th>
                  <th className="text-left py-4 px-4 text-xs font-mono text-[#666] tracking-wider">STREAK</th>
                  <th className="text-left py-4 px-4 text-xs font-mono text-[#666] tracking-wider">SCORE</th>
                  <th className="text-left py-4 px-4 text-xs font-mono text-[#666] tracking-wider">TENDANCE</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.slice(3).map((user) => (
                  <tr 
                    key={user.id}
                    className={`border-b border-[#333] hover:bg-[#D64933]/5 transition-all duration-300 cursor-pointer
                      ${user.username === user?.username ? 'bg-[#D64933]/10' : ''}`}
                    onMouseEnter={() => setHoveredUser(user.id)}
                    onMouseLeave={() => setHoveredUser(null)}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 text-center font-mono font-bold text-[#666]">{user.rank}</div>
                        {getTrendIcon(user.trend)}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#D64933]/20 border border-[#D64933] flex items-center justify-center">
                          <span className="text-[#D64933] font-mono font-bold text-sm">
                            {user.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="font-mono font-bold text-[#F2E9E2]">{user.username}</div>
                          <div className="flex items-center gap-2 text-[10px] font-mono text-[#666]">
                            <span className={getLanguageColor(user.language)}>{user.language}</span>
                            {user.badges.slice(0, 1).map((badge, i) => (
                              <span key={i} className="text-[8px]">{badge}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-[#E8C547]" />
                        <span className="font-mono font-bold text-[#E8C547]">{user.points.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1">
                        <Code className="h-3 w-3 text-[#666]" />
                        <span className="font-mono text-sm text-[#F2E9E2]">{user.challengesCompleted}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1">
                        <Flame className="h-3 w-3 text-[#FF6B6B]" />
                        <span className="font-mono text-sm text-[#F2E9E2]">{user.streak}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="w-16 h-1.5 bg-[#333] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#4ECDC4] rounded-full"
                          style={{ width: `${user.totalScore}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-[#666] mt-1 block">{user.totalScore}%</span>
                    </td>
                    <td className="py-4 px-4">
                      {hoveredUser === user.id ? (
                        <div className="flex items-center gap-1 text-[10px] font-mono text-[#D64933]">
                          <Calendar className="h-3 w-3" />
                          <span>depuis {new Date(user.joinDate).toLocaleDateString()}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-[10px] font-mono text-[#666]">
                          <GitBranch className="h-3 w-3" />
                          <span>{user.challengesCompleted} challenges</span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Current User Position */}
        {user && (
          <div className="mt-6 p-4 bg-[#0F0E0E] border-l-4 border-[#D64933] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#D64933]/20 border border-[#D64933] flex items-center justify-center">
                <span className="text-[#D64933] font-mono font-bold">{user.username?.charAt(0).toUpperCase() || 'U'}</span>
              </div>
              <div>
                <div className="font-mono font-bold text-[#F2E9E2]">{user.username || 'Vous'}</div>
                <div className="text-[10px] font-mono text-[#666]">Votre position actuelle</div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-xs font-mono text-[#666]">RANG</div>
                <div className="text-xl font-black text-[#E8C547]">#42</div>
              </div>
              <div className="text-center">
                <div className="text-xs font-mono text-[#666]">POINTS</div>
                <div className="text-xl font-black text-[#F2E9E2]">2,340</div>
              </div>
              <div className="text-center">
                <div className="text-xs font-mono text-[#666]">PROCHAIN PALIER</div>
                <div className="text-sm font-mono text-[#4ECDC4]">+160 pts → Top 40</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
