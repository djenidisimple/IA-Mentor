'use client'

import React from 'react'

export default function BlueprintBackground() {
  return (
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
  )
}
