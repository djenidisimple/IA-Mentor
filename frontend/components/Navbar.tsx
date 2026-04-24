'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'
import { X, LogOut, User, Menu } from 'lucide-react'

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
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');

        :root {
          --accent: #0052FF;
          --ink:    #0D0D0D;
          --muted:  #888888;
          --border: #E5E5E5;
          --bg:     #FFFFFF;
        }

        .nav-link {
          position: relative;
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.01em;
          color: var(--muted);
          transition: color 0.2s ease;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 1.5px;
          background: var(--ink);
          transition: width 0.25s ease;
        }
        .nav-link:hover,
        .nav-link.active {
          color: var(--ink);
        }
        .nav-link:hover::after,
        .nav-link.active::after {
          width: 100%;
        }
        .nav-link.active::after {
          background: var(--accent);
        }

        .nav-cta {
          font-family: 'Outfit', sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.04em;
          padding: 8px 22px;
          border: 1.5px solid var(--ink);
          color: var(--ink);
          background: transparent;
          transition: background 0.2s ease, color 0.2s ease;
          text-align: center;
        }
        .nav-cta:hover {
          background: var(--ink);
          color: white;
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

      <nav className="fixed top-0 w-full z-[100] bg-white font-['Outfit'] border-b border-[var(--border)]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
          
          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <div
              className="w-7 h-7 flex-shrink-0 transition-transform duration-300 group-hover:rotate-45"
              style={{
                background: 'var(--accent)',
                clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
              }}
            />
            <span className="font-bold text-lg tracking-tight">Logo</span>
          </Link>

          {/* ── Desktop Nav ── */}
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

          {/* ── Right actions ── */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-3 group"
                >
                  <div className="hidden sm:block text-right leading-none">
                    <p className="text-[12px] font-semibold uppercase tracking-wide text-[var(--ink)]">
                      {user?.username}
                    </p>
                  </div>
                  <div
                    className="w-9 h-9 border flex items-center justify-center text-[13px] font-bold uppercase transition-colors"
                    style={{
                      borderColor: userMenuOpen ? 'var(--ink)' : 'var(--border)',
                      color: 'var(--ink)',
                    }}
                  >
                    {user?.username?.[0]}
                  </div>
                </button>

                {userMenuOpen && (
                  <div className="dropdown-enter absolute right-0 top-12 w-52 bg-white border border-[var(--border)] shadow-xl z-50">
                    <div className="px-4 py-3 border-b border-[var(--border)]">
                      <p className="text-[12px] font-bold uppercase text-[var(--ink)]">{user?.username}</p>
                      <p className="text-[11px] text-[var(--muted)] truncate">{user?.email}</p>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-[13px] font-medium text-[var(--ink)]"
                    >
                      <User className="w-4 h-4 text-[var(--muted)]" />
                      Mon profil
                    </Link>
                    <button
                      onClick={() => { logout(); setUserMenuOpen(false) }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-[13px] font-medium text-red-500 border-t border-[var(--border)]"
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
                <Link href="/register" className="nav-cta">Join Free</Link>
              </div>
            )}

            {/* Mobile Burger Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-[var(--ink)]"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* ── Mobile Menu Overlay ── */}
        {mobileOpen && (
          <div className="lg:hidden fixed inset-x-0 top-16 bottom-0 bg-white z-[90] mobile-fade-in flex flex-col">
            <div className="flex flex-col p-6 gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`py-4 text-lg font-medium border-b border-[var(--border)] transition-colors ${
                    isActiveLink(item.href) ? 'text-[var(--accent)]' : 'text-[var(--ink)]'
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
                    className="text-center py-3 font-medium text-[var(--ink)]"
                  >
                    Login
                  </Link>
                  <Link 
                    href="/register" 
                    onClick={() => setMobileOpen(false)}
                    className="nav-cta py-4 text-base"
                  >
                    Join Free
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