import React from 'react'

type SkeletonVariant = 'card' | 'line' | 'avatar' | 'text-block' | 'badge'

interface SkeletonProps {
  variant?: SkeletonVariant
  className?: string
  lines?: number
}

const varianClasses: Record<SkeletonVariant, string> = {
  card: 'rounded-2xl border border-slate-100 p-6',
  line: 'h-4 rounded-full',
  avatar: 'rounded-full',
  'text-block': 'space-y-3',
  badge: 'h-6 w-20 rounded-full',
}

export default function Skeleton({ variant = 'line', className = '', lines = 3 }: SkeletonProps) {
  const baseClass = 'bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 bg-[length:200%_100%] animate-shimmer'

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
      <div className={`${baseClass} ${varianClasses.card} ${className}`}>
        <div className="flex items-center gap-3 mb-6">
          <div className={`${baseClass} w-10 h-10 ${varianClasses.avatar}`} />
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

  return <div className={`${baseClass} ${varianClasses[variant]} ${className}`} />
}

export function CardSkeleton() {
  return <Skeleton variant="card" />
}

export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
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
        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 bg-[length:200%_100%] animate-shimmer" />
      </div>
      <div className="h-8 w-3/4 mx-auto rounded-full bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 bg-[length:200%_100%] animate-shimmer" />
      <div className="h-4 w-1/2 mx-auto rounded-full bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 bg-[length:200%_100%] animate-shimmer" />
      <div className="space-y-4 pt-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 w-16 rounded-full bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 bg-[length:200%_100%] animate-shimmer" />
            <div className="h-12 w-full rounded-xl bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 bg-[length:200%_100%] animate-shimmer" />
          </div>
        ))}
      </div>
      <div className="h-12 w-full rounded-full bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 bg-[length:200%_100%] animate-shimmer" />
    </div>
  )
}

export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-[#FBFBF9] flex items-center justify-center relative overflow-hidden">
      <div className="flex flex-col items-center gap-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 bg-[length:200%_100%] animate-shimmer" />
        <div className="h-8 w-48 rounded-full bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 bg-[length:200%_100%] animate-shimmer" />
        <div className="h-3 w-24 rounded-full bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 bg-[length:200%_100%] animate-shimmer" />
      </div>
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-slate-100">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center gap-6">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 bg-[length:200%_100%] animate-shimmer" />
          <div className="h-3 w-16 rounded-full bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 bg-[length:200%_100%] animate-shimmer" />
          <div className="h-3 w-20 rounded-full bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 bg-[length:200%_100%] animate-shimmer" />
          <div className="h-3 w-16 rounded-full bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 bg-[length:200%_100%] animate-shimmer" />
          <div className="h-3 w-14 rounded-full bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 bg-[length:200%_100%] animate-shimmer ml-auto" />
          <div className="w-9 h-9 rounded-full bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 bg-[length:200%_100%] animate-shimmer" />
        </div>
      </div>
      <div className="max-w-[1200px] mx-auto px-6 py-8 space-y-8">
        <div className="h-48 rounded-2xl bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 bg-[length:200%_100%] animate-shimmer" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <div className="h-40 rounded-2xl bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 bg-[length:200%_100%] animate-shimmer" />
            <div className="h-32 rounded-2xl bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 bg-[length:200%_100%] animate-shimmer" />
          </div>
          <div className="lg:col-span-4 space-y-6">
            <div className="h-56 rounded-2xl bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 bg-[length:200%_100%] animate-shimmer" />
            <div className="h-32 rounded-2xl bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 bg-[length:200%_100%] animate-shimmer" />
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
        <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-slate-100">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 bg-[length:200%_100%] animate-shimmer" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-1/3 rounded-full bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 bg-[length:200%_100%] animate-shimmer" />
            <div className="h-2 w-1/2 rounded-full bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 bg-[length:200%_100%] animate-shimmer" />
          </div>
          <div className="h-4 w-16 rounded-full bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 bg-[length:200%_100%] animate-shimmer" />
        </div>
      ))}
    </div>
  )
}