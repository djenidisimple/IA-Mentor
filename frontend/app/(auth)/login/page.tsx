'use client'

import React, { useState } from 'react'
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
  Mail,
  Lock,
  ArrowRight
} from 'lucide-react'
import { authApi } from '@/lib/auth'
import { useAuthStore } from '@/lib/store/authStore'
import { User } from '@/types/auth.types'
import GithubIcon from '@/components/icon/GithubIcon'

export default function LoginPage() {
  const router = useRouter()
  const { setAuth } = useAuthStore()
  
  const [form, setForm] = useState({
    email: '',
    password: '',
  })
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

    try {
      const response = await authApi.login(form)
      
      const user: User = {
        id: Date.now(),
        username: response.username,
        email: response.email,
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
      setError(err.message || 'Email ou mot de passe incorrect')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative flex flex-col font-inter selection:bg-blue-500/10 selection:text-blue-600">
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-5 pt-20 pb-10">
        
        <div className="w-full max-w-md">
            {/* Header */}
            <div className="text-center mb-10">
               <div className="inline-flex font-mono text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                 Identifiants Requis
               </div>
               <h1 className="font-syne text-4xl md:text-5xl font-black tracking-tighter text-gray-900 uppercase mb-3">
                 Connexion à l&apos;<span className="char-blue">A</span>te<span className="char-amber">li</span><span className="char-emerald">e</span>r
               </h1>
               <p className="font-grotesk text-gray-500 max-w-sm mx-auto">
                 Accédez à votre tableau de bord et reprenez votre progression.
               </p>
            </div>

            {/* Glass Card */}
            <div className="bg-white/80 backdrop-blur-xl border-1.5 border-gray-200 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 diagonal-pattern text-gray-900 opacity-[0.02] w-32 h-32 pointer-events-none" />
                
                <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                  
                  {/* Email Field */}
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-2 font-mono text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                       <Mail size={12} className={focusedField === 'email' ? 'text-blue-500' : 'text-gray-400'} />
                       Adresse Email
                    </label>
                    <div className="relative group">
                       <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('email')}
                          onBlur={() => setFocusedField(null)}
                          placeholder="developpeur@example.com"
                          required
                          className="w-full bg-gray-50 text-gray-900 font-mono text-sm px-4 py-3.5 rounded-xl outline-none placeholder:text-gray-400 border-1.5 border-gray-200 focus:border-blue-500 focus:bg-white transition-all shadow-sm group-hover:border-gray-300"
                       />
                       {form.email.includes('@') && form.email.includes('.') && (
                          <div className="absolute right-4 top-1/2 -translate-y-1/2">
                             <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          </div>
                       )}
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                       <label className="flex items-center gap-2 font-mono text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                          <Lock size={12} className={focusedField === 'password' ? 'text-blue-500' : 'text-gray-400'} />
                          Mot de passe
                       </label>
                       <Link 
                          href="/forgot-password" 
                          className="font-mono text-[9px] text-gray-400 hover:text-blue-600 transition-colors tracking-wider uppercase border-b border-transparent hover:border-blue-600"
                       >
                          Oublié ?
                       </Link>
                    </div>
                    <div className="relative group">
                       <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={form.password}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('password')}
                          onBlur={() => setFocusedField(null)}
                          placeholder="••••••••"
                          required
                          className="w-full bg-gray-50 text-gray-900 font-mono text-sm px-4 py-3.5 pr-11 rounded-xl outline-none placeholder:text-gray-400 border-1.5 border-gray-200 focus:border-blue-500 focus:bg-white transition-all shadow-sm group-hover:border-gray-300"
                       />
                       <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors focus:outline-none"
                       >
                          {showPassword
                             ? <EyeOff className="h-4 w-4" />
                             : <Eye className="h-4 w-4" />
                          }
                       </button>
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                     <div className="flex items-start gap-2 bg-red-50 border-1.5 border-red-200 p-3 rounded-lg animate-in slide-in-from-top-1">
                        <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                        <p className="text-red-700 font-grotesk text-xs font-medium leading-relaxed">
                          {error}
                        </p>
                     </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white py-6 text-xs font-mono font-black tracking-widest rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 shadow-xl shadow-gray-200 uppercase mt-2 group"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <TerminalIcon className="h-4 w-4 animate-pulse text-blue-400" />
                        Authentification...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Initialiser Session
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </span>
                    )}
                  </Button>

                  {/* Divider */}
                  <div className="relative flex items-center py-2">
                     <div className="flex-grow border-t border-gray-200"></div>
                     <span className="flex-shrink-0 mx-4 text-gray-400 font-mono text-[9px] font-bold uppercase tracking-widest">
                       Opérations Externes
                     </span>
                     <div className="flex-grow border-t border-gray-200"></div>
                  </div>

                  {/* GitHub Login */}
                  <a
                    href="http://localhost:8080/oauth2/authorization/github"
                    className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full bg-white border-1.5 border-gray-200 hover:border-gray-900 text-gray-900 py-3.5 px-4 rounded-xl font-mono text-[11px] font-bold tracking-widest transition-all hover:shadow-md group relative overflow-hidden"
                  >
                     <div className="absolute inset-0 bg-gray-50 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300"></div>
                     <GithubIcon className="relative z-10 w-5 h-5 text-gray-900 transition-colors" />
                     <span className="relative z-10 uppercase">Authentification Github</span>
                  </a>

                </form>
            </div>

            {/* Footer Form */}
            <p className="text-center text-gray-500 font-mono text-[10px] font-bold tracking-widest mt-8 uppercase">
               Mode Observateur ?{' '}
               <Link href="/register" className="text-blue-600 hover:text-blue-700 transition-colors inline-flex items-center gap-1 group">
                 Créer un profil
                 <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
               </Link>
            </p>

        </div>
      </main>
    </div>
  )
}
