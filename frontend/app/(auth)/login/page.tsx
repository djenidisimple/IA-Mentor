"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Sparkles,
  AlertCircle,
  Code2,
  ArrowUpRight
} from 'lucide-react'
import { authApi } from '@/lib/auth'
import { useAuthStore } from '@/lib/store/authStore'

export default function LoginPage() {
  const router = useRouter()
  const { setAuth } = useAuthStore()

  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!form.email.includes('@') || !form.email.includes('.')) {
      setError('Veuillez entrer une adresse email valide')
      setLoading(false)
      return
    }
    if (!form.password) {
      setError('Veuillez entrer votre mot de passe')
      setLoading(false)
      return
    }

    try {
      const response = await authApi.login({
        email: form.email,
        password: form.password,
      })

      setAuth(response.token, {
        id: response.id,
        username: response.username,
        email: response.email,
        avatarUrl: '',
        points: 0,
        isPremium: false,
        role: response.role,
        createdAt: new Date().toISOString(),
      })

      router.push('/home')
    } catch (err: any) {
      setError(err.message || 'Email ou mot de passe incorrect')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--cream)] selection:bg-[var(--navy)]/10 overflow-x-hidden flex items-center justify-center px-6 py-10">

      <div
        className="fixed inset-0 -z-10 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(var(--navy) 1px, transparent 1px),
            linear-gradient(90deg, var(--navy) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          backgroundPosition: 'center center',
        }}
      />

      <div className="w-full max-w-md animate-fade-up">
        <div className="bg-white border border-[var(--border-pink)] rounded-2xl shadow-xl relative overflow-hidden">

          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-[var(--yellow)]/10 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-[var(--blue)]/10 blur-2xl pointer-events-none" />

          <div className="relative z-10 p-8">

            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[var(--navy)] flex items-center justify-center shadow-md">
                  <Code2 className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-[var(--navy)] text-xl tracking-tight">
                  Dev<span className="text-[var(--blue)]">Challenge</span>
                </span>
              </div>

              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-[0.08em] bg-white border border-[var(--border-pink)] text-[var(--navy)]">
                <span className="w-2 h-2 bg-[var(--yellow)] rounded-full animate-pulse" />
                Content de vous revoir
              </div>

              <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--navy)] mt-5 mb-2 tracking-tight">
                Connectez-vous
              </h1>
              <p className="text-[var(--gray)] text-[14px] max-w-xs mx-auto leading-relaxed">
                Accédez à vos défis, soumissions et à la communauté.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-[11px] font-bold text-[var(--navy)] uppercase tracking-[0.08em]">
                  <Mail size={14} className={focusedField === 'email' ? 'text-[var(--blue)]' : 'text-[var(--gray)]'} />
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
                    className="w-full bg-[var(--cream)] text-[var(--navy)] text-[14px] font-medium px-4 py-3.5 rounded-xl outline-none placeholder:text-[var(--gray)]/50 border border-[var(--border-pink)] focus:border-[var(--blue)] focus:bg-white focus:ring-4 focus:ring-[var(--blue)]/5 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-[11px] font-bold text-[var(--navy)] uppercase tracking-[0.08em]">
                  <Lock size={14} className={focusedField === 'password' ? 'text-[var(--blue)]' : 'text-[var(--gray)]'} />
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
                    className="w-full bg-[var(--cream)] text-[var(--navy)] text-[14px] font-medium px-4 py-3.5 pr-12 rounded-xl outline-none placeholder:text-[var(--gray)]/50 border border-[var(--border-pink)] focus:border-[var(--blue)] focus:bg-white focus:ring-4 focus:ring-[var(--blue)]/5 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--gray)] hover:text-[var(--navy)] transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 p-4 rounded-xl">
                  <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                  <p className="text-red-700 text-[13px] font-medium leading-relaxed">
                    {error}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-full text-[13px] font-bold tracking-wide transition-all duration-300 ease-out active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 bg-[var(--navy)] text-white hover:bg-[#2A3050] shadow-lg shadow-[var(--navy)]/10"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                    Connexion en cours...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Se connecter
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                )}
              </button>

              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-[var(--border-pink)]" />
                <span className="flex-shrink-0 mx-4 text-[var(--gray)] text-[10px] font-bold uppercase tracking-[0.1em]">
                  ou
                </span>
                <div className="flex-grow border-t border-[var(--border-pink)]" />
              </div>

              <a
                href="http://localhost:8080/oauth2/authorization/github"
                className="flex items-center justify-center gap-3 w-full bg-white border border-[var(--border-pink)] hover:border-[var(--navy)] hover:shadow-md text-[var(--navy)] py-3.5 px-4 rounded-full text-[12px] font-bold tracking-wide uppercase transition-all duration-300 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-[var(--navy)] translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-full" />
                <svg className="relative z-10 w-5 h-5 text-[var(--navy)] group-hover:text-white transition-colors duration-300" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
                <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                  Se connecter avec GitHub
                </span>
              </a>

            </form>

            <p className="text-center text-[var(--gray)] text-[13px] font-medium mt-6">
              Pas encore de compte ?{' '}
              <Link
                href="/register"
                className="text-[var(--blue)] font-bold hover:text-[var(--navy)] transition-colors inline-flex items-center gap-1 group"
              >
                S&apos;inscrire
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </p>

          </div>
        </div>

      </div>
    </div>
  )
}
