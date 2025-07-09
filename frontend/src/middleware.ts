import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Get token from cookies
    const token = request.cookies.get('token')?.value

    // Allow all requests to static files and API routes
    if (
        pathname.startsWith('/_next') ||
        pathname.includes('.') ||
        pathname.startsWith('/api')
    ) {
        return NextResponse.next()
    }

    // Redirect authenticated users away from auth pages
    if (token && (pathname === '/login' || pathname === '/register')) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // For all other routes, let the client-side AuthProvider handle authentication
    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
