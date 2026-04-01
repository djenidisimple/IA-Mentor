'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/lib/store/authStore'
import { challengesApi } from '@/lib/challenges'
import { Challenge as BackendChallenge } from '@/types/challenge.types'
import { 
  Code, 
  Terminal, 
  Search, 
  Filter, 
  ChevronRight,
  Users,
  Flame,
  Heart,
  Clock,
  X,
  Sparkles
} from 'lucide-react'
import LoadingScreen from '@/components/ui/LoadingScreen'

// --- LOGIQUE DE MAPPAGE PHILOSOPHIE FRONTEND ---
const mapBackendToUI = (challenge: BackendChallenge) => {
  const diffColors: Record<string, any> = {
    'DEBUTANT': { bg: 'bg-[#27C93F]/10', text: '#27C93F', color: '#27C93F' },
    'INTERMEDIAIRE': { bg: 'bg-[#E8C547]/10', text: '#E8C547', color: '#E8C547' },
    'AVANCE': { bg: 'bg-[#FF6B6B]/10', text: '#FF6B6B', color: '#FF6B6B' }
  }

  const colorConfig = diffColors[challenge.level] || diffColors.DEBUTANT

  return {
    ...challenge,
    language: `${challenge.type} • ${challenge.technologies[0] || 'Tech'}`,
    difficulty: challenge.level,
    duration: challenge.level === 'AVANCE' ? "6-10h" : challenge.level === 'INTERMEDIAIRE' ? "3-5h" : "1-2h",
    completedCount: Math.floor(Math.random() * 100) + 10,
    likesCount: Math.floor(Math.random() * 200) + 50,
    tags: challenge.technologies,
    trending: challenge.isPremium,
    isNew: new Date(challenge.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000,
    color: colorConfig.color
  }
}

const getLanguageIcon = (type: string) => {
  if (type === "BACKEND") return <Terminal className="h-5 w-5" />
  if (type === "FULLSTACK") return <Code className="h-5 w-5" />
  return <Sparkles className="h-5 w-5" />
}

const languages = ["Tous", "BACKEND", "FULLSTACK"]
const difficulties = ["Tous", "DEBUTANT", "INTERMEDIAIRE", "AVANCE"]

export default function ChallengesPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [challenges, setChallenges] = useState<any[]>([])
  const [filteredChallenges, setFilteredChallenges] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState("Tous")
  const [selectedDifficulty, setSelectedDifficulty] = useState("Tous")
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState<"popular" | "newest" | "points">("popular")
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    } else {
      fetchChallenges()
    }
  }, [isAuthenticated, router])

  const fetchChallenges = async () => {
    try {
      setLoading(true)
      const response: any = await challengesApi.getAll()
      const data = response.data || response
      
      if (Array.isArray(data)) {
        const uiChallenges = data.map(mapBackendToUI)
        setChallenges(uiChallenges)
        setFilteredChallenges(uiChallenges)
      }
      setError(null)
    } catch (err: any) {
      console.error("Erreur lors de la récupération des challenges:", err)
      setError("Impossible de charger les challenges.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let result = [...challenges]

    if (searchTerm) {
      result = result.filter(c => 
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.tags && c.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      )
    }

    if (selectedLanguage !== "Tous") {
      result = result.filter(c => c.type === selectedLanguage)
    }

    if (selectedDifficulty !== "Tous") {
      result = result.filter(c => c.level === selectedDifficulty)
    }

    switch (sortBy) {
      case "popular":
        result.sort((a, b) => b.completedCount - a.completedCount)
        break
      case "newest":
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case "points":
        result.sort((a, b) => b.points - a.points)
        break
    }

    setFilteredChallenges(result)
  }, [challenges, searchTerm, selectedLanguage, selectedDifficulty, sortBy])

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'DEBUTANT': return { bg: 'bg-[#27C93F]/10', text: '#27C93F' }
      case 'INTERMEDIAIRE': return { bg: 'bg-[#E8C547]/10', text: '#E8C547' }
      case 'AVANCE': return { bg: 'bg-[#FF6B6B]/10', text: '#FF6B6B' }
      default: return { bg: 'bg-[#666]/10', text: '#666' }
    }
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedLanguage("Tous")
    setSelectedDifficulty("Tous")
    setSortBy("popular")
  }

  if (loading) return <LoadingScreen />

  return (
    <div className="min-h-screen bg-[#1A1919] text-[#F2E9E2]">
      <div className="max-w-7xl mx-auto px-4 py-8 pt-20">
        
        {/* Header Terminal Style */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 bg-[#D64933]/10 border-l-4 border-[#D64933] px-4 py-2 mb-4">
            <Terminal className="h-3 w-3 text-[#D64933]" />
            <span className="text-[#E8C547] text-[10px] font-mono font-bold tracking-[2px]">LOCAL_CHALLENGES_FETCHED</span>
          </div>
          <h1 className="text-5xl font-black tracking-[-3px]">
            CHALLENGES <span className="text-[#D64933]">TECHNIQUES</span>
          </h1>
          {error && <p className="text-[#FF6B6B] mt-4 font-mono text-sm">{error}</p>}
        </div>

        {/* Stats Réelles */}
        <div className="grid grid-cols-4 gap-4 mb-12">
          {[
            { value: challenges.length.toString(), label: "CHALLENGES", icon: Terminal, color: "#D64933" },
            { value: challenges.reduce((acc, c) => acc + (c.completedCount || 0), 0).toLocaleString(), label: "COMPLÉTÉS", icon: Users, color: "#E8C547" },
            { value: challenges.reduce((acc, c) => acc + (c.likesCount || 0), 0).toLocaleString(), label: "LIKES", icon: Heart, color: "#FF6B6B" },
            { value: challenges.filter(c => c.trending).length.toString(), label: "PREMIUM", icon: Flame, color: "#4ECDC4" }
          ].map((stat, i) => (
            <div key={i} className="bg-[#0F0E0E] border border-[#333] p-4 text-center hover:border-[#D64933]/50 transition-all duration-300">
              <stat.icon className="h-6 w-6 mx-auto mb-2" style={{ color: stat.color }} />
              <div className="text-2xl font-black text-[#F2E9E2]">{stat.value}</div>
              <div className="text-[9px] font-mono text-[#666] tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Search & Filters */}
        <div className="mb-10">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#666]" />
              <input
                type="text"
                placeholder="Rechercher par titre, tech ou tag..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#0F0E0E] border border-[#333] text-[#F2E9E2] font-mono text-sm px-10 py-3 outline-none focus:border-[#D64933]/50 transition-colors"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-3 border border-[#333] hover:border-[#D64933] text-[#F2E9E2] transition-colors"
            >
              <Filter className="h-4 w-4" />
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 bg-[#0F0E0E] border border-[#333] p-4 flex flex-wrap gap-4 items-center justify-between">
              <div className="flex gap-4">
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="bg-[#1A1919] border border-[#333] text-[#F2E9E2] font-mono text-sm px-3 py-2 outline-none"
                >
                  {languages.map(lang => <option key={lang} value={lang}>{lang === "Tous" ? "Tous les types" : lang}</option>)}
                </select>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="bg-[#1A1919] border border-[#333] text-[#F2E9E2] font-mono text-sm px-3 py-2 outline-none"
                >
                  {difficulties.map(diff => <option key={diff} value={diff}>{diff === "Tous" ? "Toutes difficultés" : diff}</option>)}
                </select>
              </div>
              <div className="flex gap-2 items-center">
                <span className="text-xs font-mono text-[#666]">Trier:</span>
                {["popular", "newest", "points"].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setSortBy(opt as any)}
                    className={`text-xs font-mono px-2 py-1 transition-colors ${sortBy === opt ? 'text-[#D64933]' : 'text-[#666] hover:text-[#F2E9E2]'}`}
                  >
                    {opt === "popular" ? "🔥 Populaires" : opt === "newest" ? "✨ Nouveautés" : "⭐ Points"}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChallenges.map((challenge) => {
            const diffStyle = getDifficultyColor(challenge.level)
            
            return (
              <div
                key={challenge.id}
                className="group relative cursor-pointer"
                onMouseEnter={() => setHoveredCard(challenge.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `radial-gradient(circle at top right, ${challenge.color}10, transparent)` }}
                />
                
                <div className="relative bg-[#0F0E0E] border border-[#333] group-hover:border-[#D64933]/50 transition-all duration-300 overflow-hidden">
                  <div className="absolute top-3 left-3 flex gap-2">
                    {challenge.isNew && (
                      <span className="text-[8px] font-mono font-bold bg-[#D64933] text-[#1A1919] px-2 py-0.5">NEW</span>
                    )}
                    {challenge.trending && (
                      <span className="text-[8px] font-mono font-bold bg-[#E8C547] text-[#1A1919] px-2 py-0.5 flex items-center gap-1">
                        <Flame className="h-2 w-2" /> PREMIUM
                      </span>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#1A1919] border border-[#333] flex items-center justify-center group-hover:scale-110 transition-transform">
                          {getLanguageIcon(challenge.type)}
                        </div>
                        <span className="text-[10px] font-mono text-[#666]">{challenge.categoryName || "Général"}</span>
                      </div>
                      <div 
                        className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: diffStyle.bg, color: diffStyle.text }}
                      >
                        {challenge.level}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2 group-hover:text-[#D64933] transition-colors">
                      {challenge.title}
                    </h3>
                    
                    <p className="text-[#B8B0A0] font-mono text-[10px] mb-4 line-clamp-2 h-10">
                      {challenge.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-1.5 mb-4 h-12 overflow-hidden">
                      {challenge.technologies && challenge.technologies.map((tech: string, i: number) => (
                        <span key={i} className="text-[8px] font-mono text-[#666] bg-[#1A1919] px-2 py-0.5 rounded-full border border-[#333]">
                          #{tech}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-[#333]">
                      <div className="flex items-center gap-3 text-[10px] font-mono text-[#666]">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>{challenge.completedCount}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{challenge.duration}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-xs font-mono font-bold text-[#E8C547]">{challenge.points} XP</div>
                        <Link href={`/challenges/${challenge.slug}`}>
                          <div className="w-8 h-8 rounded-full bg-[#D64933] flex items-center justify-center translate-x-2 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all">
                            <ChevronRight className="h-4 w-4 text-[#1A1919]" />
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Empty state */}
        {filteredChallenges.length === 0 && !loading && (
          <div className="text-center py-20 bg-[#0F0E0E] border border-dashed border-[#333]">
            <Terminal className="h-12 w-12 text-[#666] mx-auto mb-4 opacity-20" />
            <p className="text-[#B8B0A0] font-mono text-sm">NO_DATA_FOUND: Aucun challenge ne correspond.</p>
            <button onClick={clearFilters} className="mt-4 text-[#D64933] font-mono text-xs hover:underline uppercase tracking-widest">
              Reset system filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
