'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { 
  ChevronRight, 
  Terminal as TerminalIcon, 
  AlertCircle, 
  Eye, 
  EyeOff,
  CheckCircle2,
  Shield,
  Zap,
  Infinity,
  Clock,
  Mail,
  Lock,
  ArrowRight,
  Terminal
} from 'lucide-react'
import { authApi } from '@/lib/auth'
import { useAuthStore } from '@/lib/store/authStore'
import { User } from '@/types/auth.types'
import GithubIcon from '@/components/icon/GithubIcon'
import LoadingScreen from '@/components/ui/LoadingScreen'

export default function LoginPage() {
  const router = useRouter()
  const { setAuth, isAuthenticated, token } = useAuthStore()
  
  // État pour contrôler l'affichage
  const [isChecking, setIsChecking] = useState(true)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [form, setForm] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  
  // État pour l'affichage du terminal
  const [terminalLines, setTerminalLines] = useState<string[]>([
    '$ ./devreview login --user',
    '> Authentification en cours...',
    '> 127 devs connectés ce mois-ci',
    '> Challenge actif : API REST PHP',
    '',
    '> ENTRER EMAIL: _'
  ])
  const [isTyping, setIsTyping] = useState(false)
  const terminalRef = useRef<HTMLDivElement>(null)

  // Vérification initiale de l'authentification
  useEffect(() => {
    if (isAuthenticated && token && !isRedirecting) {
      setIsRedirecting(true)
      router.replace('/home')
      return
    }
    setIsChecking(false)
  }, [isAuthenticated, token, router, isRedirecting])

  // Surveiller les changements du store après connexion
  useEffect(() => {
    if (isAuthenticated && token && !isRedirecting) {
      setIsRedirecting(true)
      router.replace('/home')
    }
  }, [isAuthenticated, token, router, isRedirecting])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await authApi.login(form)
      
      const user: User = {
        id: Date.now(),
        username: response.username,
        email: response.email,
        avatarUrl: '',
        points: 0,
        isPremium: false,
        role: response.role || 'USER',
        createdAt: new Date().toISOString(),
      }
      
      // Mettre à jour le store
      setAuth(response.token, user)
      
      // Redirection immédiate après setAuth
      // Le useEffect va aussi déclencher une redirection, mais on force ici pour être sûr
      setTimeout(() => {
        router.push('/home')
      }, 100)
      
    } catch (err: any) {
      setError(err.message || 'Email ou mot de passe incorrect')
    } finally {
      setLoading(false)
    }
  }

  // Effet pour animer le terminal
  useEffect(() => {
    const newLines = [
      '$ ./devreview login --user',
      '> Authentification en cours...',
      ''
    ]

    if (form.email) {
      newLines.push(`> EMAIL: ${form.email}`)
    } else {
      newLines.push('> ENTRER EMAIL: _')
    }

    if (form.password) {
      const maskedPassword = '•'.repeat(form.password.length)
      newLines.push(`> MOT DE PASSE: ${maskedPassword}`)
    } else if (form.email) {
      newLines.push('> ENTRER MOT DE PASSE: _')
    }

    if (form.email && form.password && !loading && !error) {
      newLines.push('')
      newLines.push('> VÉRIFICATION DES IDENTIFIANTS...')
      newLines.push('> PRÊT À SE CONNECTER')
      newLines.push('█')
    } else if (error) {
      newLines.push('')
      newLines.push(`> ERREUR: ${error}`)
      newLines.push('> RÉESSAYEZ...')
      newLines.push('█')
    } else if (loading) {
      newLines.push('')
      newLines.push('> AUTHENTIFICATION EN COURS...')
      newLines.push('> VÉRIFICATION DES ACCÈS...')
      newLines.push('█')
    } else if (form.email && !form.password) {
      newLines.push('')
      newLines.push('> EN ATTENTE DU MOT DE PASSE...')
      newLines.push('█')
    } else {
      newLines.push('█')
    }

    setTerminalLines(newLines)
    
    setTimeout(() => {
      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight
      }
    }, 50)
  }, [form, loading, error])

  // Effet de machine à écrire sur le focus
  useEffect(() => {
    if (focusedField === 'email' || focusedField === 'password') {
      setIsTyping(true)
      const timer = setTimeout(() => setIsTyping(false), 300)
      return () => clearTimeout(timer)
    }
  }, [focusedField])

  // Pendant la vérification, afficher l'écran de chargement
  if (isChecking) {
    return <LoadingScreen />
  }

  return (
    <div className="min-h-screen bg-[#1A1919] text-[#F2E9E2] flex flex-col">
      <main className="flex-1 flex items-center justify-center px-6 py-6 h-screen">
        <div className="w-full max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            
            {/* COLONNE GAUCHE — Terminal animé */}
            <div className="hidden lg:block">
              <div className="flex items-center justify-center">
                <div className="w-full">
                  <div className="bg-[#0A0A0A] border border-[#D64933]/40">
                    <div className="h-9 bg-[#121212] flex items-center px-3 gap-2 border-b border-[#D64933]/20">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57] opacity-80"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] opacity-80"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F] opacity-80"></div>
                      </div>
                      <div className="flex-1 text-center">
                        <span className="text-[#666] text-[10px] font-mono tracking-wider">
                          devreview — auth_login {isTyping && '(typing...)'}
                        </span>
                      </div>
                      <Terminal className={`h-3 w-3 ${isTyping ? 'text-[#D64933] animate-pulse' : 'text-white'}`} />
                    </div>
                    
                    <div 
                      ref={terminalRef}
                      className="p-4 font-mono text-[11px] text-[#6B8C6B] leading-relaxed overflow-y-auto max-h-[400px]"
                    >
                      {terminalLines.map((line, index) => {
                        const isCursor = line === '█'
                        const isEmailLine = line.includes('EMAIL:') && !line.includes('ENTRER')
                        const isPasswordLine = line.includes('MOT DE PASSE:')
                        const isErrorLine = line.includes('ERREUR:')
                        
                        return (
                          <div 
                            key={index} 
                            className={`mb-1.5 flex items-start gap-2 transition-all duration-200
                              ${isEmailLine ? 'text-[#E8C547]' : ''}
                              ${isPasswordLine ? 'text-[#4ECDC4]' : ''}
                              ${isErrorLine ? 'text-[#FF6B6B]' : ''}
                            `}
                          >
                            {!isCursor && (
                              <>
                                {line.startsWith('>') ? (
                                  <ArrowRight className="h-2.5 w-2.5 mt-0.5 shrink-0 text-[#D64933]" />
                                ) : line.startsWith('$') ? (
                                  <span className="text-[#D64933] shrink-0">$</span>
                                ) : (
                                  <span className="w-3 shrink-0"></span>
                                )}
                                <span className="break-all">{line}</span>
                              </>
                            )}
                            {isCursor && (
                              <div className="flex items-center gap-1">
                                <span className="text-[#D64933] animate-pulse">█</span>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="mt-4 p-3 border-l-4 border-[#D64933]/40 bg-[#0F0E0E]/50 transition-all duration-300">
                    <p className="text-[#B8B0A0] font-mono text-[10px] leading-relaxed">
                      <span className="text-[#D64933]">"</span> 
                      {loading 
                        ? 'Analyse des identifiants en cours... Patientez.' 
                        : error 
                        ? 'Accès refusé. Vérifie tes identifiants et réessaie.'
                        : form.email && form.password
                        ? 'Identifiants reçus. Prêt pour l\'authentification.'
                        : form.email
                        ? 'Email reçu. Attente du mot de passe...'
                        : 'Connecte-toi. L\'IA n\'attend que toi.'
                      }
                      <span className="text-[#D64933]">"</span>
                    </p>
                    <p className="text-[#666] font-mono text-[9px] mt-1 flex items-center gap-1">
                      <Shield className="h-2.5 w-2.5" />
                      — IA Review Engine
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#D64933]/10 grid grid-cols-3 gap-3 text-center">
                    {[
                      { value: '100%', label: 'GRATUIT', icon: CheckCircle2 },
                      { value: '<2MIN', label: 'ANALYSE IA', icon: Clock },
                      { value: '∞', label: 'CHALLENGES', icon: Infinity },
                    ].map((stat, i) => (
                      <div key={i} className="flex flex-col items-center gap-1">
                        <stat.icon className="h-3 w-3 text-[#D64933]" />
                        <div className="text-lg font-black text-[#D64933]">{stat.value}</div>
                        <div className="text-[8px] font-mono text-[#555] tracking-wider">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* COLONNE DROITE — Formulaire de connexion */}
            <div className="lg:col-span-1">
              <div className="mb-5">
                <div className="inline-flex border-l-4 border-[#D64933] pl-3 py-0.5 mb-3">
                  <span className="text-[#E8C547] text-[10px] font-mono font-bold tracking-[2px]">
                    RETOUR À L'ATELIER
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-black tracking-[-2px] leading-[1.1]">
                  REPRENDS <span className="text-[#D64933]">LE CODE.</span>
                </h1>
                <p className="mt-2 text-[#B8B0A0] font-mono text-xs flex items-center gap-2">
                  <Shield className="h-3 w-3 text-[#D64933]" />
                  Connecte-toi. L'IA n'attend que toi.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[9px] font-mono text-[#D64933] tracking-[2px] mb-1.5 flex items-center gap-1">
                    <Mail className="h-2.5 w-2.5" />
                    EMAIL
                  </label>
                  <div className={`relative border-l-4 transition-all duration-200 ${
                    focusedField === 'email'
                      ? 'border-[#D64933]'
                      : 'border-[#333]'
                  }`}>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="toi@example.com"
                      required
                      className="w-full bg-[#0F0E0E] text-[#F2E9E2] font-mono text-sm px-3 py-3 outline-none placeholder-[#444] border border-[#222] border-l-0 focus:border-[#D64933]/50 transition-colors"
                    />
                    {form.email.includes('@') && form.email.includes('.') && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#27C93F]" />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-mono text-[#D64933] tracking-[2px] mb-1.5 flex items-center gap-1">
                    <Lock className="h-2.5 w-2.5" />
                    MOT DE PASSE
                  </label>
                  <div className={`relative border-l-4 transition-all duration-200 ${
                    focusedField === 'password'
                      ? 'border-[#D64933]'
                      : 'border-[#333]'
                  }`}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="••••••••"
                      required
                      className="w-full bg-[#0F0E0E] text-[#F2E9E2] font-mono text-sm px-3 py-3 pr-10 outline-none placeholder-[#444] border border-[#222] border-l-0 focus:border-[#D64933]/50 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-[#666] hover:text-[#D64933] transition-colors"
                    >
                      {showPassword
                        ? <EyeOff className="h-3.5 w-3.5" />
                        : <Eye className="h-3.5 w-3.5" />
                      }
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Link 
                    href="/forgot-password" 
                    className="text-[10px] font-mono text-[#666] hover:text-[#D64933] transition-colors"
                  >
                    MOT DE PASSE OUBLIÉ ?
                  </Link>
                </div>

                {error && (
                  <div className="flex items-start gap-2 bg-[#D64933]/10 border-l-4 border-[#D64933] p-2.5">
                    <AlertCircle className="h-3 w-3 text-[#D64933] mt-0.5 shrink-0" />
                    <p className="text-[#D64933] font-mono text-[10px] leading-relaxed">
                      {error}
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#D64933] hover:bg-[#B33A22] text-[#F2E9E2] py-4 text-sm font-mono font-bold tracking-wider rounded-none transition-all duration-300 hover:skew-x-[-2deg] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:skew-x-0 group"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-pulse">AUTHENTIFICATION</span>
                      <TerminalIcon className="h-4 w-4 animate-pulse" />
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      SE CONNECTER
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </Button>

                <div className="relative flex items-center gap-3 my-3">
                  <div className="flex-1 h-px bg-[#333]"></div>
                  <span className="text-[#555] font-mono text-[9px] tracking-wider">OU</span>
                  <div className="flex-1 h-px bg-[#333]"></div>
                </div>

                <a
                  href="http://localhost:8080/oauth2/authorization/github"
                  className="flex items-center justify-center gap-2 w-full border border-[#333] hover:border-[#D64933]/50 bg-[#0F0E0E] hover:bg-[#D64933]/5 text-[#F2E9E2] py-3 font-mono text-xs tracking-wider transition-all duration-300 group"
                >
                  <GithubIcon />
                  CONTINUER AVEC GITHUB
                </a>

                <p className="text-center text-[#666] font-mono text-[10px] tracking-wider pt-1">
                  PAS ENCORE INSCRIT ?{' '}
                  <Link href="/register" className="text-[#D64933] hover:text-[#F2E9E2] transition-colors inline-flex items-center gap-1">
                    CRÉER UN COMPTE
                    <ArrowRight className="h-2.5 w-2.5" />
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
