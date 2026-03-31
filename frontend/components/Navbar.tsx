'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'
import { Button } from '@/components/ui/Button'
import { 
  Home, 
  Code, 
  Users, 
  Award, 
  Menu, 
  X, 
  LogOut,
  User,
  ChevronDown,
  Terminal
} from 'lucide-react'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated, user, logout } = useAuthStore()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  const navItems = [
    { href: '/home', label: 'ACCUEIL', icon: Home },
    { href: '/challenges', label: 'CHALLENGES', icon: Code },
    { href: '/community', label: 'COMMUNAUTÉ', icon: Users },
    { href: '/leaderboard', label: 'CLASSEMENT', icon: Award },
  ]

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  if (!isHydrated) {
    return (
      <nav className="fixed top-0 w-full z-50 bg-[#1A1919] border-b border-[#D64933]/20 h-16">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/mobius.svg" alt="logo" className='w-4 h-4' />
            <span className="text-xl font-black tracking-[-2px] text-[#F2E9E2]">
              DEV<span className="text-[#D64933]">REVIEW</span>
            </span>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-[#1A1919]/95 backdrop-blur-sm border-b border-[#D64933]/20 h-16">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          {/* Logo */}
          <Link href={isAuthenticated ? '/home' : '/'} className="flex items-center gap-2 group">
            <img src="/mobius.svg" alt="logo" className='w-8 h-8' />
            <span className="text-xl font-black tracking-[-2px] text-[#F2E9E2]">
              DEV<span className="text-[#D64933]">REVIEW</span>
            </span>
          </Link>

          {/* Desktop Navigation - seulement si authentifié */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 text-sm font-mono tracking-wider transition-all duration-300
                      ${isActive 
                        ? 'text-[#D64933] border-b-2 border-[#D64933] pb-1' 
                        : 'text-[#B8B0A0] hover:text-[#F2E9E2]'
                      }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          )}

          {/* User Menu / Auth Buttons */}
          <div className="flex items-center gap-4">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-3 bg-[#0F0E0E] border border-[#333] hover:border-[#D64933]/50 rounded-none px-3 py-2 transition-all duration-300"
                >
                  <div className="w-8 h-8 rounded-full bg-[#D64933]/20 border border-[#D64933] flex items-center justify-center">
                    <span className="text-[#D64933] font-mono font-bold text-sm">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-mono text-[#F2E9E2] hidden sm:block">
                    {user.username}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-[#666] transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isUserMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-[#0F0E0E] border border-[#D64933]/20 shadow-xl z-50">
                      <div className="p-3 border-b border-[#D64933]/20">
                        <p className="text-xs font-mono text-[#666]">CONNECTÉ EN TANT QUE</p>
                        <p className="text-sm font-mono text-[#F2E9E2] font-bold mt-1">{user.username}</p>
                        <p className="text-xs font-mono text-[#666]">{user.email}</p>
                      </div>
                      <div className="py-2">
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 px-4 py-2 text-sm font-mono text-[#B8B0A0] hover:bg-[#D64933]/10 hover:text-[#D64933] transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <User className="h-4 w-4" />
                          MON PROFIL
                        </Link>
                        <Link
                          href="/my-submissions"
                          className="flex items-center gap-3 px-4 py-2 text-sm font-mono text-[#B8B0A0] hover:bg-[#D64933]/10 hover:text-[#D64933] transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Terminal className="h-4 w-4" />
                          MES CHALLENGES
                        </Link>
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false)
                            handleLogout()
                          }}
                          className="flex items-center gap-3 w-full px-4 py-2 text-sm font-mono text-[#FF6B6B] hover:bg-[#FF6B6B]/10 transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          DÉCONNEXION
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login">
                  <Button variant="ghost" className="text-[#F2E9E2] hover:text-[#D64933] font-mono text-sm">
                    CONNEXION
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-[#D64933] hover:bg-[#B33A22] text-[#1A1919] font-mono text-sm">
                    S'INSCRIRE
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden text-[#F2E9E2] p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && isAuthenticated && (
          <div className="md:hidden bg-[#1A1919] border-t border-[#D64933]/20 px-6 py-4">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 py-3 text-[#B8B0A0] hover:text-[#D64933] font-mono text-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              )
            })}
          </div>
        )}
      </nav>
      <div className="h-16" /> {/* Spacer for fixed navbar */}
    </>
  )
}
