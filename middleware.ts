import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const GEOBLOCKING_ENABLED = process.env.NEXT_PUBLIC_GEOBLOCKING === 'true'
const PAUSED_NETWORK_ASSETS =
  process.env.NEXT_PUBLIC_PAUSED_NETWORK_ASSETS?.split(',').map((token) => token.trim()) || []
console.log('🚀 ~ PAUSED_NETWORK_ASSETS:', PAUSED_NETWORK_ASSETS)

// US, Panama, Cuba, Iran, North Korea, Russia, Syria
const BLOCKED_COUNTRIES = ['US', 'PA', 'CU', 'IR', 'KP', 'RU', 'SY']

const PUBLIC_FILE = /\.(.*)$/

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = PAUSED_NETWORK_ASSETS.find((token) => pathname.includes(token))
  const isPausedPage = pathname.startsWith('/tokens/') && !!token

  if (isPausedPage) {
    return NextResponse.rewrite(new URL(`/tokens/${token}/paused`, req.url))
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
