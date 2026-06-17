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
      <div className="min-h-screen bg-white p-6 max-w-[1200px] mx-auto">
        <div className="bg-slate-900 rounded-2xl p-8 md:p-12 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-5 w-16 rounded-sm bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 bg-[length:200%_100%] animate-shimmer" />
            <div className="h-4 w-24 rounded-full bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 bg-[length:200%_100%] animate-shimmer" />
          </div>
          <div className="h-16 w-96 rounded-full bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 bg-[length:200%_100%] animate-shimmer mb-6" />
          <div className="h-4 w-64 rounded-full bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 bg-[length:200%_100%] animate-shimmer mb-8" />
          <div className="h-12 w-40 rounded-xl bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 bg-[length:200%_100%] animate-shimmer" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="h-64 rounded-2xl bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 bg-[length:200%_100%] animate-shimmer" />
            <div className="h-48 rounded-2xl bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 bg-[length:200%_100%] animate-shimmer" />
          </div>
          <div className="lg:col-span-4 space-y-6">
            <div className="h-80 rounded-2xl bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 bg-[length:200%_100%] animate-shimmer" />
            <div className="h-40 rounded-2xl bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 bg-[length:200%_100%] animate-shimmer" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-white font-sans text-[#0D0D0D]">
      
      {/* ── HERO SECTION ── */}
      <section className="max-w-[1200px] mx-auto px-6 pt-8 pb-12">
        <div className="relative bg-slate-900 rounded-2xl p-8 md:p-12 text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#0052FF] blur-[150px] opacity-20 -translate-y-1/2 translate-x-1/3" />
          
          <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-[#F97316] text-[9px] font-black px-2 py-1 rounded-sm uppercase tracking-widest">
                  AI v3.0
                </span>
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                  • System Active
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-6 leading-[0.9]">
                Devient <span className="text-[#0052FF]">Inarrêtable</span>.
              </h1>
              <p className="text-slate-400 text-sm mb-8 max-w-sm leading-relaxed font-medium">
                Analyse de patterns IA et optimisation de workflow pour développeurs d'élite.
              </p>
              <Link href="/submit" className="inline-flex bg-[#0052FF] hover:bg-[#0042CC] text-white px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all items-center gap-3">
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
                <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-xl group hover:bg-white/10 transition-colors">
                  <stat.icon className="w-5 h-5 text-[#0052FF] mb-3" />
                  <p className="text-2xl font-black">{stat.val}</p>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-[1200px] mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* ── COLONNE GAUCHE ── */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Live Tech Pulse */}
            <div className="bg-[#0052FF]/5 border border-[#0052FF]/10 rounded-2xl p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-[#0052FF]" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg uppercase tracking-tighter">Live Tech Pulse</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recommandations IA</p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { tag: 'React 19', trend: '+45%', desc: 'Server Components' },
                  { tag: 'Bun', trend: '+12%', desc: 'JS Runtime' },
                  { tag: 'Rust', trend: '+82%', desc: 'Memory Safety' },
                ].map((item, i) => (
                  <div key={i} className="bg-white p-5 rounded-xl border border-slate-100 hover:border-[#0052FF] transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <span className="font-black text-[9px] px-2 py-0.5 bg-slate-900 text-white rounded-sm uppercase tracking-widest">{item.tag}</span>
                      <span className="text-[#10B981] text-[10px] font-bold">{item.trend}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-bold leading-tight">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Smart Learning Path */}
            <div className="border-2 border-slate-900 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-md mb-4">
                  <Brain className="w-3 h-3 text-[#0052FF]" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">Prochain Objectif</span>
                </div>
                <h3 className="text-2xl font-black mb-4 tracking-tighter">Architecte SOLID</h3>
                <p className="text-xs text-slate-500 mb-6 max-w-sm font-bold leading-relaxed">
                  L'IA a détecté une opportunité sur le pattern "Dependency Injection". Gagne +400 XP.
                </p>
                <button className="bg-slate-900 text-white px-6 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-[#0052FF] transition-colors">
                  Démarrer le module
                </button>
              </div>
              <div className="w-32 h-32 bg-slate-50 border-2 border-slate-900 rounded-xl flex items-center justify-center relative group">
                <Code2 className="w-12 h-12 text-slate-900" />
                <div className="absolute -top-2 -right-2 bg-[#F97316] text-white text-[8px] font-black px-2 py-1 rounded-sm shadow-sm">
                  NEW
                </div>
              </div>
            </div>
          </div>

          {/* ── SIDEBAR ── */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* Profil Card */}
            <div className="border-2 border-slate-900 p-8 rounded-2xl bg-white shadow-[6px_6px_0px_0px_#0D0D0D]">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-[#0052FF] rounded-xl flex items-center justify-center text-white text-xl font-black">AD</div>
                <div>
                  <h4 className="font-black text-lg">Alex Dev</h4>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Senior Reviewer</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Score</p>
                  <p className="text-xl font-black text-[#0052FF]">94.2</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Reviews</p>
                  <p className="text-xl font-black text-slate-900">128</p>
                </div>
              </div>
              <button className="w-full bg-slate-900 text-white py-4 rounded-xl font-black uppercase tracking-widest text-[10px] hover:shadow-lg transition-all">
                Profile Settings
              </button>
            </div>

            {/* Daily Tips - Orange Sharp */}
            <div className="bg-[#F97316] p-8 rounded-2xl text-white relative overflow-hidden group">
              <Lightbulb className="absolute -right-2 -bottom-2 w-20 h-20 text-white/20 -rotate-12 transition-transform group-hover:rotate-0" />
              <div className="relative z-10">
                <h4 className="font-black text-sm uppercase tracking-widest mb-2">Tip de l'IA</h4>
                <p className="text-white/90 text-xs font-bold leading-relaxed">
                  "Utilise useMemo uniquement pour des calculs lourds. L'abuser peut ralentir ton app."
                </p>
                <div className="mt-6 pt-4 border-t border-white/20 flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                  <span>Partager</span>
                  <ArrowUpRight className="w-3 h-3" />
                </div>
              </div>
            </div>

          </aside>
        </div>
      </div>

      {/* FAB - Moins rond */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-[#0052FF] text-white rounded-xl shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-50">
        <MessageCircle className="w-5 h-5" />
      </button>

    </main>
  )
}