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
  ArrowLeft,
  ChevronRight,
  Users,
  Award,
  Flame,
  CheckCircle,
  AlertCircle,
  Copy,
  ExternalLink,
  Play,
  FileText,
  BookOpen,
  Target,
  Trophy,
  Sparkles
} from 'lucide-react'
import LoadingScreen from '@/components/ui/LoadingScreen'

// Icônes de langages (même code que dans ChallengesPage)
const getLanguageIcon = (language: string) => {
  if (language.includes("Java")) return <JavaIcon />
  if (language.includes("JavaScript") || language.includes("MERN") || language.includes("Node")) return <JavaScriptIcon />
  if (language.includes("PHP")) return <PhpIcon />
  if (language.includes("C#")) return <CsharpIcon />
  if (language.includes("Python")) return <PythonIcon />
  if (language.includes("Rust")) return <RustIcon />
  return <Code className="h-5 w-5" />
}

// Icônes SVG pour les langages
const JavaIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8.851 18.56s-.917.534.653.714c1.902.218 2.874.187 4.969-.211 0 0 .552.346 1.323.646-4.699 2.013-10.633-.118-6.945-1.149zM8.276 15.933s-1.028.761.542.924c2.032.212 3.636.231 6.413-.313 0 0 .384.389.986.601-5.679 1.661-12.007.13-7.941-1.212zM13.116 11.475c1.158 1.333-.304 2.533-.304 2.533s2.939-1.518 1.589-3.418c-1.261-1.772-2.228-2.652 3.007-5.688 0 0-8.216 2.052-4.292 6.573zM18.26 17.491s.68.56-.749.992c-2.714.815-11.299 1.061-13.687.033-.857-.37.751-.884 1.257-.992.527-.113.828-.092.828-.092-.953-.671-6.156 1.317-2.643 1.887 9.58 1.553 17.462-.7 13.994-1.828z"/>
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

// Données mockées du challenge
const mockChallengeDetail = {
  id: 1,
  title: "API REST Sécurisée",
  description: "Implémente une API REST complète avec authentification JWT, gestion des rôles, validation des données et documentation Swagger. L'IA analysera ta sécurité, tes performances et la qualité de ton code.",
  longDescription: `
## Objectif
Créer une API REST sécurisée avec Spring Boot qui expose des endpoints pour la gestion d'utilisateurs. L'API doit inclure :
- Authentification JWT
- Gestion des rôles (USER, ADMIN)
- Validation des données d'entrée
- Documentation Swagger/OpenAPI
- Tests unitaires et d'intégration

## Critères d'évaluation
L'IA analysera ton code selon plusieurs critères :
- **Sécurité** (40%) : Protection contre les failles OWASP, gestion des tokens, validation
- **Architecture** (30%) : Structure du code, séparation des responsabilités
- **Performance** (20%) : Optimisation des requêtes, caching
- **Documentation** (10%) : Swagger, commentaires, README

## Technologies
- Spring Boot 3.x
- Spring Security
- JWT
- PostgreSQL
- Maven/Gradle
`,
  language: "Java • Spring Boot",
  difficulty: "INTERMÉDIAIRE",
  duration: "3-5h",
  points: 500,
  completedCount: 128,
  likesCount: 342,
  tags: ["API REST", "JWT", "Spring Security", "OWASP"],
  requirements: [
    "Java 17 ou supérieur",
    "Spring Boot 3.x",
    "PostgreSQL 14+",
    "Maven ou Gradle",
    "Git"
  ],
  deliverables: [
    "Code source sur GitHub",
    "Documentation Swagger",
    "Tests unitaires",
    "README avec instructions"
  ],
  evaluationCriteria: [
    { name: "Sécurité", weight: 40, description: "Authentification JWT, protection CSRF, validation" },
    { name: "Architecture", weight: 30, description: "Clean architecture, séparation des couches" },
    { name: "Performance", weight: 20, description: "Optimisation, caching, indices DB" },
    { name: "Documentation", weight: 10, description: "Swagger, commentaires, README" }
  ]
}

export default function ChallengeDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { isAuthenticated, user } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [challenge, setChallenge] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<"overview" | "submission">("overview")
  const [githubUrl, setGithubUrl] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    const loadChallenge = async () => {
      await new Promise(resolve => setTimeout(resolve, 500))
      setChallenge(mockChallengeDetail)
      setLoading(false)
    }
    loadChallenge()
  }, [params.id])

  const handleCopyRepo = () => {
    const repoUrl = "https://github.com/devreview/challenge-template"
    navigator.clipboard.writeText(repoUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSubmit = async () => {
    if (!githubUrl.trim()) {
      setSubmitError("Veuillez entrer l'URL de votre repository GitHub")
      return
    }

    if (!githubUrl.includes("github.com")) {
      setSubmitError("Veuillez entrer une URL GitHub valide")
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      // Simulation d'appel API
      await new Promise(resolve => setTimeout(resolve, 1500))
      setSubmitSuccess(true)
      
      // Redirection vers la page de résultats après 2 secondes
      setTimeout(() => {
        router.push(`/challenges/${params.id}/results`)
      }, 2000)
    } catch (error) {
      setSubmitError("Erreur lors de la soumission. Veuillez réessayer.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'DÉBUTANT': return { bg: 'bg-[#27C93F]/10', text: '#27C93F', border: '#27C93F' }
      case 'INTERMÉDIAIRE': return { bg: 'bg-[#E8C547]/10', text: '#E8C547', border: '#E8C547' }
      case 'AVANCÉ': return { bg: 'bg-[#FF6B6B]/10', text: '#FF6B6B', border: '#FF6B6B' }
      default: return { bg: 'bg-[#666]/10', text: '#666', border: '#666' }
    }
  }

  if (loading) return <LoadingScreen />

  return (
    <div className="min-h-screen bg-[#1A1919] text-[#F2E9E2]">
      <div className="max-w-7xl mx-auto px-4 py-8 pt-20">
        
        {/* Back button */}
        <Link href="/challenges" className="inline-flex items-center gap-2 text-[#666] hover:text-[#D64933] transition-colors mb-6 group">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-mono">Retour aux challenges</span>
        </Link>

        {/* Header */}
        <div className="flex flex-wrap justify-between items-start gap-6 mb-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#D64933]/10 flex items-center justify-center">
                {getLanguageIcon(challenge.language)}
              </div>
              <div className="text-xs font-mono text-[#D64933]">{challenge.language}</div>
              <div className={`text-xs font-mono px-2 py-0.5 rounded-full`}
                   style={{ backgroundColor: getDifficultyColor(challenge.difficulty).bg, color: getDifficultyColor(challenge.difficulty).text }}>
                {challenge.difficulty}
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-[-2px] mb-3">
              {challenge.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-[#666]">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{challenge.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-[#E8C547]" />
                <span>{challenge.points} points</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{challenge.completedCount} complétés</span>
              </div>
              <div className="flex items-center gap-1">
                {/* <Heart className="h-4 w-4 text-[#FF6B6B]" /> */}
                <span>{challenge.likesCount} likes</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button className="bg-[#D64933] hover:bg-[#B33A22] text-white rounded-full px-6 py-3">
              <Play className="h-4 w-4 mr-2" />
              Commencer le challenge
            </Button>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {challenge.tags.map((tag: string, i: number) => (
            <span key={i} className="text-[10px] font-mono text-[#666] bg-[#0F0E0E] px-2 py-1 rounded-full">
              #{tag}
            </span>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-[#333]">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-6 py-3 font-mono text-sm transition-all duration-300 ${
              activeTab === "overview" 
                ? 'text-[#D64933] border-b-2 border-[#D64933]' 
                : 'text-[#666] hover:text-[#F2E9E2]'
            }`}
          >
            <FileText className="h-4 w-4 inline mr-2" />
            DESCRIPTION
          </button>
          <button
            onClick={() => setActiveTab("submission")}
            className={`px-6 py-3 font-mono text-sm transition-all duration-300 ${
              activeTab === "submission" 
                ? 'text-[#D64933] border-b-2 border-[#D64933]' 
                : 'text-[#666] hover:text-[#F2E9E2]'
            }`}
          >
            <GitBranch className="h-4 w-4 inline mr-2" />
            SOUMETTRE MON CODE
          </button>
        </div>

        {/* Content */}
        {activeTab === "overview" ? (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-[#0F0E0E] p-6 rounded-xl border border-[#333]">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-[#D64933]" />
                  Description
                </h3>
                <div className="prose prose-invert max-w-none">
                  <p className="text-[#B8B0A0] leading-relaxed">{challenge.description}</p>
                </div>
              </div>

              <div className="bg-[#0F0E0E] p-6 rounded-xl border border-[#333]">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Target className="h-5 w-5 text-[#D64933]" />
                  Objectifs
                </h3>
                <pre className="font-mono text-sm text-[#B8B0A0] whitespace-pre-wrap leading-relaxed">
                  {challenge.longDescription}
                </pre>
              </div>

              <div className="bg-[#0F0E0E] p-6 rounded-xl border border-[#333]">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-[#D64933]" />
                  Livrables attendus
                </h3>
                <ul className="space-y-2">
                  {challenge.deliverables.map((item: string, i: number) => (
                    <li key={i} className="flex items-center gap-2 text-[#B8B0A0] text-sm">
                      <div className="w-1.5 h-1.5 bg-[#D64933] rounded-full"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-[#0F0E0E] p-6 rounded-xl border border-[#333]">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5 text-[#D64933]" />
                  Critères d'évaluation
                </h3>
                <div className="space-y-4">
                  {challenge.evaluationCriteria.map((criterion: any, i: number) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-[#F2E9E2]">{criterion.name}</span>
                        <span className="text-[#D64933]">{criterion.weight}%</span>
                      </div>
                      <div className="h-1.5 bg-[#333] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#D64933] rounded-full"
                          style={{ width: `${criterion.weight}%` }}
                        />
                      </div>
                      <p className="text-xs text-[#666] mt-1">{criterion.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#0F0E0E] p-6 rounded-xl border border-[#333]">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Terminal className="h-5 w-5 text-[#D64933]" />
                  Prérequis
                </h3>
                <ul className="space-y-2">
                  {challenge.requirements.map((req: string, i: number) => (
                    <li key={i} className="flex items-center gap-2 text-[#B8B0A0] text-sm">
                      <div className="w-1.5 h-1.5 bg-[#D64933] rounded-full"></div>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#0F0E0E] p-6 rounded-xl border border-[#333]">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <GitBranch className="h-5 w-5 text-[#D64933]" />
                  Template de démarrage
                </h3>
                <div className="flex items-center justify-between bg-[#1A1919] p-3 rounded-lg border border-[#333]">
                  <code className="text-xs font-mono text-[#B8B0A0]">devreview/challenge-template</code>
                  <button 
                    onClick={handleCopyRepo}
                    className="text-[#666] hover:text-[#D64933] transition-colors"
                  >
                    {copied ? <CheckCircle className="h-4 w-4 text-[#27C93F]" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-[#666] mt-3">
                  Utilise ce template pour démarrer rapidement ton projet
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <div className="bg-[#0F0E0E] rounded-xl border border-[#333] p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-[#D64933]/10 flex items-center justify-center mx-auto mb-4">
                  <GitBranch className="h-8 w-8 text-[#D64933]" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Soumets ton code</h2>
                <p className="text-[#B8B0A0] text-sm">
                  Une fois ton challenge terminé, partage le lien de ton repository GitHub.
                  L'IA analysera ton code et te donnera un retour détaillé.
                </p>
              </div>

              {submitSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-[#27C93F]/20 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-[#27C93F]" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Soumission réussie !</h3>
                  <p className="text-[#B8B0A0] text-sm mb-6">
                    Ton code est en cours d'analyse. Tu recevras un rapport détaillé dans quelques instants.
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-[#D64933] rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-[#D64933] rounded-full animate-pulse delay-150"></div>
                    <div className="w-2 h-2 bg-[#D64933] rounded-full animate-pulse delay-300"></div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-mono text-[#D64933] mb-2">
                      URL DU REPOSITORY GITHUB
                    </label>
                    <div className="relative">
                      <GitBranch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#666]" />
                      <input
                        type="url"
                        value={githubUrl}
                        onChange={(e) => setGithubUrl(e.target.value)}
                        placeholder="https://github.com/username/mon-challenge"
                        className="w-full bg-[#1A1919] border border-[#333] text-[#F2E9E2] font-mono text-sm pl-10 pr-4 py-3 outline-none focus:border-[#D64933]/50 rounded-lg transition-colors"
                      />
                    </div>
                    <p className="text-xs text-[#666] mt-2">
                      Assure-toi que ton repository est public pour que l'IA puisse l'analyser
                    </p>
                  </div>

                  {submitError && (
                    <div className="flex items-center gap-2 bg-[#FF6B6B]/10 border-l-4 border-[#FF6B6B] p-3 rounded">
                      <AlertCircle className="h-4 w-4 text-[#FF6B6B]" />
                      <p className="text-xs text-[#FF6B6B]">{submitError}</p>
                    </div>
                  )}

                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full bg-[#D64933] hover:bg-[#B33A22] text-white rounded-full py-4"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-pulse">ANALYSE EN COURS</span>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        SOUMETTRE MON CODE
                        <ChevronRight className="h-4 w-4" />
                      </span>
                    )}
                  </Button>

                  <div className="text-center pt-4 border-t border-[#333]">
                    <p className="text-xs text-[#666]">
                      En soumettant ton code, tu acceptes qu'il soit analysé par notre IA.
                      Tu recevras un rapport détaillé par email.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Tips */}
            <div className="mt-6 p-4 bg-[#0F0E0E]/50 rounded-lg border border-[#333]">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-[#E8C547]" />
                <span className="text-xs font-mono text-[#E8C547]">CONSEILS POUR UN BON SCORE</span>
              </div>
              <ul className="space-y-1 text-xs text-[#666]">
                <li>• Assure-toi d'avoir une documentation claire (README, Swagger)</li>
                <li>• Inclus des tests unitaires pour valider ton code</li>
                <li>• Suis les bonnes pratiques de sécurité (JWT, validation)</li>
                <li>• Structure ton code proprement (séparation des responsabilités)</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
