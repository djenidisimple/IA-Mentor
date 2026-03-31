import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes publiques
const publicRoutes = ['/', '/login', '/register']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Vérifier si c'est une route publique
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  )
  
  // Ne pas appliquer le middleware sur les routes API, assets, etc.
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }
  
  // Essayer de lire le token depuis le cookie (si tu en as un)
  const token = request.cookies.get('token')?.value
  
  // Si pas de token et route protégée
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // Si token et route publique (login/register)
  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL('/home', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
