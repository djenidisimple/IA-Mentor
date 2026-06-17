'use client'

import { useEffect, useState } from 'react'
import {
  Brain, Plus, Zap,
  Activity, ShieldCheck, Code2,
  TrendingUp, Trophy, ArrowUpRight, Globe, Lightbulb, MessageCircle
} from 'lucide-react'
import Link from 'next/link'
import { useSubmissions } from '@/hooks/useSubmissions'
import Skeleton from '@/components/ui/Skeleton'

export default function Home() {
  const { submissions, loading } = useSubmissions()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--cream)] p-6 max-w-[1200px] mx-auto">
        <div className="bg-[var(--navy)] rounded-2xl p-8 md:p-12 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-5 w-16 rounded-sm bg-gradient-to-r from-white/20 via-white/10 to-white/20 bg-[length:200%_100%] animate-shimmer" />
            <div className="h-4 w-24 rounded-full bg-gradient-to-r from-white/20 via-white/10 to-white/20 bg-[length:200%_100%] animate-shimmer" />
          </div>
          <div className="h-16 w-96 rounded-full bg-gradient-to-r from-white/20 via-white/10 to-white/20 bg-[length:200%_100%] animate-shimmer mb-6" />
          <div className="h-4 w-64 rounded-full bg-gradient-to-r from-white/20 via-white/10 to-white/20 bg-[length:200%_100%] animate-shimmer mb-8" />
          <div className="h-12 w-40 rounded-xl bg-gradient-to-r from-white/20 via-white/10 to-white/20 bg-[length:200%_100%] animate-shimmer" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="h-64 rounded-2xl bg-gradient-to-r from-[var(--border-pink)] via-gray-200 to-[var(--border-pink)] bg-[length:200%_100%] animate-shimmer" />
            <div className="h-48 rounded-2xl bg-gradient-to-r from-[var(--border-pink)] via-gray-200 to-[var(--border-pink)] bg-[length:200%_100%] animate-shimmer" />
          </div>
          <div className="lg:col-span-4 space-y-6">
            <div className="h-80 rounded-2xl bg-gradient-to-r from-[var(--border-pink)] via-gray-200 to-[var(--border-pink)] bg-[length:200%_100%] animate-shimmer" />
            <div className="h-40 rounded-2xl bg-gradient-to-r from-[var(--border-pink)] via-gray-200 to-[var(--border-pink)] bg-[length:200%_100%] animate-shimmer" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[var(--cream)]">
      <section className="max-w-[1200px] mx-auto px-6 pt-8 pb-12">
        <div className="relative bg-[var(--navy)] rounded-2xl p-8 md:p-12 text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--blue)] blur-[150px] opacity-20 -translate-y-1/2 translate-x-1/3" />

          <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-[var(--orange)] text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-widest">
                  AI v3.0
                </span>
                <span className="text-white/50 text-[10px] font-bold uppercase tracking-widest">
                  • System Active
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
                Deviens <span className="text-[var(--blue)]">Inarrêtable</span>.
              </h1>
              <p className="text-white/50 text-sm mb-8 max-w-sm leading-relaxed font-medium">
                Analyse de patterns IA et optimisation de workflow pour développeurs d&apos;élite.
              </p>
              <Link href="/submit" className="inline-flex bg-[var(--blue)] hover:bg-[#3A7BC8] text-white px-8 py-4 rounded-full font-bold text-xs uppercase tracking-wider transition-all items-center gap-3 shadow-lg shadow-[var(--blue)]/20">
                Nouvelle Analyse <Plus className="w-4 h-4" />
              </Link>
            </div>

            <div className="hidden lg:grid grid-cols-2 gap-4">
              {[
                { label: 'Précision', val: '99.8%', icon: ShieldCheck },
                { label: 'Vitesse', val: '1.2s', icon: Zap },
                { label: 'XP Total', val: '12.4k', icon: Trophy },
                { label: 'Rang', val: '#42', icon: Globe },
              ].map((stat, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-6 group hover:bg-white/10 transition-colors">
                  <stat.icon className="w-5 h-5 text-[var(--blue)] mb-3" />
                  <p className="text-2xl font-bold">{stat.val}</p>
                  <p className="text-[9px] font-bold text-white/50 uppercase tracking-widest mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-[1200px] mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-[var(--blue)]/5 border border-[var(--blue)]/10 rounded-2xl p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[var(--navy)] rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-[var(--blue)]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-[var(--navy)]">Live Tech Pulse</h3>
                    <p className="text-[10px] font-bold text-[var(--gray)] uppercase tracking-widest">Recommandations IA</p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { tag: 'React 19', trend: '+45%', desc: 'Server Components' },
                  { tag: 'Bun', trend: '+12%', desc: 'JS Runtime' },
                  { tag: 'Rust', trend: '+82%', desc: 'Memory Safety' },
                ].map((item, i) => (
                  <div key={i} className="bg-white p-5 rounded-xl border border-[var(--border-pink)] hover:border-[var(--blue)] transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <span className="font-bold text-[9px] px-2 py-0.5 bg-[var(--navy)] text-white rounded-full uppercase tracking-widest">{item.tag}</span>
                      <span className="text-green-500 text-[10px] font-bold">{item.trend}</span>
                    </div>
                    <p className="text-[11px] text-[var(--gray)] font-bold leading-tight">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-[var(--border-pink)] rounded-xl sm:rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 hover:shadow-xl transition-all">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 bg-[var(--cream)] px-3 py-1 rounded-full mb-4 border border-[var(--border-pink)]">
                  <Brain className="w-3 h-3 text-[var(--blue)]" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--gray)]">Prochain Objectif</span>
                </div>
                <h3 className="text-xl font-extrabold text-[var(--navy)] mb-4 tracking-tight">Architecte SOLID</h3>
                <p className="text-xs text-[var(--gray)] mb-6 max-w-sm font-bold leading-relaxed">
                  L&apos;IA a détecté une opportunité sur le pattern &quot;Dependency Injection&quot;. Gagne +400 XP.
                </p>
                <button className="bg-[var(--navy)] text-white px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-wider hover:bg-[#2A3050] transition-all shadow-lg shadow-[var(--navy)]/10">
                  Démarrer le module
                </button>
              </div>
              <div className="w-32 h-32 bg-[var(--cream)] border border-[var(--border-pink)] rounded-xl flex items-center justify-center relative group">
                <Code2 className="w-12 h-12 text-[var(--navy)]" />
                <div className="absolute -top-2 -right-2 bg-[var(--orange)] text-white text-[8px] font-bold px-2 py-1 rounded-full shadow-sm">
                  NEW
                </div>
              </div>
            </div>
          </div>

          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-[var(--border-pink)] rounded-xl sm:rounded-2xl p-8 hover:shadow-xl transition-all">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-[var(--blue)] rounded-xl flex items-center justify-center text-white text-xl font-bold">AD</div>
                <div>
                  <h4 className="font-bold text-lg text-[var(--navy)]">Alex Dev</h4>
                  <p className="text-[9px] font-bold text-[var(--gray)] uppercase tracking-widest">Senior Reviewer</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="bg-[var(--cream)] p-4 rounded-xl border border-[var(--border-pink)]">
                  <p className="text-[8px] font-bold text-[var(--gray)] uppercase mb-1">Score</p>
                  <p className="text-xl font-bold text-[var(--blue)]">94.2</p>
                </div>
                <div className="bg-[var(--cream)] p-4 rounded-xl border border-[var(--border-pink)]">
                  <p className="text-[8px] font-bold text-[var(--gray)] uppercase mb-1">Reviews</p>
                  <p className="text-xl font-bold text-[var(--navy)]">128</p>
                </div>
              </div>
              <button className="w-full bg-[var(--navy)] text-white py-4 rounded-full font-bold uppercase tracking-wider text-[10px] hover:bg-[#2A3050] transition-all shadow-lg shadow-[var(--navy)]/10">
                Profile Settings
              </button>
            </div>

            <div className="bg-[var(--orange)] p-8 rounded-xl sm:rounded-2xl text-white relative overflow-hidden group">
              <Lightbulb className="absolute -right-2 -bottom-2 w-20 h-20 text-white/20 -rotate-12 transition-transform group-hover:rotate-0" />
              <div className="relative z-10">
                <h4 className="font-bold text-sm uppercase tracking-widest mb-2">Tip de l&apos;IA</h4>
                <p className="text-white/90 text-xs font-bold leading-relaxed">
                  &quot;Utilise useMemo uniquement pour des calculs lourds. L&apos;abuser peut ralentir ton app.&quot;
                </p>
                <div className="mt-6 pt-4 border-t border-white/20 flex justify-between items-center text-[9px] font-bold uppercase tracking-widest">
                  <span>Partager</span>
                  <ArrowUpRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <button className="fixed bottom-8 right-8 w-14 h-14 bg-[var(--blue)] text-white rounded-full shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-50 hover:shadow-lg hover:shadow-[var(--blue)]/20">
        <MessageCircle className="w-5 h-5" />
      </button>
    </main>
  )
}
