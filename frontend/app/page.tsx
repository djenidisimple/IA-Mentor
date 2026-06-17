'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'
import { 
  ArrowUpRight, 
  Star,
  ChevronRight,
  Code2,
  Trophy,
  Shield,
  BarChart3,
  CheckCircle2,
  Users,
  Globe,
  Terminal,
  Layers,
  Cpu,
  MessageSquare,
  ThumbsUp
} from 'lucide-react'
import { GithubIcon } from '@/components/icon'

// --- Composants du Design System ---

const PillBadge = ({
  children,
  variant = 'default',
  className = '',
}: {
  children: React.ReactNode
  variant?: 'default' | 'accent' | 'yellow'
  className?: string
}) => {
  const variants = {
    default: 'bg-white border border-[var(--border-pink)] text-[var(--navy)]',
    accent: 'bg-[var(--navy)] text-white',
    yellow: 'bg-[var(--yellow)] text-[var(--navy)] font-extrabold tracking-wide',
  }

  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        px-3 py-2 sm:px-5 sm:py-2.5 rounded-full
        text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.08em]
        transition-all duration-300
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  )
}

const SolidButton = ({
  children,
  href,
  variant = 'navy',
  icon: Icon,
}: {
  children: React.ReactNode
  href?: string
  variant?: 'navy' | 'white' | 'yellow'
  icon?: any
}) => {
  const Comp = href ? Link : 'button'
  const variants = {
    navy: 'bg-[var(--navy)] text-white hover:bg-[#2A3050] shadow-lg shadow-[var(--navy)]/10',
    white: 'bg-white text-[var(--navy)] border border-[var(--border-pink)] hover:bg-gray-50',
    yellow:
      'bg-[var(--yellow)] text-[var(--navy)] font-extrabold hover:brightness-105 shadow-lg shadow-[var(--yellow)]/20',
  }

  return (
    <Comp
      href={href || '#'}
      className={`
        inline-flex items-center gap-2
        px-4 py-2.5 sm:px-6 sm:py-3 rounded-full
        text-[12px] sm:text-[13px] font-bold tracking-wide
        transition-all duration-300 ease-out
        active:scale-95
        focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--navy)]/20
        whitespace-nowrap
        ${variants[variant]}
      `}
    >
      {children}
      {Icon && <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />}
    </Comp>
  )
}

const Avatar = ({
  letter,
  color = 'pink',
}: {
  letter: string
  color?: 'pink' | 'blue' | 'orange' | 'green'
}) => {
  const colors = {
    pink: 'bg-pink-100 text-pink-600',
    blue: 'bg-blue-100 text-blue-600',
    orange: 'bg-orange-100 text-orange-600',
    green: 'bg-green-100 text-green-600',
  }

  return (
    <div
      className={`
        w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center
        text-xs sm:text-sm font-bold border-2 border-white
        shadow-md hover:scale-110 transition-transform duration-300 cursor-default
        ${colors[color]}
      `}
    >
      {letter}
    </div>
  )
}

const StarRating = ({
  rating = 5,
  count = '5000+',
}: {
  rating?: number
  count?: string
}) => (
  <div className="flex items-center gap-2 sm:gap-3">
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
            i < rating
              ? 'fill-[var(--yellow)] text-[var(--yellow)]'
              : 'text-gray-300'
          }`}
        />
      ))}
    </div>
    <span className="text-[11px] sm:text-[12px] font-bold text-[var(--navy)]">
      {count} défis soumis
    </span>
  </div>
)

const LanguageCard = ({
  name,
  icon: Icon,
  color,
  count,
}: {
  name: string
  icon: any
  color: string
  count: number
}) => (
  <div className="group bg-white border border-[var(--border-pink)] rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
    <div
      className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 transition-transform duration-300 group-hover:scale-110"
      style={{ backgroundColor: `${color}15`, color: color }}
    >
      <Icon className="w-5 h-5 sm:w-7 sm:h-7" />
    </div>
    <h4 className="font-bold text-[var(--navy)] text-sm sm:text-base mb-0.5 sm:mb-1">
      {name}
    </h4>
    <p className="text-[10px] sm:text-xs text-[var(--gray)]">{count} défis</p>
  </div>
)

const ChallengeCard = ({
  title,
  difficulty,
  language,
  points,
  submissions,
  languageColor,
}: {
  title: string
  difficulty: 'Facile' | 'Moyen' | 'Difficile'
  language: string
  points: number
  submissions: number
  languageColor: string
}) => {
  const difficultyColors = {
    Facile: 'bg-green-100 text-green-700',
    Moyen: 'bg-orange-100 text-orange-700',
    Difficile: 'bg-red-100 text-red-700',
  }

  return (
    <div className="group bg-white border border-[var(--border-pink)] rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <span
          className="text-xs font-bold uppercase tracking-wider"
          style={{ color: languageColor }}
        >
          {language}
        </span>
        <span
          className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${difficultyColors[difficulty]}`}
        >
          {difficulty}
        </span>
      </div>
      <h3 className="text-base sm:text-lg font-bold text-[var(--navy)] mb-3 sm:mb-4 leading-snug">
        {title}
      </h3>
      <div className="flex items-center justify-between text-xs text-[var(--gray)] mb-3 sm:mb-4">
        <span className="flex items-center gap-1">
          <Trophy className="w-3 h-3" />
          {points} pts
        </span>
        <span className="flex items-center gap-1">
          <Users className="w-3 h-3" />
          {submissions} participations
        </span>
      </div>
      <Link
        href="#"
        className="inline-flex items-center gap-1.5 text-[12px] sm:text-[13px] font-bold text-[var(--blue)] hover:gap-3 transition-all group-hover:text-[var(--navy)]"
      >
        Lancer le défi
        <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      </Link>
    </div>
  )
}

const StepCard = ({
  step,
  icon: Icon,
  title,
  desc,
  isLast = false,
}: {
  step: string
  icon: any
  title: string
  desc: string
  isLast?: boolean
}) => (
  <div className="flex flex-col items-center text-center relative group">
    <div className="relative mb-4 sm:mb-6">
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-[var(--navy)] flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:bg-[var(--purple)] transition-all duration-300">
        <Icon className="w-7 h-7 sm:w-9 sm:h-9" />
      </div>
      <div className="absolute -top-2 -right-2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[var(--yellow)] flex items-center justify-center text-xs sm:text-sm font-black text-[var(--navy)]">
        {step}
      </div>
    </div>

    <h4 className="text-base sm:text-lg font-bold text-[var(--navy)] mb-2 sm:mb-3">{title}</h4>
    <p className="text-[var(--gray)] text-[13px] sm:text-[14px] leading-relaxed max-w-[220px]">
      {desc}
    </p>

    {!isLast && (
      <div className="hidden md:block mt-4">
        <ChevronRight className="w-6 h-6 text-[var(--border-pink)]" />
      </div>
    )}
  </div>
)

// --- Page Principale ---
export default function LandingPage() {
  const { isAuthenticated, token } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated && token) {
      router.replace('/home')
    }
  }, [isAuthenticated, token, router])

  const [activeTab, setActiveTab] = useState('tous')

  const languages = [
    { name: 'JavaScript', icon: Code2, color: '#F7DF1E', count: 45 },
    { name: 'Python', icon: Terminal, color: '#3776AB', count: 38 },
    { name: 'TypeScript', icon: Layers, color: '#3178C6', count: 32 },
    { name: 'Rust', icon: Cpu, color: '#CE422B', count: 18 },
    { name: 'Go', icon: Globe, color: '#00ADD8', count: 22 },
  ]

  const challenges = [
    {
      title: 'Créer une API REST avec authentification',
      difficulty: 'Moyen' as const,
      language: 'Node.js',
      points: 250,
      submissions: 1234,
      languageColor: '#68A063',
    },
    {
      title: 'Application de chat en temps réel',
      difficulty: 'Difficile' as const,
      language: 'Next.js',
      points: 500,
      submissions: 856,
      languageColor: '#3178C6',
    },
    {
      title: 'Page produit e-commerce',
      difficulty: 'Facile' as const,
      language: 'React',
      points: 100,
      submissions: 2341,
      languageColor: '#61DAFB',
    },
  ]

  return (
    <div className="min-h-screen bg-[var(--cream)] font-['Plus_Jakarta_Sans',_'Inter'] selection:bg-[var(--navy)]/10 overflow-x-hidden">

      {/* Grille abstraite de fond */}
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

      <style jsx global>{`
        .multicolor-stripe {
          position: absolute;
          top: -10%;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 120%;
          background: linear-gradient(
            to bottom,
            var(--yellow) 0%,
            var(--yellow) 33%,
            var(--orange) 33%,
            var(--orange) 66%,
            var(--blue) 66%,
            var(--blue) 100%
          );
          border-radius: 2px;
          opacity: 0.5;
          z-index: -5;
        }

        @keyframes dash {
          to { stroke-dashoffset: -100; }
        }
        .curved-arrow {
          stroke-dasharray: 8 6;
          animation: dash 4s linear infinite;
        }
      `}</style>

      {/* Bande verticale multicolore (desktop only) */}
      <div className="multicolor-stripe hidden lg:block" />

      {/* ─────────────────── NAVIGATION ─────────────────── */}
      <nav className="relative z-50 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-4 sm:py-5 flex items-center justify-between gap-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[var(--navy)] flex items-center justify-center shadow-md">
            <Code2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <span className="font-bold text-[var(--navy)] text-base sm:text-lg tracking-tight">
            Dev<span className="text-[var(--blue)]">Challenge</span>
          </span>
        </Link>

        {/* Liens (desktop) */}
        <div className="hidden lg:flex items-center gap-8">
          {[
            { label: 'Défis',       href: '/defis' },
            { label: 'Classement',  href: '/classement' },
            { label: 'Communauté',  href: '/communaute' },
            { label: 'À propos',    href: '/a-propos' },
            { label: 'Contact',     href: '/contact' },
          ].map(item => (
            <Link
              key={item.label}
              href={item.href}
              className="text-[13px] font-medium text-[var(--gray)] hover:text-[var(--navy)] transition-colors relative group"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--yellow)] group-hover:w-full transition-all duration-300 rounded-full" />
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* "Connexion" masqué sur les très petits écrans (<360px) */}
          <Link
            href="/login"
            className="hidden xs:inline text-[12px] sm:text-[13px] font-bold text-[var(--navy)] hover:text-[var(--blue)] transition-colors"
          >
            Connexion
          </Link>
          <SolidButton href="/register" variant="navy" icon={ArrowUpRight}>
            <span className="hidden xs:inline">COMMENCER</span>
            <span className="xs:hidden">S&apos;inscrire</span>
          </SolidButton>
        </div>
      </nav>

      {/* ─────────────────── HERO SECTION ─────────────────── */}
      <section className="relative pt-10 pb-16 sm:pt-16 sm:pb-20 md:pt-24 md:pb-32">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-12 text-center relative">

          {/* Badge */}
          <div className="animate-fade-up flex justify-center mb-6 sm:mb-8">
            <PillBadge>
              <span className="w-2 h-2 rounded-full bg-[var(--orange)] animate-pulse shrink-0" />
              Plateforme de Défis Fullstack
            </PillBadge>
          </div>

          {/* Avatars — visibles seulement sur large */}
          <div className="animate-fade-up delay-2 hidden lg:flex items-center absolute left-10 top-20">
            <Avatar letter="R" color="pink" />
            <Avatar letter="P" color="blue" />
            <Avatar letter="G" color="orange" />
          </div>
          <div className="animate-fade-up delay-2 hidden lg:flex items-center absolute right-10 top-20">
            <Avatar letter="JS" color="green" />
            <Avatar letter="TS" color="pink" />
            <Avatar letter="GO" color="blue" />
          </div>

          {/* Flèches décoratives — desktop only */}
          <svg
            className="animate-fade-up delay-3 hidden lg:block absolute left-32 top-40 w-32 h-32"
            viewBox="0 0 100 100"
          >
            <path
              d="M 80 20 Q 50 20, 30 50 Q 10 80, 10 30"
              fill="none"
              stroke="var(--border-pink)"
              strokeWidth="2"
              strokeDasharray="6 4"
              className="curved-arrow"
            />
            <circle cx="10" cy="30" r="4" fill="var(--yellow)" />
          </svg>
          <svg
            className="animate-fade-up delay-3 hidden lg:block absolute right-32 top-40 w-32 h-32 scale-x-[-1]"
            viewBox="0 0 100 100"
          >
            <path
              d="M 80 20 Q 50 20, 30 50 Q 10 80, 10 30"
              fill="none"
              stroke="var(--border-pink)"
              strokeWidth="2"
              strokeDasharray="6 4"
              className="curved-arrow"
            />
            <circle cx="10" cy="30" r="4" fill="var(--orange)" />
          </svg>

          {/* ── TITRE PRINCIPAL ── */}
          {/* Base (≥320px): text-4xl → ~36px, confortable sur 320px */}
          <h1 className="animate-fade-up delay-1 relative z-10 text-4xl sm:text-5xl md:text-7xl lg:text-[80px] font-extrabold text-[var(--navy)] leading-[1.02] tracking-tight mb-5 sm:mb-6 max-w-4xl mx-auto">
            CODEZ.
            <br />
            SOUMETTEZ.
            <br />
            PROGRESSEZ.
          </h1>

          {/* Sous-titre */}
          <p className="animate-fade-up delay-4 text-[var(--gray)] text-base sm:text-lg md:text-xl max-w-xl mx-auto mb-6 sm:mb-8 leading-relaxed px-2">
            Relevez des défis fullstack dans le langage de votre choix. Notre IA analyse votre
            code et vous donne un feedback instantané avec une note.
          </p>

          {/* Terminal mini démo */}
          <div className="animate-fade-up delay-4 max-w-lg mx-auto mb-8 sm:mb-10 bg-[var(--navy)] rounded-xl sm:rounded-2xl p-3 sm:p-4 text-left font-mono shadow-xl overflow-hidden">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-400" />
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-400" />
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-400" />
              <span className="ml-2 text-[10px] sm:text-xs text-gray-400">Terminal</span>
            </div>
            <p className="text-[11px] sm:text-sm text-white/80 truncate">$ git push origin main</p>
            <p className="text-[11px] sm:text-sm text-blue-400">🚀 Défi soumis avec succès !</p>
            <p className="text-[11px] sm:text-sm text-yellow-400 mt-1.5 sm:mt-2">🤖 L&apos;IA analyse votre code…</p>
            <p className="text-[11px] sm:text-sm text-green-400 mt-1">
              ✅ Note :{' '}
              <span className="font-bold">92/100</span> — Excellent travail !
            </p>
          </div>

          {/* Bottom row */}
          <div className="animate-fade-up delay-5 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 md:gap-16 w-full">
            <div className="flex items-center gap-2 sm:gap-3">
              <GithubIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--navy)]" />
              <span className="text-[13px] sm:text-[14px] font-bold text-[var(--navy)]">
                Intégration GitHub
              </span>
            </div>

            <StarRating count="5000+" />

            <SolidButton href="/register" variant="yellow" icon={ArrowUpRight}>
              COMMENCER
            </SolidButton>
          </div>

          {/* Carte flottante du bas */}
          <div className="animate-fade-up delay-6 mt-12 sm:mt-16 relative">
            <div className="max-w-xs sm:max-w-sm mx-auto bg-gradient-to-br from-[var(--navy)] to-[var(--purple)] rounded-xl sm:rounded-2xl p-5 sm:p-8 shadow-2xl shadow-[var(--purple)]/20">
              <div className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-2">720+</div>
              <p className="text-white/70 text-sm leading-relaxed mb-4">
                Défis disponibles dans tous les langages et frameworks majeurs
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-white/60">
                  <span>Qualité du code</span>
                  <span>95%</span>
                </div>
                <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--yellow)] rounded-full" style={{ width: '95%' }} />
                </div>
                <div className="flex items-center justify-between text-xs text-white/60">
                  <span>Performance</span>
                  <span>88%</span>
                </div>
                <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--orange)] rounded-full" style={{ width: '88%' }} />
                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                <Link
                  href="/defis"
                  className="inline-flex items-center gap-2 text-[12px] sm:text-[13px] font-bold text-white hover:gap-3 transition-all"
                >
                  VOIR LES DÉFIS
                  <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────── LANGUAGES SECTION ─────────────────── */}
      <section className="py-14 sm:py-20 md:py-28 border-t border-[var(--border-pink)]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center mb-10 sm:mb-16">
            <PillBadge>Langages</PillBadge>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-[var(--navy)] mt-4 sm:mt-6 mb-3 sm:mb-4 tracking-tight">
              Codez dans votre langage préféré
            </h2>
            <p className="text-[var(--gray)] text-base sm:text-lg max-w-xl mx-auto px-2">
              De JavaScript à Rust, nous supportons tous les langages de programmation majeurs.
            </p>
          </div>

          {/* 
            Grille: 
            - xs (<480px): 2 colonnes mais la 5e carte passe en 1 colonne centrée
            - sm+: 3 colonnes
            - md+: 5 colonnes
          */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
            {languages.map((lang, i) => (
              <div
                key={i}
                className={
                  /* Centre la dernière carte quand on a 2 colonnes et 5 items */
                  i === languages.length - 1 && languages.length % 2 !== 0
                    ? 'col-span-2 sm:col-span-1 max-w-[180px] mx-auto w-full'
                    : ''
                }
              >
                <LanguageCard {...lang} />
              </div>
            ))}
          </div>

          <div className="text-center mt-8 sm:mt-10">
            <Link
              href="/langages"
              className="inline-flex items-center gap-2 text-[13px] sm:text-[14px] font-bold text-[var(--blue)] hover:text-[var(--navy)] transition-colors"
            >
              Voir les 15+ langages
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────────────── HOW IT WORKS ─────────────────── */}
      <section className="py-14 sm:py-20 md:py-28 bg-white rounded-t-[32px] sm:rounded-t-[48px]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center mb-12 sm:mb-20">
            <PillBadge>Fonctionnement</PillBadge>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-[var(--navy)] mt-4 sm:mt-6 mb-3 sm:mb-4 tracking-tight">
              Trois étapes simples
            </h2>
            <p className="text-[var(--gray)] text-base sm:text-lg max-w-xl mx-auto px-2">
              Du défi au feedback en quelques minutes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-10 md:gap-16">
            <StepCard
              step="1"
              icon={Code2}
              title="Choisissez un défi"
              desc="Parcourez des centaines de défis fullstack dans votre langage et niveau préférés."
            />
            <StepCard
              step="2"
              icon={GithubIcon}
              title="Soumettez votre repo"
              desc="Poussez votre solution sur GitHub et soumettez le lien du dépôt. On s'occupe du reste."
            />
            <StepCard
              step="3"
              icon={MessageSquare}
              title="Recevez le feedback IA"
              desc="Notre IA analyse votre code et fournit un retour détaillé avec une note de performance."
              isLast
            />
          </div>

          <div className="text-center mt-12 sm:mt-16">
            <SolidButton href="/register" variant="navy" icon={ArrowUpRight}>
              Lancer mon premier défi
            </SolidButton>
          </div>
        </div>
      </section>

      {/* ─────────────────── CHALLENGES SECTION ─────────────────── */}
      <section className="py-14 sm:py-20 md:py-28 border-t border-[var(--border-pink)]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 sm:mb-12 gap-4 sm:gap-6">
            <div>
              <PillBadge>Défis</PillBadge>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-[var(--navy)] mt-4 sm:mt-6 mb-2 sm:mb-4 tracking-tight">
                Défis populaires
              </h2>
              <p className="text-[var(--gray)] text-base sm:text-lg">
                Les meilleurs choix de notre communauté.
              </p>
            </div>

            {/* Filtres — scroll horizontal sur mobile si nécessaire */}
            <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-1 max-w-full">
              {[
                { key: 'tous',      label: 'Tous'      },
                { key: 'facile',    label: 'Facile'    },
                { key: 'moyen',     label: 'Moyen'     },
                { key: 'difficile', label: 'Difficile' },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`
                    shrink-0 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full
                    text-[11px] sm:text-[12px] font-bold capitalize transition-all whitespace-nowrap
                    ${
                      activeTab === tab.key
                        ? 'bg-[var(--navy)] text-white'
                        : 'bg-white border border-[var(--border-pink)] text-[var(--gray)] hover:border-[var(--navy)]'
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {challenges.map((challenge, i) => (
              <ChallengeCard key={i} {...challenge} />
            ))}
          </div>

          <div className="text-center mt-8 sm:mt-10">
            <Link
              href="/defis"
              className="inline-flex items-center gap-2 text-[13px] sm:text-[14px] font-bold text-[var(--blue)] hover:text-[var(--navy)] transition-colors"
            >
              Voir tous les défis
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────────────── AI FEEDBACK SECTION ─────────────────── */}
      <section className="py-14 sm:py-20 md:py-28 bg-[var(--navy)] rounded-t-[32px] sm:rounded-t-[48px]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-center">

            {/* Texte gauche */}
            <div className="space-y-6 sm:space-y-8">
              <PillBadge variant="accent">Feedback IA</PillBadge>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Une revue IA instantanée à chaque soumission
              </h2>
              <p className="text-white/60 text-base sm:text-lg leading-relaxed max-w-lg">
                Notre IA analyse la structure, la performance, la sécurité et les bonnes pratiques
                de votre code. Recevez un feedback actionnable en quelques secondes.
              </p>

              <div className="space-y-3 sm:space-y-4">
                {[
                  { icon: CheckCircle2, text: "Analyse de la qualité du code" },
                  { icon: Shield,       text: "Détection des vulnérabilités" },
                  { icon: BarChart3,    text: "Conseils d'optimisation" },
                  { icon: ThumbsUp,     text: "Recommandations de bonnes pratiques" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 sm:gap-4">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                      <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--yellow)]" />
                    </div>
                    <span className="text-white/80 font-medium text-sm sm:text-base">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>

              <SolidButton href="/demo" variant="yellow" icon={ArrowUpRight}>
                Essayer une démo
              </SolidButton>
            </div>

            {/* Visualisation droite */}
            <div className="relative">
              <div className="bg-[#0F1324] rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-2xl border border-white/10">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <span className="text-[10px] sm:text-xs font-bold text-white/50 uppercase tracking-wider">
                    Revue de Code IA
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-green-400/20 text-green-400">
                    VALIDÉ
                  </span>
                </div>

                <div className="space-y-3 sm:space-y-4 font-mono text-xs sm:text-sm">
                  {[
                    { dot: 'bg-green-400', label: '✓ Structure du code :', value: 'Excellent',      labelColor: 'text-green-400'  },
                    { dot: 'bg-green-400', label: '✓ Performance :',       value: 'Optimale',       labelColor: 'text-green-400'  },
                    { dot: 'bg-yellow-400',label: '⚠ Sécurité :',          value: '1 avertissement',labelColor: 'text-yellow-400' },
                    { dot: 'bg-green-400', label: '✓ Bonnes pratiques :',  value: 'Respectées',     labelColor: 'text-green-400'  },
                  ].map((row, i) => (
                    <div key={i} className="flex items-center gap-2 sm:gap-3 flex-wrap">
                      <div className={`w-2 h-2 rounded-full ${row.dot} shrink-0`} />
                      <span className={row.labelColor}>{row.label}</span>
                      <span className="text-white/70">{row.value}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold text-base sm:text-lg">Note globale</span>
                    <span className="text-2xl sm:text-3xl font-black text-[var(--yellow)]">
                      92/100
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────── CTA SECTION ─────────────────── */}
      <section className="py-16 sm:py-24 md:py-32 bg-[var(--navy)]">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 text-center space-y-6 sm:space-y-8">
          <PillBadge variant="accent">Prêt à coder ?</PillBadge>
          <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight px-2">
            Lancez votre premier défi aujourd&apos;hui
          </h2>
          <p className="text-white/60 text-base sm:text-lg max-w-lg mx-auto px-2">
            Rejoignez des milliers de développeurs qui améliorent leurs compétences grâce aux
            revues de code IA.
          </p>
          <div className="flex flex-col xs:flex-row flex-wrap gap-3 sm:gap-4 justify-center pt-2 sm:pt-4">
            <SolidButton href="/register" variant="yellow" icon={ArrowUpRight}>
              COMMENCER MAINTENANT
            </SolidButton>
            <SolidButton href="/defis" variant="white">
              Voir les défis
            </SolidButton>
          </div>
        </div>
      </section>

      {/* ─────────────────── FOOTER ─────────────────── */}
      <footer className="py-12 sm:py-16 bg-[var(--navy)] border-t border-white/10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
            {/* Brand */}
            <div className="col-span-2 sm:col-span-2 md:col-span-1 space-y-3 sm:space-y-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white flex items-center justify-center">
                  <Code2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--navy)]" />
                </div>
                <span className="font-bold text-white text-base sm:text-lg tracking-tight">
                  Dev<span className="text-[var(--yellow)]">Challenge</span>
                </span>
              </Link>
              <p className="text-white/40 text-xs sm:text-sm leading-relaxed">
                La plateforme pour tester et améliorer vos compétences fullstack avec des revues de
                code par IA.
              </p>
            </div>

            {[
              { title: 'Plateforme', links: ['Défis', 'Classement', 'Langages', 'FAQ'] },
              { title: 'Ressources', links: ['Guide débutant', 'API', 'Statut', 'Communauté'] },
              { title: 'À propos',   links: ['Notre histoire', 'Carrières', 'Contact', 'Confidentialité'] },
            ].map((col, i) => (
              <div key={i} className="space-y-2 sm:space-y-3">
                <h5 className="text-xs sm:text-sm font-bold text-white">{col.title}</h5>
                <div className="flex flex-col gap-1.5 sm:gap-2">
                  {col.links.map((link, j) => (
                    <Link
                      key={j}
                      href="#"
                      className="text-xs sm:text-sm text-white/40 hover:text-white transition-colors"
                    >
                      {link}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-6 sm:pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
            <p className="text-xs text-white/30">
              © {new Date().getFullYear()} DevChallenge. Tous droits réservés.
            </p>
            <div className="flex items-center gap-3 sm:gap-4">
              <GithubIcon className="w-4 h-4 text-white/30 hover:text-white transition-colors cursor-pointer" />
              <p className="text-xs text-white/30">Fait avec ❤️ à Madagascar 🇲🇬</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}