import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key')

// List of public routes that don't require authentication
const publicRoutes = ['/api/auth', '/', '/home', '/courses/create']

export async function middleware(request: NextRequest) {
  const isPublicRoute = publicRoutes.some(route => request.nextUrl.pathname.startsWith(route))
  if (isPublicRoute) {
    return NextResponse.next()
  }

  const token = request.cookies.get('session')?.value

  if (!token) {
    return NextResponse.next() // Allow access instead of redirecting
  }

  try {
    await jwtVerify(token, JWT_SECRET)
    return NextResponse.next()
  } catch (error) {
    return NextResponse.next() // Allow access instead of redirecting
  }
}



export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api/auth routes
     * 2. /_next (Next.js internals)
     * 3. /fonts (inside /public)
     * 4. /icons (inside /public)
     * 5. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!_next|fonts|icons|[\\w-]+\\.\\w+).*)'
  ],
}
