'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Eye, 
  EyeOff,
  CheckCircle2,
  Mail,
  Lock,
  User,
  Sparkles,
  AlertCircle,
  Code2,
  ArrowUpRight
} from 'lucide-react'
import { authApi } from '@/lib/auth'
import { useAuthStore } from '@/lib/store/authStore'
import { User as UserType } from '@/types/auth.types'
import { GithubIcon } from '@/components/icon'
import { FormSkeleton } from '@/components/ui/Skeleton'

const PillBadge = ({ children, variant = 'default' }: { children: React.ReactNode, variant?: 'default' | 'accent' }) => {
  const baseClasses = "inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-[0.08em] transition-all duration-300"
  
  if (variant === 'accent') {
    return (
      <span className={`${baseClasses} bg-[#1A1F36] text-white`}>
        {children}
      </span>
    )
  }
  
  return (
    <span className={`${baseClasses} bg-white border border-[#F0E0E0] text-[#1A1F36]`}>
      {children}
    </span>
  )
}

const SolidButton = ({ 
  children, 
  type = 'button', 
  variant = 'navy', 
  disabled = false, 
  loading = false 
}: { 
  children: React.ReactNode, 
  type?: 'button' | 'submit', 
  variant?: 'navy' | 'white' | 'yellow',
  disabled?: boolean,
  loading?: boolean
}) => {
  const baseClasses = "inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-full text-[13px] font-bold tracking-wide transition-all duration-300 ease-out active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1A1F36]/20"
  
  const variantClasses = {
    navy: 'bg-[#1A1F36] text-white hover:bg-[#2A3050] shadow-lg shadow-[#1A1F36]/10',
    white: 'bg-white text-[#1A1F36] border border-[#F0E0E0] hover:bg-gray-50',
    yellow: 'bg-[#FFD93D] text-[#1A1F36] font-extrabold hover:brightness-105 shadow-lg shadow-[#FFD93D]/20',
  }

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 animate-pulse" />
          Création du compte...
        </span>
      ) : (
        children
      )}
    </button>
  )
}

export default function RegisterPage() {
  const router = useRouter()
  const { setAuth } = useAuthStore()

  const [pageReady, setPageReady] = useState(false)

  useEffect(() => {
    setPageReady(true)
  }, [])
  
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [acceptedTerms, setAcceptedTerms] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError(null)
  }

  const validateForm = (): boolean => {
    if (!form.username.trim()) {
      setError('Le nom d\'utilisateur est requis')
      return false
    }
    if (form.username.length < 3) {
      setError('Le nom d\'utilisateur doit contenir au moins 3 caractères')
      return false
    }
    if (form.username.length > 30) {
      setError('Le nom d\'utilisateur ne doit pas dépasser 30 caractères')
      return false
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(form.username)) {
      setError('Le nom d\'utilisateur ne peut contenir que des lettres, chiffres, tirets et underscores')
      return false
    }
    if (!form.email.includes('@') || !form.email.includes('.')) {
      setError('Veuillez entrer une adresse email valide')
      return false
    }
    if (form.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères')
      return false
    }
    if (!/[A-Z]/.test(form.password)) {
      setError('Le mot de passe doit contenir au moins une majuscule')
      return false
    }
    if (!/[0-9]/.test(form.password)) {
      setError('Le mot de passe doit contenir au moins un chiffre')
      return false
    }
    if (!/[!@#$%^&+=]/.test(form.password)) {
      setError('Le mot de passe doit contenir au moins un caractère spécial (!@#$%^&+=)')
      return false
    }
    if (form.password !== form.confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return false
    }
    if (!acceptedTerms) {
      setError('Vous devez accepter les conditions d\'utilisation')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!validateForm()) {
      setLoading(false)
      return
    }

    try {
      const response = await authApi.register({
        username: form.username,
        email: form.email,
        password: form.password,
      })
      
      const user: UserType = {
        id: response.id,
        username: response.username || form.username,
        email: response.email || form.email,
        avatarUrl: (response as any).avatarUrl || (response as any).picture || '',
        points: 0,
        isPremium: false,
        role: response.role || 'USER',
        createdAt: new Date().toISOString(),
      }
      
      setAuth(response.token, user)
      
      setTimeout(() => {
        router.push('/home')
      }, 100)
      
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de l\'inscription')
    } finally {
      setLoading(false)
    }
  }

  // Indicateurs de force du mot de passe
  const getPasswordStrength = (password: string): { level: number, label: string, color: string } => {
    let score = 0
    if (password.length >= 8) score++
    if (password.length >= 12) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++

    if (score <= 2) return { level: 1, label: 'Faible', color: '#EF4444' }
    if (score <= 3) return { level: 2, label: 'Moyen', color: '#F59E0B' }
    if (score <= 4) return { level: 3, label: 'Bon', color: '#4A90D9' }
    return { level: 4, label: 'Excellent', color: '#10B981' }
  }

  const passwordStrength = form.password ? getPasswordStrength(form.password) : null

  if (!pageReady) {
    return <FormSkeleton />
  }

  return (
    <div className="min-h-screen bg-[#FFFDF7] font-['Plus_Jakarta_Sans',_'Inter'] selection:bg-[#1A1F36]/10 overflow-x-hidden flex items-center justify-center px-6 py-10">
      
      {/* Grille abstraite de fond */}
      <div 
        className="fixed inset-0 -z-10 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(#1A1F36 1px, transparent 1px),
            linear-gradient(90deg, #1A1F36 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          backgroundPosition: 'center center',
        }}
      />

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

        :root {
          --cream:       #FFFDF7;
          --navy:        #1A1F36;
          --border-pink: #F0E0E0;
          --yellow:      #FFD93D;
          --orange:      #FF8C42;
          --blue:        #4A90D9;
          --purple:      #6C5CE7;
          --gray:        #6B7280;
        }

        body {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        @keyframes fadeUpSoft {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-up {
          animation: fadeUpSoft 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          opacity: 0;
        }

        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.3s; }
        .delay-4 { animation-delay: 0.4s; }
      `}</style>

      {/* Carte principale */}
      <div className="w-full max-w-md animate-fade-up">
        <div className="bg-white border border-[#F0E0E0] rounded-2xl shadow-xl relative overflow-hidden">
          
          {/* Décorations */}
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-[#FFD93D]/10 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-[#4A90D9]/10 blur-2xl pointer-events-none" />

          <div className="relative z-10 p-8">
            
            {/* Logo + Marque */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#1A1F36] flex items-center justify-center shadow-md">
                  <Code2 className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-[#1A1F36] text-xl tracking-tight">
                  Dev<span className="text-[#4A90D9]">Challenge</span>
                </span>
              </div>

              <PillBadge>
                <span className="w-2 h-2 rounded-full bg-[#FFD93D] animate-pulse" />
                Nouveau développeur
              </PillBadge>

              <h1 className="text-2xl md:text-3xl font-extrabold text-[#1A1F36] mt-5 mb-2 tracking-tight">
                Rejoignez l&apos;aventure
              </h1>
              <p className="text-[#6B7280] text-[14px] max-w-xs mx-auto leading-relaxed">
                Créez votre compte et commencez à relever des défis dès aujourd&apos;hui.
              </p>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Champ Nom d'utilisateur */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-[11px] font-bold text-[#1A1F36] uppercase tracking-[0.08em]">
                  <User size={14} className={focusedField === 'username' ? 'text-[#4A90D9]' : 'text-[#6B7280]'} />
                  Nom d&apos;utilisateur
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('username')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="votre-pseudo"
                    required
                    maxLength={30}
                    className="w-full bg-[#FFFDF7] text-[#1A1F36] text-[14px] font-medium px-4 py-3.5 rounded-xl outline-none placeholder:text-[#6B7280]/50 border border-[#F0E0E0] focus:border-[#4A90D9] focus:bg-white focus:ring-4 focus:ring-[#4A90D9]/5 transition-all duration-200"
                  />
                  {form.username.length >= 3 && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    </div>
                  )}
                </div>
              </div>

              {/* Champ Email */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-[11px] font-bold text-[#1A1F36] uppercase tracking-[0.08em]">
                  <Mail size={14} className={focusedField === 'email' ? 'text-[#4A90D9]' : 'text-[#6B7280]'} />
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="dev@example.com"
                    required
                    className="w-full bg-[#FFFDF7] text-[#1A1F36] text-[14px] font-medium px-4 py-3.5 rounded-xl outline-none placeholder:text-[#6B7280]/50 border border-[#F0E0E0] focus:border-[#4A90D9] focus:bg-white focus:ring-4 focus:ring-[#4A90D9]/5 transition-all duration-200"
                  />
                  {form.email.includes('@') && form.email.includes('.') && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    </div>
                  )}
                </div>
              </div>

              {/* Champ Mot de passe */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-[11px] font-bold text-[#1A1F36] uppercase tracking-[0.08em]">
                  <Lock size={14} className={focusedField === 'password' ? 'text-[#4A90D9]' : 'text-[#6B7280]'} />
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-[#FFFDF7] text-[#1A1F36] text-[14px] font-medium px-4 py-3.5 pr-12 rounded-xl outline-none placeholder:text-[#6B7280]/50 border border-[#F0E0E0] focus:border-[#4A90D9] focus:bg-white focus:ring-4 focus:ring-[#4A90D9]/5 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#1A1F36] transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {/* Indicateur de force */}
                {passwordStrength && (
                  <div className="mt-2 space-y-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className="h-1 flex-1 rounded-full transition-all duration-300"
                          style={{
                            backgroundColor: level <= passwordStrength.level ? passwordStrength.color : '#F0E0E0',
                          }}
                        />
                      ))}
                    </div>
                    <p 
                      className="text-[10px] font-bold uppercase tracking-wider"
                      style={{ color: passwordStrength.color }}
                    >
                      {passwordStrength.label}
                    </p>
                  </div>
                )}
              </div>

              {/* Champ Confirmation mot de passe */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-[11px] font-bold text-[#1A1F36] uppercase tracking-[0.08em]">
                  <Lock size={14} className={focusedField === 'confirmPassword' ? 'text-[#4A90D9]' : 'text-[#6B7280]'} />
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('confirmPassword')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-[#FFFDF7] text-[#1A1F36] text-[14px] font-medium px-4 py-3.5 pr-12 rounded-xl outline-none placeholder:text-[#6B7280]/50 border border-[#F0E0E0] focus:border-[#4A90D9] focus:bg-white focus:ring-4 focus:ring-[#4A90D9]/5 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#1A1F36] transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {form.confirmPassword && form.password === form.confirmPassword && (
                  <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mt-1">
                    ✓ Les mots de passe correspondent
                  </p>
                )}
              </div>

              {/* Acceptation des conditions */}
              <div className="flex items-start gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setAcceptedTerms(!acceptedTerms)}
                  className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${
                    acceptedTerms 
                      ? 'bg-[#1A1F36] border-[#1A1F36]' 
                      : 'bg-white border-[#F0E0E0] hover:border-[#4A90D9]'
                  }`}
                >
                  {acceptedTerms && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                </button>
                <label className="text-[12px] text-[#6B7280] leading-relaxed cursor-pointer" onClick={() => setAcceptedTerms(!acceptedTerms)}>
                  J&apos;accepte les{' '}
                  <Link href="/conditions" className="text-[#4A90D9] font-bold hover:underline">
                    conditions d&apos;utilisation
                  </Link>
                  {' '}et la{' '}
                  <Link href="/confidentialite" className="text-[#4A90D9] font-bold hover:underline">
                    politique de confidentialité
                  </Link>
                </label>
              </div>

              {/* Message d'erreur */}
              {error && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 p-4 rounded-xl">
                  <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                  <p className="text-red-700 text-[13px] font-medium leading-relaxed">
                    {error}
                  </p>
                </div>
              )}

              {/* Bouton Inscription */}
              <SolidButton type="submit" variant="navy" disabled={loading} loading={loading}>
                <span className="flex items-center gap-2">
                  Créer mon compte
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </SolidButton>

              {/* Séparateur */}
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-[#F0E0E0]" />
                <span className="flex-shrink-0 mx-4 text-[#6B7280] text-[10px] font-bold uppercase tracking-[0.1em]">
                  ou
                </span>
                <div className="flex-grow border-t border-[#F0E0E0]" />
              </div>

              {/* Bouton GitHub */}
              <a
                href="http://localhost:8080/oauth2/authorization/github"
                className="flex items-center justify-center gap-3 w-full bg-white border border-[#F0E0E0] hover:border-[#1A1F36] hover:shadow-md text-[#1A1F36] py-3.5 px-4 rounded-full text-[12px] font-bold tracking-wide uppercase transition-all duration-300 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-[#1A1F36] translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-full" />
                <GithubIcon className="relative z-10 w-5 h-5 text-[#1A1F36] group-hover:text-white transition-colors duration-300" />
                <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                  S&apos;inscrire avec GitHub
                </span>
              </a>

            </form>

            {/* Lien de connexion */}
            <p className="text-center text-[#6B7280] text-[13px] font-medium mt-6">
              Déjà un compte ?{' '}
              <Link 
                href="/login" 
                className="text-[#4A90D9] font-bold hover:text-[#1A1F36] transition-colors inline-flex items-center gap-1 group"
              >
                Se connecter
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </p>

          </div>
        </div>

      </div>
    </div>
  )
}
