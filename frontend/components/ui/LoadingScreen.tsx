'use client'

import React, { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import LandingStyles from "@/components/landing/LandingStyles"

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
    <div className="min-h-screen bg-[#FBFBF9] flex items-center justify-center relative overflow-hidden font-inter">
      <LandingStyles />
      
      {/* Background Decor - Blueprint Style */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 geometric-bg opacity-40" />
        <div className="absolute inset-0 grid-overlay" />
        <div className="absolute inset-0 blueprint-grid opacity-20" />
      </div>

      <div className="relative z-10 flex flex-col items-center animate-in fade-in duration-500">
        {/* Simple elegant loader */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 rounded-full animate-pulse" />
          <div className="w-16 h-16 bg-white border-1.5 border-gray-200 rounded-2xl flex items-center justify-center shadow-lg relative z-10">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        </div>
        
        {/* Branding */}
        <h2 className="font-syne text-2xl font-black tracking-tighter uppercase text-gray-900 mb-2">
          <span className="text-gray-900">dev</span><span className="text-blue-600">Review</span> <span className="text-amber-500">AI</span>
        </h2>
        <p className="font-mono text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          Initialisation . . .
        </p>
      </div>
    </div>
  )
}
