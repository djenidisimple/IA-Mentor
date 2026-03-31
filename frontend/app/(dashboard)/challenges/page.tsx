'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/lib/store/authStore'
import { Button } from '@/components/ui/Button'
import { 
  Code, 
  Terminal, 
  Shield, 
  Zap, 
  Clock, 
  Star, 
  GitBranch,
  Search,
  Filter,
  ChevronRight,
  TrendingUp,
  Users,
  Award,
  Sparkles,
  ChevronDown,
  X,
  Heart,
  Flame
} from 'lucide-react'
import LoadingScreen from '@/components/ui/LoadingScreen'

// Icônes de langages (SVG)
const JavaIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8.851 18.56s-.917.534.653.714c1.902.218 2.874.187 4.969-.211 0 0 .552.346 1.323.646-4.699 2.013-10.633-.118-6.945-1.149zM8.276 15.933s-1.028.761.542.924c2.032.212 3.636.231 6.413-.313 0 0 .384.389.986.601-5.679 1.661-12.007.13-7.941-1.212zM13.116 11.475c1.158 1.333-.304 2.533-.304 2.533s2.939-1.518 1.589-3.418c-1.261-1.772-2.228-2.652 3.007-5.688 0 0-8.216 2.052-4.292 6.573zM18.26 17.491s.68.56-.749.992c-2.714.815-11.299 1.061-13.687.033-.857-.37.751-.884 1.257-.992.527-.113.828-.092.828-.092-.953-.671-6.156 1.317-2.643 1.887 9.58 1.553 17.462-.7 13.994-1.828z"/>
    <path d="M15.721 12.2c1.355 1.524-.358 2.896-.358 2.896s3.35-1.73 1.813-3.897c-1.432-2.018-2.53-3.024 3.427-6.48 0 0-9.371 2.34-4.882 7.481z"/>
  </svg>
)

const JavaScriptIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.003-2.667-2.854-1.159-.557-1.676-1.014-1.676-1.76 0-.763.506-1.157 1.316-1.157.813 0 1.403.359 1.85.814.486.55.73 1.276.73 1.276h2.094s-.104-.702-.467-1.478c-.47-1.002-1.464-1.873-3.013-1.873-1.736 0-3.01 1.026-3.01 2.612 0 1.678 1.094 2.553 2.777 3.209 1.193.475 1.6.827 1.6 1.445 0 .632-.543 1.105-1.427 1.105-.96 0-1.52-.473-1.885-1.097-.34-.578-.45-1.11-.45-1.11h-2.08s.074.986.68 1.869c.885 1.278 2.469 1.652 4.195 1.652 2.442 0 3.892-1.136 3.892-2.852 0-1.98-1.707-2.828-3.075-3.42z"/>
  </svg>
)

const PhpIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M7.01 10.207h-.944l-.472 2.68h.944c.623 0 1.11-.15 1.46-.449.35-.299.525-.718.525-1.256 0-.538-.188-.913-.564-1.127-.376-.214-.862-.321-1.458-.321-.01 0-.473-.01-1.49.473zM12 6c-4.142 0-7.5 2.462-7.5 5.5 0 1.424.637 2.734 1.729 3.788.301.289.668.539 1.075.755-.074.17-.154.339-.237.509-1.206 2.468-3.157 3.624-3.157 3.624l2.118.001c.888-1.072 1.529-2.281 1.961-3.394.369.071.75.108 1.141.108 4.142 0 7.5-2.462 7.5-5.5 0-3.038-3.358-5.5-7.5-5.5zM7.36 14.957c-.496.313-1.111.47-1.845.47h-1.49l.472-2.68h.944c.595 0 1.081.107 1.458.321.376.214.564.589.564 1.127 0 .538-.175.957-.525 1.256-.35.299-.837.449-1.46.449z"/>
  </svg>
)

const CsharpIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
  </svg>
)

const PythonIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
  </svg>
)

const RustIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
  </svg>
)

const getLanguageIcon = (language: string) => {
  if (language.includes("Java")) return <JavaIcon />
  if (language.includes("JavaScript") || language.includes("MERN") || language.includes("Node")) return <JavaScriptIcon />
  if (language.includes("PHP")) return <PhpIcon />
  if (language.includes("C#")) return <CsharpIcon />
  if (language.includes("Python")) return <PythonIcon />
  if (language.includes("Rust")) return <RustIcon />
  return <Code className="h-5 w-5" />
}

const mockChallenges = [
  {
    id: 1,
    title: "API REST Sécurisée",
    description: "JWT, OAuth2, Spring Security",
    language: "Java • Spring Boot",
    difficulty: "INTERMÉDIAIRE",
    duration: "3-5h",
    points: 500,
    completedCount: 128,
    likesCount: 342,
    tags: ["API", "Security", "JWT"],
    trending: true,
    color: "#D64933"
  },
  {
    id: 2,
    title: "Architecture Hexagonale",
    description: "DDD, Clean Architecture, Tests",
    language: "Java • Spring Boot",
    difficulty: "AVANCÉ",
    duration: "5-8h",
    points: 800,
    completedCount: 56,
    likesCount: 189,
    tags: ["DDD", "Clean Code", "Testing"],
    isNew: true,
    color: "#E8C547"
  },
  {
    id: 3,
    title: "API Asynchrone .NET",
    description: "Async/Await, Redis, Performance",
    language: "C# • .NET 8",
    difficulty: "AVANCÉ",
    duration: "4-6h",
    points: 600,
    completedCount: 89,
    likesCount: 267,
    tags: ["Async", "Redis", "Performance"],
    trending: true,
    color: "#4ECDC4"
  },
  {
    id: 4,
    title: "Laravel API",
    description: "REST, OAuth2, Passport",
    language: "PHP • Laravel",
    difficulty: "INTERMÉDIAIRE",
    duration: "3-5h",
    points: 450,
    completedCount: 234,
    likesCount: 567,
    tags: ["Laravel", "OAuth2", "API"],
    trending: true,
    color: "#FF6B6B"
  },
  {
    id: 5,
    title: "FullStack MERN",
    description: "React, Node.js, MongoDB",
    language: "JavaScript • MERN",
    difficulty: "DÉBUTANT",
    duration: "6-8h",
    points: 400,
    completedCount: 312,
    likesCount: 789,
    tags: ["React", "Node.js", "MongoDB"],
    isNew: true,
    color: "#27C93F"
  },
  {
    id: 6,
    title: "Microservices",
    description: "Spring Cloud, Docker, Kafka",
    language: "Java • Spring Cloud",
    difficulty: "AVANCÉ",
    duration: "8-10h",
    points: 1000,
    completedCount: 34,
    likesCount: 98,
    tags: ["Microservices", "Docker", "Kafka"],
    trending: true,
    color: "#D64933"
  }
]

const languages = ["Tous", "Java", "JavaScript", "PHP", "C#", "Python", "Rust"]
const difficulties = ["Tous", "DÉBUTANT", "INTERMÉDIAIRE", "AVANCÉ"]

export default function ChallengesPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [challenges, setChallenges] = useState(mockChallenges)
  const [filteredChallenges, setFilteredChallenges] = useState(mockChallenges)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState("Tous")
  const [selectedDifficulty, setSelectedDifficulty] = useState("Tous")
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState<"popular" | "newest" | "points">("popular")
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    const loadChallenges = async () => {
      await new Promise(resolve => setTimeout(resolve, 500))
      setLoading(false)
    }
    loadChallenges()
  }, [])

  useEffect(() => {
    let result = [...challenges]

    if (searchTerm) {
      result = result.filter(c => 
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (selectedLanguage !== "Tous") {
      result = result.filter(c => c.language.toLowerCase().includes(selectedLanguage.toLowerCase()))
    }

    if (selectedDifficulty !== "Tous") {
      result = result.filter(c => c.difficulty === selectedDifficulty)
    }

    switch (sortBy) {
      case "popular":
        result.sort((a, b) => b.completedCount - a.completedCount)
        break
      case "newest":
        result.sort((a, b) => (a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1))
        break
      case "points":
        result.sort((a, b) => b.points - a.points)
        break
    }

    setFilteredChallenges(result)
  }, [challenges, searchTerm, selectedLanguage, selectedDifficulty, sortBy])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'DÉBUTANT': return { bg: 'bg-[#27C93F]/10', text: '#27C93F', border: '#27C93F' }
      case 'INTERMÉDIAIRE': return { bg: 'bg-[#E8C547]/10', text: '#E8C547', border: '#E8C547' }
      case 'AVANCÉ': return { bg: 'bg-[#FF6B6B]/10', text: '#FF6B6B', border: '#FF6B6B' }
      default: return { bg: 'bg-[#666]/10', text: '#666', border: '#666' }
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
        
        {/* Header simplifié */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 bg-[#D64933]/10 border-l-4 border-[#D64933] px-4 py-2 mb-4">
            <Terminal className="h-3 w-3 text-[#D64933]" />
            <span className="text-[#E8C547] text-[10px] font-mono font-bold tracking-[2px]">CATALOGUE</span>
          </div>
          <h1 className="text-5xl font-black tracking-[-3px]">
            CHALLENGES <span className="text-[#D64933]">TECHNIQUES</span>
          </h1>
        </div>

        {/* Stats simplifiées - style terminal */}
        <div className="grid grid-cols-4 gap-4 mb-12">
          {[
            { value: "12", label: "CHALLENGES", icon: Terminal, color: "#D64933" },
            { value: "1.3k", label: "COMPLÉTÉS", icon: Users, color: "#E8C547" },
            { value: "3.7k", label: "LIKES", icon: Heart, color: "#FF6B6B" },
            { value: "5", label: "TENDANCES", icon: Flame, color: "#4ECDC4" }
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
                placeholder="Rechercher un challenge..."
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
                  {languages.map(lang => <option key={lang} value={lang}>{lang}</option>)}
                </select>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="bg-[#1A1919] border border-[#333] text-[#F2E9E2] font-mono text-sm px-3 py-2 outline-none"
                >
                  {difficulties.map(diff => <option key={diff} value={diff}>{diff}</option>)}
                </select>
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
              {(searchTerm || selectedLanguage !== "Tous" || selectedDifficulty !== "Tous") && (
                <button onClick={clearFilters} className="text-xs font-mono text-[#666] hover:text-[#D64933] flex items-center gap-1">
                  <X className="h-3 w-3" /> Effacer
                </button>
              )}
            </div>
          )}
        </div>

        {/* Challenges Grid - Style créatif */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChallenges.map((challenge, index) => {
            const diffColors = getDifficultyColor(challenge.difficulty)
            const isHovered = hoveredCard === challenge.id
            
            return (
              <div
                key={challenge.id}
                className="group relative cursor-pointer"
                onMouseEnter={() => setHoveredCard(challenge.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Background gradient effect */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(circle at top right, ${challenge.color}10, transparent)`
                  }}
                />
                
                {/* Card */}
                <div className="relative bg-[#0F0E0E] border border-[#333] group-hover:border-[#D64933]/50 transition-all duration-300 overflow-hidden">
                  {/* Decorative corner */}
                  <div className="absolute top-0 right-0 w-16 h-16 opacity-10 group-hover:opacity-30 transition-opacity">
                    <div className="absolute top-0 right-0 w-0 h-0 border-t-[64px] border-r-[64px] border-t-transparent border-r-[#D64933]" />
                  </div>
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    {challenge.isNew && (
                      <span className="text-[8px] font-mono font-bold bg-[#D64933] text-[#1A1919] px-2 py-0.5">NEW</span>
                    )}
                    {challenge.trending && (
                      <span className="text-[8px] font-mono font-bold bg-[#E8C547] text-[#1A1919] px-2 py-0.5 flex items-center gap-1">
                        <Flame className="h-2 w-2" /> HOT
                      </span>
                    )}
                  </div>
                  
                  <div className="p-6">
                    {/* Language icon & difficulty */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#1A1919] border border-[#333] flex items-center justify-center group-hover:scale-110 transition-transform">
                          {getLanguageIcon(challenge.language)}
                        </div>
                        <span className="text-[10px] font-mono text-[#666]">{challenge.language.split(" • ")[0]}</span>
                      </div>
                      <div 
                        className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: diffColors.bg, color: diffColors.text }}
                      >
                        {challenge.difficulty}
                      </div>
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-xl font-bold mb-2 group-hover:text-[#D64933] transition-colors">
                      {challenge.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-[#B8B0A0] font-mono text-xs mb-4">
                      {challenge.description}
                    </p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {challenge.tags.map((tag, i) => (
                        <span key={i} className="text-[8px] font-mono text-[#666] bg-[#1A1919] px-2 py-0.5 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    
                    {/* Stats */}
                    <div className="flex items-center justify-between pt-4 border-t border-[#333]">
                      <div className="flex items-center gap-3 text-[10px] font-mono text-[#666]">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>{challenge.completedCount}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          <span>{challenge.likesCount}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{challenge.duration}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-xs font-mono font-bold text-[#E8C547]">{challenge.points} pts</div>
                        <Link href={`/challenges/${challenge.id}`}>
                          <div className="w-8 h-8 rounded-full bg-[#D64933] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
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
        {filteredChallenges.length === 0 && (
          <div className="text-center py-16 bg-[#0F0E0E] border-l-4 border-[#D64933]">
            <Search className="h-12 w-12 text-[#666] mx-auto mb-4" />
            <p className="text-[#B8B0A0] font-mono text-sm">Aucun challenge trouvé</p>
            <button onClick={clearFilters} className="mt-4 text-[#D64933] font-mono text-sm hover:underline">
              Effacer les filtres
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
