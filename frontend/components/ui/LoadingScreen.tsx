'use client'

import React, { useState, useEffect } from 'react'
import { Terminal, Zap, Shield, Code, GitBranch, CheckCircle2 } from 'lucide-react'

interface LoadingScreenProps {
  onComplete?: () => void
  minDuration?: number
}

export default function LoadingScreen({ onComplete, minDuration = 2000 }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [currentMessage, setCurrentMessage] = useState('')
  const [dots, setDots] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  const messages = [
    'INITIALISATION DU MOTEUR D\'ANALYSE',
    'CHARGEMENT DES MODULES IA',
    'CONNEXION AUX SERVEURS',
    'RÉCUPÉRATION DES CHALLENGES',
    'PRÉPARATION DE L\'ENVIRONNEMENT',
    'ANALYSE DES COMPOSANTS',
    'OPTIMISATION DES PERFORMANCES',
    'PRÊT À FRACTURER LE CODE'
  ]

  // Simulation de progression
  useEffect(() => {
    const startTime = Date.now()
    const interval = setInterval(() => {
      setProgress(prev => {
        const elapsed = Date.now() - startTime
        const newProgress = Math.min((elapsed / minDuration) * 100, 100)
        
        if (newProgress >= 100) {
          clearInterval(interval)
          setIsComplete(true)
          setTimeout(() => {
            onComplete?.()
          }, 500)
        }
        
        return newProgress
      })
    }, 50)

    return () => clearInterval(interval)
  }, [minDuration, onComplete])

  // Changement de message selon la progression
  useEffect(() => {
    const messageIndex = Math.min(
      Math.floor(progress / (100 / messages.length)),
      messages.length - 1
    )
    setCurrentMessage(messages[messageIndex])
  }, [progress])

  // Animation des points
  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots(prev => {
        if (prev.length >= 3) return ''
        return prev + '.'
      })
    }, 400)

    return () => clearInterval(dotInterval)
  }, [])

  return (
    <div className="min-h-screen bg-[#1A1919] text-[#F2E9E2] flex flex-col overflow-hidden">
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-4xl">
          
          {/* Terminal Loading */}
          <div className="bg-[#0A0A0A] border border-[#D64933]/40 mb-8">
            <div className="h-10 bg-[#121212] flex items-center px-4 gap-2 border-b border-[#D64933]/20">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF5F57] opacity-80"></div>
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E] opacity-80"></div>
                <div className="w-3 h-3 rounded-full bg-[#27C93F] opacity-80"></div>
              </div>
              <div className="flex-1 text-center">
                <span className="text-[#666] text-[11px] font-mono tracking-wider">
                  devreview — loading_system
                </span>
              </div>
              <Terminal className={`h-3 w-3 ${!isComplete ? 'text-[#D64933] animate-pulse' : 'text-[#27C93F]'}`} />
            </div>

            <div className="p-6 md:p-8 font-mono">
              <div className="mb-6">
                <div className="text-[#D64933] text-sm md:text-base mb-2 flex items-center gap-2">
                  <span className="text-[#D64933]">$</span>
                  <span>./devreview bootstrap --environment=production</span>
                </div>
                <div className="text-[#888] text-xs md:text-sm">
                  Initialisation de DevReview v1.0.0...
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-[#6B8C6B] text-xs md:text-sm">
                  <CheckCircle2 className="h-4 w-4 text-[#27C93F]" />
                  <span>System check: OK</span>
                </div>
                <div className="flex items-center gap-3 text-[#6B8C6B] text-xs md:text-sm">
                  <CheckCircle2 className="h-4 w-4 text-[#27C93F]" />
                  <span>Database connection: ESTABLISHED</span>
                </div>
                <div className={`flex items-center gap-3 text-xs md:text-sm ${!isComplete ? 'text-[#E8C547]' : 'text-[#27C93F]'}`}>
                  <Zap className="h-4 w-4" />
                  <span>AI Engine: {isComplete ? 'ACTIVÉ' : `${currentMessage}${dots}`}</span>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-[10px] font-mono text-[#666]">
                  <span>LOADING SEQUENCE</span>
                  <span>{Math.floor(progress)}%</span>
                </div>
                <div className="h-1 bg-[#222] overflow-hidden">
                  <div 
                    className="h-full bg-[#D64933] transition-all duration-100 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="mt-6 text-[10px] font-mono text-[#333] leading-relaxed">
                <pre className="select-none">
{`[${'▰'.repeat(Math.floor(progress / 5))}${'▱'.repeat(20 - Math.floor(progress / 5))}]`}
{`> Compiling modules...`}
{`> Optimizing algorithms...`}
{`> ${isComplete ? 'Ready to fracture code' : 'Loading...'} █`}
                </pre>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Code, label: 'MODULES CHARGÉS', value: '24/24', loaded: progress > 80 },
              { icon: Shield, label: 'TESTS PASSÉS', value: '100%', loaded: progress > 90 },
              { icon: Zap, label: 'PERFORMANCE', value: 'OPTIMAL', loaded: progress > 95 },
              { icon: GitBranch, label: 'CHALLENGES', value: '8 ACTIFS', loaded: progress > 70 },
            ].map((stat, i) => (
              <div 
                key={i}
                className={`bg-[#0F0E0E] border-l-4 border-[#D64933] p-3 transition-all duration-500 ${
                  stat.loaded ? 'opacity-100' : 'opacity-50'
                }`}
              >
                <stat.icon className="h-4 w-4 text-[#D64933] mb-2" />
                <div className="text-[10px] font-mono text-[#666] tracking-wider">{stat.label}</div>
                <div className="text-sm font-mono text-[#F2E9E2] font-bold">{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Message d'attente */}
          <div className="mt-8 text-center">
            <p className="text-[#B8B0A0] font-mono text-xs">
              {isComplete 
                ? "CHARGEMENT TERMINÉ — REDIRECTION VERS L'ATELIER..."
                : "CHARGEMENT DE L'ENVIRONNEMENT — PRÉPARATION DES OUTILS D'ANALYSE"
              }
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
