import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const GEOBLOCKING_ENABLED = process.env.NEXT_PUBLIC_GEOBLOCKING === 'true'
const MANUALLY_PAUSED_NETWORK_ASSETS =
  process.env.NEXT_PUBLIC_PAUSED_NETWORK_ASSETS?.split(',').map((token) => token.trim()) || []

// US, Panama, Cuba, Iran, North Korea, Russia, Syria
const BLOCKED_COUNTRIES = ['US', 'PA', 'CU', 'IR', 'KP', 'RU', 'SY']

const PUBLIC_FILE = /\.(.*)$/

export function middleware(req: NextRequest) {
  console.log(`Middleware executing for: ${req.nextUrl.pathname}`)
  const { pathname } = req.nextUrl

  // Check if the request is an RTK Query request
  const isRTKQuery =
    req.headers.get('content-type')?.includes('application/json') &&
    (req.method === 'POST' || req.method === 'GET') &&
    pathname.startsWith('/tokens/')

  // Early return for RTK Query requests
  if (isRTKQuery) {
    return NextResponse.next()
  }

  const token = MANUALLY_PAUSED_NETWORK_ASSETS.find((token) => pathname.includes(token))
  const isPausedPage = pathname.startsWith('/tokens/') && !!token

  if (isPausedPage) {
    return NextResponse.rewrite(new URL(`/tokens/${token}/paused`, req.url))
  }

  if (pathname.includes('/api')) {
    return NextResponse.next()
  }

  if (!GEOBLOCKING_ENABLED) {
    return NextResponse.next()
  }

  const country = req.geo?.country || 'NOT-US' // NOT-US is for localhost testing

  if (
    pathname.startsWith('/_next') || // exclude Next.js internals
    pathname.startsWith('/api') || //  exclude all API routes
    pathname.startsWith('/static') || // exclude static files
    PUBLIC_FILE.test(pathname) // exclude all files in the public folder
  ) {
    return NextResponse.next()
  }

  if (BLOCKED_COUNTRIES.includes(country)) {
    req.nextUrl.pathname = '/geoblock'
  }

  return NextResponse.rewrite(req.nextUrl)
}

// Add middleware config to handle matcher
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
