'use client'

import React from 'react'
import LandingStyles from "@/components/landing/LandingStyles"

export default function BlueprintBackground() {
  return (
    <>
      <LandingStyles />
      <div className="fixed inset-0 pointer-events-none z-[-10]">
        <div className="absolute inset-0 geometric-bg opacity-40" />
        <div className="absolute inset-0 grid-overlay" />
        <div className="absolute inset-0 blueprint-grid opacity-20" />
      </div>
    </>
  )
}
