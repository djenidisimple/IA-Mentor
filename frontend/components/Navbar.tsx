'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'
import { X, LogOut, User, Menu, Code2 } from 'lucide-react'

export default function Navbar() {
  const pathname = usePathname()
  const { isAuthenticated, user, logout } = useAuthStore()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setHydrated(true)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const isActiveLink = (href: string): boolean => {
    if (href === '/home') return pathname === '/home' || pathname === '/'
    return pathname.startsWith(href)
  }

  const navItems = [
    { href: '/home',        label: 'Home' },
    { href: '/challenges',  label: 'Challenges' },
    { href: '/community',   label: 'Community' },
    { href: '/leaderboard', label: 'Rankings' },
  ]

  if (!hydrated) return null

  return (
    <>
      <style jsx global>{`
        .nav-link {
          position: relative;
          font-size: 13px;
          font-weight: 500;
          color: var(--gray);
          transition: color 0.2s ease;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 1.5px;
          background: var(--yellow);
          transition: width 0.25s ease;
        }
        .nav-link:hover,
        .nav-link.active {
          color: var(--navy);
        }
        .nav-link:hover::after,
        .nav-link.active::after {
          width: 100%;
        }
        .nav-link.active::after {
          background: var(--yellow);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .mobile-fade-in { animation: fadeIn 0.2s ease forwards; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .dropdown-enter { animation: fadeUp 0.2s ease forwards; }
      `}</style>

      <nav className="fixed top-0 w-full z-[100] bg-[var(--cream)]/80 backdrop-blur-md border-b border-[var(--border-pink)]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-4 sm:py-5 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-[var(--navy)] flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-[var(--navy)]">
              Dev<span className="text-[var(--blue)]">Challenge</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-10">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link ${isActiveLink(item.href) ? 'active' : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-3 group"
                >
                  <div className="hidden sm:block text-right leading-none">
                    <p className="text-[12px] font-semibold uppercase tracking-wide text-[var(--navy)]">
                      {user?.username}
                    </p>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-[var(--navy)] flex items-center justify-center text-[13px] font-bold uppercase text-white">
                    {user?.username?.[0]}
                  </div>
                </button>

                {userMenuOpen && (
                  <div className="dropdown-enter absolute right-0 top-12 w-52 bg-white border border-[var(--border-pink)] rounded-xl shadow-xl z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-[var(--border-pink)]">
                      <p className="text-[12px] font-bold uppercase text-[var(--navy)]">{user?.username}</p>
                      <p className="text-[11px] text-[var(--gray)] truncate">{user?.email}</p>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--cream)] text-[13px] font-medium text-[var(--navy)]"
                    >
                      <User className="w-4 h-4 text-[var(--gray)]" />
                      Mon profil
                    </Link>
                    <button
                      onClick={() => { logout(); setUserMenuOpen(false) }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-[13px] font-medium text-red-500 border-t border-[var(--border-pink)]"
                    >
                      <LogOut className="w-4 h-4" />
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-6">
                <Link href="/login" className="nav-link">Login</Link>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-[13px] font-bold tracking-wide bg-[var(--navy)] text-white hover:bg-[#2A3050] shadow-lg shadow-[var(--navy)]/10 transition-all duration-300 ease-out active:scale-95"
                >
                  Commencer
                </Link>
              </div>
            )}

            {/* Mobile Burger Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-[var(--navy)]"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileOpen && (
          <div className="lg:hidden fixed inset-x-0 top-16 bottom-0 bg-[var(--cream)] z-[90] mobile-fade-in flex flex-col">
            <div className="flex flex-col p-6 gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`py-4 text-lg font-medium border-b border-[var(--border-pink)] transition-colors ${
                    isActiveLink(item.href) ? 'text-[var(--navy)]' : 'text-[var(--gray)]'
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              {!isAuthenticated && (
                <div className="flex flex-col gap-4 mt-6">
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="text-center py-3 font-medium text-[var(--navy)]"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileOpen(false)}
                    className="text-center py-3 rounded-full text-[13px] font-bold tracking-wide bg-[var(--navy)] text-white"
                  >
                    Commencer
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
      {/* Spacer pour compenser la nav fixed */}
      <div className="h-16" />
    </>
  )
}
