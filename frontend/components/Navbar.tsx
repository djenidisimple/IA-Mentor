'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'
import {
  X, LogOut, User, Settings,
  ArrowUpRight, ChevronRight, Hash, Square
} from 'lucide-react'

export default function Navbar() {
  const pathname = usePathname()
  const { isAuthenticated, user, logout } = useAuthStore()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const ACCENT_COLOR = '#0052FF' 

  useEffect(() => {
    setHydrated(true)
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActiveLink = (href: string): boolean => {
    if (href === '/home') return pathname === '/home' || pathname === '/'
    return pathname.startsWith(href)
  }

  const navItems = [
    { href: '/home', label: 'Index' },
    { href: '/challenges', label: 'Work' },
    { href: '/community', label: 'Studio' },
    { href: '/leaderboard', label: 'Archive' },
  ]

  if (!hydrated) return null

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');
        
        .kerning-wide {
          letter-spacing: 0.25em;
        }
      `}</style>

      {/* MODIFICATION ICI : 
          - Suppression de 'white-glass' et du flou.
          - Utilisation de 'bg-white' permanent.
      */}
      <nav className={`fixed top-0 w-full z-[100] font-['Space_Grotesk'] transition-all duration-500 bg-white py-3`}>
        <div className="max-w-[1600px] mx-auto px-10 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-4 group">
            <div className="relative w-10 h-10 border-2 border-black flex items-center justify-center transition-all duration-500 group-hover:bg-black">
              <Square className="w-5 h-5 text-black group-hover:text-white transition-colors" fill="currentColor" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-['Syne'] font-extrabold tracking-tighter leading-none text-black">
                devReview <span style={{ color: ACCENT_COLOR }}>AI</span>
              </span>
              <span className="text-[8px] kerning-wide uppercase text-gray-400 font-bold">White Edition 2026</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-16">
            {navItems.map((item, index) => {
              const isActive = isActiveLink(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative group"
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-[9px] font-bold transition-colors duration-300 ${isActive ? 'text-black' : 'text-gray-300'}`}>
                      0{index + 1}
                    </span>
                    <span className={`
                      text-[13px] font-bold uppercase kerning-wide transition-all duration-300
                      ${isActive ? 'text-black' : 'text-gray-400 group-hover:text-black'}
                    `}>
                      {item.label}
                    </span>
                  </div>
                  
                  {/* Indicator Dot */}
                  <div className={`
                    absolute -bottom-4 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full transition-all duration-500
                    ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100'}
                  `} style={{ backgroundColor: ACCENT_COLOR }} />
                </Link>
              )
            })}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-10">
            {isAuthenticated ? (
              <div className="flex items-center gap-6">
                 <div className="hidden xl:block text-right">
                    <p className="text-[10px] font-bold text-black uppercase kerning-wide">{user?.username}</p>
                    <div className="h-[2px] w-12 mt-1 bg-gray-100 ml-auto overflow-hidden">
                       <div className="h-full transition-all duration-1000" style={{ width: '65%', backgroundColor: ACCENT_COLOR }} />
                    </div>
                 </div>
                 <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="w-12 h-12 rounded-full border border-gray-100 p-1 hover:border-black transition-colors">
                    <div className="w-full h-full bg-gray-50 rounded-full flex items-center justify-center text-xs font-bold text-black uppercase">
                       {user?.username?.[0]}
                    </div>
                 </button>
              </div>
            ) : (
              <div className="flex items-center gap-10">
                <Link href="/login" className="text-[11px] font-bold uppercase kerning-wide text-gray-400 hover:text-black transition-colors">
                  Login
                </Link>
                <Link href="/register" 
                  className="px-8 py-3 bg-black text-white text-[11px] font-bold uppercase kerning-wide hover:bg-gray-900 transition-all"
                >
                  Join Now
                </Link>
              </div>
            )}

            <button onClick={() => setMobileOpen(true)} className="lg:hidden">
              <Hash className="w-6 h-6 text-black" />
            </button>
          </div>
        </div>
      </nav>

      {/* Fullscreen Mobile Menu - Toujours blanc opaque */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[200] bg-white p-12 flex flex-col animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex justify-between items-center mb-24">
            <div className="w-8 h-8 bg-black" />
            <button onClick={() => setMobileOpen(false)} className="group flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase kerning-wide">Close</span>
              <X className="w-8 h-8 text-black" />
            </button>
          </div>
          
          <div className="flex flex-col gap-10">
            {navItems.map((item, index) => (
              <Link 
                key={item.href} 
                href={item.href} 
                onClick={() => setMobileOpen(false)}
                className="group flex items-center gap-8"
              >
                <span className="text-sm font-bold text-gray-200 group-hover:text-black transition-colors">0{index + 1}</span>
                <span className="text-6xl font-['Syne'] font-extrabold tracking-tighter text-black/5 group-hover:text-black transition-all duration-500">
                  {item.label}
                </span>
                <ArrowUpRight className="w-10 h-10 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-blue-600" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  )
}