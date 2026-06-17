'use client'

import React, { useEffect } from 'react'
import { Loader2, Code2 } from 'lucide-react'

interface LoadingScreenProps {
  onComplete?: () => void
  minDuration?: number
}

export default function LoadingScreen({ onComplete, minDuration = 1000 }: LoadingScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.()
    }, minDuration)
    return () => clearTimeout(timer)
  }, [minDuration, onComplete])

  return (
    <div className="min-h-screen bg-[var(--cream)] flex items-center justify-center relative overflow-hidden">
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

      <div className="relative z-10 flex flex-col items-center animate-fade-up">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-[var(--blue)] blur-xl opacity-20 rounded-2xl animate-pulse" />
          <div className="w-16 h-16 bg-white border border-[var(--border-pink)] rounded-2xl flex items-center justify-center shadow-lg relative z-10">
            <Loader2 className="w-8 h-8 text-[var(--blue)] animate-spin" />
          </div>
        </div>

        <h2 className="font-['Plus_Jakarta_Sans'] text-2xl font-black tracking-tight text-[var(--navy)] mb-2">
          Dev<span className="text-[var(--blue)]">Challenge</span>
        </h2>
        <p className="text-[10px] font-bold text-[var(--gray)] uppercase tracking-widest">
          Initialisation . . .
        </p>
      </div>
    </div>
  )
}
