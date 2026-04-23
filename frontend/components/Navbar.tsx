'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'
import { X, LogOut, User, ArrowUpRight } from 'lucide-react'

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

  // Fermer le menu utilisateur en cliquant dehors
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
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap');

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
        }
        .nav-cta:hover {
          background: var(--ink);
          color: white;
        }

        /* Checkerboard accent strip (inspired by reference) */
        .checker-strip {
          height: 6px;
          background-image: repeating-linear-gradient(
            90deg,
            var(--ink) 0px,
            var(--ink) 10px,
            transparent 10px,
            transparent 20px
          );
        }

        /* Mobile menu */
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .mobile-menu-enter { animation: slideDown 0.35s ease forwards; }

        /* User dropdown */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .dropdown-enter { animation: fadeUp 0.2s ease forwards; }
      `}</style>

      {/* Checkerboard top strip */}
      <div className="fixed top-0 w-full z-[101] checker-strip" />

      <nav className="fixed top-[6px] w-full z-[100] bg-white font-['Outfit']">

        {/* Main bar */}
        <div className="max-w-[1400px] mx-auto px-8 lg:px-12 h-16 flex items-center justify-between">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            {/* Geometric mark */}
            <div
              className="w-8 h-8 flex-shrink-0 transition-transform duration-300 group-hover:rotate-45"
              style={{
                background: 'var(--accent)',
                clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
              }}
            />
            <div className="flex flex-col leading-none">
              Logo
            </div>
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
          <div className="flex items-center gap-5">
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                {/* Avatar button */}
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-3 group"
                >
                  <div className="hidden sm:block text-right leading-none">
                    <p
                      className="text-[12px] font-semibold uppercase tracking-wide"
                      style={{ color: 'var(--ink)' }}
                    >
                      {user?.username}
                    </p>
                    <p className="text-[10px] mt-0.5" style={{ color: 'var(--muted)' }}>
                      Member
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

                {/* Dropdown */}
                {userMenuOpen && (
                  <div
                    className="dropdown-enter absolute right-0 top-12 w-52 bg-white border shadow-md z-50"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <div
                      className="px-4 py-3 border-b"
                      style={{ borderColor: 'var(--border)' }}
                    >
                      <p className="text-[12px] font-bold uppercase tracking-wide" style={{ color: 'var(--ink)' }}>
                        {user?.username}
                      </p>
                      <p className="text-[11px] mt-0.5" style={{ color: 'var(--muted)' }}>
                        {user?.email ?? 'Membre actif'}
                      </p>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <User className="w-4 h-4" style={{ color: 'var(--muted)' }} />
                      <span className="text-[13px] font-medium" style={{ color: 'var(--ink)' }}>
                        Mon profil
                      </span>
                    </Link>
                    <button
                      onClick={() => { logout(); setUserMenuOpen(false) }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors border-t"
                      style={{ borderColor: 'var(--border)' }}
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      <span className="text-[13px] font-medium text-red-500">Déconnexion</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-5">
                <Link
                  href="/login"
                  className="nav-link hidden sm:block"
                >
                  Login
                </Link>
                <Link href="/register" className="nav-cta">
                  Join Free
                </Link>
              </div>
            )}

            {/* Mobile burger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden flex flex-col gap-[5px] p-1"
              aria-label="Open menu"
            >
              <span className="block w-6 h-[2px]" style={{ background: 'var(--ink)' }} />
              <span className="block w-4 h-[2px]" style={{ background: 'var(--ink)' }} />
              <span className="block w-6 h-[2px]" style={{ background: 'var(--ink)' }} />
            </button>
          </div>
        </div>

        {/* Bottom border */}
        <div className="h-px" style={{ background: 'var(--border)' }} />
      </nav>

      {/* ── Fullscreen Mobile Menu ── */}
      {mobileOpen && (
        <div className="mobile-menu-enter fixed inset-0 z-[200] bg-white flex flex-col p-8">

          {/* Header */}
          <div className="flex justify-between items-center mb-16">
            <span
              className="text-[11px] font-bold uppercase tracking-[0.25em]"
              style={{ color: 'var(--muted)' }}
            >
              Navigation
            </span>
            <button
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 group"
            >
              <span
                className="text-[11px] font-bold uppercase tracking-widest transition-colors"
                style={{ color: 'var(--muted)' }}
              >
                Fermer
              </span>
              <X className="w-5 h-5" style={{ color: 'var(--ink)' }} />
            </button>
          </div>

          {/* Links */}
          <div className="flex flex-col divide-y" style={{ borderColor: 'var(--border)' }}>
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="group flex items-center justify-between py-6"
              >
                <div className="flex items-baseline gap-4">
                  <span
                    className="text-[11px] font-bold tabular-nums"
                    style={{ color: 'var(--muted)' }}
                  >
                    0{index + 1}
                  </span>
                  <span
                    className="text-4xl font-['Syne'] font-extrabold tracking-tight transition-colors duration-300 group-hover:text-blue-600"
                    style={{ color: 'var(--ink)' }}
                  >
                    {item.label}
                  </span>
                </div>
                <ArrowUpRight
                  className="w-6 h-6 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                  style={{ color: 'var(--accent)' }}
                />
              </Link>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-auto">
            {!isAuthenticated && (
              <Link
                href="/register"
                onClick={() => setMobileOpen(false)}
                className="nav-cta block text-center w-full py-4 text-base"
              >
                Rejoindre gratuitement →
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  )
}