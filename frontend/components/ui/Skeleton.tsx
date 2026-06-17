import React from 'react'

type SkeletonVariant = 'card' | 'line' | 'avatar' | 'text-block' | 'badge'

interface SkeletonProps {
  variant?: SkeletonVariant
  className?: string
  lines?: number
}

const baseClass = 'bg-gradient-to-r from-[var(--border-pink)] via-gray-200 to-[var(--border-pink)] bg-[length:200%_100%] animate-shimmer'

export default function Skeleton({ variant = 'line', className = '', lines = 3 }: SkeletonProps) {
  if (variant === 'text-block') {
    return (
      <div className="space-y-3">
        <div className={`${baseClass} h-4 w-3/4 rounded-full ${className}`} />
        {Array.from({ length: lines - 1 }).map((_, i) => (
          <div
            key={i}
            className={`${baseClass} h-4 ${i === lines - 2 ? 'w-1/2' : 'w-full'} rounded-full ${className}`}
          />
        ))}
      </div>
    )
  }

  if (variant === 'card') {
    return (
      <div className={`${baseClass} rounded-xl border border-[var(--border-pink)] p-5 ${className}`}>
        <div className="flex items-center gap-3 mb-6">
          <div className={`${baseClass} w-10 h-10 rounded-full`} />
          <div className="flex-1 space-y-2">
            <div className={`${baseClass} h-3 w-1/3 rounded-full`} />
            <div className={`${baseClass} h-2 w-1/4 rounded-full`} />
          </div>
        </div>
        <div className="space-y-2 mb-6">
          <div className={`${baseClass} h-3 w-full rounded-full`} />
          <div className={`${baseClass} h-3 w-5/6 rounded-full`} />
          <div className={`${baseClass} h-3 w-2/3 rounded-full`} />
        </div>
        <div className="flex gap-2">
          <div className={`${baseClass} h-6 w-16 rounded-full`} />
          <div className={`${baseClass} h-6 w-20 rounded-full`} />
          <div className={`${baseClass} h-6 w-14 rounded-full`} />
        </div>
      </div>
    )
  }

  const varianClasses: Record<string, string> = {
    card: 'rounded-xl border border-[var(--border-pink)] p-5',
    line: 'h-4 rounded-full',
    avatar: 'rounded-full',
    badge: 'h-6 w-20 rounded-full',
  }

  return <div className={`${baseClass} ${varianClasses[variant]} ${className}`} />
}

export function CardSkeleton() {
  return <Skeleton variant="card" />
}

export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} variant="card" />
      ))}
    </div>
  )
}

export function FormSkeleton() {
  return (
    <div className="w-full max-w-md mx-auto space-y-6 p-8">
      <div className="flex items-center justify-center mb-8">
        <div className={`${baseClass} w-10 h-10 rounded-xl`} />
      </div>
      <div className={`${baseClass} h-8 w-3/4 mx-auto rounded-full`} />
      <div className={`${baseClass} h-4 w-1/2 mx-auto rounded-full`} />
      <div className="space-y-4 pt-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className={`${baseClass} h-3 w-16 rounded-full`} />
            <div className={`${baseClass} h-12 w-full rounded-xl`} />
          </div>
        ))}
      </div>
      <div className={`${baseClass} h-12 w-full rounded-full`} />
    </div>
  )
}

export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-[var(--cream)] flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className={`${baseClass} w-14 h-14 rounded-2xl`} />
        <div className={`${baseClass} h-8 w-48 rounded-full`} />
        <div className={`${baseClass} h-3 w-24 rounded-full`} />
      </div>
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[var(--cream)]">
      <div className="border-b border-[var(--border-pink)]">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center gap-6">
          <div className={`${baseClass} w-8 h-8 rounded-lg`} />
          <div className={`${baseClass} h-3 w-16 rounded-full`} />
          <div className={`${baseClass} h-3 w-20 rounded-full`} />
          <div className={`${baseClass} h-3 w-16 rounded-full`} />
          <div className={`${baseClass} h-3 w-14 rounded-full ml-auto`} />
          <div className={`${baseClass} w-9 h-9 rounded-full`} />
        </div>
      </div>
      <div className="max-w-[1200px] mx-auto px-6 py-8 space-y-8">
        <div className={`${baseClass} h-48 rounded-xl`} />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <div className={`${baseClass} h-40 rounded-xl`} />
            <div className={`${baseClass} h-32 rounded-xl`} />
          </div>
          <div className="lg:col-span-4 space-y-6">
            <div className={`${baseClass} h-56 rounded-xl`} />
            <div className={`${baseClass} h-32 rounded-xl`} />
          </div>
        </div>
      </div>
    </div>
  )
}

export function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-[var(--border-pink)]">
          <div className={`${baseClass} h-12 w-12 rounded-xl`} />
          <div className="flex-1 space-y-2">
            <div className={`${baseClass} h-3 w-1/3 rounded-full`} />
            <div className={`${baseClass} h-2 w-1/2 rounded-full`} />
          </div>
          <div className={`${baseClass} h-4 w-16 rounded-full`} />
        </div>
      ))}
    </div>
  )
}
