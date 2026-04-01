'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/lib/store/authStore'
import { challengesApi } from '@/lib/challenges'
import { submissionsApi } from '@/lib/submissions'
import { Challenge as BackendChallenge } from '@/types/challenge.types'
import { Button } from '@/components/ui/Button'
import { 
  Code, 
  Terminal, 
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
  Play,
  FileText,
  BookOpen,
  Target,
  Sparkles
} from 'lucide-react'
import LoadingScreen from '@/components/ui/LoadingScreen'

const mapBackendToUI = (challenge: BackendChallenge) => {
  const diffColors: Record<string, any> = {
    'DEBUTANT': { bg: 'bg-[#27C93F]/10', text: '#27C93F', border: '#27C93F' },
    'INTERMEDIAIRE': { bg: 'bg-[#E8C547]/10', text: '#E8C547', border: '#E8C547' },
    'AVANCE': { bg: 'bg-[#FF6B6B]/10', text: '#FF6B6B', border: '#FF6B6B' }
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
    color: colorConfig.text,
    diffStyle: colorConfig
  }
}

const getLanguageIcon = (type: string) => {
  if (type === "BACKEND") return <Terminal className="h-6 w-6" />
  if (type === "FULLSTACK") return <Code className="h-6 w-6" />
  return <Sparkles className="h-6 w-6" />
}

export default function ChallengeDetailPage({ params }: { params: { slug: string } }) {
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
    } else {
      loadChallenge()
    }
  }, [isAuthenticated, router, params.slug])

  const loadChallenge = async () => {
    try {
      setLoading(true)
      const response: any = await challengesApi.getBySlug(params.slug)
      const data = response.data || response
      
      if (data) {
        setChallenge(mapBackendToUI(data))
      }
    } catch (err) {
      console.error("Erreur lors du chargement du challenge:", err)
    } finally {
      setLoading(false)
    }
  }

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
      await submissionsApi.submit({
        challengeId: challenge.id,
        githubUrl: githubUrl.trim()
      })
      
      setSubmitSuccess(true)
      
      // Notification de succès et redirection
      setTimeout(() => {
        router.push('/dashboard') // Redirection vers le dashboard pour voir la progression
      }, 3000)
    } catch (error: any) {
      setSubmitError(error.message || "Erreur lors de la soumission. Veuillez réessayer.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) return <LoadingScreen />
  if (!challenge) return (
    <div className="min-h-screen bg-[#1A1919] flex items-center justify-center text-[#F2E9E2]">
      <div className="text-center">
        <AlertCircle className="h-12 w-12 text-[#D64933] mx-auto mb-4" />
        <p>Challenge introuvable.</p>
        <Link href="/challenges" className="text-[#D64933] hover:underline mt-4 inline-block">Retour à la liste</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#1A1919] text-[#F2E9E2]">
      <div className="max-w-7xl mx-auto px-4 py-8 pt-20">
        
        <Link href="/challenges" className="inline-flex items-center gap-2 text-[#666] hover:text-[#D64933] transition-colors mb-6 group">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-mono">Retour aux challenges</span>
        </Link>

        {/* Header Section */}
        <div className="flex flex-wrap justify-between items-start gap-6 mb-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#D64933]/10 flex items-center justify-center">
                {getLanguageIcon(challenge.type)}
              </div>
              <div className="text-xs font-mono text-[#D64933]">{challenge.categoryName || "Général"}</div>
              <div className="text-[10px] font-mono px-2 py-0.5 rounded-full"
                   style={{ backgroundColor: challenge.diffStyle.bg, color: challenge.diffStyle.text }}>
                {challenge.level}
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-[-2px] mb-3">
              {challenge.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-[#666]">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>~{challenge.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-[#E8C547]" />
                <span>{challenge.points} XP</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{challenge.completedCount} complétés</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => setActiveTab("submission")}
              className="bg-[#D64933] hover:bg-[#B33A22] text-white rounded-full px-6 py-3 font-bold"
            >
              <Play className="h-4 w-4 mr-2" />
              LANCER LE DÉFI
            </Button>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex gap-2 mb-6 border-b border-[#333]">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-6 py-3 font-mono text-xs tracking-widest transition-all duration-300 ${
              activeTab === "overview" 
                ? 'text-[#D64933] border-b-2 border-[#D64933]' 
                : 'text-[#666] hover:text-[#F2E9E2]'
            }`}
          >
            DESCRIPTION
          </button>
          <button
            onClick={() => setActiveTab("submission")}
            className={`px-6 py-3 font-mono text-xs tracking-widest transition-all duration-300 ${
              activeTab === "submission" 
                ? 'text-[#D64933] border-b-2 border-[#D64933]' 
                : 'text-[#666] hover:text-[#F2E9E2]'
            }`}
          >
            SOUMISSION
          </button>
        </div>

        {/* Content Section */}
        {activeTab === "overview" ? (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-[#0F0E0E] p-8 rounded-xl border border-[#333]">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-[#D64933]">
                  <FileText className="h-5 w-5" />
                  CONTEXTE DU CHALLENGE
                </h3>
                <div className="text-[#B8B0A0] leading-relaxed font-mono text-sm whitespace-pre-wrap">
                  {challenge.description}
                </div>
              </div>

              <div className="bg-[#0F0E0E] p-8 rounded-xl border border-[#333]">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-[#D64933]">
                  <Target className="h-5 w-5" />
                  OBJECTIFS TECHNIQUES
                </h3>
                <ul className="space-y-4">
                  {(challenge.criteresIA && challenge.criteresIA.length > 0) ? (
                    challenge.criteresIA.map((criterion: string, i: number) => (
                      <li key={i} className="flex gap-3 text-sm text-[#B8B0A0]">
                        <div className="mt-1"><CheckCircle className="h-4 w-4 text-[#27C93F]" /></div>
                        <span>{criterion}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-[#666] italic">Aucun critère spécifique défini.</li>
                  )}
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-[#0F0E0E] p-6 rounded-xl border border-[#333]">
                <h3 className="text-xs font-mono font-bold text-[#666] mb-4 tracking-tighter">TECHNOLOGIES</h3>
                <div className="flex flex-wrap gap-2">
                  {challenge.technologies.map((tech: string, i: number) => (
                    <span key={i} className="bg-[#1A1919] border border-[#333] px-3 py-1 rounded text-xs text-[#F2E9E2] font-mono">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-[#0F0E0E] p-6 rounded-xl border border-[#333]">
                <h3 className="text-xs font-mono font-bold text-[#666] mb-4 tracking-tighter">ÉVALUATION IA</h3>
                <div className="space-y-4">
                   <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-[#666]">Poursuite d objectifs</span>
                      <span className="text-[#D64933]">60%</span>
                   </div>
                   <div className="h-1 bg-[#1A1919] rounded-full overflow-hidden">
                      <div className="h-full bg-[#D64933] w-[60%]"></div>
                   </div>
                   <p className="text-[10px] text-[#666] leading-tight mt-2">
                     L IA analysera la cohérence de votre code par rapport aux critères définis.
                   </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto py-10">
            <div className="bg-[#0F0E0E] rounded-2xl border border-[#333] p-10 text-center">
              <div className="w-20 h-20 rounded-full bg-[#D64933]/10 flex items-center justify-center mx-auto mb-8">
                <GitBranch className="h-10 w-10 text-[#D64933]" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Prêt à soumettre ?</h2>
              <p className="text-[#B8B0A0] text-sm mb-10 max-w-sm mx-auto leading-relaxed">
                Collez l lien public de votre repository GitHub ci-dessous. Notre IA va scanner votre code immédiatement.
              </p>

              {submitSuccess ? (
                <div className="bg-[#27C93F]/10 border border-[#27C93F]/50 p-6 rounded-xl">
                  <CheckCircle className="h-10 w-10 text-[#27C93F] mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-[#27C93F] mb-1">BRAVO !</h3>
                  <p className="text-xs text-[#B8B0A0]">Votre code a été envoyé au système d analyse.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="url"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      placeholder="https://github.com/votre-compte/votre-projet"
                      className="w-full bg-[#1A1919] border border-[#333] text-[#F2E9E2] font-mono text-sm px-6 py-4 rounded-xl outline-none focus:border-[#D64933] transition-all"
                    />
                  </div>
                  
                  {submitError && (
                    <p className="text-xs text-[#FF6B6B] font-mono">{submitError}</p>
                  )}

                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full bg-[#D64933] hover:bg-[#B33A22] text-white py-8 rounded-xl font-black text-lg tracking-widest"
                  >
                    {isSubmitting ? "ANALYSE EN COURS..." : "DÉMARRER L ANALYSE"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
