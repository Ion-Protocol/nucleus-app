import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const GEOBLOCKING_ENABLED = process.env.NEXT_PUBLIC_GEOBLOCKING === 'true'
const MANUALLY_PAUSED_NETWORK_ASSETS =
  process.env.NEXT_PUBLIC_PAUSED_NETWORK_ASSETS?.split(',').map((token) => token.trim()) || []
const BLOCKED_COUNTRIES = ['US', 'PA', 'CU', 'IR', 'KP', 'RU', 'SY']
const PUBLIC_FILE = /\.(.*)$/

// Helper function to check if request should be excluded from middleware processing
const shouldExcludeRequest = (pathname: string): boolean => {
  return (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    PUBLIC_FILE.test(pathname)
  )
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Early return for excluded paths to prevent race conditions
  if (shouldExcludeRequest(pathname)) {
    return NextResponse.next()
  }

  // Handle API requests first
  if (pathname.includes('/api')) {
    // Set appropriate headers to prevent caching of API responses
    const response = NextResponse.next()
    response.headers.set('Cache-Control', 'no-store, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    return response
  }

  // Handle paused token pages
  const token = MANUALLY_PAUSED_NETWORK_ASSETS.find((token) => pathname.includes(token))
  if (pathname.startsWith('/tokens/') && token) {
    return NextResponse.rewrite(new URL(`/tokens/${token}/paused`, req.url))
  }

  // Skip geoblocking if disabled
  if (!GEOBLOCKING_ENABLED) {
    return NextResponse.next()
  }

  // Handle geoblocking
  const country = req.geo?.country || 'NOT-US'
  if (BLOCKED_COUNTRIES.includes(country)) {
    req.nextUrl.pathname = '/geoblock'
  }

  return NextResponse.rewrite(req.nextUrl)
}

// Refined matcher configuration to explicitly exclude API routes
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
}
