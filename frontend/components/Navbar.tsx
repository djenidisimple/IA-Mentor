'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'
import {
  Menu, X, Circle, Square, Triangle, Hexagon,
  Sparkles, Crown, LogOut, User, Settings,
  ArrowUpRight, Minimize2
} from 'lucide-react'

export default function Navbar() {
  const pathname = usePathname()
  const { isAuthenticated, user, logout } = useAuthStore()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    setHydrated(true)
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Fonction pour vérifier si le lien est actif (inclut les sous-chemins)
  const isActiveLink = (href: string): boolean => {
    if (href === '/home') {
      return pathname === '/home' || pathname === '/'
    }
    return pathname.startsWith(href)
  }

  const navItems = [
    { href: '/home', label: 'Index', shape: Circle, color: '#EF4444' },
    { href: '/challenges', label: 'Work', shape: Square, color: '#3B82F6' },
    { href: '/community', label: 'Studio', shape: Triangle, color: '#F59E0B' },
    { href: '/leaderboard', label: 'Archive', shape: Hexagon, color: '#10B981' },
  ]

  if (!hydrated) return null

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Syne:wght@400;500;600;700;800&display=swap');
        
        @keyframes reveal {
          0% { clip-path: inset(0 100% 0 0); opacity: 0; }
          100% { clip-path: inset(0 0 0 0); opacity: 1; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-5px) rotate(2deg); }
          75% { transform: translateY(5px) rotate(-2deg); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
        
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .geometric-pattern {
          background-image: 
            radial-gradient(circle at 20% 30%, #EF444410 1px, transparent 1px),
            radial-gradient(circle at 80% 70%, #3B82F610 1px, transparent 1px),
            radial-gradient(circle at 40% 80%, #F59E0B10 1px, transparent 1px);
          background-size: 40px 40px, 60px 60px, 50px 50px;
        }
        
        .grid-overlay {
          background-image: 
            linear-gradient(to right, #00000008 1px, transparent 1px),
            linear-gradient(to bottom, #00000008 1px, transparent 1px);
          background-size: 30px 30px;
        }
      `}</style>

      <nav className={`
        font-['Space_Grotesk'] relative
        transition-all duration-500
        ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'}
      `}>
        
        {/* Decorative Background Pattern */}
        <div className="absolute inset-0 pointer-events-none geometric-pattern opacity-30" />
        <div className="absolute inset-0 pointer-events-none grid-overlay" />

        {/* Floating Abstract Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-10 left-[15%] w-16 h-16 border border-red-200 rounded-full opacity-20 animate-float" />
          <div className="absolute bottom-5 right-[20%] w-24 h-24 border-2 border-blue-200 opacity-20 animate-float" 
               style={{ animationDelay: '1s', transform: 'rotate(45deg)' }} />
          <div className="absolute top-1/2 right-[10%] w-8 h-8 bg-yellow-200/30 animate-float" 
               style={{ animationDelay: '2s' }} />
        </div>

        <div className="max-w-[1800px] mx-auto px-8 py-5 relative">
          <div className="flex items-center justify-between">
            
            {/* Logo - Bauhaus Enhanced */}
            <Link href="/" className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-blue-500/0 to-yellow-500/0 group-hover:from-red-500/5 group-hover:via-blue-500/5 group-hover:to-yellow-500/5 rounded-2xl blur-xl transition-all duration-500" />
              
              <div className="relative flex items-center gap-4">
                {/* Geometric Logo Mark */}
                <div className="relative">
                  <div className="flex gap-1.5">
                    <div className="w-3.5 h-3.5 bg-red-500 group-hover:scale-110 transition-all duration-300" 
                         style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
                    <div className="w-3.5 h-3.5 bg-blue-500 group-hover:scale-110 transition-all duration-300 delay-75" />
                    <div className="w-3.5 h-3.5 bg-yellow-500 rounded-full group-hover:scale-110 transition-all duration-300 delay-150" />
                  </div>
                  
                  {/* Rotating accent */}
                  <div className="absolute -top-1 -right-1 w-2 h-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Sparkles className="w-2 h-2 text-purple-500 animate-rotate" />
                  </div>
                </div>
                
                {/* Typography */}
                <div className="flex flex-col">
                  <span className="text-2xl font-['Syne'] font-bold tracking-tighter leading-none">
                    <span className="text-black">dev</span>
                    <span className="text-blue-500">Review</span>
                    <span className="text-amber-500 ml-1">AI</span>
                  </span>
                  <span className="text-[8px] text-gray-400 tracking-[0.3em] uppercase font-medium">
                    Bauhaus Edition
                  </span>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation - Abstract Geometric */}
            <div className="hidden lg:flex items-center gap-6">
              {navItems.map((item, index) => {
                const Shape = item.shape
                const isActive = isActiveLink(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group relative px-2"
                  >
                    {/* Hover background effect */}
                    <div className={`
                      absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300
                      bg-gradient-to-r from-transparent via-gray-50 to-transparent
                    `} />
                    
                    <div className="relative flex flex-col items-center gap-1.5">
                      {/* Shape with color */}
                      <div className="relative">
                        <Shape className={`
                          w-3.5 h-3.5 transition-all duration-500
                          ${isActive 
                            ? 'text-current fill-current' 
                            : 'text-gray-300 group-hover:text-current'
                          }
                        `}
                        style={{ 
                          color: isActive ? item.color : undefined,
                          transform: isActive ? 'scale(1.2)' : 'scale(1)'
                        }} />
                        
                        {/* Active indicator ring */}
                        {isActive && (
                          <div className="absolute -inset-2 opacity-20 animate-pulse-glow"
                               style={{ color: item.color }}>
                            <Shape className="w-full h-full text-current fill-current" />
                          </div>
                        )}
                      </div>
                      
                      {/* Label */}
                      <span className={`
                        text-[10px] font-semibold tracking-[0.15em] uppercase
                        transition-all duration-300
                        ${isActive 
                          ? 'text-black font-bold' 
                          : 'text-gray-400 group-hover:text-black'
                        }
                      `}>
                        {item.label}
                      </span>
                      
                      {/* Underline animation */}
                      <div className={`
                        absolute -bottom-3 left-1/2 h-0.5 transition-all duration-500 ease-out
                        ${isActive ? 'w-8' : 'w-0 group-hover:w-8'}
                      `}
                      style={{ 
                        backgroundColor: item.color,
                        transform: 'translateX(-50%)'
                      }} />
                    </div>
                    
                    {/* Number indicator */}
                    <span className="absolute -top-1 -right-1 text-[8px] font-bold text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">
                      0{index + 1}
                    </span>
                  </Link>
                )
              })}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <div className="flex items-center gap-3 md:gap-4">
                  {/* XP/Status Indicator */}
                  <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-100">
                    <Crown className="w-3.5 h-3.5 text-yellow-500" />
                    <span className="text-[10px] font-semibold text-gray-600 tracking-wider">
                      {user?.points || '0'} PTS
                    </span>
                  </div>
                  
                  {/* User Menu */}
                  <div className="relative">
                    <button 
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="group flex items-center gap-2 md:gap-3 pl-0 md:pl-3 md:border-l border-gray-200"
                    >
                      {/* Avatar with geometric style */}
                      <div className="relative">
                        <div className="w-8 h-8 bg-black flex items-center justify-center text-white text-xs font-bold overflow-hidden"
                             style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' }}>
                          {user?.avatarUrl ? (
                            <img src={user.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                            user?.username?.[0]?.toUpperCase() || 'U'
                          )}
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-white" />
                      </div>
                      
                      <div className="hidden md:block text-left">
                        <span className="text-xs font-semibold text-black tracking-wide block leading-tight">
                          {user?.username}
                        </span>
                        <span className="text-[9px] text-gray-400 tracking-wider uppercase">
                          Artist
                        </span>
                      </div>
                    </button>

                    {/* Dropdown Menu - Geometric Style */}
                    {userMenuOpen && (
                      <>
                        <div 
                          className="fixed inset-0 z-40" 
                          onClick={() => setUserMenuOpen(false)} 
                        />
                        
                        <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-100 shadow-2xl z-50 animate-slideDown"
                             style={{ boxShadow: '20px 20px 40px rgba(0,0,0,0.05)' }}>
                          
                          {/* User Header */}
                          <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-transparent">
                            <p className="text-[9px] text-gray-400 tracking-wider uppercase mb-1">Signed in as</p>
                            <p className="text-sm font-bold text-black">{user?.username}</p>
                            <p className="text-[9px] text-gray-500 mt-1">{user?.email}</p>
                          </div>
                          
                          {/* Menu Items */}
                          <div className="p-2">
                            <Link 
                              href="/profile"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center justify-between px-3 py-2.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors group"
                            >
                              <span className="flex items-center gap-3">
                                <User className="w-3.5 h-3.5 text-gray-400" />
                                Profile
                              </span>
                              <ArrowUpRight className="w-3 h-3 text-gray-300 group-hover:text-black transition-colors" />
                            </Link>
                            
                            <Link 
                              href="/settings"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center justify-between px-3 py-2.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors group"
                            >
                              <span className="flex items-center gap-3">
                                <Settings className="w-3.5 h-3.5 text-gray-400" />
                                Settings
                              </span>
                              <ArrowUpRight className="w-3 h-3 text-gray-300 group-hover:text-black transition-colors" />
                            </Link>
                            
                            <div className="h-px bg-gray-100 my-2" />
                            
                            <button 
                              onClick={() => {
                                logout()
                                setUserMenuOpen(false)
                              }}
                              className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors group"
                            >
                              <span className="flex items-center gap-3">
                                <LogOut className="w-3.5 h-3.5" />
                                Sign out
                              </span>
                              <Minimize2 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                          </div>
                          
                          {/* Footer Decoration */}
                          <div className="h-0.5 bg-gradient-to-r from-red-500 via-blue-500 to-yellow-500" />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-6">
                  <Link 
                    href="/login"
                    className="text-xs font-medium text-gray-400 hover:text-black tracking-wider uppercase transition-colors"
                  >
                    Enter
                  </Link>
                  
                  <div className="h-4 w-px bg-gray-200" />
                  
                  <Link 
                    href="/register"
                    className="relative group"
                  >
                    <span className="relative z-10 text-xs font-bold text-black hover:text-white tracking-wider uppercase px-4 py-2">
                      Join
                    </span>
                    <div className="absolute inset-0 border border-black group-hover:bg-black transition-colors" />
                    <div className="absolute -inset-0.5 border border-black/20 -z-10" />
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button - Geometric */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden relative w-10 h-10 flex items-center justify-center group"
              >
                <div className="absolute inset-0 border border-gray-200 group-hover:border-black transition-colors" />
                {mobileOpen ? (
                  <X className="w-4 h-4 text-black" />
                ) : (
                  <div className="flex flex-col gap-1">
                    <div className="w-4 h-0.5 bg-black" />
                    <div className="w-3 h-0.5 bg-black" />
                    <div className="w-4 h-0.5 bg-black" />
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu - Full Screen Artistic Overlay */}
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 bg-white z-50 animate-reveal overflow-y-auto">
            {/* Geometric Background */}
            <div className="absolute inset-0 geometric-pattern opacity-20" />
            
            <div className="relative h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-8">
                <div className="flex gap-2">
                  <div className="w-4 h-4 bg-red-500" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
                  <div className="w-4 h-4 bg-blue-500" />
                  <div className="w-4 h-4 bg-yellow-500 rounded-full" />
                </div>
                
                <button 
                  onClick={() => setMobileOpen(false)}
                  className="relative w-12 h-12 flex items-center justify-center group"
                >
                  <div className="absolute inset-0 border-2 border-black group-hover:bg-black transition-colors" />
                  <X className="w-5 h-5 text-black group-hover:text-white transition-colors relative z-10" />
                </button>
              </div>
              
              {/* Navigation Links */}
              <div className="flex-1 flex flex-col justify-center px-8">
                <div className="space-y-6">
                  {navItems.map((item, index) => {
                    const Shape = item.shape
                    const isActive = isActiveLink(item.href)
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="group block"
                      >
                        <div className="flex items-center gap-6">
                          {/* Large Shape */}
                          <div className="relative">
                            <Shape className={`
                              w-6 h-6 transition-all duration-500
                              ${isActive ? 'text-current' : 'text-gray-200 group-hover:text-current'}
                            `}
                            style={{ color: isActive ? item.color : undefined }} />
                            
                            {isActive && (
                              <div className="absolute inset-0 animate-pulse-glow"
                                   style={{ color: item.color }}>
                                <Shape className="w-full h-full text-current fill-current opacity-20" />
                              </div>
                            )}
                          </div>
                          
                          {/* Label */}
                          <span className={`
                            text-5xl font-['Syne'] font-bold tracking-tighter
                            transition-all duration-300
                            ${isActive 
                              ? 'text-black' 
                              : 'text-gray-200 group-hover:text-black'
                            }
                          `}>
                            {item.label}
                          </span>
                          
                          {/* Number */}
                          <span className="text-sm text-gray-300 ml-auto font-mono">
                            [0{index + 1}]
                          </span>
                        </div>
                        
                        {/* Description line */}
                        <p className="text-xs text-gray-400 mt-2 ml-12 opacity-0 group-hover:opacity-100 transition-opacity">
                          {index === 0 && 'Starting point of your creative journey'}
                          {index === 1 && 'Explore curated challenges and experiments'}
                          {index === 2 && 'Connect with the creative developer community'}
                          {index === 3 && 'Timeless pieces from the gallery collection'}
                        </p>
                      </Link>
                    )
                  })}
                </div>
                
                {/* Auth Section */}
                {!isAuthenticated && (
                  <div className="mt-16 pt-16 border-t border-gray-100">
                    <p className="text-[10px] text-gray-400 tracking-[0.3em] uppercase mb-8">
                      Begin your journey
                    </p>
                    <div className="flex gap-8">
                      <Link 
                        href="/login"
                        onClick={() => setMobileOpen(false)}
                        className="group"
                      >
                        <span className="text-2xl font-['Syne'] font-light text-gray-300 group-hover:text-black transition-colors">
                          Enter
                        </span>
                        <div className="h-0.5 w-0 group-hover:w-full bg-black transition-all duration-500" />
                      </Link>
                      
                      <Link 
                        href="/register"
                        onClick={() => setMobileOpen(false)}
                        className="group"
                      >
                        <span className="text-2xl font-['Syne'] font-bold text-black">
                          Join
                        </span>
                        <div className="h-0.5 w-full bg-gradient-to-r from-red-500 via-blue-500 to-yellow-500" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Footer */}
              <div className="p-8">
                <div className="flex items-center justify-between text-[9px] text-gray-400 tracking-wider">
                  <span>© 2024 devReview AI</span>
                  <span>Bauhaus Edition</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
